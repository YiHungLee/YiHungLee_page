import React, { useEffect, useRef, useState } from 'react';
import { PROFILE } from '../../constants';

type Category = 'speech' | 'course' | 'tutoring' | 'other';

interface FormData {
  name: string;
  email: string;
  category: Category;
  message: string;
}

type FieldName = 'name' | 'email' | 'message';
type FormErrors = Partial<Record<FieldName, string>>;
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

interface SubmitResult {
  ok: boolean;
  message?: string;
  fieldErrors?: FormErrors;
}

// Cloudflare Worker endpoint (secure proxy to Google Apps Script)
const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'https://yi-hung-lee-contact-form.lee2952000.workers.dev';

// 欄位限制（與 worker/contact-form.js 的 LIMITS 保持一致）
const LIMITS = {
  name: 100,
  email: 254,
  messageMin: 10,
  messageMax: 5000,
};

const REQUEST_TIMEOUT_MS = 30000;
// 連線失敗（例如網路瞬斷）時自動重試的等待時間
const NETWORK_RETRY_DELAYS_MS = [1500, 4000];
const DRAFT_KEY = 'contact-form-draft';
const DRAFT_SAVE_DELAY_MS = 400;

const CATEGORY_LABELS: Record<Category, string> = {
  speech: '演講邀約',
  course: '課程邀請',
  tutoring: '心輔所備考協助',
  other: '其他',
};

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  category: 'speech',
  message: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_ERROR = '送出時發生錯誤，請稍後再試，或直接寄信給我。';

const isCategory = (value: unknown): value is Category =>
  typeof value === 'string' && value in CATEGORY_LABELS;

// 讀取上次沒送出的草稿（只存在訪客自己的瀏覽器）
const loadDraft = (): FormData => {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return INITIAL_FORM;
    const draft = JSON.parse(raw);
    return {
      name: typeof draft.name === 'string' ? draft.name : '',
      email: typeof draft.email === 'string' ? draft.email : '',
      category: isCategory(draft.category) ? draft.category : INITIAL_FORM.category,
      message: typeof draft.message === 'string' ? draft.message : '',
    };
  } catch {
    return INITIAL_FORM;
  }
};

const saveDraft = (data: FormData) => {
  try {
    if (!data.name && !data.email && !data.message) {
      window.localStorage.removeItem(DRAFT_KEY);
    } else {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    }
  } catch {
    // 無痕模式或儲存空間被封鎖時略過
  }
};

const createSubmissionId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};
  const name = data.name.trim();
  const email = data.email.trim();
  const message = data.message.trim();

  if (!name) {
    errors.name = '請輸入您的姓名';
  } else if (name.length > LIMITS.name) {
    errors.name = `姓名請勿超過 ${LIMITS.name} 個字元`;
  }

  if (!email) {
    errors.email = '請輸入您的 Email';
  } else if (email.length > LIMITS.email || !EMAIL_REGEX.test(email)) {
    errors.email = '請輸入有效的 Email 地址';
  }

  if (!message) {
    errors.message = '請輸入您的訊息';
  } else if (message.length < LIMITS.messageMin) {
    errors.message = `訊息至少需要 ${LIMITS.messageMin} 個字元`;
  } else if (message.length > LIMITS.messageMax) {
    errors.message = `訊息請勿超過 ${LIMITS.messageMax} 個字元`;
  }

  return errors;
};

const postWithTimeout = async (body: string): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
};

/**
 * 送出表單。只有在伺服器明確回覆成功時才算成功。
 * 連不上伺服器時自動重試；逾時則不重試（伺服器可能仍在處理），改請訪客稍後再試或寄信。
 */
const sendSubmission = async (payload: Record<string, unknown>): Promise<SubmitResult> => {
  const body = JSON.stringify(payload);
  let response: Response | undefined;

  for (let attempt = 0; !response; attempt++) {
    try {
      response = await postWithTimeout(body);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { ok: false, message: '伺服器回應逾時，訊息可能沒有送達。請稍後再試，或直接寄信給我。' };
      }
      if (attempt >= NETWORK_RETRY_DELAYS_MS.length) {
        return {
          ok: false,
          message: navigator.onLine === false
            ? '目前沒有網路連線，請確認連線後再試。'
            : '無法連線到伺服器，請稍後再試，或直接寄信給我。',
        };
      }
      await sleep(NETWORK_RETRY_DELAYS_MS[attempt]);
    }
  }

  const result = await response.json().catch(() => null);

  if (response.ok && result?.success === true) {
    return { ok: true };
  }
  if (response.status === 400 && result?.fields) {
    return { ok: false, message: result.error || '請檢查欄位內容。', fieldErrors: result.fields };
  }
  if (response.status === 429) {
    return { ok: false, message: '送出次數過於頻繁，請稍候一分鐘再試。' };
  }
  return { ok: false, message: typeof result?.error === 'string' ? result.error : GENERIC_ERROR };
};

const buildMailtoLink = (data: FormData): string => {
  const subject = `[網站聯絡] ${CATEGORY_LABELS[data.category]}${data.name.trim() ? `｜${data.name.trim()}` : ''}`;
  const signature = `\n\n—\n${data.name.trim()}${data.email.trim() ? `（${data.email.trim()}）` : ''}`;
  const fullBody = `${data.message.trim()}${signature}`;
  // 太長的 mailto 連結有些郵件程式打不開，過長時請訪客用「複製訊息」貼上
  const body = encodeURIComponent(fullBody).length > 1800
    ? `（訊息較長，請在此貼上剛才複製的內容）${signature}`
    : fullBody;
  return `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(loadDraft);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  // 蜜罐欄位：畫面上看不到，只有機器人會填
  const [gotcha, setGotcha] = useState('');

  const submittingRef = useRef(false);
  // 同一份內容重送時沿用同一個 ID，讓後端能辨識重複送出
  const submissionIdRef = useRef<string | null>(null);

  // 自動儲存草稿，避免重新整理或送出失敗時內容遺失
  useEffect(() => {
    const timer = setTimeout(() => saveDraft(formData), DRAFT_SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    submittingRef.current = true;
    setStatus('submitting');
    setErrorMessage('');
    setCopied(false);

    if (!submissionIdRef.current) {
      submissionIdRef.current = createSubmissionId();
    }

    try {
      const result = await sendSubmission({
        submissionId: submissionIdRef.current,
        name: formData.name.trim(),
        email: formData.email.trim(),
        category: formData.category,
        message: formData.message.trim(),
        _gotcha: gotcha,
      });

      if (result.ok) {
        setStatus('success');
        setFormData(INITIAL_FORM);
        saveDraft(INITIAL_FORM);
        submissionIdRef.current = null;
      } else {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        setErrorMessage(result.message || GENERIC_ERROR);
        setStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage(GENERIC_ERROR);
      setStatus('error');
    } finally {
      submittingRef.current = false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 內容改了就視為新的一筆
    submissionIdRef.current = null;
    if (status === 'success' || status === 'error') setStatus('idle');
    // Clear error for this field when user starts typing
    if (errors[name as FieldName]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCopy = async () => {
    const text = `${formData.message.trim()}\n\n—\n${formData.name.trim()}（${formData.email.trim()}）`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const fieldClass = (field: FieldName) =>
    `w-full px-6 py-4 font-body text-lg
     bg-warmCream-50 dark:bg-darkMode-bgSubtle border-2
     ${errors[field] ? 'border-red-500 dark:border-red-600' : 'border-border-light dark:border-darkMode-border'}
     text-charcoal-900 dark:text-darkMode-text
     focus:outline-none focus:border-ochre-500 dark:focus:border-darkMode-ochre
     transition-colors duration-300`;

  return (
    <section id="contact-form" className="py-32 md:py-40 bg-warmCream-100 dark:bg-darkMode-bg transition-colors duration-500">
      <div className="max-w-3xl mx-auto px-6 md:px-12">

        {/* Form Header */}
        <div className="mb-16 opacity-0 animate-fade-in-up">
          <h2 className="font-display text-6xl md:text-7xl lg:text-8xl
                     font-bold text-charcoal-900 dark:text-darkMode-text tracking-tight
                     text-center mb-8 optical-align">
        取得聯繫
      </h2>

          <p className="font-body text-lg md:text-xl text-charcoal-600 dark:text-darkMode-textMuted
                    text-center max-w-2xl leading-relaxed">
        演講邀約｜課程邀請｜心輔所備考協助
      </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-8 opacity-0 animate-fade-in-up stagger-1">

          {/* Honeypot (hidden from people, filled in by bots) */}
          <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
            <label htmlFor="contact-gotcha">請勿填寫此欄位</label>
            <input
              type="text"
              id="contact-gotcha"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              value={gotcha}
              onChange={e => setGotcha(e.target.value)}
            />
          </div>

          {/* Name Field */}
          <div className="space-y-3">
            <label
              htmlFor="name"
              className="font-body text-sm tracking-wider uppercase text-charcoal-600 dark:text-darkMode-textMuted">
              姓名 <span className="text-ochre-500 dark:text-darkMode-ochre">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              maxLength={LIMITS.name}
              value={formData.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={fieldClass('name')}
              placeholder="您的姓名"
            />
            {errors.name && (
              <p id="name-error" className="font-body text-sm text-red-500 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-3">
            <label
              htmlFor="email"
              className="font-body text-sm tracking-wider uppercase text-charcoal-600 dark:text-darkMode-textMuted">
              Email <span className="text-ochre-500 dark:text-darkMode-ochre">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              maxLength={LIMITS.email}
              value={formData.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={fieldClass('email')}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p id="email-error" className="font-body text-sm text-red-500 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Category Field */}
          <div className="space-y-3">
            <label
              htmlFor="category"
              className="font-body text-sm tracking-wider uppercase text-charcoal-600 dark:text-darkMode-textMuted">
              聯絡類別
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-6 py-4 font-body text-lg
                         bg-warmCream-50 dark:bg-darkMode-bgSubtle border-2 border-border-light dark:border-darkMode-border
                         text-charcoal-900 dark:text-darkMode-text
                         focus:outline-none focus:border-ochre-500 dark:focus:border-darkMode-ochre
                         transition-colors duration-300
                         cursor-pointer"
            >
              {(Object.keys(CATEGORY_LABELS) as Category[]).map(value => (
                <option key={value} value={value}>{CATEGORY_LABELS[value]}</option>
              ))}
            </select>
          </div>

          {/* Message Field */}
          <div className="space-y-3">
            <label
              htmlFor="message"
              className="font-body text-sm tracking-wider uppercase text-charcoal-600 dark:text-darkMode-textMuted">
              訊息 <span className="text-ochre-500 dark:text-darkMode-ochre">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              maxLength={LIMITS.messageMax}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'message-error message-count' : 'message-count'}
              className={`${fieldClass('message')} resize-y`}
              placeholder="請告訴我您的想法或需求..."
            />
            <div className="flex items-start justify-between gap-4">
              {errors.message ? (
                <p id="message-error" className="font-body text-sm text-red-500 dark:text-red-400">{errors.message}</p>
              ) : (
                <span />
              )}
              <p
                id="message-count"
                className="font-body text-sm text-charcoal-600 dark:text-darkMode-textMuted whitespace-nowrap">
                {formData.message.length} / {LIMITS.messageMax}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="group relative w-full md:w-auto px-12 py-4
                         font-display text-xl font-semibold
                         bg-ochre-500 dark:bg-darkMode-ochre
                         text-warmCream-50 dark:text-charcoal-900
                         hover:bg-ochre-600 dark:hover:bg-darkMode-ochreDim
                         hover:text-warmCream-50 dark:hover:text-darkMode-text
                         disabled:bg-charcoal-600 dark:disabled:bg-darkMode-textMuted disabled:cursor-not-allowed
                         transition-all duration-500 ease-out-expo
                         overflow-hidden">
              <span className="relative z-10">
                {status === 'submitting' ? '傳送中...' : '送出訊息'}
              </span>
              <div className="absolute inset-0 bg-charcoal-900 dark:bg-darkMode-bgElevated
                              transform translate-y-full
                              group-hover:translate-y-0
                              transition-transform duration-500 ease-out-expo
                              group-disabled:translate-y-full"></div>
            </button>
          </div>

          {/* Status Messages */}
          <div aria-live="polite">
            {status === 'success' && (
              <div role="status" className="p-6 bg-green-50 dark:bg-darkMode-bgElevated border-2 border-green-500 dark:border-green-600">
                <p className="font-body text-lg text-green-700 dark:text-green-400">
                  ✓ 訊息已成功送出！我會盡快回覆您。
                </p>
              </div>
            )}

            {status === 'error' && (
              <div role="alert" className="p-6 space-y-4 bg-red-50 dark:bg-darkMode-bgElevated border-2 border-red-500 dark:border-red-600">
                <p className="font-body text-lg text-red-700 dark:text-red-400">
                  ✗ {errorMessage || GENERIC_ERROR}
                </p>
                <p className="font-body text-base text-charcoal-600 dark:text-darkMode-textMuted">
                  您填寫的內容仍保留在表單中。也可以直接寄信到{' '}
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="underline text-ochre-600 dark:text-darkMode-ochre">
                    {PROFILE.email}
                  </a>
                  。
                </p>
                {formData.message.trim() && (
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={buildMailtoLink(formData)}
                      className="px-5 py-2 font-body text-base border-2 border-charcoal-900 dark:border-darkMode-text
                                 text-charcoal-900 dark:text-darkMode-text
                                 hover:bg-charcoal-900 hover:text-warmCream-50
                                 dark:hover:bg-darkMode-text dark:hover:text-charcoal-900
                                 transition-colors duration-300">
                      用 Email 寄出這則訊息
                    </a>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-5 py-2 font-body text-base border-2 border-charcoal-900 dark:border-darkMode-text
                                 text-charcoal-900 dark:text-darkMode-text
                                 hover:bg-charcoal-900 hover:text-warmCream-50
                                 dark:hover:bg-darkMode-text dark:hover:text-charcoal-900
                                 transition-colors duration-300">
                      {copied ? '已複製 ✓' : '複製訊息內容'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </form>
      </div>
    </section>
  );
};

export default ContactForm;
