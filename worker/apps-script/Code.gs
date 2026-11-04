/**
 * yi-hung-lee.work 聯絡表單 API（Google Apps Script）
 * 綁定在 Google 試算表「個人網頁的聯絡表單回應」（擴充功能 → Apps Script）
 *
 * 這是選用的升級版；舊版程式碼也能和新的 Worker 一起運作。升級後多了：
 * 1. 收到新訊息時寄 Email 通知（不用再記得去看試算表）
 * 2. 用 submissionId 去除重複：Worker 重試或補送時不會多寫一筆
 * 3. 失敗時回傳真正的錯誤原因（舊版 JSON.stringify(error) 會變成 {}）
 * 4. 拿不到寫入鎖時回報失敗，讓 Worker 重試，而不是直接寫入
 *
 * 更新方式見 worker/DEPLOYMENT.md「升級 Google Apps Script（選用）」
 */

var SHEET_NAME = '表單回應';
// 新訊息通知寄到哪裡；設成 '' 可關閉通知
var NOTIFY_EMAIL = 'mail@yi-hung-lee.work';
// submissionId 寫在第幾欄（A=1）。A~E 是原本的欄位：時間、姓名、Email、類別、訊息
var ID_COLUMN = 6;
// 檢查重複時往回看幾列
var DEDUPE_LOOKBACK_ROWS = 500;

var CATEGORY_LABELS = {
  speech: '演講邀約',
  course: '課程邀請',
  tutoring: '心輔所備考協助',
  other: '其他'
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return jsonOutput_({ result: 'error', error: '系統忙碌中，請稍後再試' });
  }

  var data;
  try {
    data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();
    var id = data.submissionId ? String(data.submissionId) : '';

    if (id && isDuplicate_(sheet, id)) {
      return jsonOutput_({ result: 'success', duplicate: true });
    }

    sheet.appendRow([new Date(), data.name, data.email, data.category, data.message, id]);
    SpreadsheetApp.flush();
  } catch (error) {
    console.error(error);
    return jsonOutput_({ result: 'error', error: String(error && error.message ? error.message : error) });
  } finally {
    lock.releaseLock();
  }

  // 寫入成功後才寄通知；寄信失敗不影響回傳結果
  notify_(data);
  return jsonOutput_({ result: 'success' });
}

/**
 * 升級後請在編輯器手動執行一次：授權寄信權限，並確認收得到通知信。
 */
function testNotify() {
  notify_({
    name: '測試',
    email: NOTIFY_EMAIL,
    category: 'other',
    message: '這是一封測試通知信。收到這封信代表通知功能正常。'
  });
}

function getSheet_() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  return doc.getSheetByName(SHEET_NAME) || doc.getSheets()[0];
}

function isDuplicate_(sheet, id) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 1) return false;
  var startRow = Math.max(1, lastRow - DEDUPE_LOOKBACK_ROWS + 1);
  var values = sheet.getRange(startRow, ID_COLUMN, lastRow - startRow + 1, 1).getDisplayValues();
  for (var i = values.length - 1; i >= 0; i--) {
    if (values[i][0] === id) return true;
  }
  return false;
}

function notify_(data) {
  if (!NOTIFY_EMAIL) return;
  try {
    var name = plain_(data.name);
    var email = plain_(data.email);
    var category = CATEGORY_LABELS[data.category] || '其他';
    var body = [
      '網站聯絡表單收到一則新訊息：',
      '',
      '姓名：' + name,
      'Email：' + email,
      '類別：' + category,
      '時間：' + Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd HH:mm'),
      '',
      '──────────',
      plain_(data.message),
      '──────────',
      '',
      '直接回覆這封信就會寄給對方。',
      '試算表：' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
    ].join('\n');

    var options = { name: '網站聯絡表單' };
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      options.replyTo = email;
    }
    MailApp.sendEmail(NOTIFY_EMAIL, '[網站聯絡表單] ' + category + '｜' + name, body, options);
  } catch (error) {
    console.error('通知信寄送失敗：' + error);
  }
}

// Worker 會在 = + - @ 開頭的內容前加單引號（避免試算表當成公式），寄信時拿掉
function plain_(value) {
  var text = value == null ? '' : String(value);
  return /^'[=+\-@\t\r]/.test(text) ? text.slice(1) : text;
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
