import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Feed } from 'feed';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://yi-hung-lee.work';
const BLOG_DIR = path.resolve(__dirname, '../public/content/blog');
const OUTPUT_PATH = path.resolve(__dirname, '../dist/feed.xml');

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

function isPostPublished(dateString: string): boolean {
  const postDate = new Date(dateString);
  const today = new Date();
  postDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return postDate.getTime() <= today.getTime();
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
      content: post.content,
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
