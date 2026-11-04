# 聯絡表單後端部署指南

## 架構

```
網站表單（components/contact/ContactForm.tsx）
   │  POST JSON（含 submissionId）
   ▼
Cloudflare Worker（worker/contact-form.js）
   │  驗證、來源檢查、速率限制、蜜罐防機器人
   ├──▶ ① D1 資料庫 contact-form（正式紀錄）
   └──▶ ② Email 通知（經 Cloudflare Email Routing 寄到你的信箱，直接回覆即可回信給對方）
```

資料庫和 Email 是兩份獨立的紀錄，**任一成功就算訊息已保存**。

### 出問題時會發生什麼事

| 狀況 | 處理方式 |
|------|----------|
| 訪客網路瞬斷 | 前端自動重試 2 次 |
| 伺服器 30 秒沒回應 | 前端顯示錯誤，內容保留在表單，提供「用 Email 寄出」與「複製訊息」按鈕 |
| 資料庫暫時錯誤 | Worker 重試一次 |
| 資料庫寫不進去（例如帳號 D1 每日額度被其他專案用完） | 改靠 Email 保住訊息，信件開頭會註明「沒有存進資料庫」 |
| 通知信寄不出去 | 訊息仍在資料庫（標記為未通知），下一次寄信成功時自動補寄 |
| 資料庫和 Email 都失敗 | 訪客看到錯誤與 Email 備援按鈕；完整內容寫進 Worker 日誌（事件 `submission_not_saved`） |
| 訪客重新整理頁面 | 表單內容自動存成草稿，重新開啟時還原 |
| 同一筆訊息被重送 | 用 `submissionId` 辨識，不會重複寫入或重複寄信 |

---

## 第一次設定

資料庫 `contact-form` 已建立並套用 `worker/schema.sql`。還需要設定通知信：

### 1. 確認收件信箱已在 Email Routing 驗證

Worker 只能寄信到 Cloudflare 帳號裡**已驗證的目的地信箱**（免費，不計額度）。

1. Cloudflare Dashboard → **Compute** → **Email Service** → **Email Routing** → **Destination Addresses**
2. 確認你想收通知的信箱（例如 `mail@yi-hung-lee.work` 轉寄到的那個 Gmail）狀態是 **Verified**
3. 如果不在清單上，新增後到該信箱點驗證信

### 2. 設定 `NOTIFY_TO`

1. Dashboard → **Workers & Pages** → **`yi-hung-lee-contact-form`** → **Settings** → **Variables and Secrets**
2. 新增 `NOTIFY_TO`，值為上一步確認過的信箱，類型選 **Secret**
   （repo 是公開的，所以收件信箱不寫在程式碼裡）

### 3. 部署並確認

推送到 `main` 後，GitHub Actions 會自動部署。接著打開
`https://yi-hung-lee-contact-form.lee2952000.workers.dev/health`，應該看到：

```json
{ "ok": true, "databaseConfigured": true, "emailConfigured": true, "rateLimiterConfigured": true }
```

最後在網站送出一則測試訊息，確認收到通知信（第一次請也檢查垃圾郵件匣）。

### 4. 收尾：停用舊的 Google Apps Script

確認新流程正常後：

- Worker 的 **Variables and Secrets** 可以刪除不再使用的 `APPS_SCRIPT_URL`
- Apps Script「yi-hung-lee.work的聯絡表單API」→ **部署** → **管理部署作業** → 封存，避免舊網址繼續接受寫入
- 試算表「個人網頁的聯絡表單回應」保留當作舊資料的封存

---

## 查看訊息

平常看通知信即可。要查歷史紀錄：Dashboard → **Storage & Databases** → **D1** → **contact-form** → **Console**，執行：

```sql
-- 最近 50 則
SELECT created_at, name, email, category, message
FROM submissions ORDER BY created_at DESC LIMIT 50;

-- 通知信沒寄出去的訊息
SELECT * FROM submissions WHERE notified = 0;
```

`created_at` 是 UTC 時間（台灣時間減 8 小時）。

---

## 檢查與監控

### 健康檢查

`GET /health` 回報：`databaseConfigured`、`emailConfigured`（需要 `EMAIL` 綁定和 `NOTIFY_TO`）、`rateLimiterConfigured`。

### Worker 日誌

已開啟 Workers Logs（`wrangler.toml` 的 `[observability]`）。Dashboard → Worker → **Logs** 可搜尋：

| 事件 | 意義 |
|------|------|
| `submission_saved` | 已存進資料庫 |
| `notified` / `catch_up_notified` | 通知信已寄出／已補寄 |
| `notify_failed` | 通知信寄不出去（訊息在資料庫，會補寄） |
| `database_failed` | 資料庫寫入失敗（含原因） |
| `submission_emailed_only` | 只有 Email 有這則訊息，資料庫沒有 |
| `submission_not_saved` | **兩邊都失敗**，完整內容在這筆日誌裡，請手動處理 |
| `rate_limited` / `origin_rejected` / `honeypot_triggered` | 被擋下的請求 |

日誌在免費方案保留 3 天。即時查看可在本機執行 `cd worker && npx wrangler tail`。

### 自動化測試

```bash
npm run test:worker
```

---

## 用量

每則訊息約寫入 5 列（資料本身加索引）、讀取 1–2 列；免費方案整個帳號每天可寫入 10 萬列、讀取 500 萬列，聯絡表單的用量可以忽略。D1 額度是**整個帳號共用**的，其他專案用完時，聯絡表單會改靠 Email 保住訊息（見上表）。額度在台灣時間每天早上 8 點重置。

通知信寄到已驗證信箱不計入寄信額度。

---

## 設定參考

| 名稱 | 類型 | 說明 |
|------|------|------|
| `DB` | D1 binding | 資料庫 `contact-form`，結構見 `schema.sql` |
| `EMAIL` | Send Email binding | 寄通知信 |
| `NOTIFY_TO` | Secret（必填） | 通知信收件信箱，必須是 Email Routing 已驗證的目的地信箱 |
| `NOTIFY_FROM` | 變數（選用） | 寄件地址，預設 `contact-form@yi-hung-lee.work`（必須是已啟用 Email Routing 的網域） |
| `ALLOWED_ORIGINS` | 變數（選用） | 額外允許的網站來源，逗號分隔；設為 `*` 允許全部 |
| `RATE_LIMITER` | Rate Limit binding | 每個 IP 每 60 秒 5 次 |

預設允許的來源：`https://yi-hung-lee.work`、`https://www.yi-hung-lee.work`、`localhost:3000`（dev）、`localhost:4173`（preview）。

部署相關的 GitHub Secrets：`CLOUDFLARE_API_TOKEN`（需要 **Workers Scripts: Edit**）、`CLOUDFLARE_ACCOUNT_ID`。

---

## 疑難排解

### `/health` 顯示 `emailConfigured: false`

還沒設定 `NOTIFY_TO`，見「第一次設定」第 2 步。

### 收不到通知信

到 Worker 日誌搜尋 `notify_failed` 看原因：

- 收件信箱沒有驗證：到 Email Routing 的 **Destination Addresses** 驗證，或把 `NOTIFY_TO` 改成已驗證的信箱
- 寄件地址被拒：把 `NOTIFY_FROM` 設成 `mail@yi-hung-lee.work` 再試
- 也請檢查垃圾郵件匣

訊息本身仍在資料庫裡，修好後下一則訊息寄出時會自動補寄。

### 部署失敗

- `Authentication error [code: 10000]`：確認 `CLOUDFLARE_API_TOKEN` 有 Workers Scripts 的編輯權限；若錯誤提到 D1，再加上 **D1: Edit** 權限
- 速率限制 binding 需要 wrangler 4.36.0 以上（workflow 已固定 4.151.3）

### 表單一直顯示「無法連線到伺服器」，瀏覽器 Console 出現 CORS 錯誤

網站網址不在允許名單內。在 Worker 的 **Variables and Secrets** 新增 `ALLOWED_ORIGINS`，填入完整來源（例如 `https://abc.yi-hung-lee.pages.dev`）。

### 速率限制

修改 `wrangler.toml` 的 `[ratelimits.simple]`（`period` 只能是 10 或 60）。

---

## 手動操作（進階）

```bash
cd worker
npx wrangler@4.151.3 login
npx wrangler@4.151.3 deploy
npx wrangler@4.151.3 secret put NOTIFY_TO
# 重新套用資料庫結構（只會建立不存在的資料表與索引）
npx wrangler@4.151.3 d1 execute contact-form --remote --file=schema.sql
```
