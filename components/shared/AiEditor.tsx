import React, { useEffect, useMemo, useState } from 'react';
import { PsiBot } from './PsiBot';
import { PsiBuddy, type PsiCue, type PsiStep } from './PsiBuddy';
import { AI_EDITOR, getAiByline, getPsiMood } from '../../utils/blogCategories';

/** 文章列表用的小標籤：「AI 撰寫・小賽」 */
export const AiEditorBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-1 border border-fine
                border-sage-500 dark:border-darkMode-sage
                font-body text-xs tracking-wide
                text-sage-600 dark:text-darkMode-sage
                ${className}`}
  >
    <PsiBot size={13} animated={false} decorative />
    {AI_EDITOR.badge}
  </span>
);

/** 文章頁標題下方的署名；小賽的表情跟著這週的 aiMood */
export const AiEditorByline: React.FC<{ aiNote?: string; aiMood?: string }> = ({ aiNote, aiMood }) => (
  <div
    className="flex items-center gap-4 px-5 py-4
               bg-sage-300/15 dark:bg-darkMode-sage/10
               border-l-2 border-sage-500 dark:border-darkMode-sage"
  >
    <PsiBuddy size={39} restMood={getPsiMood(aiMood)} />
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

// 搜尋時小賽先翻書找資料，找到就開心，找不到就難過
const SEARCH_READING: PsiStep = { pose: { action: 'reading' }, ms: 1600 };
const SEARCH_FOUND: PsiStep = { pose: { mood: 'happy' }, ms: 1400 };
// 停止輸入這麼久才反應，免得每打一個字就翻一次書
const SEARCH_SETTLE_MS = 500;

interface AiEditorIntroProps {
  /** 目前的搜尋關鍵字 */
  searchQuery?: string;
  /** 符合的文章數 */
  resultCount?: number;
}

/** Blog 列表選到心聞週報時的自我介紹卡 */
export const AiEditorIntro: React.FC<AiEditorIntroProps> = ({ searchQuery = '', resultCount = 0 }) => {
  const [search, setSearch] = useState(() => ({ query: searchQuery.trim(), found: resultCount > 0 }));

  useEffect(() => {
    const id = window.setTimeout(
      () => setSearch({ query: searchQuery.trim(), found: resultCount > 0 }),
      SEARCH_SETTLE_MS
    );
    return () => window.clearTimeout(id);
  }, [searchQuery, resultCount]);

  const cue = useMemo<PsiCue | null>(
    () =>
      search.query
        ? { key: search.query, steps: search.found ? [SEARCH_READING, SEARCH_FOUND] : [SEARCH_READING] }
        : null,
    [search]
  );

  return (
    <div
      className="mb-12 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10
                 p-8 md:p-10
                 bg-warmCream-100 dark:bg-darkMode-bgElevated
                 border border-fine border-sage-500/40 dark:border-darkMode-sage/40"
    >
      <div className="flex justify-center sm:block pt-2">
        <PsiBuddy size={91} restMood={search.query && !search.found ? 'sad' : 'default'} cue={cue} />
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
};

/** 文章內文結尾的提醒；小賽在想自己是不是哪裡寫錯了 */
export const AiEditorDisclaimer: React.FC = () => (
  <aside
    className="mt-16 flex gap-4 p-6
               bg-warmCream-100 dark:bg-darkMode-bgElevated
               border border-fine border-sage-500/40 dark:border-darkMode-sage/40"
  >
    <PsiBot size={26} mood="thinking" animated={false} decorative className="mt-2" />
    <div className="space-y-2 font-body text-sm leading-relaxed text-charcoal-600 dark:text-darkMode-textMuted">
      <p>{AI_EDITOR.disclaimer}</p>
      <p>{AI_EDITOR.helpline}</p>
    </div>
  </aside>
);
