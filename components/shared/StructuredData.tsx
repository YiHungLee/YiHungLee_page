import { useEffect } from 'react';
import { BlogPost, PortfolioItem } from '../../types';

const BASE_URL = 'https://yi-hung-lee.work';
const AUTHOR = {
  '@type': 'Person',
  '@id': `${BASE_URL}/#person`,
  name: '李奕宏',
};

interface StructuredDataProps {
  type: 'article' | 'portfolio' | 'breadcrumb';
  data?: BlogPost | PortfolioItem;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

// 生成 BlogPosting schema
function generateArticleSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${BASE_URL}/blog/${post.id}#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${post.id}`,
    },
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.date,
    author: AUTHOR,
    publisher: {
      '@type': 'Person',
      '@id': `${BASE_URL}/#person`,
    },
    inLanguage: 'zh-TW',
    keywords: post.tags?.join(', '),
    articleSection: getCategoryLabel(post.category),
  };
}

// 生成 CreativeWork schema
function generatePortfolioSchema(item: PortfolioItem) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': getSchemaType(item.type),
    '@id': `${BASE_URL}/projects/${item.category}/${item.id}#work`,
    name: item.title,
    description: item.description,
    dateCreated: typeof item.year === 'number' ? `${item.year}` : item.year,
    creator: AUTHOR,
    inLanguage: 'zh-TW',
  };

  // 音樂作品額外屬性
  if (item.category === 'music' && item.audioUrl) {
    return {
      ...baseSchema,
      '@type': 'MusicComposition',
      audio: {
        '@type': 'AudioObject',
        contentUrl: item.audioUrl,
        duration: item.duration,
      },
    };
  }

  // 程式專案額外屬性
  if (item.category === 'coding') {
    return {
      ...baseSchema,
      '@type': 'SoftwareApplication',
      applicationCategory: 'WebApplication',
      operatingSystem: 'Web Browser',
      ...(item.liveUrl && { url: item.liveUrl }),
      ...(item.githubUrl && {
        codeRepository: item.githubUrl,
      }),
      ...(item.techStack && {
        programmingLanguage: item.techStack,
      }),
    };
  }

  // 學術研究額外屬性
  if (item.category === 'academic') {
    return {
      ...baseSchema,
      '@type': item.type === 'publication' ? 'ScholarlyArticle' : 'CreativeWork',
      ...(item.venue && { publisher: item.venue }),
      ...(item.award && { award: item.award }),
    };
  }

  return baseSchema;
}

// 生成 BreadcrumbList schema
function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${BASE_URL}${crumb.url}`,
    })),
  };
}

// 根據作品類型取得 Schema.org 類型
function getSchemaType(type: string): string {
  switch (type) {
    case 'research':
      return 'ScholarlyArticle';
    case 'publication':
      return 'ScholarlyArticle';
    case 'tool':
      return 'SoftwareApplication';
    case 'app':
      return 'SoftwareApplication';
    case 'composition':
      return 'MusicComposition';
    default:
      return 'CreativeWork';
  }
}

// 取得分類標籤
function getCategoryLabel(category: string): string {
  switch (category) {
    case 'professional':
      return '專業文章';
    case 'creative':
      return '創作文章';
    case 'casual':
      return '日常隨筆';
    default:
      return '文章';
  }
}

export function StructuredData({ type, data, breadcrumbs }: StructuredDataProps) {
  useEffect(() => {
    // 確保在瀏覽器環境中執行
    if (typeof document === 'undefined' || !document.head) return;

    let schema: object | null = null;

    if (type === 'article' && data && 'summary' in data) {
      schema = generateArticleSchema(data as BlogPost);
    } else if (type === 'portfolio' && data && 'category' in data) {
      schema = generatePortfolioSchema(data as PortfolioItem);
    } else if (type === 'breadcrumb' && breadcrumbs) {
      schema = generateBreadcrumbSchema(breadcrumbs);
    }

    if (!schema) return;

    let script: HTMLScriptElement | null = null;

    try {
      // 移除舊的動態 structured data
      const existingScript = document.querySelector(
        `script[data-structured-data="${type}"]`
      );
      if (existingScript?.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }

      // 注入新的 structured data
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-structured-data', type);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    } catch (error) {
      console.warn('StructuredData: Failed to inject schema', error);
    }

    // 清理函式
    return () => {
      try {
        if (script?.parentNode) {
          script.parentNode.removeChild(script);
        }
      } catch {
        // 忽略清理時的錯誤
      }
    };
  }, [type, data, breadcrumbs]);

  return null;
}

export default StructuredData;
