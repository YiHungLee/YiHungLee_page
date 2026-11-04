# 聯絡表單後端部署指南

## 架構

```
網站表單（ContactForm.tsx）
   │  POST JSON（含 submissionId）
   ▼
Cloudflare Worker（worker/contact-form.js）
   │  驗證、來源檢查、速率限制、蜜罐防機器人
   ▼
Google Apps Script（worker/apps-script/Code.gs）
   │
   ▼
Google 試算表「個人網頁的聯絡表單回應」
```

### 出問題時會發生什麼事

| 狀況 | 處理方式 |
|------|----------|
| 訪客網路瞬斷 | 前端自動重試 2 次 |
| 伺服器 30 秒沒回應 | 前端顯示錯誤，內容保留在表單，提供「用 Email 寄出」與「複製訊息」按鈕 |
| Apps Script 回報失敗或沒回應 | Worker 自動重試一次（Apps Script 失敗時仍回 HTTP 200，Worker 會檢查回傳內容） |
| 重試後仍失敗，且已啟用暫存區 | 訊息存進 KV 暫存區，訪客看到「已送出」，之後每 30 分鐘自動補送 |
| 重試後仍失敗，且沒有暫存區 | 訪客看到錯誤與 Email 備援按鈕；完整內容寫進 Worker 日誌（事件 `submission_not_saved`） |
| 訪客重新整理頁面 | 表單內容自動存成草稿，重新開啟時還原 |
| 同一筆訊息被重送 | 用 `submissionId` 辨識，不會重複寫入（完整去重需升級 Apps Script） |

---

## 基本部署

### 步驟 1：設定 GitHub Secrets

前往 GitHub Repository → **Settings** → **Secrets and variables** → **Actions**，需要 2 個 Secrets（如果網站部署已經設定過，可以共用）：

- `CLOUDFLARE_API_TOKEN`：需要 **Account > Workers Scripts > Edit** 權限（網站部署另需 **Cloudflare Pages > Edit**）
- `CLOUDFLARE_ACCOUNT_ID`：Cloudflare Dashboard 右側欄的 Account ID

### 步驟 2：推送程式碼

修改 `worker/` 底下的檔案並推送到 `main`，GitHub Actions（`.github/workflows/deploy-worker.yml`）會自動部署。

### 步驟 3：設定 `APPS_SCRIPT_URL`

1. Cloudflare Dashboard → **Workers & Pages** → **`yi-hung-lee-contact-form`** → **Settings** → **Variables and Secrets**
2. 新增 `APPS_SCRIPT_URL`，值為 `https://script.google.com/macros/s/<部署 ID>/exec`
3. 類型選 **Secret**（加密）。Secret 不會在之後的部署被覆蓋

### 步驟 4：前端設定 Worker 網址

`components/contact/ContactForm.tsx` 預設使用 `https://yi-hung-lee-contact-form.lee2952000.workers.dev`。要改用其他網址時，設定 `VITE_WORKER_URL`（本地開發放在 `.env.local`，正式環境在 Cloudflare Pages 的環境變數）。

### 步驟 5：確認運作

打開 `https://yi-hung-lee-contact-form.lee2952000.workers.dev/health`，應該看到：

```json
{ "ok": true, "appsScriptConfigured": true, "backupConfigured": false, "rateLimiterConfigured": true }
```

然後在網站送出一則測試訊息，確認試算表有新的一列。

---

## 啟用失敗訊息暫存區（建議）

啟用後，即使 Google Apps Script 故障（配額用完、權限過期、部署網址失效），訊息也會先存在 Cloudflare KV，之後自動補寫進試算表。

1. 建立 KV namespace（擇一）：
   - Dashboard → **Storage & Databases** → **KV** → **Create**，名稱填 `contact-form-submissions`
   - 或在本機執行 `npx wrangler kv namespace create contact-form-submissions`
2. 複製產生的 namespace ID
3. 編輯 `worker/wrangler.toml`，取消以下區塊的註解並填入 ID：
   ```toml
   [[kv_namespaces]]
   binding = "SUBMISSIONS_KV"
   id = "<namespace ID>"

   [triggers]
   crons = ["*/30 * * * *"]
   ```
4. 推送到 `main` 部署
5. 打開 `/health`，確認 `backupConfigured` 變成 `true`

注意：
- 免費方案每個帳號最多 5 個 Cron Trigger。如果其他 Worker 已經用滿，部署會失敗，可以先不加 `[triggers]`（暫存的訊息會在下一次有人成功送出時補送）
- 暫存中的訊息可以在 Dashboard → KV → `contact-form-submissions` 看到，key 以 `pending:` 開頭

---

## 升級 Google Apps Script（選用）

`worker/apps-script/Code.gs` 是升級版的 Apps Script。舊版也能和新的 Worker 運作，但升級後多了：

- **新訊息 Email 通知**：寄到 `mail@yi-hung-lee.work`，直接回覆就能回信給對方
- **去除重複**：Worker 重試或補送時不會多寫一筆（submissionId 寫在 F 欄）
- **正確回報錯誤原因**

更新步驟：

1. 打開試算表「個人網頁的聯絡表單回應」→ **擴充功能** → **Apps Script**
2. 用 `worker/apps-script/Code.gs` 的內容取代原本的程式碼，儲存
3. 上方函式選單選 `testNotify` → **執行**，依指示授權寄信權限，確認收到測試信
4. **部署** → **管理部署作業** → 點目前部署旁的鉛筆圖示 → 版本選 **新版本** → **部署**
   （這樣網址不會變，不需要改 `APPS_SCRIPT_URL`）
5. 建議在試算表 F1 加上標題「submissionId」

---

## 檢查與監控

### 健康檢查

`GET /health` 會回報三項設定是否就緒：`appsScriptConfigured`、`backupConfigured`、`rateLimiterConfigured`。

### Worker 日誌

已開啟 Workers Logs（`wrangler.toml` 的 `[observability]`）。到 Dashboard → Worker → **Logs** 可以搜尋以下事件：

| 事件 | 意義 |
|------|------|
| `submission_delivered` | 成功寫入試算表 |
| `apps_script_failed` | Apps Script 失敗（含原因） |
| `submission_queued` | 已存入暫存區，稍後補送 |
| `pending_delivered` | 暫存的訊息補送成功 |
| `submission_not_saved` | **訊息沒有存到任何地方**，完整內容在這筆日誌裡，請手動處理 |
| `rate_limited` / `origin_rejected` / `honeypot_triggered` | 被擋下的請求 |

日誌在免費方案保留 3 天。即時查看可在本機執行 `cd worker && npx wrangler tail`。

### 自動化測試

```bash
npm run test:worker
```

---

## 設定參考

| 名稱 | 類型 | 說明 |
|------|------|------|
| `APPS_SCRIPT_URL` | Secret（必填） | Google Apps Script 部署網址 |
| `ALLOWED_ORIGINS` | 變數（選用） | 額外允許的網站來源，逗號分隔，例如 Pages 預覽網址；設為 `*` 允許全部 |
| `RATE_LIMITER` | Rate Limit binding | 每個 IP 每 60 秒 5 次，設定在 `wrangler.toml` |
| `SUBMISSIONS_KV` | KV binding（選用） | 失敗訊息暫存區 |

預設允許的來源：`https://yi-hung-lee.work`、`https://www.yi-hung-lee.work`、`localhost:3000`（dev）、`localhost:4173`（preview）。

---

## 疑難排解

### 部署失敗：`Authentication error [code: 10000]`

確認 `CLOUDFLARE_API_TOKEN` 有 Workers Scripts 的編輯權限。

### 表單一直顯示「無法連線到伺服器」，瀏覽器 Console 出現 CORS 錯誤

網站的網址不在允許名單內（瀏覽器會在送出前就擋下請求）。在 Worker 的 **Variables and Secrets** 新增 `ALLOWED_ORIGINS`，填入完整來源（例如 `https://abc.yi-hung-lee.pages.dev`）。`wrangler.toml` 設有 `keep_vars = true`，這個變數不會被之後的部署清掉。

### 表單顯示「目前無法送出訊息」

到 Worker 日誌搜尋 `apps_script_failed` 看原因：

- `http_404`／`unexpected_response`：Apps Script 部署網址失效或權限不是「任何人」，重新部署後更新 `APPS_SCRIPT_URL`
- `apps_script_error`：Apps Script 執行出錯，到 Apps Script 編輯器 → **執行作業** 查看
- `timeout`：Google 暫時太慢，通常會自己恢復

### 速率限制

每個 IP 每 60 秒最多 5 次。要調整時修改 `wrangler.toml` 的 `[ratelimits.simple]`（`period` 只能是 10 或 60）。

---

## 手動部署（進階）

```bash
cd worker
npx wrangler@4.151.3 login
npx wrangler@4.151.3 deploy
npx wrangler@4.151.3 secret put APPS_SCRIPT_URL
```

速率限制 binding 需要 wrangler 4.36.0 以上。
