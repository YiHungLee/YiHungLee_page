// 聯絡表單 Worker 的測試：npm run test:worker
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import worker from './contact-form.js';

const SITE = 'https://yi-hung-lee.work';
const NOTIFY_TO = 'owner@example.com';

let ipCounter = 0;
let logs;
const realConsole = { info: console.info, warn: console.warn, error: console.error };

beforeEach(() => {
  logs = [];
  for (const level of Object.keys(realConsole)) {
    console[level] = (line) => logs.push(JSON.parse(line));
  }
});

afterEach(() => {
  Object.assign(console, realConsole);
});

/** 模擬 D1：只實作 Worker 用到的三種 SQL。failures 可以讓前幾次呼叫丟出錯誤 */
function makeDB({ insertFailures = [], rows = [] } = {}) {
  const table = new Map(rows.map((r) => [r.id, { notified: 0, ...r }]));
  const failures = [...insertFailures];
  const calls = { insert: 0 };
  return {
    table,
    calls,
    prepare(sql) {
      return {
        bind(...args) {
          return {
            async run() {
              if (sql.startsWith('INSERT')) {
                calls.insert++;
                const failure = failures.shift();
                if (failure) throw new Error(failure);
                const [id, created_at, name, email, category, message] = args;
                if (table.has(id)) return { meta: { changes: 0 } };
                table.set(id, { id, created_at, name, email, category, message, notified: 0 });
                return { meta: { changes: 1 } };
              }
              if (sql.startsWith('UPDATE')) {
                const row = table.get(args[0]);
                if (row) row.notified = 1;
                return { meta: { changes: row ? 1 : 0 } };
              }
              throw new Error(`unexpected run: ${sql}`);
            },
            async all() {
              const [cutoff] = args;
              const limit = Number(sql.match(/LIMIT (\d+)/)[1]);
              const results = [...table.values()]
                .filter((r) => r.notified === 0 && r.created_at < cutoff)
                .sort((a, b) => a.created_at.localeCompare(b.created_at))
                .slice(0, limit);
              return { results };
            },
          };
        },
      };
    },
  };
}

/** 模擬寄信綁定。failTimes：前幾次呼叫丟出錯誤 */
function makeEmail({ failTimes = 0 } = {}) {
  const sent = [];
  let failuresLeft = failTimes;
  return {
    sent,
    async send(message) {
      if (failuresLeft > 0) {
        failuresLeft--;
        const err = new Error('send failed');
        err.code = 'E_TEST';
        throw err;
      }
      sent.push(message);
      return { messageId: `msg-${sent.length}` };
    },
  };
}

function makeCtx() {
  const pending = [];
  return { pending, waitUntil: (p) => pending.push(p), flush: () => Promise.all(pending) };
}

function makeEnv(overrides = {}) {
  return { DB: makeDB(), EMAIL: makeEmail(), NOTIFY_TO, ...overrides };
}

function submit(body, { env = makeEnv(), origin = SITE, ip, ctx = makeCtx() } = {}) {
  const headers = { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip ?? `10.0.0.${++ipCounter}` };
  if (origin) headers.Origin = origin;
  const request = new Request('https://worker.example/', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  return worker.fetch(request, env, ctx);
}

const validForm = (overrides = {}) => ({
  name: '測試者',
  email: 'test@example.com',
  category: 'speech',
  message: '這是一則測試訊息，長度超過十個字。',
  submissionId: `test-${Math.random().toString(36).slice(2, 12)}`,
  ...overrides,
});

// ---------- 正常流程 ----------

test('送出成功：存進資料庫、寄出通知、標記已通知', async () => {
  const env = makeEnv();
  const ctx = makeCtx();
  const form = validForm();
  const res = await submit(form, { env, ctx });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { success: true, id: form.submissionId });

  const row = env.DB.table.get(form.submissionId);
  assert.equal(row.message, form.message);
  assert.equal(row.category, 'speech');

  await ctx.flush();
  assert.equal(env.EMAIL.sent.length, 1);
  const mail = env.EMAIL.sent[0];
  assert.equal(mail.to, NOTIFY_TO);
  assert.equal(mail.from.email, 'contact-form@yi-hung-lee.work');
  assert.deepEqual(mail.replyTo, { email: 'test@example.com', name: '測試者' });
  assert.equal(mail.subject, '[網站聯絡表單] 演講邀約｜測試者');
  assert.ok(mail.text.includes(form.message));
  assert.equal(row.notified, 1);
});

test('通知信時間以台灣時間顯示', async () => {
  const env = makeEnv();
  const ctx = makeCtx();
  await submit(validForm(), { env, ctx });
  await ctx.flush();
  assert.match(env.EMAIL.sent[0].text, /時間：\d{4}-\d{2}-\d{2} \d{2}:\d{2}（台灣時間）/);
});

test('NOTIFY_FROM 可以覆寫寄件地址', async () => {
  const env = makeEnv({ NOTIFY_FROM: 'hello@yi-hung-lee.work' });
  const ctx = makeCtx();
  await submit(validForm(), { env, ctx });
  await ctx.flush();
  assert.equal(env.EMAIL.sent[0].from.email, 'hello@yi-hung-lee.work');
});

test('姓名中的換行不會進到信件主旨', async () => {
  const env = makeEnv();
  const ctx = makeCtx();
  await submit(validForm({ name: '王\r\nBcc: evil@example.com' }), { env, ctx });
  await ctx.flush();
  assert.ok(!/[\r\n]/.test(env.EMAIL.sent[0].subject));
  assert.ok(!/[\r\n]/.test(env.EMAIL.sent[0].replyTo.name));
});

test('格式特殊的 Email 不設成回覆地址，但仍寄出通知', async () => {
  const env = makeEnv();
  const ctx = makeCtx();
  await submit(validForm({ email: 'a"b<c>@example.com' }), { env, ctx });
  await ctx.flush();
  assert.equal(env.EMAIL.sent.length, 1);
  assert.equal(env.EMAIL.sent[0].replyTo, undefined);
});

// ---------- 其中一邊失敗 ----------

test('資料庫暫時失敗會重試一次', async () => {
  const env = makeEnv({ DB: makeDB({ insertFailures: ['D1 DB reset because its code was updated.'] }) });
  const ctx = makeCtx();
  const res = await submit(validForm(), { env, ctx });
  assert.equal(res.status, 200);
  assert.equal(env.DB.calls.insert, 2);
  await ctx.flush();
  assert.equal(env.EMAIL.sent.length, 1, '重試成功的新訊息仍要寄通知');
});

test('資料庫額度用完時不重試，改由 Email 保住訊息', async () => {
  const quota = "Your account has exceeded D1's free tier daily row write limit.";
  const env = makeEnv({ DB: makeDB({ insertFailures: [quota] }) });
  const form = validForm();
  const res = await submit(form, { env });
  assert.equal(res.status, 200);
  assert.equal(env.DB.calls.insert, 1);
  assert.equal(env.EMAIL.sent.length, 1);
  assert.ok(env.EMAIL.sent[0].text.includes('沒有存進資料庫'));
  assert.ok(env.EMAIL.sent[0].text.includes(form.message));
  assert.ok(logs.some((l) => l.event === 'submission_emailed_only'));
});

test('沒有設定資料庫時，仍可靠 Email 送達', async () => {
  const env = makeEnv({ DB: undefined });
  const res = await submit(validForm(), { env });
  assert.equal(res.status, 200);
  assert.equal(env.EMAIL.sent.length, 1);
});

test('寄信失敗時重試一次', async () => {
  const env = makeEnv({ EMAIL: makeEmail({ failTimes: 1 }) });
  const ctx = makeCtx();
  const form = validForm();
  await submit(form, { env, ctx });
  await ctx.flush();
  assert.equal(env.EMAIL.sent.length, 1);
  assert.equal(env.DB.table.get(form.submissionId).notified, 1);
});

test('通知信寄不出去時，訊息仍算送出成功，並保持「未通知」等待補寄', async () => {
  const env = makeEnv({ EMAIL: makeEmail({ failTimes: 99 }) });
  const ctx = makeCtx();
  const form = validForm();
  const res = await submit(form, { env, ctx });
  assert.equal(res.status, 200);
  await ctx.flush();
  assert.equal(env.DB.table.get(form.submissionId).notified, 0);
  assert.ok(logs.some((l) => l.event === 'notify_failed'));
});

test('下一則訊息寄信成功時，會補寄先前沒寄出的通知', async () => {
  const old = {
    id: 'old-00000001',
    created_at: '2026-01-01T00:00:00.000Z',
    name: '舊訪客',
    email: 'old@example.com',
    category: 'course',
    message: '之前通知信沒寄出去的訊息內容',
  };
  const env = makeEnv({ DB: makeDB({ rows: [old] }) });
  const ctx = makeCtx();
  await submit(validForm(), { env, ctx });
  await ctx.flush();
  assert.equal(env.EMAIL.sent.length, 2);
  assert.ok(env.EMAIL.sent[1].text.includes('補寄'));
  assert.ok(env.EMAIL.sent[1].text.includes('之前通知信沒寄出去的訊息內容'));
  assert.equal(env.DB.table.get('old-00000001').notified, 1);
});

test('資料庫和 Email 都失敗時回報錯誤，完整內容寫進日誌', async () => {
  const env = makeEnv({
    DB: makeDB({ insertFailures: ['boom', 'boom'] }),
    EMAIL: makeEmail({ failTimes: 99 }),
  });
  const form = validForm();
  const res = await submit(form, { env });
  assert.equal(res.status, 502);
  const notSaved = logs.find((l) => l.event === 'submission_not_saved');
  assert.ok(notSaved);
  assert.equal(notSaved.record.message, form.message);
});

test('Email 沒有設定收件信箱時視為未設定', async () => {
  const env = makeEnv({ NOTIFY_TO: '', DB: undefined });
  const res = await submit(validForm(), { env });
  assert.equal(res.status, 502);
  assert.ok(logs.some((l) => l.event === 'submission_not_saved' && l.reason === 'email_not_configured'));
});

// ---------- 重複送出 ----------

test('同一個 submissionId 重送時不會重複寫入或重複寄信', async () => {
  const env = makeEnv();
  const ctx = makeCtx();
  const form = validForm();
  await submit(form, { env, ctx });
  const res = await submit(form, { env, ctx });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).duplicate, true);
  await ctx.flush();
  assert.equal(env.DB.table.size, 1);
  assert.equal(env.EMAIL.sent.length, 1);
});

test('資料庫已有同一個 ID（例如 Worker 重啟後重送）時也不重複寄信', async () => {
  const form = validForm();
  const env = makeEnv({
    DB: makeDB({
      rows: [{ id: form.submissionId, created_at: '2026-11-01T00:00:00.000Z', name: 'x', email: 'x@y.co', category: 'other', message: '已經存過的訊息內容', notified: 1 }],
    }),
  });
  const ctx = makeCtx();
  const res = await submit(form, { env, ctx });
  assert.equal((await res.json()).duplicate, true);
  await ctx.flush();
  assert.equal(env.EMAIL.sent.length, 0);
});

// ---------- 驗證與防濫用 ----------

test('CORS 預檢：允許網站本身的來源', async () => {
  const res = await worker.fetch(
    new Request('https://worker.example/', { method: 'OPTIONS', headers: { Origin: SITE } }),
    {},
    makeCtx()
  );
  assert.equal(res.status, 204);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), SITE);
});

test('拒絕其他網站的來源', async () => {
  const env = makeEnv();
  const res = await submit(validForm(), { env, origin: 'https://evil.example' });
  assert.equal(res.status, 403);
  assert.equal(env.DB.table.size, 0);
});

test('ALLOWED_ORIGINS 可以追加允許的來源', async () => {
  const res = await submit(validForm(), {
    origin: 'https://preview.example.pages.dev',
    env: makeEnv({ ALLOWED_ORIGINS: 'https://preview.example.pages.dev' }),
  });
  assert.equal(res.status, 200);
});

test('欄位驗證失敗時回傳 400 與各欄位的錯誤', async () => {
  const env = makeEnv();
  const res = await submit(validForm({ name: '  ', email: 'not-an-email', message: '太短' }), { env });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.deepEqual(Object.keys(body.fields).sort(), ['email', 'message', 'name']);
  assert.equal(env.DB.table.size, 0);
});

test('訊息過長時拒絕', async () => {
  const res = await submit(validForm({ message: '字'.repeat(5001) }));
  assert.equal(res.status, 400);
});

test('非 JSON 內容回傳 400，而不是 500', async () => {
  const res = await submit('not json');
  assert.equal(res.status, 400);
});

test('不明的類別會被改成 other', async () => {
  const env = makeEnv();
  const form = validForm({ category: 'constructor' });
  await submit(form, { env });
  assert.equal(env.DB.table.get(form.submissionId).category, 'other');
});

test('蜜罐欄位有填時假裝成功，但不儲存也不寄信', async () => {
  const env = makeEnv();
  const ctx = makeCtx();
  const res = await submit(validForm({ _gotcha: 'http://spam.example' }), { env, ctx });
  assert.equal(res.status, 200);
  await ctx.flush();
  assert.equal(env.DB.table.size, 0);
  assert.equal(env.EMAIL.sent.length, 0);
});

test('同一個 IP 一分鐘內第 6 次送出會被限制', async () => {
  const env = makeEnv();
  const statuses = [];
  for (let i = 0; i < 6; i++) {
    const res = await submit(validForm(), { env, ip: '192.0.2.99' });
    statuses.push(res.status);
  }
  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429]);
});

test('有 RATE_LIMITER binding 時使用它', async () => {
  const keys = [];
  const RATE_LIMITER = { limit: async ({ key }) => (keys.push(key), { success: false }) };
  const res = await submit(validForm(), { env: makeEnv({ RATE_LIMITER }), ip: '192.0.2.50' });
  assert.equal(res.status, 429);
  assert.deepEqual(keys, ['contact:192.0.2.50']);
});

test('健康檢查端點', async () => {
  const res = await worker.fetch(new Request('https://worker.example/health'), makeEnv(), makeCtx());
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), {
    ok: true,
    databaseConfigured: true,
    emailConfigured: true,
    rateLimiterConfigured: false,
  });
});
