import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  category: 'speech' | 'course' | 'tutoring' | 'other';
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

// TODO: Replace with your actual Google Apps Script deployment URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzk0sDc4lEOPKZA-qHRkdP2ckydUNidjYJiDneH1-Xag0bBD6NyTRjV4s68Ca0qMKc/exec';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    category: 'speech',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = '請輸入您的姓名';
    } else if (formData.name.trim().length < 1) {
      newErrors.name = '姓名至少需要 1 個字元';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = '請輸入您的 Email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '請輸入有效的 Email 地址';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = '請輸入您的訊息';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = '訊息至少需要 10 個字元';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus('submitting');

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',  // Google Apps Script CORS limitation
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          source: 'portfolio-website'
        })
      });

      // mode: 'no-cors' prevents reading response, assume success
      setStatus('success');
      setFormData({ name: '', email: '', category: 'other', message: '' });

      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section className="py-32 md:py-40 bg-warmCream-100 dark:bg-darkMode-bg transition-colors duration-500">
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
        演講邀約｜課程邀請｜找我家教
      </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 opacity-0 animate-fade-in-up stagger-1">

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
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-6 py-4 font-body text-lg
                         bg-warmCream-50 dark:bg-darkMode-bgSubtle border-2
                         ${errors.name ? 'border-red-500 dark:border-red-600' : 'border-border-light dark:border-darkMode-border'}
                         text-charcoal-900 dark:text-darkMode-text
                         focus:outline-none focus:border-ochre-500 dark:focus:border-darkMode-ochre
                         transition-colors duration-300`}
              placeholder="您的姓名"
            />
            {errors.name && (
              <p className="font-body text-sm text-red-500 dark:text-red-400">{errors.name}</p>
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
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-6 py-4 font-body text-lg
                         bg-warmCream-50 dark:bg-darkMode-bgSubtle border-2
                         ${errors.email ? 'border-red-500 dark:border-red-600' : 'border-border-light dark:border-darkMode-border'}
                         text-charcoal-900 dark:text-darkMode-text
                         focus:outline-none focus:border-ochre-500 dark:focus:border-darkMode-ochre
                         transition-colors duration-300`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="font-body text-sm text-red-500 dark:text-red-400">{errors.email}</p>
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
              <option value="speech">演講邀約</option>
              <option value="course">課程邀請</option>
              <option value="tutoring">找我家教</option>
              <option value="other">其他</option>
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
              className={`w-full px-6 py-4 font-body text-lg
                         bg-warmCream-50 dark:bg-darkMode-bgSubtle border-2
                         ${errors.message ? 'border-red-500 dark:border-red-600' : 'border-border-light dark:border-darkMode-border'}
                         text-charcoal-900 dark:text-darkMode-text
                         focus:outline-none focus:border-ochre-500 dark:focus:border-darkMode-ochre
                         transition-colors duration-300
                         resize-y`}
              placeholder="請告訴我您的想法或需求..."
            />
            {errors.message && (
              <p className="font-body text-sm text-red-500 dark:text-red-400">{errors.message}</p>
            )}
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
          {status === 'success' && (
            <div className="p-6 bg-green-50 dark:bg-darkMode-bgElevated border-2 border-green-500 dark:border-green-600">
              <p className="font-body text-lg text-green-700 dark:text-green-400">
                ✓ 訊息已成功送出！我會盡快回覆您。
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="p-6 bg-red-50 dark:bg-darkMode-bgElevated border-2 border-red-500 dark:border-red-600">
              <p className="font-body text-lg text-red-700 dark:text-red-400">
                ✗ 送出時發生錯誤，請稍後再試或直接寄信至我的 Email。
              </p>
            </div>
          )}

        </form>
      </div>
    </section>
  );
};

export default ContactForm;
