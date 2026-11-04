-- 聯絡表單的 D1 資料庫結構（資料庫名稱：contact-form）
-- 套用方式：cd worker && npx wrangler d1 execute contact-form --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS submissions (
  id         TEXT PRIMARY KEY,           -- submissionId，前端產生，用來辨識重複送出
  created_at TEXT NOT NULL,              -- 送出時間（ISO 8601，UTC）
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  category   TEXT NOT NULL,              -- speech | course | tutoring | other
  message    TEXT NOT NULL,
  notified   INTEGER NOT NULL DEFAULT 0  -- 1 = 已寄出 Email 通知
);

CREATE INDEX IF NOT EXISTS idx_submissions_created_at
  ON submissions (created_at);

-- 只索引「還沒寄出通知」的訊息，補寄時只會讀到這幾筆
CREATE INDEX IF NOT EXISTS idx_submissions_unnotified
  ON submissions (created_at) WHERE notified = 0;
