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
  title: '小賽．AI小編',
  badge: 'AI 撰寫・小賽',
  bylineLead: '本文是我寫的！',
  intro:
    '「心聞週報」由小賽整理資料後撰寫而成。每週小賽會整理國內外與心理健康有關的新聞並發布週報，但小賽可能有誤，引用時請以原始新聞資料為準！',
  disclaimer:
    '本文由 AI 整理撰寫，內容可能有錯誤或遺漏，請以文中連結的原始新聞為準，也不構成任何專業建議。',
  helpline: '如果你正感到困擾，歡迎尋求專業協助：衛福部安心專線 1925（24 小時、免付費）。',
} as const;

/** 文章頂部署名：「本文是我寫的！」＋每週由 AI 生成的心情（frontmatter 的 aiNote） */
export function getAiByline(aiNote?: string): string {
  const note = aiNote?.trim();
  return note ? `${AI_EDITOR.bylineLead}${note}` : AI_EDITOR.bylineLead;
}
