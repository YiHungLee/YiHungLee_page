import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.resolve(__dirname, '../../public/content/blog');
const PORTFOLIO_DIR = path.resolve(__dirname, '../../public/content/portfolio');

export interface BlogPostData {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  tags: string[];
  category: 'professional' | 'creative' | 'casual';
  featured?: boolean;
  readTime?: number;
}

export interface PortfolioItemData {
  id: string;
  category: 'academic' | 'coding' | 'music';
  type: string;
  title: string;
  year: string;
  description: string;
  content?: string;
  featured?: boolean;
  tags?: string[];
  techStack?: string[];
  award?: string;
}

export interface RouteInfo {
  path: string;
  type: 'static' | 'blog' | 'portfolio';
  data?: BlogPostData | PortfolioItemData;
}

// 靜態路由
const STATIC_ROUTES: RouteInfo[] = [
  { path: '/', type: 'static' },
  { path: '/about', type: 'static' },
  { path: '/contact', type: 'static' },
  { path: '/projects', type: 'static' },
  { path: '/projects/academic', type: 'static' },
  { path: '/projects/coding', type: 'static' },
  { path: '/projects/music', type: 'static' },
  { path: '/blog', type: 'static' },
  { path: '/bio', type: 'static' },
];

// 檢查文章是否已發布（使用台灣時區）
function isPostPublished(dateInput: string | Date): boolean {
  const taiwanOffsetMs = 8 * 60 * 60 * 1000;

  let postDateMs: number;
  if (dateInput instanceof Date) {
    postDateMs = dateInput.getTime();
  } else {
    postDateMs = new Date(dateInput + 'T00:00:00Z').getTime();
  }

  const now = new Date();
  const taiwanNowMs = now.getTime() + taiwanOffsetMs;
  const taiwanDate = new Date(taiwanNowMs);
  const todayTaiwanMidnightUTC = Date.UTC(
    taiwanDate.getUTCFullYear(),
    taiwanDate.getUTCMonth(),
    taiwanDate.getUTCDate()
  );

  return postDateMs <= todayTaiwanMidnightUTC;
}

// 正規化 ID（處理 gray-matter 將日期解析為 Date 物件的情況）
function normalizeId(id: unknown): string {
  if (id instanceof Date) {
    return id.toISOString().split('T')[0];
  }
  return String(id);
}

// 正規化日期
function normalizeDate(date: unknown): string {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return String(date);
}

// 載入部落格文章
export function loadBlogPosts(): BlogPostData[] {
  if (!fs.existsSync(BLOG_DIR)) {
    console.warn('Blog directory not found:', BLOG_DIR);
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'));

  return files.map(file => {
    const filePath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);

    return {
      id: normalizeId(data.id),
      title: data.title || '',
      date: normalizeDate(data.date),
      summary: data.summary || '',
      content,
      tags: data.tags || [],
      category: data.category || 'casual',
      featured: data.featured || false,
      readTime: data.readTime,
    };
  });
}

// 載入作品集項目
export function loadPortfolioItems(): PortfolioItemData[] {
  if (!fs.existsSync(PORTFOLIO_DIR)) {
    console.warn('Portfolio directory not found:', PORTFOLIO_DIR);
    return [];
  }

  const files = fs.readdirSync(PORTFOLIO_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'));

  return files.map(file => {
    const filePath = path.join(PORTFOLIO_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);

    return {
      id: normalizeId(data.id),
      category: data.category,
      type: data.type || '',
      title: data.title || '',
      year: String(data.year || ''),
      description: data.description || '',
      content,
      featured: data.featured || false,
      tags: data.tags || [],
      techStack: data.techStack || data.technologies || [],
      award: data.award,
    };
  });
}

// 收集所有路由
export function collectAllRoutes(): RouteInfo[] {
  const routes: RouteInfo[] = [...STATIC_ROUTES];

  // 添加部落格路由（只包含已發布的文章）
  const blogPosts = loadBlogPosts().filter(post => isPostPublished(post.date));
  for (const post of blogPosts) {
    routes.push({
      path: `/blog/${post.id}`,
      type: 'blog',
      data: post,
    });
  }

  // 添加作品集路由
  const portfolioItems = loadPortfolioItems();
  for (const item of portfolioItems) {
    routes.push({
      path: `/projects/${item.category}/${item.id}`,
      type: 'portfolio',
      data: item,
    });
  }

  return routes;
}

// 取得已發布的部落格文章
export function getPublishedBlogPosts(): BlogPostData[] {
  return loadBlogPosts().filter(post => isPostPublished(post.date));
}
