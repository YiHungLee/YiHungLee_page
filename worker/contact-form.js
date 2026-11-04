/**
 * Cloudflare Worker：聯絡表單後端
 *
 * 流程：網站表單 → 本 Worker（驗證、防濫用）→ ① D1 資料庫 ＋ ② Email 通知
 *
 * 可靠性設計：
 * - 資料庫和 Email 是兩份獨立的紀錄，任一成功就算訊息已保存
 *   （例如帳號的 D1 每日額度被其他專案用完時，仍會收到 Email）
 * - 兩者都失敗時回報錯誤，並把完整內容寫進 Worker 日誌作為最後備份
 * - 已存進資料庫但通知信沒寄出的訊息，會在下一次成功寄信時補寄
 * - 每筆送出都帶 submissionId，重送不會重複寫入
 * - RATE_LIMITER：限制同一個 IP 的送出頻率（沒設定時改用記憶體內的簡易限制）
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

const CATEGORY_LABELS = {
  speech: '演講邀約',
  course: '課程邀請',
  tutoring: '心輔所備考協助',
  other: '其他',
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 設為通知信「回覆地址」前，用較嚴格的格式再檢查一次
const REPLY_TO_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const SUBMISSION_ID_RE = /^[A-Za-z0-9-]{8,64}$/;

// 通知信的寄件地址（必須是已啟用 Email Routing 的網域）；可用環境變數 NOTIFY_FROM 覆寫
const DEFAULT_NOTIFY_FROM = 'contact-form@yi-hung-lee.work';

const RETRY_DELAY_MS = 500;
// 補寄通知：只處理建立超過 2 分鐘的訊息（避免和正在寄送中的重疊），每次最多 5 筆
const CATCH_UP_MIN_AGE_MS = 2 * 60 * 1000;
const CATCH_UP_BATCH = 5;

// 速率限制（沒有 RATE_LIMITER binding 時的備援設定）
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 1000;

// 同一個 isolate 內的短期記憶（Worker 重啟後會清空，只是盡力而為）
const memoryHits = new Map();
const completedIds = new Map();
const COMPLETED_TTL_MS = 10 * 60 * 1000;

const INSERT_SQL =
  'INSERT INTO submissions (id, created_at, name, email, category, message) ' +
  'VALUES (?1, ?2, ?3, ?4, ?5, ?6) ON CONFLICT(id) DO NOTHING';
const MARK_NOTIFIED_SQL = 'UPDATE submissions SET notified = 1 WHERE id = ?1';
const UNNOTIFIED_SQL =
  'SELECT id, created_at, name, email, category, message FROM submissions ' +
  'WHERE notified = 0 AND created_at < ?1 ORDER BY created_at LIMIT ?2';

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
            databaseConfigured: Boolean(env.DB),
            emailConfigured: Boolean(env.EMAIL && env.NOTIFY_TO),
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

  const record = { id, createdAt: new Date().toISOString(), ...validation.value };

  // ① 先存進資料庫
  const saved = await saveToDatabase(env, record);

  if (saved.ok && saved.duplicate) {
    markCompleted(id);
    log('info', 'duplicate_ignored', { id });
    return json({ success: true, id, duplicate: true }, 200, cors);
  }

  if (saved.ok) {
    markCompleted(id);
    log('info', 'submission_saved', { id });
    // ② 通知信在背景寄出，訪客不用等；寄不出去時訊息仍在資料庫，之後會補寄
    ctx.waitUntil(notifyAndCatchUp(env, record));
    return json({ success: true, id }, 200, cors);
  }

  // 資料庫寫不進去：改靠 Email 保住這則訊息
  log('error', 'database_failed', { id, reason: saved.reason });
  const mailed = await sendNotification(env, record, { databaseFailed: true });
  if (mailed.ok) {
    markCompleted(id);
    log('warn', 'submission_emailed_only', { id });
    return json({ success: true, id }, 200, cors);
  }

  log('error', 'submission_not_saved', { reason: mailed.reason, record });
  return json(
    { error: '目前無法送出訊息，請稍後再試，或直接寄信給我。', id },
    502,
    cors
  );
}

// ---------- 資料庫 ----------

async function saveToDatabase(env, record) {
  if (!env.DB) return { ok: false, reason: 'database_not_configured' };

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await env.DB.prepare(INSERT_SQL)
        .bind(record.id, record.createdAt, record.name, record.email, record.category, record.message)
        .run();
      // 第一次就沒有寫入 = 這個 ID 之前已經存過。
      // 重試時沒有寫入，可能是第一次其實成功了，視為新訊息處理（寧可多寄一封通知）
      const duplicate = attempt === 1 && result.meta && result.meta.changes === 0;
      return { ok: true, duplicate };
    } catch (err) {
      const reason = errorMessage(err);
      // 額度用完之類的錯誤，重試也沒用
      if (attempt === 2 || /exceeded/i.test(reason)) return { ok: false, reason };
      await sleep(RETRY_DELAY_MS);
    }
  }
}

async function markNotified(env, id) {
  try {
    await env.DB.prepare(MARK_NOTIFIED_SQL).bind(id).run();
  } catch (err) {
    log('warn', 'mark_notified_failed', { id, error: errorMessage(err) });
  }
}

// ---------- Email 通知 ----------

async function notifyAndCatchUp(env, record) {
  const mailed = await sendNotification(env, record);
  if (!mailed.ok) {
    log('error', 'notify_failed', { id: record.id, reason: mailed.reason });
    return;
  }
  await markNotified(env, record.id);
  log('info', 'notified', { id: record.id });

  // 通知信寄得出去，順便補寄先前沒寄成功的
  try {
    const cutoff = new Date(Date.now() - CATCH_UP_MIN_AGE_MS).toISOString();
    const { results = [] } = await env.DB.prepare(UNNOTIFIED_SQL).bind(cutoff, CATCH_UP_BATCH).all();
    for (const row of results) {
      const late = {
        id: row.id,
        createdAt: row.created_at,
        name: row.name,
        email: row.email,
        category: row.category,
        message: row.message,
      };
      const result = await sendNotification(env, late, { late: true });
      if (!result.ok) {
        log('warn', 'catch_up_failed', { id: row.id, reason: result.reason });
        break;
      }
      await markNotified(env, row.id);
      log('info', 'catch_up_notified', { id: row.id });
    }
  } catch (err) {
    log('warn', 'catch_up_error', { error: errorMessage(err) });
  }
}

async function sendNotification(env, record, { databaseFailed = false, late = false } = {}) {
  if (!env.EMAIL || !env.NOTIFY_TO) return { ok: false, reason: 'email_not_configured' };

  const name = singleLine(record.name);
  const category = CATEGORY_LABELS[record.category] || CATEGORY_LABELS.other;
  const message = {
    to: env.NOTIFY_TO,
    from: { email: env.NOTIFY_FROM || DEFAULT_NOTIFY_FROM, name: '網站聯絡表單' },
    subject: `[網站聯絡表單] ${category}｜${name}`,
    text: buildEmailText(record, { databaseFailed, late }),
  };
  if (REPLY_TO_RE.test(record.email)) {
    message.replyTo = { email: record.email, name };
  }

  let reason = '';
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await env.EMAIL.send(message);
      return { ok: true };
    } catch (err) {
      reason = [err && err.code, errorMessage(err)].filter(Boolean).join(' ');
      if (attempt < 2) await sleep(RETRY_DELAY_MS);
    }
  }
  return { ok: false, reason };
}

function buildEmailText(record, { databaseFailed, late }) {
  const lines = [];
  if (databaseFailed) {
    lines.push('⚠ 這則訊息沒有存進資料庫（資料庫暫時無法寫入），請保留這封信。', '');
  }
  if (late) {
    lines.push('（這是補寄的通知，訊息先前已存進資料庫，但當時通知信沒有寄出。）', '');
  }
  lines.push(
    '網站聯絡表單收到一則新訊息：',
    '',
    `姓名：${singleLine(record.name)}`,
    `Email：${record.email}`,
    `類別：${CATEGORY_LABELS[record.category] || CATEGORY_LABELS.other}`,
    `時間：${formatTaipeiTime(record.createdAt)}（台灣時間）`,
    '',
    '──────────',
    record.message,
    '──────────',
    '',
    '直接回覆這封信就會寄給對方。',
    `編號：${record.id}`
  );
  return lines.join('\n');
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
  const category = Object.hasOwn(CATEGORY_LABELS, data.category) ? data.category : 'other';

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

function singleLine(value) {
  return String(value).replace(/[\r\n\t]+/g, ' ').trim();
}

function formatTaipeiTime(iso) {
  const date = new Date(new Date(iso).getTime() + 8 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 16).replace('T', ' ');
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
