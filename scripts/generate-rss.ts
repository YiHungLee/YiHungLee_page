import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Feed } from 'feed';
import { fileURLToPath } from 'url';
import { marked, Renderer } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://yi-hung-lee.work';
const BLOG_DIR = path.resolve(__dirname, '../public/content/blog');
const OUTPUT_PATH = path.resolve(__dirname, '../dist/feed.xml');

// 設定 marked 渲染器，處理圖片和連結路徑
const renderer = new Renderer();

// 正規化 assets 路徑為完整 URL
const normalizeAssetPath = (href: string): string => {
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return href;
  }
  if (href.startsWith('assets/')) {
    return `${SITE_URL}/${href}`;
  }
  if (href.startsWith('/assets/')) {
    return `${SITE_URL}${href}`;
  }
  if (href.startsWith('/')) {
    return `${SITE_URL}${href}`;
  }
  return href;
};

// 自訂圖片渲染器
renderer.image = ({ href, title, text }) => {
  const normalizedHref = normalizeAssetPath(href);
  const titleAttr = title ? ` title="${title}"` : '';
  const altAttr = text || '';
  return `<img src="${normalizedHref}" alt="${altAttr}"${titleAttr} />`;
};

// 自訂連結渲染器
renderer.link = ({ href, title, text }) => {
  let finalHref = href;

  // 轉換 Obsidian 格式的 blog 連結
  if (href.match(/^content\/blog\/(.+)\.md$/)) {
    const postId = href.replace(/^content\/blog\//, '').replace(/\.md$/, '');
    finalHref = `${SITE_URL}/blog/${postId}`;
  }
  // 轉換 Obsidian 格式的 portfolio 連結
  else if (href.match(/^content\/portfolio\/(.+)\.md$/)) {
    const projectId = href.replace(/^content\/portfolio\//, '').replace(/\.md$/, '');
    finalHref = `${SITE_URL}/projects/${projectId}`;
  }
  // 處理相對路徑連結
  else if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:')) {
    finalHref = normalizeAssetPath(href);
  }

  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${finalHref}"${titleAttr}>${text}</a>`;
};

// 配置 marked 選項
marked.setOptions({
  breaks: true,
  gfm: true,
});
marked.use({ renderer });

// 將 Markdown 轉換為 HTML
function markdownToHtml(content: string): string {
  return marked(content) as string;
}

interface BlogPostData {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  tags: string[];
  category: string;
  featured?: boolean;
  readTime?: number;
}

function isPostPublished(dateInput: string | Date): boolean {
  // 使用台灣時區 (UTC+8) 進行日期比較
  const taiwanOffsetMs = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

  // 處理 gray-matter 可能回傳 Date 物件的情況
  let postDateMs: number;
  if (dateInput instanceof Date) {
    // gray-matter 將 YAML 日期解析為 UTC 午夜的 Date 物件
    postDateMs = dateInput.getTime();
  } else {
    // 字串格式 "YYYY-MM-DD"，解析為 UTC 午夜
    postDateMs = new Date(dateInput + 'T00:00:00Z').getTime();
  }

  // 取得台灣時區的今天午夜 (UTC 時間)
  const now = new Date();
  const taiwanNowMs = now.getTime() + taiwanOffsetMs;
  const taiwanDate = new Date(taiwanNowMs);
  const todayTaiwanMidnightUTC = Date.UTC(
    taiwanDate.getUTCFullYear(),
    taiwanDate.getUTCMonth(),
    taiwanDate.getUTCDate()
  );

  // 比較：文章日期 <= 台灣今天午夜
  return postDateMs <= todayTaiwanMidnightUTC;
}

function loadBlogPosts(): BlogPostData[] {
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

    // Normalize id
    let id = data.id;
    if (id instanceof Date) {
      id = id.toISOString().split('T')[0];
    } else if (typeof id !== 'string') {
      id = String(id);
    }

    return { ...data, id, content } as BlogPostData;
  });
}

function generateRSS(): void {
  const posts = loadBlogPosts()
    .filter(post => isPostPublished(post.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const feed = new Feed({
    title: '李奕宏的部落格',
    description: '心理諮商、科技探索、音樂創作的交匯點',
    id: SITE_URL,
    link: SITE_URL,
    language: 'zh-TW',
    image: `${SITE_URL}/assets/yihung_transparent.webp`,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, 李奕宏`,
    feedLinks: {
      rss2: `${SITE_URL}/feed.xml`,
    },
    author: {
      name: '李奕宏',
      link: SITE_URL,
    },
  });

  posts.forEach(post => {
    const postUrl = `${SITE_URL}/blog/${post.id}`;

    feed.addItem({
      title: post.title,
      id: postUrl,
      link: postUrl,
      description: post.summary,
      content: markdownToHtml(post.content),
      author: [{
        name: '李奕宏',
        link: SITE_URL,
      }],
      date: new Date(post.date),
      category: post.tags?.map(tag => ({ name: tag })) || [],
    });
  });

  // Ensure dist directory exists
  const distDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Write RSS feed
  fs.writeFileSync(OUTPUT_PATH, feed.rss2());
  console.log(`✅ RSS feed generated: ${OUTPUT_PATH}`);
  console.log(`   ${posts.length} posts included`);
}

generateRSS();
