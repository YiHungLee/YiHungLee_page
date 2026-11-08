// Blog 分類與 AI 小編設定（前端元件與建置腳本共用，不可引入 virtual:content）

export type BlogCategoryId = 'professional' | 'creative' | 'casual' | 'ai-weekly';

export const BLOG_CATEGORY_IDS: BlogCategoryId[] = ['professional', 'creative', 'casual', 'ai-weekly'];

export const BLOG_CATEGORY_LABELS: Record<BlogCategoryId, string> = {
  professional: '專業分享',
  creative: '創意探索',
  casual: '心情隨筆',
  'ai-weekly': '心聞週報',
};

export function getBlogCategoryLabel(category: string): string {
  return BLOG_CATEGORY_LABELS[category as BlogCategoryId] ?? category;
}

/** 是否為 AI 撰寫的分類 */
export function isAiCategory(category: string): boolean {
  return category === 'ai-weekly';
}

/** AI 小編「小賽」的文字設定 */
export const AI_EDITOR = {
  name: '小賽',
  nameEn: 'Psi',
  role: 'AI 小編',
  badge: 'AI 撰寫・小賽',
  byline: '本文由 AI 小編小賽整理撰寫',
  intro:
    '嗨，我是小賽，奕宏的 AI 小編。每週我會整理國內外和心理諮商有關的新聞，挑出值得留意的消息寫成這份週報。我寫的文章不一定經過奕宏逐篇審閱，引用時請以原始新聞為準。',
  disclaimer:
    '本文由 AI 整理撰寫，內容可能有錯誤或遺漏，請以文中連結的原始新聞為準，也不構成任何專業建議。',
  helpline: '如果你正感到困擾，歡迎尋求專業協助：衛福部安心專線 1925（24 小時、免付費）。',
} as const;
