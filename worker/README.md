# Cloudflare Worker - Contact Form Proxy

這個 Cloudflare Worker 作為安全的中介層，保護 Google Apps Script URL 不被直接暴露在前端程式碼中。

## 架構說明

```
前端表單 (ContactForm.tsx)
    ↓
Cloudflare Worker (contact-form.js)
    ↓
Google Apps Script
    ↓
Google Sheets
```

## 安全優勢

1. **隱藏敏感端點**：Google Apps Script URL 儲存為環境變數，不會暴露在前端
2. **速率限制**：防止濫用和 DoS 攻擊（每個 IP 每分鐘最多 5 次請求）
3. **輸入驗證**：在 Worker 層驗證表單資料
4. **CORS 控制**：可以精確控制允許的來源網域
5. **IP 記錄**：記錄提交者的 IP 位址到 Google Sheets

## 部署步驟

### 1. 安裝 Wrangler CLI（選擇性，用於本地測試）

```bash
npm install -g wrangler
```

### 2. 設定 GitHub Secrets

在你的 GitHub repository 設定以下 Secrets（Settings → Secrets and variables → Actions）：

#### 必要的 Secrets：

- `CLOUDFLARE_API_TOKEN`
  - 前往 [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
  - 點擊 "Create Token"
  - 使用 "Edit Cloudflare Workers" 模板
  - 或自訂權限：Account > Workers Scripts > Edit
  - 複製產生的 token

- `CLOUDFLARE_ACCOUNT_ID`
  - 前往 [Cloudflare Dashboard](https://dash.cloudflare.com/)
  - 在右側欄可以找到 "Account ID"
  - 或從 URL 取得：`dash.cloudflare.com/<ACCOUNT_ID>/workers`

- `APPS_SCRIPT_URL`
  - 你現有的 Google Apps Script 部署 URL
  - 格式：`https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec`

### 3. 部署 Worker

#### 方法 A：使用 GitHub Actions（推薦）

1. 將程式碼推送到 `main` 分支
2. GitHub Actions 會自動部署 Worker
3. 查看部署狀態：Actions tab → Deploy Cloudflare Worker

#### 方法 B：手動部署（本地開發）

```bash
cd worker

# 登入 Cloudflare
wrangler login

# 設定 secret（僅需執行一次）
wrangler secret put APPS_SCRIPT_URL
# 貼上你的 Google Apps Script URL

# 部署到 Cloudflare
wrangler deploy
```

### 4. 取得 Worker URL

部署成功後，你會看到類似這樣的輸出：

```
Published yi-hung-lee-contact-form (0.xx sec)
  https://yi-hung-lee-contact-form.your-subdomain.workers.dev
```

### 5. 更新前端設定

#### 方法 A：使用環境變數（推薦用於本地開發）

在專案根目錄建立 `.env.local` 檔案（不要提交到 git）：

```env
VITE_WORKER_URL=https://yi-hung-lee-contact-form.your-subdomain.workers.dev
```

#### 方法 B：在 Cloudflare Pages 設定環境變數（推薦用於正式環境）

1. 前往 Cloudflare Dashboard → Pages → 你的專案
2. 點擊 "Settings" → "Environment variables"
3. 新增變數：
   - Variable name: `VITE_WORKER_URL`
   - Value: `https://yi-hung-lee-contact-form.your-subdomain.workers.dev`
4. 選擇環境：Production（和 Preview 如果需要）
5. 儲存後重新部署網站

**注意**：雖然 Worker URL 最終會暴露在前端，但這是可接受的，因為：
- Worker 本身有速率限制保護
- 真正敏感的 Google Apps Script URL 仍然隱藏在 Worker 的環境變數中
- 可以透過 Worker 的 CORS 設定限制允許的來源網域

### 6. 設定自訂網域（選擇性）

如果你想使用自訂網域（例如 `contact.lee-yi-hung.com`）：

1. 在 Cloudflare Dashboard → Workers & Pages → 你的 Worker
2. 點擊 "Settings" → "Triggers" → "Add Custom Domain"
3. 輸入子網域名稱（需要網域已託管在 Cloudflare）
4. 更新 `wrangler.toml` 中的 route 設定

## Google Apps Script 設定

確保你的 Google Apps Script 可以接收 POST 請求：

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // 寫入 Google Sheets
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.email,
      data.category,
      data.message,
      data.ip,
      data.userAgent,
      data.source
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 本地開發與測試

### 啟動本地開發伺服器

```bash
cd worker
wrangler dev
```

Worker 會在 `http://localhost:8787` 啟動。

### 測試 Worker

```bash
# 測試 POST 請求
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "測試名稱",
    "email": "test@example.com",
    "category": "other",
    "message": "這是測試訊息"
  }'

# 測試速率限制（快速發送多次請求）
for i in {1..6}; do
  curl -X POST http://localhost:8787 \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","message":"Rate limit test"}'
  echo ""
done
```

## 進階設定

### 啟用速率限制（使用 KV）

1. 建立 KV namespace：
```bash
wrangler kv:namespace create "RATE_LIMIT_KV"
```

2. 取得 namespace ID 並更新 `wrangler.toml`：
```toml
[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "your-kv-namespace-id"
```

3. 重新部署 Worker

### 限制 CORS 來源

修改 [contact-form.js](./contact-form.js:9) 中的 `CORS_HEADERS`：

```javascript
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://lee-yi-hung.com', // 限制為你的網域
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

### 調整速率限制

修改 [contact-form.js](./contact-form.js:15-16) 中的常數：

```javascript
const RATE_LIMIT_WINDOW = 60 * 1000; // 時間窗口（毫秒）
const MAX_REQUESTS_PER_WINDOW = 5; // 最大請求次數
```

## 監控與日誌

### 查看 Worker 日誌

```bash
wrangler tail
```

或在 Cloudflare Dashboard → Workers & Pages → 你的 Worker → Logs

### 查看分析數據

Cloudflare Dashboard → Workers & Pages → 你的 Worker → Analytics

可以看到：
- 請求數量
- 錯誤率
- CPU 使用時間
- 請求來源地理位置

## 費用說明

Cloudflare Workers 免費方案：
- 每天 100,000 次請求
- 每次請求最多 10ms CPU 時間

對於個人作品集網站的聯絡表單來說，免費方案綽綽有餘。

## 疑難排解

### Worker 部署失敗

1. 確認 GitHub Secrets 設定正確
2. 檢查 `wrangler.toml` 語法是否正確
3. 查看 GitHub Actions 的錯誤訊息

### 表單提交失敗

1. 在瀏覽器 DevTools → Network 查看請求詳情
2. 檢查 Worker 是否正確部署（訪問 Worker URL 應該返回 405 Method Not Allowed）
3. 確認 `APPS_SCRIPT_URL` secret 設定正確
4. 查看 Worker 日誌：`wrangler tail`

### CORS 錯誤

確認 Worker 的 CORS headers 包含你的網域，或設定為 `*`（開發階段）。

## 更新 Worker

修改 `worker/contact-form.js` 或 `worker/wrangler.toml` 後：

1. 提交並推送到 GitHub
2. GitHub Actions 會自動重新部署
3. 或手動執行：`wrangler deploy`

## 安全建議

1. ✅ 不要將 `APPS_SCRIPT_URL` 提交到版本控制
2. ✅ 使用 GitHub Secrets 儲存敏感資訊
3. ✅ 定期檢查 Cloudflare 的 Analytics 是否有異常流量
4. ✅ 考慮啟用 Cloudflare 的 Bot Management（付費功能）
5. ✅ 設定 CORS 為特定網域（正式環境）

## 相關連結

- [Cloudflare Workers 文件](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文件](https://developers.cloudflare.com/workers/wrangler/)
- [Google Apps Script 文件](https://developers.google.com/apps-script/)
