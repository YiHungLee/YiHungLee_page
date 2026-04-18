import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { collectAllRoutes, type RouteInfo } from './utils/route-collector.js';
import { getMetaConfig, generateMetaTags } from './utils/meta-generator.js';
import { generateJsonLdSchemas, generateJsonLdScriptTags } from './utils/jsonld-generator.js';
import { renderBodyForRoute } from './utils/body-renderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

// 輕量內聯樣式：給預渲染內容一個可讀的初始外觀，降低 FOUC
// React 掛載後會整個替換 #root 內容，所以這份樣式只影響首屏繪製到 JS 執行之間的那幾毫秒
const PRERENDER_STYLE = `<style id="prerender-style">
  .prerendered {
    max-width: 48rem;
    margin: 0 auto;
    padding: 8rem 1.5rem 4rem;
    font-family: 'Manrope', 'Noto Sans TC', sans-serif;
    color: #1a1a1a;
    line-height: 1.7;
  }
  .prerendered h1 {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 2.5rem;
    line-height: 1.2;
    margin: 0.5rem 0 1rem;
  }
  .prerendered h2 {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 1.75rem;
    margin: 2.5rem 0 1rem;
  }
  .prerendered h3 { font-size: 1.25rem; margin: 1.5rem 0 0.5rem; }
  .prerendered p { margin: 0 0 1rem; }
  .prerendered a { color: #a06847; text-decoration: none; }
  .prerendered a:hover { text-decoration: underline; }
  .prerendered .prerendered-category,
  .prerendered .prerendered-meta {
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #4a4a4a;
    margin: 0.25rem 0;
  }
  .prerendered .prerendered-meta > * + *::before { content: " · "; color: #999; }
  .prerendered .prerendered-summary {
    font-size: 1.125rem;
    color: #3a3a3a;
    border-left: 1px solid #c4885f;
    padding: 0.25rem 0 0.25rem 1rem;
    margin: 1rem 0;
  }
  .prerendered .prerendered-tagline {
    font-size: 1rem;
    color: #4a4a4a;
    margin: 0 0 1rem;
  }
  .prerendered .prerendered-tags {
    list-style: none; padding: 0; margin: 1rem 0;
    display: flex; flex-wrap: wrap; gap: 0.5rem;
  }
  .prerendered .prerendered-tags li {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    border: 1px solid #d0ccc5;
    color: #4a4a4a;
  }
  .prerendered .prerendered-breadcrumb {
    font-size: 0.8rem; color: #4a4a4a; margin-bottom: 2rem;
  }
  .prerendered .prerendered-subnav {
    display: flex; flex-wrap: wrap; gap: 1rem; margin: 1rem 0 2rem;
  }
  .prerendered .prerendered-list {
    list-style: none; padding: 0; margin: 0;
  }
  .prerendered .prerendered-list > li {
    padding: 1.5rem 0;
    border-bottom: 1px solid #e8e5e0;
  }
  .prerendered .prerendered-content img { max-width: 100%; height: auto; }
  .prerendered section { margin: 2rem 0; }
  .prerendered ul { padding-left: 1.25rem; }
  @media (prefers-color-scheme: dark) {
    .prerendered { color: #e8e3db; }
    .prerendered a { color: #c7a378; }
    .prerendered .prerendered-category,
    .prerendered .prerendered-meta { color: #b8b0a6; }
    .prerendered .prerendered-summary { color: #b8b0a6; border-left-color: #c7a378; }
    .prerendered .prerendered-tags li { color: #b8b0a6; border-color: #44413d; }
    .prerendered .prerendered-list > li { border-bottom-color: #44413d; }
  }
</style>`;

// 讀取模板
function readTemplate(): string {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Template not found: ${TEMPLATE_PATH}. Run 'vite build' first.`);
  }
  return fs.readFileSync(TEMPLATE_PATH, 'utf-8');
}

// 替換 SEO meta tags
function replaceSeoMeta(html: string, route: RouteInfo): string {
  const metaConfig = getMetaConfig(route);
  const newMetaTags = generateMetaTags(metaConfig);

  const seoMetaRegex = /<!-- SEO_META_START -->[\s\S]*?<!-- SEO_META_END -->/;

  if (seoMetaRegex.test(html)) {
    return html.replace(seoMetaRegex, `<!-- SEO_META_START -->${newMetaTags}
    <!-- SEO_META_END -->`);
  }

  console.warn(`Warning: SEO_META markers not found for ${route.path}`);
  return html;
}

// 替換 JSON-LD
function replaceJsonLd(html: string, route: RouteInfo): string {
  const schemas = generateJsonLdSchemas(route);
  const jsonLdTags = generateJsonLdScriptTags(schemas);

  const jsonLdRegex = /<!-- JSON_LD_PLACEHOLDER -->/;

  if (jsonLdRegex.test(html)) {
    return html.replace(jsonLdRegex, jsonLdTags);
  }

  return html.replace('</head>', `    ${jsonLdTags}\n  </head>`);
}

// 替換頁面標題
function replaceTitle(html: string, route: RouteInfo): string {
  const metaConfig = getMetaConfig(route);
  const titleRegex = /<title>[^<]*<\/title>/;

  return html.replace(titleRegex, `<title>${metaConfig.title}</title>`);
}

// 注入預渲染的 body 內容到 <div id="root">
function injectBodyContent(html: string, route: RouteInfo): string {
  const bodyHtml = renderBodyForRoute(route);
  if (!bodyHtml) return html;

  // 在 </head> 之前插入內聯樣式（只插入一次）
  let out = html;
  if (!out.includes('id="prerender-style"')) {
    out = out.replace('</head>', `  ${PRERENDER_STYLE}\n  </head>`);
  }

  // 用預渲染 HTML 取代空的 #root
  out = out.replace(
    /<div id="root"><\/div>/,
    `<div id="root">\n${bodyHtml}\n</div>`,
  );
  return out;
}

// 為單一路由生成預渲染 HTML
function prerenderRoute(template: string, route: RouteInfo): string {
  let html = template;
  html = replaceTitle(html, route);
  html = replaceSeoMeta(html, route);
  html = replaceJsonLd(html, route);
  html = injectBodyContent(html, route);
  return html;
}

// 取得路由的輸出路徑
function getOutputPath(routePath: string): string {
  if (routePath === '/') {
    return path.join(DIST_DIR, 'index.html');
  }

  const normalizedPath = routePath.startsWith('/') ? routePath.slice(1) : routePath;
  return path.join(DIST_DIR, normalizedPath, 'index.html');
}

// 主函數
async function prerender(): Promise<void> {
  console.log('🚀 Starting prerender...\n');

  const template = readTemplate();

  const routes = collectAllRoutes();
  console.log(`📍 Found ${routes.length} routes to prerender\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const route of routes) {
    try {
      const html = prerenderRoute(template, route);

      const outputPath = getOutputPath(route.path);

      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(outputPath, html);
      successCount++;

      const routeType = route.type === 'blog' ? '📝' : route.type === 'portfolio' ? '💼' : '📄';
      console.log(`  ${routeType} ${route.path}`);
    } catch (error) {
      errorCount++;
      console.error(`  ❌ Error prerendering ${route.path}:`, error);
    }
  }

  console.log('\n✅ Prerender completed!');
  console.log(`   Success: ${successCount}`);
  if (errorCount > 0) {
    console.log(`   Errors: ${errorCount}`);
  }

  const staticRoutes = routes.filter(r => r.type === 'static').length;
  const blogRoutes = routes.filter(r => r.type === 'blog').length;
  const portfolioRoutes = routes.filter(r => r.type === 'portfolio').length;

  console.log(`\n   Breakdown:`);
  console.log(`     📄 Static pages: ${staticRoutes}`);
  console.log(`     📝 Blog posts: ${blogRoutes}`);
  console.log(`     💼 Portfolio items: ${portfolioRoutes}`);
}

prerender().catch(error => {
  console.error('Prerender failed:', error);
  process.exit(1);
});
