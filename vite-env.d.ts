/// <reference types="vite/client" />

declare module 'virtual:content' {
  import type { BlogPost, PortfolioItem } from './types';

  export const BLOG_POSTS: BlogPost[];
  export const PORTFOLIO_ITEMS: PortfolioItem[];
}
