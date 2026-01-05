import React, { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// 正規化 assets 路徑的輔助函數
// 將 "assets/..." 或 "/assets/..." 統一轉換為 "/assets/..."
const normalizeAssetPath = (path: string): string => {
  if (path.startsWith('assets/')) {
    return '/' + path;
  }
  return path;
};

// 自訂連結渲染器，將 Obsidian 格式的連結轉換為網站路由
const renderer = new marked.Renderer();
renderer.link = ({ href, title, text }) => {
  let finalHref = href;

  // 轉換 Obsidian 格式的 blog 連結: content/blog/2025-10-29.md → /blog/2025-10-29
  if (href.match(/^content\/blog\/(.+)\.md$/)) {
    const postId = href.replace(/^content\/blog\//, '').replace(/\.md$/, '');
    finalHref = `/blog/${postId}`;
  }
  // 轉換 Obsidian 格式的 portfolio 連結: content/portfolio/xxx.md → /projects/xxx
  else if (href.match(/^content\/portfolio\/(.+)\.md$/)) {
    const projectId = href.replace(/^content\/portfolio\//, '').replace(/\.md$/, '');
    finalHref = `/projects/${projectId}`;
  }

  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${finalHref}"${titleAttr}>${text}</a>`;
};

// 自訂圖片渲染器，正規化 assets 路徑並支援 Obsidian 風格的尺寸語法
// 支援格式: ![300](url) → 寬度 300px, ![300x200](url) → 寬度 300px 高度 200px
renderer.image = ({ href, title, text }) => {
  const normalizedHref = normalizeAssetPath(href);
  const titleAttr = title ? ` title="${title}"` : '';

  // 檢查 alt text 是否為 Obsidian 風格的尺寸規格
  let altAttr = '';
  let styleAttr = '';

  if (text) {
    // 匹配 "300" 或 "300x200" 格式
    const sizeMatch = text.match(/^(\d+)(x(\d+))?$/);
    if (sizeMatch) {
      const width = sizeMatch[1];
      const height = sizeMatch[3];
      styleAttr = height
        ? ` style="width: ${width}px; height: ${height}px;"`
        : ` style="width: ${width}px;"`;
    } else {
      altAttr = text;
    }
  }

  return `<img src="${normalizedHref}" alt="${altAttr}"${titleAttr}${styleAttr} loading="lazy" />`;
};

// 配置 marked 選項
marked.setOptions({
  breaks: true,
  gfm: true,
});
marked.use({ renderer });

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = 'prose-custom editorial-content'
}) => {
  // 使用 useMemo 來同步解析 markdown
  const html = useMemo(() => {
    return marked(content);
  }, [content]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
