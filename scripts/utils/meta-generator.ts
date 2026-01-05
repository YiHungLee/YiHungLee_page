import type { BlogPostData, PortfolioItemData, RouteInfo } from './route-collector.js';

const SITE_URL = 'https://yi-hung-lee.work';
const DEFAULT_IMAGE = `${SITE_URL}/assets/yihung_transparent.webp`;
const AUTHOR = '李奕宏';

interface MetaConfig {
  title: string;
  description: string;
  url: string;
  image: string;
  type: 'website' | 'article';
  publishedTime?: string;
  tags?: string[];
}

// 轉義 HTML 特殊字元
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 截斷描述文字
function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// 取得分類的中文名稱
function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    'academic': '學術研究',
    'coding': '程式專案',
    'music': '音樂創作',
    'professional': '專業分享',
    'creative': '創意探索',
    'casual': '心情隨筆',
  };
  return categoryMap[category] || category;
}

// 生成靜態頁面的 Meta 配置
function getStaticPageMeta(path: string): MetaConfig {
  const staticMeta: Record<string, MetaConfig> = {
    '/': {
      title: '李奕宏 Yi-hung Lee | 實習諮商心理師',
      description: '李奕宏，臺北市立大學心理與諮商研究所。專注於心理諮商、心理學領域研究，同時探索科技與音樂創作。',
      url: SITE_URL,
      image: DEFAULT_IMAGE,
      type: 'website',
    },
    '/about': {
      title: '關於我 - 李奕宏 | 諮商心理師',
      description: '了解李奕宏的學術背景、專業訓練與心理諮商理念。臺北市立大學心理與諮商研究所碩士班。',
      url: `${SITE_URL}/about`,
      image: DEFAULT_IMAGE,
      type: 'website',
    },
    '/contact': {
      title: '聯絡我 - 李奕宏',
      description: '與李奕宏聯繫，討論心理諮商、學術合作或其他事宜。',
      url: `${SITE_URL}/contact`,
      image: DEFAULT_IMAGE,
      type: 'website',
    },
    '/projects': {
      title: '作品集 - 李奕宏',
      description: '李奕宏的作品集，包含學術研究、程式專案與音樂創作。',
      url: `${SITE_URL}/projects`,
      image: DEFAULT_IMAGE,
      type: 'website',
    },
    '/projects/academic': {
      title: '學術研究 - 李奕宏作品集',
      description: '李奕宏的學術研究成果，包含心理學研究、學術論文與研討會發表。',
      url: `${SITE_URL}/projects/academic`,
      image: DEFAULT_IMAGE,
      type: 'website',
    },
    '/projects/coding': {
      title: '程式專案 - 李奕宏作品集',
      description: '李奕宏的程式開發作品，結合心理學專業與軟體技術的創新應用。',
      url: `${SITE_URL}/projects/coding`,
      image: DEFAULT_IMAGE,
      type: 'website',
    },
    '/projects/music': {
      title: '音樂創作 - 李奕宏作品集',
      description: '李奕宏的原創音樂作品，探索電子音樂與創意聲音設計。',
      url: `${SITE_URL}/projects/music`,
      image: DEFAULT_IMAGE,
      type: 'website',
    },
    '/blog': {
      title: '部落格 - 李奕宏',
      description: '李奕宏的部落格，分享心理諮商觀點、自我成長心得與生活隨筆。',
      url: `${SITE_URL}/blog`,
      image: DEFAULT_IMAGE,
      type: 'website',
    },
    '/bio': {
      title: '關於 - 李奕宏',
      description: '李奕宏的社群連結與聯絡資訊。',
      url: `${SITE_URL}/bio`,
      image: DEFAULT_IMAGE,
      type: 'website',
    },
  };

  return staticMeta[path] || staticMeta['/'];
}

// 生成部落格文章的 Meta 配置
function getBlogPostMeta(post: BlogPostData): MetaConfig {
  return {
    title: `${post.title} - 李奕宏部落格`,
    description: truncateDescription(post.summary),
    url: `${SITE_URL}/blog/${post.id}`,
    image: DEFAULT_IMAGE,
    type: 'article',
    publishedTime: post.date,
    tags: post.tags,
  };
}

// 生成作品集項目的 Meta 配置
function getPortfolioMeta(item: PortfolioItemData): MetaConfig {
  return {
    title: `${item.title} - 李奕宏作品集`,
    description: truncateDescription(item.description),
    url: `${SITE_URL}/projects/${item.category}/${item.id}`,
    image: DEFAULT_IMAGE,
    type: 'article',
    publishedTime: item.year ? `${item.year}-01-01` : undefined,
    tags: item.tags,
  };
}

// 根據路由資訊取得 Meta 配置
export function getMetaConfig(route: RouteInfo): MetaConfig {
  switch (route.type) {
    case 'blog':
      return getBlogPostMeta(route.data as BlogPostData);
    case 'portfolio':
      return getPortfolioMeta(route.data as PortfolioItemData);
    case 'static':
    default:
      return getStaticPageMeta(route.path);
  }
}

// 生成 Meta Tags HTML
export function generateMetaTags(config: MetaConfig): string {
  const { title, description, url, image, type, publishedTime, tags } = config;

  const escapedTitle = escapeHtml(title);
  const escapedDescription = escapeHtml(description);

  let html = `
    <title>${escapedTitle}</title>
    <meta name="description" content="${escapedDescription}">
    <meta name="author" content="${AUTHOR}">
    <link rel="canonical" href="${url}">

    <!-- Open Graph -->
    <meta property="og:type" content="${type}">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${escapedTitle}">
    <meta property="og:description" content="${escapedDescription}">
    <meta property="og:image" content="${image}">
    <meta property="og:locale" content="zh_TW">
    <meta property="og:site_name" content="李奕宏 Yi-hung Lee">`;

  if (type === 'article') {
    if (publishedTime) {
      html += `
    <meta property="article:published_time" content="${publishedTime}">`;
    }
    html += `
    <meta property="article:author" content="${AUTHOR}">`;

    if (tags && tags.length > 0) {
      html += tags.map(tag => `
    <meta property="article:tag" content="${escapeHtml(tag)}">`).join('');
    }
  }

  html += `

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${url}">
    <meta name="twitter:title" content="${escapedTitle}">
    <meta name="twitter:description" content="${escapedDescription}">
    <meta name="twitter:image" content="${image}">`;

  return html;
}
