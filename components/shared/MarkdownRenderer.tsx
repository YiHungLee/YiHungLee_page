import React, { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// 配置 marked 選項
marked.setOptions({
  breaks: true,
  gfm: true,
});

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
