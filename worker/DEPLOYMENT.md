# Worker 部署指南

## 快速部署流程

### 步驟 1：設定 GitHub Secrets

前往 GitHub Repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

需要設定 2 個 Secrets：

#### 1. `CLOUDFLARE_API_TOKEN`

**注意**：如果你已經為網站部署設定過這個 Secret，可以**直接使用同一個**，只需確認它有足夠的權限。

**檢查現有 Token（如果已存在）**：
1. 前往 [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. 找到你目前使用的 Token，點擊 "Edit"
3. 確認是否包含以下權限：
   - Account > **Cloudflare Pages** > Edit（網站部署需要）
   - Account > **Workers Scripts** > Edit（Worker 部署需要）
4. 如果缺少權限，點擊 "Add" 新增缺少的權限後 Save

**建立新 Token（如果還沒有）**：
1. 前往 [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. 點擊 **"Create Token"**
3. 選擇 **"Create Custom Token"**
4. 設定權限：
   - Account > **Cloudflare Pages** > **Edit**
   - Account > **Workers Scripts** > **Edit**
5. 複製產生的 token
6. 貼到 GitHub Secret（Settings → Secrets and variables → Actions → New repository secret）

#### 2. `CLOUDFLARE_ACCOUNT_ID`

1. 前往 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 在右側欄找到 **"Account ID"**
3. 或從 URL 取得：`dash.cloudflare.com/<ACCOUNT_ID>/workers`
4. 複製 Account ID
5. 貼到 GitHub Secret

### 步驟 2：推送程式碼，觸發第一次部署

```bash
git add .
git commit -m "Add Cloudflare Worker"
git push origin main
```

前往 **GitHub Actions** 查看部署進度。第一次部署會成功建立 Worker，但 Worker 還無法正常運作（因為缺少 `APPS_SCRIPT_URL` 環境變數）。

### 步驟 3：在 Cloudflare Dashboard 設定環境變數

1. 前往 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages**
2. 找到並點擊 **`yi-hung-lee-contact-form`** Worker
3. 點擊 **"Settings"** 標籤
4. 點擊 **"Variables"**
5. 在 **"Environment Variables"** 區域：
   - 點擊 **"Add variable"**
   - **Variable name**: `APPS_SCRIPT_URL`
   - **Value**: 你的 Google Apps Script 部署 URL
     ```
     https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
     ```
   - **類型**: 選擇 **"Encrypt"**（加密儲存為 Secret）
6. 點擊 **"Save and deploy"**

### 步驟 4：取得 Worker URL

部署完成後，在 Cloudflare Dashboard 的 Worker 頁面可以看到 URL：

```
https://yi-hung-lee-contact-form.<your-account>.workers.dev
```

複製這個 URL。

### 步驟 5：設定前端環境變數

#### 方法 A：本地開發

建立 `.env.local` 檔案（不會被 git 追蹤）：

```env
VITE_WORKER_URL=https://yi-hung-lee-contact-form.<your-account>.workers.dev
```

#### 方法 B：正式環境（Cloudflare Pages）

1. 前往 Cloudflare Dashboard → **Pages** → 你的網站專案
2. 點擊 **"Settings"** → **"Environment variables"**
3. 點擊 **"Add variable"**：
   - **Variable name**: `VITE_WORKER_URL`
   - **Value**: `https://yi-hung-lee-contact-form.<your-account>.workers.dev`
   - **Environment**: 選擇 **Production**（和 Preview 如果需要）
4. 點擊 **"Save"**
5. 重新部署網站（或等待下次 git push 自動部署）

### 步驟 6：測試表單

1. 前往你的網站
2. 找到聯絡表單
3. 填寫測試資料並送出
4. 檢查：
   - 前端是否顯示「訊息已成功送出」
   - Google Sheets 是否收到資料

---

## 疑難排解

### 問題 1：GitHub Actions 部署失敗

**錯誤訊息**：`Authentication error [code: 10000]`

**解決方法**：
- 確認 `CLOUDFLARE_API_TOKEN` 有正確的權限
- 重新產生 API Token 並更新 GitHub Secret

### 問題 2：Worker 部署成功但表單送出失敗

**可能原因**：缺少 `APPS_SCRIPT_URL` 環境變數

**解決方法**：
1. 檢查 Cloudflare Dashboard → Worker → Settings → Variables
2. 確認 `APPS_SCRIPT_URL` 已設定且類型為 "Secret"
3. 檢查值是否正確（應該是完整的 Google Apps Script URL）

### 問題 3：CORS 錯誤

**錯誤訊息**：瀏覽器 Console 顯示 CORS 相關錯誤

**解決方法**：
1. 檢查 `worker/contact-form.js` 中的 `CORS_HEADERS`
2. 確認 `Access-Control-Allow-Origin` 包含你的網域
3. 重新部署 Worker

### 問題 4：速率限制錯誤

**錯誤訊息**：`請求過於頻繁，請稍後再試`

**說明**：這是正常的保護機制，每個 IP 每分鐘最多 5 次請求

**解決方法**：
- 等待 1 分鐘後重試
- 或調整 `worker/contact-form.js` 中的 `MAX_REQUESTS_PER_WINDOW` 常數

---

## 更新 Worker

當你修改 `worker/` 目錄下的任何檔案後：

1. 提交並推送：
   ```bash
   git add worker/
   git commit -m "Update worker"
   git push origin main
   ```

2. GitHub Actions 會自動重新部署

3. 查看部署狀態：
   - GitHub → Actions 頁面
   - 或 Cloudflare Dashboard → Worker → Deployments

---

## 手動部署（進階）

如果你想從本地手動部署：

```bash
# 安裝 wrangler CLI
npm install -g wrangler

# 登入 Cloudflare
wrangler login

# 切換到 worker 目錄
cd worker

# 部署
wrangler deploy

# 設定環境變數（僅需執行一次）
wrangler secret put APPS_SCRIPT_URL
# 然後貼上你的 Google Apps Script URL
```

---

## 監控與日誌

### 查看即時日誌

```bash
cd worker
wrangler tail
```

### 查看分析數據

前往 Cloudflare Dashboard → Worker → Analytics

可以看到：
- 請求數量
- 成功率 / 錯誤率
- CPU 使用時間
- 請求來源地理位置

---

## 安全建議

✅ **已完成的安全措施**：
- Google Apps Script URL 隱藏在 Worker 環境變數中
- 速率限制（每個 IP 每分鐘 5 次請求）
- 輸入驗證（Email 格式、必填欄位）
- IP 記錄到 Google Sheets

⚠️ **可選的額外安全措施**：

1. **限制 CORS 來源**

   修改 `worker/contact-form.js`：
   ```javascript
   const CORS_HEADERS = {
     'Access-Control-Allow-Origin': 'https://your-domain.com', // 改為你的網域
     // ...
   };
   ```

2. **啟用 KV 速率限制**

   參考 `worker/README.md` 中的「啟用速率限制（使用 KV）」章節

3. **設定自訂網域**

   使用 `contact.your-domain.com` 而不是 `.workers.dev` 網域

4. **監控異常流量**

   定期檢查 Cloudflare Analytics，注意異常的請求模式

---

## 相關文件

- [完整 README](./README.md) - 詳細的技術文件
- [Cloudflare Workers 文件](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文件](https://developers.cloudflare.com/workers/wrangler/)
