import { Marked } from 'marked';
import type {
  BlogPostData,
  PortfolioItemData,
  RouteInfo,
} from './route-collector.js';
import {
  getPublishedBlogPosts,
  loadPortfolioItems,
} from './route-collector.js';

const SITE_URL = 'https://yi-hung-lee.work';

// ========== Helpers ==========

export function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeAssetPath(path: string): string {
  if (!path) return path;
  if (path.startsWith('assets/')) return '/' + path;
  return path;
}

function formatDate(iso: string): string {
  // 接受 YYYY-MM-DD，輸出 YYYY年M月D日
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  const [, y, m, d] = match;
  return `${y}年${Number(m)}月${Number(d)}日`;
}

function blogCategoryLabel(cat: string): string {
  return {
    professional: '專業分享',
    creative: '創意探索',
    casual: '心情隨筆',
  }[cat] ?? cat;
}

function portfolioCategoryLabel(cat: string): string {
  return {
    academic: '學術研究',
    coding: '程式專案',
    music: '音樂創作',
  }[cat] ?? cat;
}

// ========== Markdown rendering ==========

const markedInstance = new Marked({ breaks: true, gfm: true });
const renderer = { link: undefined as any, image: undefined as any };
renderer.link = ({ href, title, text }: { href: string; title: string | null; text: string }) => {
  let finalHref = href;
  if (/^content\/blog\/(.+)\.md$/.test(href)) {
    finalHref = '/blog/' + href.replace(/^content\/blog\//, '').replace(/\.md$/, '');
  } else if (/^content\/portfolio\/(.+)\.md$/.test(href)) {
    finalHref = '/projects/' + href.replace(/^content\/portfolio\//, '').replace(/\.md$/, '');
  }
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  return `<a href="${escapeHtml(finalHref)}"${titleAttr}>${text}</a>`;
};
renderer.image = ({ href, title, text }: { href: string; title: string | null; text: string }) => {
  const src = normalizeAssetPath(href);
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  let altAttr = '';
  let styleAttr = '';
  if (text) {
    const sizeMatch = /^(\d+)(x(\d+))?$/.exec(text);
    if (sizeMatch) {
      const width = sizeMatch[1];
      const height = sizeMatch[3];
      styleAttr = height
        ? ` style="width: ${width}px; height: ${height}px;"`
        : ` style="width: ${width}px;"`;
    } else {
      altAttr = escapeHtml(text);
    }
  }
  return `<img src="${escapeHtml(src)}" alt="${altAttr}"${titleAttr}${styleAttr} loading="lazy" />`;
};

markedInstance.use({ renderer });

function renderMarkdown(md: string): string {
  return markedInstance.parse(md, { async: false }) as string;
}

// Strip markdown + HTML 成為純文字（給 articleBody / llms.txt 用）
export function markdownToPlainText(md: string): string {
  const html = renderMarkdown(md);
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ========== Body renderers per route ==========

function renderBlogPost(post: BlogPostData): string {
  const articleHtml = renderMarkdown(post.content);
  const tagsHtml = post.tags?.length
    ? `<ul class="prerendered-tags">${post.tags
        .map(t => `<li>${escapeHtml(t)}</li>`)
        .join('')}</ul>`
    : '';
  const summaryHtml = post.summary
    ? `<p class="prerendered-summary">${escapeHtml(post.summary)}</p>`
    : '';
  const readTimeHtml = post.readTime
    ? `<span class="prerendered-readtime">${post.readTime} 分鐘閱讀</span>`
    : '';

  return `<main class="prerendered">
  <nav class="prerendered-breadcrumb" aria-label="Breadcrumb">
    <a href="/">首頁</a> › <a href="/blog">Blog</a> › <span>${escapeHtml(post.title)}</span>
  </nav>
  <article>
    <header>
      <p class="prerendered-category">${escapeHtml(blogCategoryLabel(post.category))}</p>
      <h1>${escapeHtml(post.title)}</h1>
      <p class="prerendered-meta">
        <time datetime="${escapeHtml(post.date)}">${formatDate(post.date)}</time>
        ${readTimeHtml}
      </p>
      ${summaryHtml}
      ${tagsHtml}
    </header>
    <div class="prerendered-content">
${articleHtml}
    </div>
  </article>
</main>`;
}

function renderPortfolioItem(item: PortfolioItemData): string {
  const contentHtml = item.content ? renderMarkdown(item.content) : '';
  const tagsHtml = item.tags?.length
    ? `<ul class="prerendered-tags">${item.tags
        .map(t => `<li>${escapeHtml(t)}</li>`)
        .join('')}</ul>`
    : '';
  const techHtml = item.techStack?.length
    ? `<p class="prerendered-tech"><strong>技術：</strong>${item.techStack
        .map(t => escapeHtml(t))
        .join('、')}</p>`
    : '';
  const awardHtml = item.award
    ? `<p class="prerendered-award"><strong>獎項：</strong>${escapeHtml(item.award)}</p>`
    : '';

  return `<main class="prerendered">
  <nav class="prerendered-breadcrumb" aria-label="Breadcrumb">
    <a href="/">首頁</a> › <a href="/projects">作品</a> › <a href="/projects/${escapeHtml(item.category)}">${escapeHtml(portfolioCategoryLabel(item.category))}</a> › <span>${escapeHtml(item.title)}</span>
  </nav>
  <article>
    <header>
      <p class="prerendered-category">${escapeHtml(portfolioCategoryLabel(item.category))}</p>
      <h1>${escapeHtml(item.title)}</h1>
      <p class="prerendered-meta">
        ${item.year ? `<time datetime="${escapeHtml(item.year)}">${escapeHtml(item.year)}</time>` : ''}
        ${item.type ? `<span class="prerendered-type">${escapeHtml(item.type)}</span>` : ''}
      </p>
      <p class="prerendered-summary">${escapeHtml(item.description)}</p>
      ${awardHtml}
      ${techHtml}
      ${tagsHtml}
    </header>
    ${contentHtml ? `<div class="prerendered-content">${contentHtml}</div>` : ''}
  </article>
</main>`;
}

function renderBlogList(): string {
  const posts = getPublishedBlogPosts().sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );
  const items = posts
    .map(
      post => `
    <li>
      <article>
        <p class="prerendered-category">${escapeHtml(blogCategoryLabel(post.category))}</p>
        <h2><a href="/blog/${escapeHtml(post.id)}">${escapeHtml(post.title)}</a></h2>
        <p class="prerendered-meta">
          <time datetime="${escapeHtml(post.date)}">${formatDate(post.date)}</time>
          ${post.readTime ? `<span>${post.readTime} 分鐘閱讀</span>` : ''}
        </p>
        ${post.summary ? `<p class="prerendered-summary">${escapeHtml(post.summary)}</p>` : ''}
      </article>
    </li>`,
    )
    .join('');

  return `<main class="prerendered">
  <header>
    <h1>部落格</h1>
    <p class="prerendered-summary">分享心理諮商觀點、自我成長心得與生活隨筆。</p>
  </header>
  <ol class="prerendered-list">${items}
  </ol>
</main>`;
}

function renderPortfolioList(category?: 'academic' | 'coding' | 'music'): string {
  const all = loadPortfolioItems();
  const items = category ? all.filter(i => i.category === category) : all;
  const title = category
    ? `${portfolioCategoryLabel(category)} - 作品集`
    : '作品集';
  const intro = category
    ? `李奕宏的${portfolioCategoryLabel(category)}作品。`
    : '李奕宏的作品集，包含學術研究、程式專案與音樂創作。';

  const listHtml = items
    .map(
      item => `
    <li>
      <article>
        <p class="prerendered-category">${escapeHtml(portfolioCategoryLabel(item.category))}</p>
        <h2><a href="/projects/${escapeHtml(item.category)}/${escapeHtml(item.id)}">${escapeHtml(item.title)}</a></h2>
        <p class="prerendered-meta">
          ${item.year ? `<time datetime="${escapeHtml(item.year)}">${escapeHtml(item.year)}</time>` : ''}
          ${item.type ? `<span>${escapeHtml(item.type)}</span>` : ''}
        </p>
        <p class="prerendered-summary">${escapeHtml(item.description)}</p>
      </article>
    </li>`,
    )
    .join('');

  const categoryNavHtml = !category
    ? `<nav class="prerendered-subnav" aria-label="作品分類">
    <a href="/projects/academic">學術研究</a>
    <a href="/projects/coding">程式專案</a>
    <a href="/projects/music">音樂創作</a>
  </nav>`
    : '';

  return `<main class="prerendered">
  <header>
    <h1>${escapeHtml(title)}</h1>
    <p class="prerendered-summary">${escapeHtml(intro)}</p>
    ${categoryNavHtml}
  </header>
  <ol class="prerendered-list">${listHtml}
  </ol>
</main>`;
}

function renderHome(): string {
  const recentPosts = getPublishedBlogPosts()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);
  const featured = loadPortfolioItems().filter(i => i.featured).slice(0, 4);

  const recentHtml = recentPosts
    .map(
      p => `
    <li>
      <article>
        <h3><a href="/blog/${escapeHtml(p.id)}">${escapeHtml(p.title)}</a></h3>
        <p class="prerendered-meta"><time datetime="${escapeHtml(p.date)}">${formatDate(p.date)}</time></p>
        ${p.summary ? `<p>${escapeHtml(p.summary)}</p>` : ''}
      </article>
    </li>`,
    )
    .join('');

  const featuredHtml = featured
    .map(
      item => `
    <li>
      <article>
        <h3><a href="/projects/${escapeHtml(item.category)}/${escapeHtml(item.id)}">${escapeHtml(item.title)}</a></h3>
        <p class="prerendered-meta"><span>${escapeHtml(portfolioCategoryLabel(item.category))}</span>${item.year ? ` · <time datetime="${escapeHtml(item.year)}">${escapeHtml(item.year)}</time>` : ''}</p>
        <p>${escapeHtml(item.description)}</p>
      </article>
    </li>`,
    )
    .join('');

  return `<main class="prerendered">
  <section>
    <h1>李奕宏 Yi-hung Lee</h1>
    <p class="prerendered-tagline">實習諮商心理師</p>
    <p class="prerendered-summary">我是奕宏，喜歡探索科技、創作音樂。在學術與助人工作中發展。臺北市立大學心理與諮商研究所，目前於世新大學諮商中心全職實習。</p>
    <nav class="prerendered-subnav" aria-label="主要導覽">
      <a href="/about">關於</a>
      <a href="/projects">作品</a>
      <a href="/blog">Blog</a>
      <a href="/contact">聯絡</a>
    </nav>
  </section>
  <section>
    <h2>最新文章</h2>
    <ol class="prerendered-list">${recentHtml}
    </ol>
    <p><a href="/blog">查看所有文章 →</a></p>
  </section>
  ${featured.length ? `<section>
    <h2>精選作品</h2>
    <ol class="prerendered-list">${featuredHtml}
    </ol>
    <p><a href="/projects">查看全部作品 →</a></p>
  </section>` : ''}
</main>`;
}

function renderAbout(): string {
  // 直接從 constants.ts 的資料結構複製基本資訊（避免 import .ts 檔的 ESM 問題）
  return `<main class="prerendered">
  <header>
    <h1>關於李奕宏</h1>
    <p class="prerendered-tagline">全職實習諮商心理師</p>
    <p class="prerendered-summary">臺北市立大學心理與諮商研究所碩士班（諮商組），目前於世新大學諮商中心全職實習。專注於心理諮商、心理學領域研究，同時探索科技與音樂創作。</p>
  </header>

  <section>
    <h2>學歷</h2>
    <ul>
      <li>臺北市立大學 心理與諮商學系碩士班（諮商組）· 就讀中</li>
      <li>臺北市立大學 心理與諮商學系 · 2023 畢業</li>
    </ul>
  </section>

  <section>
    <h2>專業經歷</h2>
    <ul>
      <li>2025 ~ ｜ 國立臺北教育大學劉彥君教授 研究助理</li>
      <li>2025 ~ 2026 ｜ 世新大學諮商中心 實習諮商心理師</li>
      <li>2024 ~ 2025 ｜ 好窩心理諮商所 實習諮商心理師</li>
      <li>2023 ~ 2025 ｜ 臺北市立大學劉彥君教授 研究助理</li>
      <li>2022 ｜ 臺北市中正區河堤國小 特教課輔班教師</li>
      <li>2021 ｜ 臺北市信義區興雅國小 實習輔導教師</li>
      <li>2020 ｜ 臺北市立大學游錦雲教授 研究助理</li>
    </ul>
  </section>

  <section>
    <h2>獎項</h2>
    <ul>
      <li>2023 ｜ 臺北市立大學教育學院 院長獎</li>
      <li>2022 ｜ 臺北市立大學心理與諮商學系 壁報論文發表會 首獎（大學生復原力量表之編製與驗證）</li>
    </ul>
  </section>

  <section>
    <h2>專業訓練</h2>
    <ul>
      <li>碩士層級心理諮商專業訓練</li>
      <li>心理劇導演訓練團體（累計 48 小時以上）</li>
      <li>臺北市立大學心理與諮商學系 研究生心理劇訓練團體（第 3 年）</li>
      <li>結構家族治療理論與個案研討會（6 小時）</li>
      <li>完形治療個案研討會（2.5 小時）</li>
      <li>黃盛璘老師園藝治療工作坊（3 小時）</li>
    </ul>
  </section>

  <section>
    <h2>其他專長</h2>
    <ul>
      <li>多媒體製作：影片剪輯（Sony Vegas）、網站設計（HTML / CSS / JS）、混音錄音（Reason, Cubase）</li>
      <li>AI 應用：AI 輔助程式設計、Google Certified AI Educator、RAG 建置、模型微調、本機模型搭建</li>
    </ul>
  </section>
</main>`;
}

function renderContact(): string {
  return `<main class="prerendered">
  <header>
    <h1>聯絡我</h1>
    <p class="prerendered-summary">與李奕宏聯繫，討論心理諮商、學術合作或其他事宜。</p>
  </header>
  <section>
    <h2>聯絡資訊</h2>
    <ul>
      <li>Email：<a href="mailto:lee2952000@gmail.com">lee2952000@gmail.com</a></li>
    </ul>
  </section>
</main>`;
}

function renderBio(): string {
  return `<main class="prerendered">
  <header>
    <h1>李奕宏 Yi-hung Lee</h1>
    <p class="prerendered-summary">實習諮商心理師 · 臺北市立大學心理與諮商研究所</p>
  </header>
  <section>
    <h2>連結</h2>
    <ul>
      <li><a href="/">首頁</a></li>
      <li><a href="/about">關於我</a></li>
      <li><a href="/projects">作品集</a></li>
      <li><a href="/blog">部落格</a></li>
      <li><a href="/contact">聯絡</a></li>
      <li><a href="${SITE_URL}/feed.xml">RSS Feed</a></li>
    </ul>
  </section>
</main>`;
}

// ========== Entry point ==========

export function renderBodyForRoute(route: RouteInfo): string {
  if (route.type === 'blog') {
    return renderBlogPost(route.data as BlogPostData);
  }
  if (route.type === 'portfolio') {
    return renderPortfolioItem(route.data as PortfolioItemData);
  }
  // static routes
  switch (route.path) {
    case '/':
      return renderHome();
    case '/about':
      return renderAbout();
    case '/contact':
      return renderContact();
    case '/projects':
      return renderPortfolioList();
    case '/projects/academic':
      return renderPortfolioList('academic');
    case '/projects/coding':
      return renderPortfolioList('coding');
    case '/projects/music':
      return renderPortfolioList('music');
    case '/blog':
      return renderBlogList();
    case '/bio':
      return renderBio();
    default:
      return '';
  }
}
