// 聯絡表單 Worker 的測試：npm run test:worker
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import worker from './contact-form.js';

const SITE = 'https://yi-hung-lee.work';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/test/exec';

let ipCounter = 0;
let fetchCalls;
let appsScriptReplies;
let logs;
const realFetch = globalThis.fetch;
const realConsole = { info: console.info, warn: console.warn, error: console.error };

beforeEach(() => {
  fetchCalls = [];
  appsScriptReplies = [];
  logs = [];
  globalThis.fetch = async (url, init) => {
    fetchCalls.push({ url, body: JSON.parse(init.body) });
    const reply = appsScriptReplies.shift() ?? { status: 200, body: { result: 'success' } };
    if (reply.throw) throw reply.throw;
    const text = typeof reply.body === 'string' ? reply.body : JSON.stringify(reply.body);
    return new Response(text, { status: reply.status ?? 200 });
  };
  for (const level of Object.keys(realConsole)) {
    console[level] = (line) => logs.push(JSON.parse(line));
  }
});

afterEach(() => {
  globalThis.fetch = realFetch;
  Object.assign(console, realConsole);
});

function makeKV() {
  const store = new Map();
  return {
    store,
    async put(key, value) { store.set(key, value); },
    async get(key, type) {
      const value = store.get(key);
      if (value === undefined) return null;
      return type === 'json' ? JSON.parse(value) : value;
    },
    async delete(key) { store.delete(key); },
    async list({ prefix = '', limit = 1000 } = {}) {
      const keys = [...store.keys()].filter((k) => k.startsWith(prefix)).slice(0, limit);
      return { keys: keys.map((name) => ({ name })) };
    },
  };
}

function makeCtx() {
  const pending = [];
  return { pending, waitUntil: (p) => pending.push(p), flush: () => Promise.all(pending) };
}

function submit(body, { env = {}, origin = SITE, ip, ctx = makeCtx() } = {}) {
  const headers = { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip ?? `10.0.0.${++ipCounter}` };
  if (origin) headers.Origin = origin;
  const request = new Request('https://worker.example/', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  return worker.fetch(request, { APPS_SCRIPT_URL, ...env }, ctx);
}

const validForm = (overrides = {}) => ({
  name: '測試者',
  email: 'test@example.com',
  category: 'speech',
  message: '這是一則測試訊息，長度超過十個字。',
  submissionId: `test-${Math.random().toString(36).slice(2, 12)}`,
  ...overrides,
});

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
  const res = await submit(validForm(), { origin: 'https://evil.example' });
  assert.equal(res.status, 403);
  assert.equal(fetchCalls.length, 0);
});

test('ALLOWED_ORIGINS 可以追加允許的來源', async () => {
  const res = await submit(validForm(), {
    origin: 'https://preview.example.pages.dev',
    env: { ALLOWED_ORIGINS: 'https://preview.example.pages.dev' },
  });
  assert.equal(res.status, 200);
});

test('Apps Script 回報成功時才回傳成功，並帶上 submissionId', async () => {
  const form = validForm();
  const res = await submit(form);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { success: true, id: form.submissionId });
  assert.equal(fetchCalls.length, 1);
  assert.equal(fetchCalls[0].url, APPS_SCRIPT_URL);
  assert.equal(fetchCalls[0].body.submissionId, form.submissionId);
  assert.equal(fetchCalls[0].body.name, '測試者');
});

test('Apps Script 回 HTTP 200 但內容是 error 時，不可以當成成功', async () => {
  appsScriptReplies = [
    { status: 200, body: { result: 'error', error: {} } },
    { status: 200, body: { result: 'error', error: {} } },
  ];
  const res = await submit(validForm());
  assert.equal(res.status, 502);
  assert.equal(fetchCalls.length, 2, '應該重試一次');
  const notSaved = logs.find((l) => l.event === 'submission_not_saved');
  assert.ok(notSaved, '沒有暫存區時要把完整內容寫進日誌');
  assert.equal(notSaved.record.message, validForm().message);
});

test('Apps Script 回傳 HTML（例如錯誤頁）時視為失敗', async () => {
  appsScriptReplies = [
    { status: 200, body: '<html>Error</html>' },
    { status: 200, body: '<html>Error</html>' },
  ];
  const res = await submit(validForm());
  assert.equal(res.status, 502);
});

test('第一次失敗、第二次成功時回傳成功', async () => {
  appsScriptReplies = [{ status: 503, body: 'unavailable' }, { status: 200, body: { result: 'success' } }];
  const res = await submit(validForm());
  assert.equal(res.status, 200);
  assert.equal(fetchCalls.length, 2);
});

test('網路錯誤也會重試', async () => {
  appsScriptReplies = [{ throw: new TypeError('fetch failed') }, { status: 200, body: { result: 'success' } }];
  const res = await submit(validForm());
  assert.equal(res.status, 200);
});

test('有暫存區時，Apps Script 失敗的訊息會被存起來並回報已收到', async () => {
  appsScriptReplies = [{ status: 500 }, { status: 500 }];
  const kv = makeKV();
  const form = validForm();
  const res = await submit(form, { env: { SUBMISSIONS_KV: kv } });
  assert.equal(res.status, 202);
  assert.deepEqual(await res.json(), { success: true, id: form.submissionId, queued: true });
  const saved = JSON.parse(kv.store.get(`pending:${form.submissionId}`));
  assert.equal(saved.record.message, form.message);
});

test('沒有設定 APPS_SCRIPT_URL 但有暫存區時，訊息仍會被保存', async () => {
  const kv = makeKV();
  const res = await submit(validForm(), { env: { APPS_SCRIPT_URL: '', SUBMISSIONS_KV: kv } });
  assert.equal(res.status, 202);
  assert.equal(kv.store.size, 1);
  assert.equal(fetchCalls.length, 0);
});

test('排程會補送暫存區的訊息，成功後刪除', async () => {
  const kv = makeKV();
  const record = { submissionId: 'queued-0001', name: 'A', email: 'a@b.co', category: 'other', message: '暫存中的訊息內容！！' };
  await kv.put('pending:queued-0001', JSON.stringify({ record }));
  const ctx = makeCtx();
  await worker.scheduled({}, { APPS_SCRIPT_URL, SUBMISSIONS_KV: kv }, ctx);
  await ctx.flush();
  assert.equal(fetchCalls.length, 1);
  assert.equal(fetchCalls[0].body.submissionId, 'queued-0001');
  assert.equal(kv.store.size, 0);
});

test('補送仍失敗時保留訊息，並停止處理後面的訊息', async () => {
  const kv = makeKV();
  for (const id of ['queued-a001', 'queued-a002']) {
    const record = { submissionId: id, name: 'A', email: 'a@b.co', category: 'other', message: '暫存中的訊息內容！！' };
    await kv.put(`pending:${id}`, JSON.stringify({ record }));
  }
  appsScriptReplies = [{ status: 200, body: { result: 'error' } }];
  const ctx = makeCtx();
  await worker.scheduled({}, { APPS_SCRIPT_URL, SUBMISSIONS_KV: kv }, ctx);
  await ctx.flush();
  assert.equal(fetchCalls.length, 1);
  assert.equal(kv.store.size, 2);
});

test('新訊息送出成功後，會順便補送暫存區的訊息', async () => {
  const kv = makeKV();
  const record = { submissionId: 'queued-b001', name: 'A', email: 'a@b.co', category: 'other', message: '暫存中的訊息內容！！' };
  await kv.put('pending:queued-b001', JSON.stringify({ record }));
  const ctx = makeCtx();
  const res = await submit(validForm(), { env: { SUBMISSIONS_KV: kv }, ctx });
  assert.equal(res.status, 200);
  await ctx.flush();
  assert.equal(fetchCalls.length, 2);
  assert.equal(kv.store.size, 0);
});

test('欄位驗證失敗時回傳 400 與各欄位的錯誤', async () => {
  const res = await submit(validForm({ name: '  ', email: 'not-an-email', message: '太短' }));
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.deepEqual(Object.keys(body.fields).sort(), ['email', 'message', 'name']);
  assert.equal(fetchCalls.length, 0);
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
  await submit(validForm({ category: 'hack' }));
  assert.equal(fetchCalls[0].body.category, 'other');
});

test('= + - @ 開頭的內容會加上單引號，避免試算表當成公式', async () => {
  await submit(validForm({ name: '=HYPERLINK("x")', message: '-- 這是一則測試訊息內容' }));
  assert.equal(fetchCalls[0].body.name, `'=HYPERLINK("x")`);
  assert.equal(fetchCalls[0].body.message, `'-- 這是一則測試訊息內容`);
});

test('蜜罐欄位有填時假裝成功，但不轉送', async () => {
  const res = await submit(validForm({ _gotcha: 'http://spam.example' }));
  assert.equal(res.status, 200);
  assert.equal(fetchCalls.length, 0);
});

test('同一個 submissionId 重送時不會重複寫入', async () => {
  const form = validForm();
  await submit(form);
  const res = await submit(form);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).duplicate, true);
  assert.equal(fetchCalls.length, 1);
});

test('同一個 IP 一分鐘內第 6 次送出會被限制', async () => {
  const statuses = [];
  for (let i = 0; i < 6; i++) {
    const res = await submit(validForm(), { ip: '192.0.2.99' });
    statuses.push(res.status);
  }
  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429]);
});

test('有 RATE_LIMITER binding 時使用它', async () => {
  const keys = [];
  const RATE_LIMITER = { limit: async ({ key }) => (keys.push(key), { success: false }) };
  const res = await submit(validForm(), { env: { RATE_LIMITER }, ip: '192.0.2.50' });
  assert.equal(res.status, 429);
  assert.deepEqual(keys, ['contact:192.0.2.50']);
});

test('健康檢查端點', async () => {
  const res = await worker.fetch(new Request('https://worker.example/health'), { APPS_SCRIPT_URL }, makeCtx());
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), {
    ok: true,
    appsScriptConfigured: true,
    backupConfigured: false,
    rateLimiterConfigured: false,
  });
});
