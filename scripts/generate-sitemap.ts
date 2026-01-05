import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { collectAllRoutes, getPublishedBlogPosts, loadPortfolioItems } from './utils/route-collector.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://yi-hung-lee.work';
const OUTPUT_PATH = path.resolve(__dirname, '../dist/sitemap.xml');

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function generateSitemap(): void {
  const today = getTodayDate();
  const entries: SitemapEntry[] = [];

  // 靜態頁面
  const staticPages: SitemapEntry[] = [
    { loc: `${SITE_URL}/`, lastmod: today, changefreq: 'weekly', priority: 1.0 },
    { loc: `${SITE_URL}/about`, lastmod: today, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/contact`, lastmod: today, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/projects`, lastmod: today, changefreq: 'weekly', priority: 0.9 },
    { loc: `${SITE_URL}/projects/academic`, lastmod: today, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/projects/coding`, lastmod: today, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/projects/music`, lastmod: today, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/blog`, lastmod: today, changefreq: 'weekly', priority: 0.9 },
    { loc: `${SITE_URL}/bio`, lastmod: today, changefreq: 'monthly', priority: 0.5 },
  ];
  entries.push(...staticPages);

  // 部落格文章
  const blogPosts = getPublishedBlogPosts();
  const oneYear = 365 * 24 * 60 * 60 * 1000;

  for (const post of blogPosts) {
    const postAge = Date.now() - new Date(post.date).getTime();
    entries.push({
      loc: `${SITE_URL}/blog/${encodeURIComponent(post.id)}`,
      lastmod: post.date,
      changefreq: postAge > oneYear ? 'yearly' : 'monthly',
      priority: post.featured ? 0.7 : 0.6,
    });
  }

  // 作品集項目
  const portfolioItems = loadPortfolioItems();
  for (const item of portfolioItems) {
    const lastmod = item.year ? `${item.year}-01-01` : today;
    entries.push({
      loc: `${SITE_URL}/projects/${item.category}/${encodeURIComponent(item.id)}`,
      lastmod,
      changefreq: 'yearly',
      priority: item.featured ? 0.7 : 0.6,
    });
  }

  // 生成 XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // 確保 dist 目錄存在
  const distDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, xml);
  console.log(`✅ Sitemap generated: ${OUTPUT_PATH}`);
  console.log(`   Static pages: ${staticPages.length}`);
  console.log(`   Blog posts: ${blogPosts.length}`);
  console.log(`   Portfolio items: ${portfolioItems.length}`);
  console.log(`   Total URLs: ${entries.length}`);
}

generateSitemap();
