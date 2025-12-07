import React, { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

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
