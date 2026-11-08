import React from 'react';
import { PsiBot } from './PsiBot';
import { AI_EDITOR, getAiByline } from '../../utils/blogCategories';

/** 文章列表用的小標籤：「AI 撰寫・小賽」 */
export const AiEditorBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-1 border
                border-sage-500 dark:border-darkMode-sage
                font-body text-xs tracking-wide
                text-sage-600 dark:text-darkMode-sage
                ${className}`}
  >
    <PsiBot size={14} animated={false} decorative />
    {AI_EDITOR.badge}
  </span>
);

/** 文章頁標題下方的署名 */
export const AiEditorByline: React.FC<{ aiNote?: string }> = ({ aiNote }) => (
  <div
    className="flex items-center gap-4 px-5 py-4
               bg-sage-300/15 dark:bg-darkMode-sage/10
               border-l-2 border-sage-500 dark:border-darkMode-sage"
  >
    <PsiBot size={40} />
    <div className="space-y-1">
      <p className="font-body text-sm font-semibold text-sage-600 dark:text-darkMode-sage">
        {AI_EDITOR.title}
      </p>
      <p className="font-body text-sm text-charcoal-700 dark:text-darkMode-textMuted">
        {getAiByline(aiNote)}
      </p>
    </div>
  </div>
);

/** Blog 列表選到心聞週報時的自我介紹卡 */
export const AiEditorIntro: React.FC = () => (
  <div
    className="mb-12 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10
               p-8 md:p-10
               bg-warmCream-100 dark:bg-darkMode-bgElevated
               border border-sage-500/40 dark:border-darkMode-sage/40"
  >
    <div className="flex justify-center sm:block pt-2">
      <PsiBot size={88} />
    </div>
    <div className="space-y-3">
      <p className="font-body text-xs tracking-widest uppercase text-sage-600 dark:text-darkMode-sage">
        {AI_EDITOR.title}
      </p>
      <p className="font-body text-base md:text-lg leading-relaxed
                    text-charcoal-700 dark:text-darkMode-textMuted max-w-3xl">
        {AI_EDITOR.intro}
      </p>
    </div>
  </div>
);

/** 文章內文結尾的提醒 */
export const AiEditorDisclaimer: React.FC = () => (
  <aside
    className="mt-16 flex gap-4 p-6
               bg-warmCream-100 dark:bg-darkMode-bgElevated
               border border-sage-500/40 dark:border-darkMode-sage/40"
  >
    <PsiBot size={30} animated={false} decorative className="mt-1" />
    <div className="space-y-2 font-body text-sm leading-relaxed text-charcoal-600 dark:text-darkMode-textMuted">
      <p>{AI_EDITOR.disclaimer}</p>
      <p>{AI_EDITOR.helpline}</p>
    </div>
  </aside>
);
