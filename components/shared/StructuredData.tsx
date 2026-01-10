import { useEffect } from 'react';
import { BlogPost, PortfolioItem } from '../../types';

const BASE_URL = 'https://yi-hung-lee.work';
const AUTHOR = {
  '@type': 'Person',
  '@id': `${BASE_URL}/#person`,
  name: '李奕宏',
};

// 清單頁面的資料結構
interface ListItem {
  id: string;
  title: string;
  url: string;
}

// 學歷/認證資料結構
interface CredentialData {
  name: string;
  credentialCategory: 'degree' | 'certificate';
  dateReceived?: string;
  credentialUrl?: string;
  recognizedBy?: string;
}

// 組織資料結構
interface OrganizationData {
  name: string;
  type: 'EducationalOrganization' | 'Organization';
  url?: string;
}

// About 頁面資料結構
interface AboutPageData {
  credentials: CredentialData[];
  organizations: OrganizationData[];
}

interface StructuredDataProps {
  type: 'article' | 'portfolio' | 'breadcrumb' | 'blogList' | 'portfolioList' | 'about';
  data?: BlogPost | PortfolioItem | AboutPageData;
  breadcrumbs?: Array<{ name: string; url: string }>;
  // 清單頁面用
  listData?: {
    name: string;
    description: string;
    url: string;
    items: ListItem[];
  };
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

// 生成 CollectionPage + ItemList schema（清單頁面用）
function generateCollectionPageSchema(listData: {
  name: string;
  description: string;
  url: string;
  items: ListItem[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${BASE_URL}${listData.url}#collectionpage`,
    name: listData.name,
    description: listData.description,
    url: `${BASE_URL}${listData.url}`,
    inLanguage: 'zh-TW',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: listData.items.length,
      itemListElement: listData.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        url: `${BASE_URL}${item.url}`,
      })),
    },
  };
}

// 生成 About 頁面 schema（Person + Credentials + Organization）
function generateAboutSchema(data: AboutPageData) {
  const credentialSchemas = data.credentials.map((cred) => ({
    '@type': 'EducationalOccupationalCredential',
    name: cred.name,
    credentialCategory: cred.credentialCategory === 'degree' ? 'degree' : 'certificate',
    ...(cred.dateReceived && { dateReceived: cred.dateReceived }),
    ...(cred.credentialUrl && { url: cred.credentialUrl }),
    ...(cred.recognizedBy && {
      recognizedBy: {
        '@type': 'Organization',
        name: cred.recognizedBy,
      },
    }),
  }));

  const organizationSchemas = data.organizations.map((org) => ({
    '@type': org.type,
    name: org.name,
    ...(org.url && { url: org.url }),
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${BASE_URL}/about#profilepage`,
    mainEntity: {
      '@type': 'Person',
      '@id': `${BASE_URL}/#person`,
      name: '李奕宏',
      alternateName: 'Yi-Hung Lee',
      jobTitle: '全職實習諮商心理師',
      hasCredential: credentialSchemas,
      alumniOf: organizationSchemas.filter((org) => org['@type'] === 'EducationalOrganization'),
    },
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

export function StructuredData({ type, data, breadcrumbs, listData }: StructuredDataProps) {
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
    } else if ((type === 'blogList' || type === 'portfolioList') && listData) {
      schema = generateCollectionPageSchema(listData);
    } else if (type === 'about' && data && 'credentials' in data) {
      schema = generateAboutSchema(data as AboutPageData);
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
