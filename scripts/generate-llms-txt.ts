import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getPublishedBlogPosts,
  loadPortfolioItems,
} from './utils/route-collector.js';
import { markdownToPlainText } from './utils/body-renderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const SITE_URL = 'https://yi-hung-lee.work';

// 產生 /llms.txt：網站索引給 LLM
// 規格參考：https://llmstxt.org/
function generateLlmsTxt(): string {
  const posts = getPublishedBlogPosts().sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );
  const portfolio = loadPortfolioItems();

  const sections: string[] = [];

  sections.push(`# 李奕宏 Yi-hung Lee

> 臺北市立大學心理與諮商研究所碩士班（諮商組），全職實習諮商心理師（世新大學諮商中心）。專注於心理諮商、心理學研究，同時探索科技與音樂創作。本站為個人作品集與部落格，內容以繁體中文撰寫。

## Site

- [首頁](${SITE_URL}/): 網站入口
- [關於我](${SITE_URL}/about): 學術背景、專業訓練、工作經歷
- [作品集](${SITE_URL}/projects): 學術研究、程式專案、音樂創作總覽
- [部落格](${SITE_URL}/blog): 心理諮商觀點、自我成長、生活隨筆
- [聯絡](${SITE_URL}/contact): 聯絡方式與表單
- [RSS Feed](${SITE_URL}/feed.xml): 文章 RSS 訂閱源
- [llms-full.txt](${SITE_URL}/llms-full.txt): 所有文章全文（LLM 友善純文字格式）`);

  // Blog
  if (posts.length) {
    sections.push(`## Blog posts

${posts
  .map(
    p =>
      `- [${p.title}](${SITE_URL}/blog/${p.id}): ${p.summary || ''}`,
  )
  .join('\n')}`);
  }

  // Portfolio 分類
  const byCategory: Record<string, typeof portfolio> = {
    academic: [],
    coding: [],
    music: [],
  };
  for (const item of portfolio) {
    byCategory[item.category]?.push(item);
  }

  const catLabels: Record<string, string> = {
    academic: 'Academic works',
    coding: 'Coding projects',
    music: 'Music compositions',
  };

  for (const cat of ['academic', 'coding', 'music'] as const) {
    const items = byCategory[cat];
    if (!items?.length) continue;
    sections.push(`## ${catLabels[cat]}

${items
  .map(
    i =>
      `- [${i.title}](${SITE_URL}/projects/${i.category}/${i.id}): ${i.description}`,
  )
  .join('\n')}`);
  }

  return sections.join('\n\n') + '\n';
}

// 產生 /llms-full.txt：所有文章全文（純文字）
function generateLlmsFullTxt(): string {
  const posts = getPublishedBlogPosts().sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );
  const portfolio = loadPortfolioItems();

  const sections: string[] = [];

  sections.push(`# 李奕宏 Yi-hung Lee — 全文索引

本檔提供網站內所有已發布文章與作品說明的純文字版本，方便 LLM 訓練與引用。
站點：${SITE_URL}
語言：繁體中文`);

  if (posts.length) {
    sections.push(`\n\n=====\n# Blog\n=====`);
    for (const p of posts) {
      const body = markdownToPlainText(p.content);
      sections.push(
        `\n## ${p.title}
URL: ${SITE_URL}/blog/${p.id}
Date: ${p.date}
Category: ${p.category}${p.tags?.length ? `\nTags: ${p.tags.join(', ')}` : ''}${p.summary ? `\nSummary: ${p.summary}` : ''}

${body}`,
      );
    }
  }

  if (portfolio.length) {
    sections.push(`\n\n=====\n# Portfolio\n=====`);
    for (const item of portfolio) {
      const body = item.content ? markdownToPlainText(item.content) : '';
      sections.push(
        `\n## ${item.title}
URL: ${SITE_URL}/projects/${item.category}/${item.id}
Category: ${item.category}
Type: ${item.type || ''}${item.year ? `\nYear: ${item.year}` : ''}${item.techStack?.length ? `\nTech: ${item.techStack.join(', ')}` : ''}${item.award ? `\nAward: ${item.award}` : ''}

${item.description}${body ? `\n\n${body}` : ''}`,
      );
    }
  }

  return sections.join('\n') + '\n';
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error(`dist/ not found at ${DIST_DIR}. Run 'vite build' first.`);
  }

  const llmsTxt = generateLlmsTxt();
  const llmsFullTxt = generateLlmsFullTxt();

  fs.writeFileSync(path.join(DIST_DIR, 'llms.txt'), llmsTxt, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'llms-full.txt'), llmsFullTxt, 'utf-8');

  console.log('🤖 Generated llms.txt and llms-full.txt');
  console.log(`   llms.txt: ${llmsTxt.length} chars`);
  console.log(`   llms-full.txt: ${llmsFullTxt.length} chars`);
}

main();
