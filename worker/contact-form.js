/**
 * Cloudflare Worker：聯絡表單後端
 *
 * 流程：網站表單 → 本 Worker（驗證、防濫用）→ Google Apps Script → Google 試算表
 *
 * 可靠性設計：
 * - 檢查 Apps Script 回傳的內容，而不只看 HTTP 狀態碼
 *   （Apps Script 寫入失敗時仍回 HTTP 200，內容是 {"result":"error"}）
 * - 轉送有逾時限制，失敗會自動重試一次
 * - 選用 SUBMISSIONS_KV：轉送失敗時把訊息暫存起來，之後自動補送，不會遺失
 * - 選用 RATE_LIMITER：限制同一個 IP 的送出頻率（沒設定時改用記憶體內的簡易限制）
 * - 每筆送出都帶 submissionId，重試時可以辨識重複資料
 *
 * 設定方式請見 worker/DEPLOYMENT.md
 */

// 允許呼叫此 Worker 的網站來源。可用環境變數 ALLOWED_ORIGINS（逗號分隔）追加，設為 * 則全部允許
const DEFAULT_ALLOWED_ORIGINS = [
  'https://yi-hung-lee.work',
  'https://www.yi-hung-lee.work',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
];

// 欄位限制（與 components/contact/ContactForm.tsx 的 LIMITS 保持一致）
const LIMITS = {
  name: 100,
  email: 254,
  messageMin: 10,
  message: 5000,
  bodyBytes: 32 * 1024,
};

const CATEGORIES = ['speech', 'course', 'tutoring', 'other'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBMISSION_ID_RE = /^[A-Za-z0-9-]{8,64}$/;

// 轉送到 Apps Script
const FORWARD_TIMEOUT_MS = 12000;
const FORWARD_ATTEMPTS = 2;
const RETRY_DELAY_MS = 1000;

// 速率限制（沒有 RATE_LIMITER binding 時的備援設定）
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 1000;

// 暫存區（SUBMISSIONS_KV）
const PENDING_PREFIX = 'pending:';
const DRAIN_BATCH_ON_REQUEST = 5;
const DRAIN_BATCH_ON_CRON = 15;

// 同一個 isolate 內的短期記憶（Worker 重啟後會清空，只是盡力而為）
const memoryHits = new Map();
const completedIds = new Map();
const COMPLETED_TTL_MS = 10 * 60 * 1000;

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin');
    const cors = corsHeaders(origin, env);

    try {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: cors });
      }

      const url = new URL(request.url);
      if (request.method === 'GET' && url.pathname === '/health') {
        return json(
          {
            ok: true,
            appsScriptConfigured: Boolean(env.APPS_SCRIPT_URL),
            backupConfigured: Boolean(env.SUBMISSIONS_KV),
            rateLimiterConfigured: Boolean(env.RATE_LIMITER),
          },
          200,
          cors
        );
      }

      if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, 405, { ...cors, Allow: 'POST, OPTIONS' });
      }

      return await handleSubmit(request, env, ctx, cors);
    } catch (err) {
      log('error', 'unhandled_error', { error: errorMessage(err) });
      return json({ error: '伺服器發生錯誤，請稍後再試，或直接寄信給我。' }, 500, cors);
    }
  },

  // Cron Trigger：定期補送暫存區裡的訊息（需在 wrangler.toml 設定 [triggers]）
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(drainPending(env, DRAIN_BATCH_ON_CRON, 'cron'));
  },
};

async function handleSubmit(request, env, ctx, cors) {
  const origin = request.headers.get('Origin');
  // 瀏覽器發出的請求一定帶 Origin；來源不在名單內就拒絕
  if (origin && !isAllowedOrigin(origin, env)) {
    log('warn', 'origin_rejected', { origin });
    return json({ error: '不允許的來源' }, 403, cors);
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (!(await allowRequest(env, ip))) {
    log('warn', 'rate_limited', { ip });
    return json(
      { error: '送出次數過於頻繁，請稍候一分鐘再試。', retryAfter: 60 },
      429,
      { ...cors, 'Retry-After': '60' }
    );
  }

  const parsed = await readJsonBody(request);
  if (!parsed.ok) {
    return json({ error: parsed.error }, parsed.status, cors);
  }
  const data = parsed.data;

  // 蜜罐欄位：真人看不到也不會填，有填就是機器人。回傳成功但不處理
  if (typeof data._gotcha === 'string' && data._gotcha.trim() !== '') {
    log('info', 'honeypot_triggered', { ip });
    return json({ success: true }, 200, cors);
  }

  const validation = validate(data);
  if (!validation.ok) {
    const firstError = Object.values(validation.errors)[0];
    return json({ error: firstError, fields: validation.errors }, 400, cors);
  }

  const id =
    typeof data.submissionId === 'string' && SUBMISSION_ID_RE.test(data.submissionId)
      ? data.submissionId
      : crypto.randomUUID();

  if (wasCompleted(id)) {
    log('info', 'duplicate_ignored', { id });
    return json({ success: true, id, duplicate: true }, 200, cors);
  }

  const record = {
    submissionId: id,
    ...validation.value,
    timestamp: new Date().toISOString(),
    source: 'portfolio-website',
    ip,
    userAgent: (request.headers.get('User-Agent') || 'unknown').slice(0, 300),
  };

  if (!env.APPS_SCRIPT_URL) {
    log('error', 'apps_script_url_missing', { id });
    return await fallback(env, record, 'APPS_SCRIPT_URL not configured', cors);
  }

  const result = await forwardToAppsScript(env.APPS_SCRIPT_URL, record, FORWARD_ATTEMPTS);
  if (result.ok) {
    markCompleted(id);
    log('info', 'submission_delivered', { id, attempts: result.attempts });
    // Apps Script 正常運作，順便補送先前暫存的訊息
    if (env.SUBMISSIONS_KV) {
      ctx.waitUntil(drainPending(env, DRAIN_BATCH_ON_REQUEST, 'request'));
    }
    return json({ success: true, id }, 200, cors);
  }

  log('error', 'apps_script_failed', {
    id,
    reason: result.reason,
    detail: result.detail,
    attempts: result.attempts,
  });
  return await fallback(env, record, result.reason, cors);
}

/**
 * Apps Script 轉送失敗時的處理：
 * 有 SUBMISSIONS_KV 就暫存起來稍後補送（對訪客而言已送出成功）；
 * 沒有的話回報錯誤，並把完整內容寫進 Worker 日誌，作為最後的備份。
 */
async function fallback(env, record, reason, cors) {
  if (env.SUBMISSIONS_KV) {
    try {
      await env.SUBMISSIONS_KV.put(
        PENDING_PREFIX + record.submissionId,
        JSON.stringify({ record, reason, queuedAt: new Date().toISOString() })
      );
      markCompleted(record.submissionId);
      log('warn', 'submission_queued', { id: record.submissionId, reason });
      return json({ success: true, id: record.submissionId, queued: true }, 202, cors);
    } catch (err) {
      log('error', 'queue_failed', { id: record.submissionId, error: errorMessage(err) });
    }
  }

  log('error', 'submission_not_saved', { record });
  return json(
    {
      error: '目前無法送出訊息，請稍後再試，或直接寄信給我。',
      id: record.submissionId,
    },
    502,
    cors
  );
}

async function forwardToAppsScript(appsScriptUrl, record, attempts) {
  let result;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    result = await forwardOnce(appsScriptUrl, record);
    result.attempts = attempt;
    if (result.ok || !result.retryable || attempt === attempts) break;
    await sleep(RETRY_DELAY_MS * attempt);
  }
  return result;
}

async function forwardOnce(appsScriptUrl, record) {
  let response;
  try {
    response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSheetPayload(record)),
      redirect: 'follow',
      signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
    });
  } catch (err) {
    const timedOut = err && (err.name === 'TimeoutError' || err.name === 'AbortError');
    return { ok: false, retryable: true, reason: timedOut ? 'timeout' : 'network_error', detail: errorMessage(err) };
  }

  const text = await response.text().catch(() => '');
  if (!response.ok) {
    return {
      ok: false,
      retryable: response.status >= 500 || response.status === 429,
      reason: `http_${response.status}`,
      detail: text.slice(0, 300),
    };
  }

  let body;
  try {
    body = JSON.parse(text);
  } catch {
    // 例如 Google 的錯誤頁或登入頁（HTML）
    return { ok: false, retryable: true, reason: 'unexpected_response', detail: text.slice(0, 300) };
  }

  if (body && body.result === 'success') {
    return { ok: true };
  }
  return {
    ok: false,
    retryable: true,
    reason: 'apps_script_error',
    detail: JSON.stringify(body).slice(0, 300),
  };
}

/**
 * 補送暫存區裡的訊息。遇到第一筆失敗就停止（代表 Apps Script 還沒恢復）。
 * 已送出的會從暫存區刪除。
 */
async function drainPending(env, limit, trigger) {
  const kv = env.SUBMISSIONS_KV;
  if (!kv || !env.APPS_SCRIPT_URL) return;

  try {
    const { keys } = await kv.list({ prefix: PENDING_PREFIX, limit });
    if (keys.length === 0) return;

    let delivered = 0;
    for (const { name } of keys) {
      const entry = await kv.get(name, 'json');
      if (!entry || !entry.record) {
        await kv.delete(name);
        continue;
      }
      const result = await forwardToAppsScript(env.APPS_SCRIPT_URL, entry.record, 1);
      if (!result.ok) {
        log('warn', 'pending_retry_failed', { trigger, id: entry.record.submissionId, reason: result.reason });
        break;
      }
      await kv.delete(name);
      delivered++;
      log('info', 'pending_delivered', { trigger, id: entry.record.submissionId, queuedAt: entry.queuedAt });
    }
    log('info', 'drain_finished', { trigger, delivered, checked: keys.length });
  } catch (err) {
    log('error', 'drain_failed', { trigger, error: errorMessage(err) });
  }
}

// ---------- 驗證與資料處理 ----------

async function readJsonBody(request) {
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > LIMITS.bodyBytes) {
    return { ok: false, status: 413, error: '內容過長，請縮短訊息後再試。' };
  }

  let text;
  try {
    text = await request.text();
  } catch {
    return { ok: false, status: 400, error: '無法讀取送出的資料。' };
  }
  if (new TextEncoder().encode(text).length > LIMITS.bodyBytes) {
    return { ok: false, status: 413, error: '內容過長，請縮短訊息後再試。' };
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, status: 400, error: '資料格式錯誤。' };
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, status: 400, error: '資料格式錯誤。' };
  }
  return { ok: true, data };
}

function validate(data) {
  const errors = {};
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';
  const category = CATEGORIES.includes(data.category) ? data.category : 'other';

  if (!name) {
    errors.name = '請輸入您的姓名';
  } else if (name.length > LIMITS.name) {
    errors.name = `姓名請勿超過 ${LIMITS.name} 個字元`;
  }

  if (!email) {
    errors.email = '請輸入您的 Email';
  } else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) {
    errors.email = '請輸入有效的 Email 地址';
  }

  if (!message) {
    errors.message = '請輸入您的訊息';
  } else if (message.length < LIMITS.messageMin) {
    errors.message = `訊息至少需要 ${LIMITS.messageMin} 個字元`;
  } else if (message.length > LIMITS.message) {
    errors.message = `訊息請勿超過 ${LIMITS.message} 個字元`;
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    value: { name, email, category, message },
  };
}

/**
 * 試算表會把 = + - @ 開頭的文字當成公式（可能變成 #ERROR! 或被注入公式）。
 * 開頭加上單引號會讓試算表把它當純文字，顯示時不會看到這個單引號。
 */
function escapeForSheet(value) {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function toSheetPayload(record) {
  return {
    ...record,
    name: escapeForSheet(record.name),
    email: escapeForSheet(record.email),
    message: escapeForSheet(record.message),
  };
}

// ---------- 防濫用 ----------

async function allowRequest(env, ip) {
  const key = `contact:${ip}`;
  if (env.RATE_LIMITER) {
    try {
      const { success } = await env.RATE_LIMITER.limit({ key });
      return success;
    } catch (err) {
      log('warn', 'rate_limiter_error', { error: errorMessage(err) });
    }
  }
  return memoryRateLimit(key);
}

function memoryRateLimit(key) {
  const now = Date.now();
  const hits = (memoryHits.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_LIMIT) {
    memoryHits.set(key, hits);
    return false;
  }
  hits.push(now);
  memoryHits.set(key, hits);

  if (memoryHits.size > 5000) {
    for (const [k, v] of memoryHits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) memoryHits.delete(k);
    }
  }
  return true;
}

function wasCompleted(id) {
  const expiresAt = completedIds.get(id);
  if (!expiresAt) return false;
  if (expiresAt < Date.now()) {
    completedIds.delete(id);
    return false;
  }
  return true;
}

function markCompleted(id) {
  const now = Date.now();
  completedIds.set(id, now + COMPLETED_TTL_MS);
  if (completedIds.size > 1000) {
    for (const [k, expiresAt] of completedIds) {
      if (expiresAt < now) completedIds.delete(k);
    }
  }
}

// ---------- 共用工具 ----------

function isAllowedOrigin(origin, env) {
  const extra = String(env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (extra.includes('*')) return true;
  return DEFAULT_ALLOWED_ORIGINS.includes(origin) || extra.includes(origin);
}

function corsHeaders(origin, env) {
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (origin && isAllowedOrigin(origin, env)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

function json(body, status, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

function log(level, event, fields = {}) {
  console[level](JSON.stringify({ event, ...fields }));
}

function errorMessage(err) {
  return err instanceof Error ? err.message : String(err);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
