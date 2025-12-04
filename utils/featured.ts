// utils/featured.ts

import { PORTFOLIO_ITEMS, BLOG_POSTS } from '../constants';
import { PortfolioItem, BlogPost } from '../types';

/**
 * 取得精選作品
 * @param limit 數量限制（預設 2）
 * @returns 精選作品陣列
 */
export const getFeaturedProjects = (limit: number = 2): PortfolioItem[] => {
  return PORTFOLIO_ITEMS
    .filter(item => item.featured === true)
    .sort((a, b) => {
      // 按年份降序排序
      // 支援數字或字串格式的 year
      const yearA = typeof a.year === 'string'
        ? parseInt(a.year.split('-')[0])
        : parseInt(String(a.year));
      const yearB = typeof b.year === 'string'
        ? parseInt(b.year.split('-')[0])
        : parseInt(String(b.year));
      return yearB - yearA;
    })
    .slice(0, limit);
};

/**
 * 檢查文章是否已發布（日期早於或等於今天）
 * @param dateString 日期字串（格式：YYYY-MM-DD）
 * @returns 是否已發布
 */
export const isPostPublished = (dateString: string): boolean => {
  const postDate = new Date(dateString);
  const today = new Date();

  // 將兩個日期都設定為當天的 00:00:00 以便比較
  postDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return postDate.getTime() <= today.getTime();
};

/**
 * 取得已發布的文章（過濾掉未來日期的文章）
 * @param posts 文章陣列
 * @returns 已發布的文章陣列
 */
export const getPublishedPosts = (posts: BlogPost[]): BlogPost[] => {
  return posts.filter(post => isPostPublished(post.date));
};

/**
 * 取得最新文章（只包含已發布的文章）
 * @param limit 數量限制（預設 2）
 * @returns 最新文章陣列
 */
export const getLatestPosts = (limit: number = 2): BlogPost[] => {
  return getPublishedPosts(BLOG_POSTS)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

/**
 * 按分類篩選作品
 * @param category 作品分類
 * @returns 該分類的作品陣列
 */
export const getProjectsByCategory = (category: string): PortfolioItem[] => {
  return PORTFOLIO_ITEMS.filter(item => item.category === category);
};

/**
 * 按標籤篩選 Blog 文章
 * @param tag 標籤名稱
 * @returns 包含該標籤的文章陣列
 */
export const getPostsByTag = (tag: string): BlogPost[] => {
  return BLOG_POSTS.filter(post => post.tags.includes(tag));
};

/**
 * 格式化日期（YYYY-MM-DD → YYYY年MM月DD日）
 * @param dateString 日期字串
 * @returns 格式化後的日期
 */
export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${year}年${parseInt(month)}月${parseInt(day)}日`;
};
