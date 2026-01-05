import type { BlogPostData, PortfolioItemData, RouteInfo } from './route-collector.js';

const SITE_URL = 'https://yi-hung-lee.work';
const DEFAULT_IMAGE = `${SITE_URL}/assets/yihung_transparent.webp`;
const FAVICON = `${SITE_URL}/favicon-192x192.png`;

// WebSite Schema（所有頁面共用）
export function generateWebsiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': '李奕宏 Yi-hung Lee',
    'alternateName': 'Yi-hung Lee Portfolio',
    'url': SITE_URL,
    'description': '李奕宏，臺北市立大學心理與諮商研究所。專注於心理諮商、心理學領域研究，同時探索科技與音樂創作。',
    'inLanguage': 'zh-TW',
    'author': {
      '@type': 'Person',
      'name': '李奕宏',
      'alternateName': 'Yi-hung Lee',
      'jobTitle': '實習諮商心理師',
      'affiliation': {
        '@type': 'EducationalOrganization',
        'name': '臺北市立大學心理與諮商研究所',
      },
    },
  };
}

// Person Schema（關於頁面）
export function generatePersonSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': '李奕宏',
    'alternateName': 'Yi-hung Lee',
    'url': SITE_URL,
    'image': DEFAULT_IMAGE,
    'jobTitle': '實習諮商心理師',
    'description': '臺北市立大學心理與諮商研究所碩士班學生，專注於心理諮商、心理學領域研究，同時探索科技與音樂創作。',
    'alumniOf': {
      '@type': 'EducationalOrganization',
      'name': '臺北市立大學',
    },
    'knowsAbout': ['心理諮商', '心理學研究', '程式開發', '音樂創作'],
  };
}

// BlogPosting Schema
export function generateBlogPostSchema(post: BlogPostData): object {
  const categoryMap: Record<string, string> = {
    'professional': '專業分享',
    'creative': '創意探索',
    'casual': '心情隨筆',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.summary,
    'datePublished': post.date,
    'dateModified': post.date,
    'author': {
      '@type': 'Person',
      'name': '李奕宏',
      'url': `${SITE_URL}/about`,
    },
    'publisher': {
      '@type': 'Person',
      'name': '李奕宏',
      'logo': {
        '@type': 'ImageObject',
        'url': FAVICON,
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.id}`,
    },
    'keywords': post.tags.join(', '),
    'articleSection': categoryMap[post.category] || post.category,
    'wordCount': Math.round(post.content.length / 2), // 中文字數估算
    'timeRequired': `PT${post.readTime || 5}M`,
    'inLanguage': 'zh-TW',
  };
}

// Portfolio Item Schema
export function generatePortfolioSchema(item: PortfolioItemData): object {
  const baseSchema = {
    '@context': 'https://schema.org',
    'name': item.title,
    'description': item.description,
    'dateCreated': item.year ? `${item.year}-01-01` : undefined,
    'author': {
      '@type': 'Person',
      'name': '李奕宏',
    },
    'url': `${SITE_URL}/projects/${item.category}/${item.id}`,
    'inLanguage': 'zh-TW',
  };

  // 根據類別選擇不同的 Schema 類型
  switch (item.category) {
    case 'coding':
      return {
        ...baseSchema,
        '@type': 'SoftwareApplication',
        'applicationCategory': 'Utility',
        'operatingSystem': 'Cross-platform',
        ...(item.techStack && item.techStack.length > 0 && {
          'programmingLanguage': item.techStack,
        }),
      };

    case 'music':
      return {
        ...baseSchema,
        '@type': 'MusicComposition',
        'composer': {
          '@type': 'Person',
          'name': '李奕宏',
        },
      };

    case 'academic':
      return {
        ...baseSchema,
        '@type': 'ScholarlyArticle',
        ...(item.award && {
          'award': item.award,
        }),
      };

    default:
      return {
        ...baseSchema,
        '@type': 'CreativeWork',
      };
  }
}

// 根據路由資訊生成 JSON-LD Schemas
export function generateJsonLdSchemas(route: RouteInfo): object[] {
  const schemas: object[] = [];

  // 所有頁面都包含 WebSite schema
  schemas.push(generateWebsiteSchema());

  // 根據頁面類型添加額外的 schema
  switch (route.type) {
    case 'blog':
      schemas.push(generateBlogPostSchema(route.data as BlogPostData));
      break;

    case 'portfolio':
      schemas.push(generatePortfolioSchema(route.data as PortfolioItemData));
      break;

    case 'static':
      if (route.path === '/about') {
        schemas.push(generatePersonSchema());
      }
      break;
  }

  return schemas;
}

// 生成 JSON-LD Script Tags
export function generateJsonLdScriptTags(schemas: object[]): string {
  return schemas
    .map(schema => `<script type="application/ld+json">${JSON.stringify(schema, null, 0)}</script>`)
    .join('\n    ');
}
