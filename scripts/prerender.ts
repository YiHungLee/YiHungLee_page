import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { collectAllRoutes, type RouteInfo } from './utils/route-collector.js';
import { getMetaConfig, generateMetaTags } from './utils/meta-generator.js';
import { generateJsonLdSchemas, generateJsonLdScriptTags } from './utils/jsonld-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

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

  // 使用正則表達式匹配 SEO_META_START 和 SEO_META_END 之間的內容
  const seoMetaRegex = /<!-- SEO_META_START -->[\s\S]*?<!-- SEO_META_END -->/;

  if (seoMetaRegex.test(html)) {
    return html.replace(seoMetaRegex, `<!-- SEO_META_START -->${newMetaTags}
    <!-- SEO_META_END -->`);
  }

  // 如果找不到標記，嘗試替換 title 標籤
  console.warn(`Warning: SEO_META markers not found for ${route.path}`);
  return html;
}

// 替換 JSON-LD
function replaceJsonLd(html: string, route: RouteInfo): string {
  const schemas = generateJsonLdSchemas(route);
  const jsonLdTags = generateJsonLdScriptTags(schemas);

  // 替換 JSON_LD_PLACEHOLDER
  const jsonLdRegex = /<!-- JSON_LD_PLACEHOLDER -->/;

  if (jsonLdRegex.test(html)) {
    return html.replace(jsonLdRegex, jsonLdTags);
  }

  // 如果找不到佔位符，在 </head> 前插入
  return html.replace('</head>', `    ${jsonLdTags}\n  </head>`);
}

// 替換頁面標題
function replaceTitle(html: string, route: RouteInfo): string {
  const metaConfig = getMetaConfig(route);
  const titleRegex = /<title>[^<]*<\/title>/;

  return html.replace(titleRegex, `<title>${metaConfig.title}</title>`);
}

// 為單一路由生成預渲染 HTML
function prerenderRoute(template: string, route: RouteInfo): string {
  let html = template;

  // 1. 替換標題
  html = replaceTitle(html, route);

  // 2. 替換 SEO meta tags
  html = replaceSeoMeta(html, route);

  // 3. 替換 JSON-LD
  html = replaceJsonLd(html, route);

  return html;
}

// 取得路由的輸出路徑
function getOutputPath(routePath: string): string {
  if (routePath === '/') {
    return path.join(DIST_DIR, 'index.html');
  }

  // 對於其他路由，創建子目錄
  const normalizedPath = routePath.startsWith('/') ? routePath.slice(1) : routePath;
  return path.join(DIST_DIR, normalizedPath, 'index.html');
}

// 主函數
async function prerender(): Promise<void> {
  console.log('🚀 Starting prerender...\n');

  // 讀取模板
  const template = readTemplate();

  // 收集所有路由
  const routes = collectAllRoutes();
  console.log(`📍 Found ${routes.length} routes to prerender\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const route of routes) {
    try {
      // 生成預渲染 HTML
      const html = prerenderRoute(template, route);

      // 取得輸出路徑
      const outputPath = getOutputPath(route.path);

      // 確保目錄存在
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // 寫入檔案
      fs.writeFileSync(outputPath, html);
      successCount++;

      // 顯示進度
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

  // 統計
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
