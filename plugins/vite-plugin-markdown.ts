import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Plugin } from 'vite';

export function markdownPlugin(): Plugin {
  return {
    name: 'vite-plugin-markdown',

    resolveId(id) {
      if (id === 'virtual:content') {
        return '\0virtual:content';
      }
      return null;
    },

    load(id) {
      if (id === '\0virtual:content') {
        const blogDir = path.resolve(__dirname, '../content/blog');
        const portfolioDir = path.resolve(__dirname, '../content/portfolio');

        const loadMarkdownFiles = (dir: string) => {
          if (!fs.existsSync(dir)) {
            return [];
          }

          const files = fs.readdirSync(dir)
            .filter(f => f.endsWith('.md') && !f.startsWith('_'));

          return files.map(file => {
            const filePath = path.join(dir, file);
            const raw = fs.readFileSync(filePath, 'utf-8');
            const { data, content } = matter(raw);
            return { ...data, content };
          });
        };

        const blogPosts = loadMarkdownFiles(blogDir);
        const portfolioItems = loadMarkdownFiles(portfolioDir);

        return `
          export const BLOG_POSTS = ${JSON.stringify(blogPosts)};
          export const PORTFOLIO_ITEMS = ${JSON.stringify(portfolioItems)};
        `;
      }
      return null;
    },
  };
}
