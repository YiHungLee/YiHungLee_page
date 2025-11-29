# 李奕宏個人網站重構實作指南

> **版本**: 2.0
> **最後更新**: 2025-11-29
> **狀態**: 完成首頁重新設計 - Refined Minimalism 風格

---

## 📋 目錄

1. [專案概述](#專案概述)
2. [設計理念](#設計理念)
3. [技術架構](#技術架構)
4. [設計系統](#設計系統)
5. [資料結構規範](#資料結構規範)
6. [組件 API 文檔](#組件-api-文檔)
7. [實作步驟](#實作步驟)
8. [測試檢查清單](#測試檢查清單)
9. [部署指南](#部署指南)

---

## 專案概述

### 目標

打造一個**精緻極簡主義風格**的心理諮商師個人作品集網站，透過優雅的排版、細線美學和大量留白，創造吸引訪客駐足觀看的視覺體驗。

### 核心特色

1. **Refined Minimalism** - 精緻極簡主義設計語言
2. **Editorial Typography** - 雜誌級大字體排版
3. **Fine Line Aesthetics** - 1px 細線美學取代粗邊框
4. **Asymmetric Layouts** - 不對稱布局創造視覺張力
5. **Responsive Design** - 完整的響應式設計支援

---

## 設計理念

### 設計概念：「Refined Minimalism with Editorial Typography」

這是一個為心理諮商師量身打造的視覺系統，核心理念是讓**文字本身成為視覺焦點**，透過極簡的設計語言傳達專業性與溫暖感。

### 設計原則

#### 1. 無漸層 (No Gradients)
- ✅ **嚴格禁止使用任何漸層效果**
- 使用純色背景和細膩的邊框分隔
- 透過色彩層次和透明度創造深度

#### 2. 無 Emoji (No Emojis)
- ✅ **全站移除所有表情符號**
- 使用優雅的文字和排版傳達情感
- 保持專業和精緻的視覺形象

#### 3. 最小化圖標使用 (Minimal Icons)
- ✅ **僅保留功能性圖標**
  - 漢堡菜單 (Menu)
  - 關閉按鈕 (X)
- ❌ 移除所有裝飾性圖標
  - 社交媒體圖標
  - 箭頭、星星等裝飾
  - 分類圖標（用文字標籤取代）

#### 4. 響應式設計 (Responsive Design)
- ✅ **完整支援所有裝置尺寸**
- 桌面版 (≥1024px) - 多欄布局
- 平板版 (768px-1023px) - 適應性布局
- 手機版 (<768px) - 單欄堆疊

### 視覺特色

#### 超大字體 + 極致留白
- **首頁姓名**: `text-9xl` (8rem / 128px)
- **章節標題**: `text-7xl` (4.5rem / 72px)
- **區塊間距**: `py-32 md:py-40` (128px-160px)
- **容器邊距**: `px-6 md:px-12` (24px-48px)

#### 1px 細線美學
- 所有邊框使用 `border-fine` (1px)
- 分隔線使用 `h-px` (1px 高度)
- hover 效果使用細線變色而非陰影

#### 不對稱布局
- Hero 區塊：左側大標題，右側資訊欄
- 作品展示：3/12 + 9/12 的不平衡分欄
- 文章列表：索引編號與內容的視覺對比

#### 極簡色彩系統
```css
/* Light Mode - 主要配色 */
Background: #faf8f5 (warmCream-100)
Text:       #1a1a1a (charcoal-900)
Accent:     #c4885f (ochre-400)
Border:     #e8e5e0 (border-light)

/* Dark Mode - 深色配色 */
Background: #1a1a1a (charcoal-900)
Text:       #faf8f5 (warmCream-50)
Accent:     #c4885f (ochre-400)
Border:     #333333 (border-dark)
```

### 字體系統

#### 英文字體
- **Display**: Cormorant Garamond (襯線，標題用)
  - 優雅的古典襯線字體
  - 用於姓名、章節標題、引言
- **Body**: Manrope (無襯線，正文用)
  - 現代溫暖的無襯線字體
  - 用於段落、說明文字
- **Accent**: Libre Baskerville (襯線，強調用)
  - 書籍級襯線字體
  - 用於副標題、特殊強調

#### 中文字體
- **襯線**: Noto Serif TC
- **無襯線**: Noto Sans TC

### 動畫與互動

#### 頁面載入動畫
- **淡入**: `animate-fade-in` (1.2s)
- **上移淡入**: `animate-fade-in-up` (1s)
- **右側滑入**: `animate-slide-in-right` (1s)
- **階梯延遲**: `stagger-1` 到 `stagger-8` (0.1s 遞增)

#### Hover 效果
- **細線下劃線**: `.editorial-underline`
  - 0.6s 緩動
  - 從右到左展開
- **邊框變色**: `hover:border-ochre-500`
- **透明度變化**: `hover:opacity-60`
- **細微位移**: `hover:translateY(-4px)`

#### 緩動函數
- **主要**: `cubic-bezier(0.16, 1, 0.3, 1)` - 柔和的彈性
- **標準**: `ease-out-expo`
- **時長**: 300ms (快速) / 500ms (中速) / 1200ms (慢速)

### 技術棧

```
React 19 + TypeScript + Vite
React Router v6 (HashRouter)
TailwindCSS (CDN, dark mode enabled)
Lucide React (Icons)
```

---

## 技術架構

### 路由系統

#### 路由配置表

| 路由 | 頁面 | 主題模式 | 組件 |
|------|------|---------|------|
| `/` | 首頁 | Light | HomePage.tsx |
| `/about` | 關於我 | Light | AboutPage.tsx |
| `/contact` | 聯絡 | Light | ContactPage.tsx |
| `/blog` | Blog 列表 | Light | BlogListPage.tsx |
| `/blog/:postId` | Blog 文章 | Light | BlogPostPage.tsx |
| `/projects` | 作品集總覽 | Light | ProjectsPage.tsx |
| `/projects/academic` | 學術研究 | Light | ProjectCategoryPage.tsx |
| `/projects/coding` | 程式開發 | **Dark** ⚡ | ProjectCategoryPage.tsx |
| `/projects/music` | 音樂創作 | **Dark** ⚡ | ProjectCategoryPage.tsx |

#### 路由映射邏輯

```typescript
// components/layout/ThemeProvider.tsx

const ROUTE_THEME_MAP: Record<string, ThemeMode> = {
  '/': 'light',
  '/about': 'light',
  '/contact': 'light',
  '/blog': 'light',
  '/projects': 'light',
  '/projects/academic': 'light',
  '/projects/coding': 'dark',
  '/projects/music': 'dark',
};

// 根據路由路徑判斷主題
function getThemeByPath(pathname: string): ThemeMode {
  // 精確匹配
  if (ROUTE_THEME_MAP[pathname]) {
    return ROUTE_THEME_MAP[pathname];
  }

  // 模糊匹配（用於 /blog/:postId）
  if (pathname.startsWith('/blog')) return 'light';
  if (pathname.startsWith('/projects/coding')) return 'dark';
  if (pathname.startsWith('/projects/music')) return 'dark';

  // 默認淺色
  return 'light';
}
```

### 主題切換系統

#### ThemeContext 架構

```typescript
// types.ts
export type ThemeMode = 'light' | 'dark';
export type PageType = 'professional' | 'creative';

export interface ThemeContextType {
  mode: ThemeMode;
  pageType: PageType;
  setMode: (mode: ThemeMode) => void;
}

// components/layout/ThemeContext.ts
import { createContext, useContext } from 'react';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export { ThemeContext };
```

#### ThemeProvider 實作

```typescript
// components/layout/ThemeProvider.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const newMode = getThemeByPath(location.pathname);

    if (newMode !== mode) {
      // 添加過渡動畫 class
      document.documentElement.classList.add('theme-transitioning');
      setMode(newMode);

      // 500ms 後移除過渡 class
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 500);
    }
  }, [location.pathname]);

  useEffect(() => {
    // 更新 HTML class
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const pageType: PageType = mode === 'dark' ? 'creative' : 'professional';

  return (
    <ThemeContext.Provider value={{ mode, pageType, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### App.tsx 重構

```typescript
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/layout/ThemeProvider';
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';

// Pages
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import ProjectsPage from './components/pages/ProjectsPage';
import ProjectCategoryPage from './components/pages/ProjectCategoryPage';
import BlogListPage from './components/pages/BlogListPage';
import BlogPostPage from './components/pages/BlogPostPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <ThemeProvider>
        <div className="min-h-screen font-sans
                        bg-cream-50 dark:bg-forest-900
                        text-forest-800 dark:text-cream-100
                        transition-colors duration-500
                        selection:bg-olive-200 selection:text-forest-800
                        dark:selection:bg-olive-400/30 dark:selection:text-cream-100">
          <Navigation />

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:category" element={<ProjectCategoryPage />} />

              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:postId" element={<BlogPostPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;
```

---

## 設計系統

### 色彩規範

#### Light Mode (Professional)

```css
/* 背景色 */
--bg-primary: #FDFBF7;        /* cream-50 */
--bg-secondary: #F7F3EB;      /* cream-100 */
--bg-tertiary: #EFEAD8;       /* cream-200 */

/* 文字色 */
--text-primary: #2C4C3B;      /* forest-800 */
--text-secondary: #4A6B5A;    /* forest-600 */
--text-muted: #A8A29E;        /* mist-500 */

/* 強調色 */
--accent-primary: #6B8E23;    /* olive-600 */
--accent-secondary: #808000;  /* olive-500 */
--accent-light: #F4F8E6;      /* olive-100 */

/* 邊框與分隔 */
--border-light: #D2B48C;      /* camel-400 */
--border-medium: #C19A6B;     /* camel-500 */
--border-subtle: #EFEAD8;     /* cream-200 */
```

#### Dark Mode (Creative Lab)

```css
/* 背景色 */
--bg-primary: #1A2F23;        /* forest-900 - 新增深森林綠 */
--bg-secondary: #243A2E;      /* 次要背景 - 新增 */
--bg-elevated: #2C4C3B;       /* forest-800 - 卡片背景 */

/* 文字色 */
--text-primary: #F7F3EB;      /* cream-100 - 高對比 */
--text-secondary: #D4CFC4;    /* cream-200 變體 */
--text-muted: #A8A29E;        /* mist-500 */

/* 強調色 */
--accent-primary: #8FB339;    /* olive-400 - 新增亮化版 */
--accent-secondary: #B8C76F;  /* olive-300 - 新增 */
--accent-glow: rgba(143, 179, 57, 0.2); /* 發光效果 */

/* 邊框與分隔 */
--border-light: #3D5A49;      /* forest-600 變體 */
--border-subtle: rgba(107, 142, 35, 0.15); /* olive 半透明 */

/* 互動狀態 */
--hover-bg: rgba(107, 142, 35, 0.1);
--active-bg: rgba(143, 179, 57, 0.15);
```

#### Tailwind 配置更新

```javascript
// index.html <script> 區塊
tailwind.config = {
  darkMode: 'class', // 啟用 class 模式
  theme: {
    extend: {
      colors: {
        forest: {
          900: '#1A2F23', // 新增：深色模式主背景
          800: '#2C4C3B',
          600: '#4A6B5A',
          50: '#E8F0E8',
        },
        olive: {
          600: '#6B8E23',
          500: '#808000',
          400: '#8FB339', // 新增：深色模式強調色
          300: '#B8C76F', // 新增：深色模式次要強調色
          100: '#F4F8E6',
        },
        cream: {
          50: '#FDFBF7',
          100: '#F7F3EB',
          200: '#EFEAD8',
        },
        camel: {
          400: '#D2B48C',
          500: '#C19A6B',
          50: '#FAF5EF',
        },
        mist: {
          500: '#A8A29E',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'sans-serif'],
        serif: ['"Noto Serif TC"', 'serif'],
      },
    }
  }
}
```

### 動畫與過渡

#### 主題切換過渡動畫

```css
/* 添加到 index.html <style> 區塊 */

/* 主題切換過渡效果 */
.theme-transitioning,
.theme-transitioning * {
  transition: background-color 500ms cubic-bezier(0.4, 0, 0.2, 1),
              color 500ms cubic-bezier(0.4, 0, 0.2, 1),
              border-color 500ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* 深色模式專屬樣式 */
.dark {
  background-color: #1A2F23;
  color: #F7F3EB;
}

/* 深色模式下的卡片發光效果 */
.dark .card-glow:hover {
  box-shadow: 0 0 30px rgba(143, 179, 57, 0.2);
}

/* 深色模式下的文字選取色 */
.dark ::selection {
  background-color: rgba(143, 179, 57, 0.3);
  color: #F7F3EB;
}

/* 平滑滾動 */
html {
  scroll-behavior: smooth;
}
```

#### 常用過渡速度

```typescript
// Tailwind class 使用指南
'duration-300' // 快速：顏色、邊框變化
'duration-500' // 中速：主題切換、陰影
'duration-700' // 緩慢：圖片縮放、大型動畫
```

### 間距系統

```typescript
// Tailwind spacing scale
const SPACING = {
  xs: 'p-2',      // 8px
  sm: 'p-4',      // 16px
  md: 'p-6',      // 24px
  lg: 'p-8',      // 32px
  xl: 'p-12',     // 48px
  '2xl': 'p-16',  // 64px
  '3xl': 'p-20',  // 80px (section 垂直間距)
};

// Section 間距標準
const SECTION_SPACING = {
  vertical: 'py-20',   // 80px 上下
  container: 'px-6',   // 24px 左右
  maxWidth: 'max-w-6xl', // 1152px 最大寬度
};
```

### 圓角系統

```typescript
const BORDER_RADIUS = {
  card: 'rounded-2xl',      // 16px - 卡片
  cardLarge: 'rounded-3xl', // 24px - 大型卡片
  button: 'rounded-full',   // 完全圓角 - 按鈕、標籤
  image: 'rounded-2xl',     // 16px - 圖片容器
};
```

### 陰影系統

```typescript
const SHADOWS = {
  card: 'shadow-sm',           // 卡片預設
  cardHover: 'shadow-md',      // 卡片 hover
  cardLarge: 'shadow-lg',      // 大型卡片
  glow: 'shadow-olive-400/20', // 深色模式發光（需自定義）
};
```

---

## 資料結構規範

### types.ts 完整定義

```typescript
// types.ts

// 作品分類
export type ProjectCategory = 'academic' | 'coding' | 'music';

// 作品類型
export type ProjectType =
  | 'research'      // 學術研究
  | 'workshop'      // 講座工作坊
  | 'tool'          // 專業工具
  | 'app'           // 應用程式
  | 'composition';  // 音樂創作

// 頁面類型
export type PageType = 'professional' | 'creative';

// 主題模式
export type ThemeMode = 'light' | 'dark';

// 作品項目介面
export interface PortfolioItem {
  id: string;
  category: ProjectCategory;
  type: ProjectType;
  title: string;
  year: string;
  description: string;
  featured?: boolean;        // 首頁精選標記

  // 專業領域專屬
  award?: string;            // 獎項
  venue?: string;            // 發表場合

  // 程式專案專屬
  techStack?: string[];      // 技術棧
  githubUrl?: string;        // GitHub 連結
  liveUrl?: string;          // Live Demo 連結

  // 音樂作品專屬
  audioUrl?: string;         // 音訊檔案 URL
  duration?: string;         // 時長（如 "5:32"）
  tools?: string[];          // DAW 軟體

  // 共用
  imageUrl?: string;         // 預覽圖片
  tags?: string[];           // 標籤
}

// Blog 文章介面
export interface BlogPost {
  id: string;
  title: string;
  date: string;              // 格式：YYYY-MM-DD
  summary: string;
  content: string;           // Markdown 內容
  tags: string[];
  category: 'professional' | 'creative'; // 主分類
  featured?: boolean;        // 首頁精選標記
  readTime?: number;         // 閱讀時間（分鐘）
}

// 主題 Context 介面
export interface ThemeContextType {
  mode: ThemeMode;
  pageType: PageType;
  setMode: (mode: ThemeMode) => void;
}

// 經歷項目介面（保留原有）
export interface ExperienceItem {
  year: string;
  title: string;
  description?: string;
  type: 'work' | 'award' | 'education';
}

// 技能項目介面（保留原有）
export interface SkillItem {
  category: string;
  skills: string[];
}

// 訓練項目介面（保留原有）
export interface TrainingItem {
  title: string;
  details?: string;
}

// 導航項目介面（新增）
export interface NavItem {
  label: string;
  path: string;
  showInNav: boolean;
}
```

### constants.ts 重組範例

```typescript
// constants.ts

import { PortfolioItem, BlogPost, ExperienceItem, TrainingItem, SkillItem } from './types';

// ===== 個人資料 =====
export const PROFILE = {
  name: "李奕宏",
  nameEn: "Yi-hung Lee",
  title: "全職實習心理師",
  school: "臺北市立大學 心理與諮商研究所",
  currentRole: "世新大學諮商中心 114年全職實習心理師",
  email: "lee2952000@gmail.com",
  phone: "0972-883-820",
  lineId: "h2952000",
  philosophy: "我們或許都會遇到被黑暗籠罩的時刻，身處其中而無力抵抗。但人的內在具有力量，並且這個力量是能夠成長的！我們在生命中遭遇到的每一個困難，都可以是一個好好看見自己的機會。我想跟隨每一位來談者，好好陪伴他看見自己內心深處，那十分珍貴又獨特的力量與韌性。",
  heroTagline: "我是奕宏，在諮商中陪伴，在學術中探索，在音樂與科技中玩樂敘說"
};

// ===== 作品集 =====
export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  // Academic - 學術研究
  {
    id: 'resilience-scale-2022',
    category: 'academic',
    type: 'research',
    title: '大學生復原力量表之編製與驗證',
    year: '2022',
    award: '臺北市立大學心理與諮商學系壁報論文發表會首獎',
    venue: '臺北市立大學',
    description: '本研究旨在編製一份適合台灣大學生使用的復原力量表，並驗證其信效度。透過文獻回顧與質性訪談，建構本土化復原力理論架構，編製量表題項並進行預試與正式施測。結果顯示量表具有良好的信效度，可作為評估大學生復原力的有效工具。',
    tags: ['復原力', '量表編製', '心理計量', '大學生'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200&auto=format&fit=crop'
  },

  // Coding - 程式開發
  {
    id: 'theranotes',
    category: 'coding',
    type: 'tool',
    title: 'TheraNotes',
    year: '2023-2024',
    description: '專為心理助人工作者設計的個人個案紀錄管理系統。結合安全隱私設計與直覺的介面，協助諮商師進行個案紀錄管理與結構化整理。支援多種標籤分類、搜尋功能，並採用本地加密儲存確保個案隱私安全。',
    techStack: ['Tauri', 'Svelte', 'TailwindCSS', 'SQLCiphere'],
    githubUrl: 'https://github.com/YiHungLee/TheraNotes',
    tags: ['紀錄管理', '本機優先', '隱私保護', '輕量高效'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1200&auto=format&fit=crop'
  },

  // Music - 音樂創作
  {
    id: 'mindfulness-journey',
    category: 'music',
    type: 'composition',
    title: 'Mindfulness Journey (Demo)',
    year: '2023',
    description: '使用 Cubase 製作的放鬆引導背景音樂，融合自然聲景與柔和的鋼琴旋律，旨在創造安全的抱持性空間。適合用於正念練習、放鬆引導或療癒情境。',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '5:32',
    tools: ['Cubase', 'Audacity'],
    tags: ['環境音樂', '正念', '吉他', '鋼琴'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop'
  },

  {
    id: 'inner-dialogue',
    category: 'music',
    type: 'composition',
    title: 'Inner Dialogue',
    year: '2022',
    description: '嘗試以音樂表達內在對話的過程，從混亂到釐清。使用 Reason 進行編曲與混音，融合電子節奏與有機樂器，象徵理性與感性的對話。',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    duration: '4:18',
    tools: ['Reason', 'Ableton Live'],
    tags: ['電子音樂', '實驗音樂', '內在探索'],
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop'
  }
];

// ===== 部落格文章 =====
export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'resilience-in-relationships',
    title: '伴侶韌性：在衝突中看見彼此',
    date: '2024-03-15',
    category: 'professional',
    summary: '衝突不代表關係的破裂，反而是深入了解彼此需求的契機。探討如何在關係風暴中建立韌性。',
    tags: ['伴侶諮商', '關係韌性', '自我成長'],
    featured: true,
    readTime: 8,
    content: `
# 伴侶韌性：在衝突中看見彼此

我們常以為好的關係應該是沒有衝突的，像平靜的湖面。然而，真正的韌性並非來自於迴避衝突，而是來自於**修復的能力**。

## 衝突的本質

衝突往往源自於未被滿足的需求。當我們在爭吵時，表面上是在爭論「誰對誰錯」，但潛意識裡我們可能在呼喊：
- 你看見我了嗎？
- 我對你來說重要嗎？
- 當我脆弱時，你會接住我嗎？

## 建立關係的緩衝區

研究顯示，擁有高韌性的伴侶，通常具備以下特質：
1. **正向詮釋**：願意相信對方的動機並非惡意。
2. **情緒調節**：在被激怒時，能暫停一下，不被杏仁核劫持。
3. **共同意義**：擁有共同的目標或價值觀，作為關係的錨點。

透過諮商，我們可以練習在衝突發生的當下，慢下來，聽見彼此語言背後的心跳聲。
    `
  },
  {
    id: 'anxiety-regulation',
    title: '與焦慮共處：植物系的自我照顧',
    date: '2024-02-20',
    category: 'professional',
    summary: '焦慮像是一株生長過盛的藤蔓，試圖保護我們免受傷害。學習如何溫柔地修剪與灌溉內心的花園。',
    tags: ['焦慮調節', '自我照顧', '正念'],
    featured: true,
    readTime: 6,
    content: `
# 與焦慮共處

在諮商室中，我常聽到來談者說：「我想消除焦慮。」
但焦慮其實是我們內建的警報系統，它的存在是為了保護我們。

## 植物系調節法

我們可以試著將焦慮視為一株需要照顧的植物：

### 1. 土壤（環境檢視）
現在的環境是否給了你足夠的安全感？如果沒有，我們可以如何創造一個小小的、安全的角落？這可能是一個物理空間，也可以是一段信任的關係。

### 2. 陽光（關注焦點）
我們將注意力放在哪裡，哪裡就會生長。試著每天花五分鐘，練習**著陸（Grounding）**技巧：
- 看見 5 樣東西
- 觸摸 4 樣東西
- 聽見 3 種聲音
- 聞到 2 種氣味
- 嚐到 1 種味道

### 3. 修剪（認知調整）
有些擔憂像是枯黃的葉子，已經不再服務於現在的你了。我們可以溫柔地謝謝它們曾經的保護，然後輕輕剪下。

接納焦慮的存在，而不是與之對抗，往往是平靜的開始。
    `
  }
];

// ===== 部落格標籤系統 =====
export const BLOG_TAGS = {
  PROFESSIONAL: ['心理諮商', '伴侶諮商', '焦慮調節', '自我成長', '關係韌性'],
  MUSIC: ['音樂創作', '聲音設計', 'DAW教學', '環境音樂'],
  CODING: ['程式開發', 'React', 'TypeScript', 'UI/UX', '工具開發']
};

// ===== 經歷學歷（保留原有） =====
export const EXPERIENCE: ExperienceItem[] = [
  { year: "2024~", title: "好窩心理諮商所 兼職實習心理師", type: "work" },
  { year: "2023~", title: "臺北市立大學劉彥君教授 研究助理", type: "work" },
  { year: "2022", title: "臺北市中正區河堤國小 特教課輔班教師", type: "work" },
  { year: "2021", title: "臺北市信義區興雅國小 實習輔導教師", type: "work" },
  { year: "2020", title: "臺北市立大學游錦雲教授 研究助理", type: "work" },
  { year: "2020", title: "臺北市立大學心理與諮商學系 行政工讀生", type: "work" },
];

export const AWARDS: ExperienceItem[] = [
  { year: "2023", title: "臺北市立大學教育學院 院長獎", type: "award" },
  { year: "2022", title: "臺北市立大學心理與諮商學系 壁報論文發表會 首獎", description: "題目：大學生復原力量表之編製與驗證", type: "award" },
];

export const EDUCATION: ExperienceItem[] = [
  { year: "就讀中", title: "臺北市立大學 心理與諮商學系碩士班 (諮商組)", type: "education" },
  { year: "畢業", title: "臺北市立大學 心理與諮商學系", type: "education" },
];

export const TRAININGS: TrainingItem[] = [
  { title: "碩士層級心理諮商專業訓練" },
  { title: "心理劇導演訓練團體", details: "累計時數48小時，持續增加中" },
  { title: "臺北市立大學心理與諮商學系 研究生心理劇訓練團體", details: "第3年" },
  { title: "結構家族治療理論與個案研討會", details: "6小時" },
  { title: "完形治療個案研討會", details: "2.5小時" },
  { title: "黃盛璘老師園藝治療工作坊", details: "3小時" },
];

export const OTHER_SKILLS: SkillItem[] = [
  { category: "多媒體製作", skills: ["影片剪輯 (Sony Vegas)", "網站設計 (基礎 HTML, CSS, JS)", "混音、錄音等音訊處理能力 (Reason, Cubase)"] },
];
```

### utils/featured.ts 工具函數

```typescript
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
      const yearA = parseInt(a.year.split('-')[0]);
      const yearB = parseInt(b.year.split('-')[0]);
      return yearB - yearA;
    })
    .slice(0, limit);
};

/**
 * 取得最新文章
 * @param limit 數量限制（預設 2）
 * @returns 最新文章陣列
 */
export const getLatestPosts = (limit: number = 2): BlogPost[] => {
  return BLOG_POSTS
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
```

---

## 組件 API 文檔

### Layout 組件

#### ThemeProvider

**用途**: 提供主題切換 Context，監聽路由變化自動切換主題

**Props**:
```typescript
interface ThemeProviderProps {
  children: React.ReactNode;
}
```

**使用範例**:
```typescript
<ThemeProvider>
  <App />
</ThemeProvider>
```

#### Navigation

**用途**: 頂部導航欄，支援路由導航與深色模式樣式

**Props**: 無（使用 `useTheme()` hook 取得主題狀態）

**功能**:
- 固定在頂部（`sticky top-0`）
- 響應式設計（桌面版 / 行動版漢堡選單）
- 滾動時背景變化（半透明白色）
- 當前頁面高亮顯示

**路由項目**:
```typescript
const navItems = [
  { label: '首頁', path: '/' },
  { label: '關於我', path: '/about' },
  { label: '作品集', path: '/projects' },
  { label: 'Blog', path: '/blog' },
  { label: '聯絡', path: '/contact' },
];
```

**使用範例**:
```typescript
import { Navigation } from './components/layout/Navigation';
<Navigation />
```

#### Footer

**用途**: 頁面底部，顯示聯絡資訊與版權

**Props**: 無

**深色模式支援**: 使用 `dark:` 前綴的 Tailwind class

**使用範例**:
```typescript
<Footer />
```

---

### Home 組件

#### HeroNew

**用途**: 首頁 Hero Section，展示個人風格圖像與標語

**Props**: 無（從 `PROFILE` 常數讀取資料）

**設計要點**:
- 最小高度 `min-h-[90vh]`
- 圓形頭像（140px × 140px）
- 主標語：「我是奕宏」（大型 serif 字體）
- 副標語：「在諮商中陪伴，在學術中探索...」
- 向下滾動提示（Chevron 圖示 + 彈跳動畫）

**使用範例**:
```typescript
import { HeroNew } from './components/home/HeroNew';
<HeroNew />
```

**組件架構**:
```typescript
export const HeroNew: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden bg-gradient-to-br from-cream-50 via-white to-forest-50/30">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* 圓形頭像 */}
        <div className="w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden border-4 border-white shadow-xl">
          <img src={PROFILE.avatarUrl || 'https://via.placeholder.com/160'} alt={PROFILE.name} className="w-full h-full object-cover" />
        </div>

        {/* 主標語 */}
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-forest-800 dark:text-cream-100 mb-6 leading-tight">
          我是奕宏
        </h1>

        {/* 副標語 */}
        <p className="text-2xl md:text-3xl text-forest-600 dark:text-olive-400 font-light mb-4">
          {PROFILE.heroTagline}
        </p>

        {/* 向下滾動提示 */}
        <div className="animate-bounce mt-16">
          <ChevronDown className="mx-auto text-olive-600 dark:text-olive-400" size={32} />
        </div>
      </div>
    </section>
  );
};
```

#### IdentityGateway

**用途**: 身份導航雙卡片區塊，引導訪客選擇路徑

**Props**: 無

**設計要點**:
- 雙卡片設計（Professional / Creative Lab）
- **兩張卡片都保持淺色背景**（統一視覺）
- Professional 卡片：溫暖色調、Heart 圖示、諮商關鍵字
- Creative Lab 卡片：科技感設計、Code 圖示、程式/音樂關鍵字
- Hover 效果：卡片放大、邊框變色
- 點擊後使用 `useNavigate()` 導航至對應路由

**使用範例**:
```typescript
import { IdentityGateway } from './components/home/IdentityGateway';
<IdentityGateway />
```

**組件架構**:
```typescript
import { useNavigate } from 'react-router-dom';
import { Heart, Code, CheckCircle, ArrowRight } from 'lucide-react';

export const IdentityGateway: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-cream-100 dark:bg-forest-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-3xl font-serif font-bold text-forest-800 dark:text-cream-100 mb-4">
          探索我的世界
        </h2>
        <p className="text-center text-mist-500 mb-16 max-w-2xl mx-auto">
          我在兩個領域之間遊走：專業的心理諮商工作，以及充滿實驗性的創作空間
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Professional Card - 淺色背景 */}
          <div
            onClick={() => navigate('/projects/academic')}
            className="group relative bg-white dark:bg-forest-700 rounded-3xl p-12
                       border-2 border-camel-200 dark:border-olive-600/30
                       hover:border-olive-600 hover:shadow-2xl
                       transition-all duration-500 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-forest-50 rounded-full blur-3xl
                            opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-olive-100 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="text-olive-600" size={32} />
              </div>

              <h3 className="text-3xl font-serif font-bold text-forest-800 dark:text-cream-100 mb-4">
                Professional
              </h3>
              <p className="text-forest-600 dark:text-olive-200 mb-6 leading-relaxed">
                心理諮商專業 · 學術研究 · 講座與工作坊
              </p>

              <ul className="space-y-2 text-sm text-mist-500 dark:text-cream-200/80">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-olive-600 dark:text-olive-400" />
                  大學生復原力研究
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-olive-600 dark:text-olive-400" />
                  心理劇訓練經歷
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-olive-600 dark:text-olive-400" />
                  助人工作者工具開發
                </li>
              </ul>

              <div className="mt-8 flex items-center gap-2 text-olive-600 dark:text-olive-400 font-medium
                              group-hover:translate-x-2 transition-transform">
                查看專業作品 <ArrowRight size={20} />
              </div>
            </div>
          </div>

          {/* Creative Lab Card - 淺色背景（與 Professional 統一） */}
          <div
            onClick={() => navigate('/projects/coding')}
            className="group relative bg-white dark:bg-forest-700 rounded-3xl p-12
                       border-2 border-camel-200 dark:border-olive-600/30
                       hover:border-olive-600 hover:shadow-2xl
                       transition-all duration-500 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-olive-100 rounded-full blur-3xl
                            opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-olive-100 rounded-2xl flex items-center justify-center mb-6">
                <Code className="text-olive-600" size={32} />
              </div>

              <h3 className="text-3xl font-serif font-bold text-forest-800 dark:text-cream-100 mb-4">
                Creative Lab
              </h3>
              <p className="text-forest-600 dark:text-olive-200 mb-6 leading-relaxed">
                程式專案 · 音樂創作 · 跨界實驗
              </p>

              <ul className="space-y-2 text-sm text-mist-500 dark:text-cream-200/80">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-olive-600 dark:text-olive-400" />
                  Web 應用開發
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-olive-600 dark:text-olive-400" />
                  電子音樂製作
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-olive-600 dark:text-olive-400" />
                  UI/UX 設計探索
                </li>
              </ul>

              <div className="mt-8 flex items-center gap-2 text-olive-600 dark:text-olive-400 font-medium
                              group-hover:translate-x-2 transition-transform">
                進入創作實驗室 <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
```

#### FeaturedProjects

**用途**: 展示首頁精選作品（2 件）

**Props**:
```typescript
interface FeaturedProjectsProps {
  projects: PortfolioItem[];
}
```

**設計要點**:
- 從 `getFeaturedProjects(2)` 取得資料
- 使用 `ProjectCard` 組件渲染
- 網格佈局（2 列）
- 提供「查看更多」連結至 `/projects`

**使用範例**:
```typescript
import { FeaturedProjects } from './components/home/FeaturedProjects';
import { getFeaturedProjects } from './utils/featured';

<FeaturedProjects projects={getFeaturedProjects(2)} />
```

#### LatestPosts

**用途**: 展示最新 Blog 文章（2 篇）

**Props**:
```typescript
interface LatestPostsProps {
  posts: BlogPost[];
}
```

**設計要點**:
- 從 `getLatestPosts(2)` 取得資料
- 使用 `BlogCard` 組件渲染
- 網格佈局（2 列）
- 提供「查看更多」連結至 `/blog`

**使用範例**:
```typescript
import { LatestPosts } from './components/home/LatestPosts';
import { getLatestPosts } from './utils/featured';

<LatestPosts posts={getLatestPosts(2)} />
```

---

### Shared 組件

#### ProjectCard

**用途**: 統一的作品卡片組件

**Props**:
```typescript
interface ProjectCardProps {
  item: PortfolioItem;
  onClick?: () => void;
}
```

**功能**:
- 顯示作品圖片、標題、年份、描述
- 根據 `category` 顯示不同圖示與標籤
- Academic: 顯示獎項
- Coding: 顯示技術棧、GitHub 連結
- Music: 顯示音訊播放器

**深色模式**:
- 背景：`bg-white dark:bg-forest-800`
- 文字：`text-forest-800 dark:text-cream-100`
- 邊框：`border-camel-200 dark:border-olive-600/30`
- Hover 發光：`dark:hover:shadow-olive-400/20`

**使用範例**:
```typescript
<ProjectCard item={portfolioItem} onClick={() => navigate(`/projects/${item.category}`)} />
```

#### BlogCard

**用途**: Blog 文章卡片組件

**Props**:
```typescript
interface BlogCardProps {
  post: BlogPost;
  onClick?: () => void;
}
```

**功能**:
- 顯示文章標題、日期、摘要、標籤
- 顯示閱讀時間（如果有）
- 點擊導航至文章詳情頁

**使用範例**:
```typescript
<BlogCard post={blogPost} onClick={() => navigate(`/blog/${post.id}`)} />
```

#### TagFilter

**用途**: 標籤篩選器組件

**Props**:
```typescript
interface TagFilterProps {
  tags: string[];
  activeTags: string[];
  onTagClick: (tag: string) => void;
  allowMultiple?: boolean; // 允許多選（預設 false）
}
```

**功能**:
- 顯示所有可用標籤
- 支援單選或多選模式
- 高亮顯示已選標籤

**使用範例**:
```typescript
<TagFilter
  tags={['心理諮商', '音樂創作', 'React']}
  activeTags={selectedTags}
  onTagClick={(tag) => setSelectedTags([tag])}
/>
```

---

### Pages 組件

#### HomePage

**用途**: 首頁整合組件

**組成**:
```typescript
<>
  <HeroNew />
  <IdentityGateway />
  <FeaturedProjects projects={getFeaturedProjects(2)} />
  <LatestPosts posts={getLatestPosts(2)} />
  <Philosophy />
  <CTASection />
</>
```

#### ProjectCategoryPage

**用途**: 作品分類頁面（academic / coding / music）

**路由參數**:
```typescript
const { category } = useParams<{ category: string }>();
```

**功能**:
- 根據 `category` 參數篩選作品
- 顯示分類標題與說明
- 使用 `ProjectCard` 組件渲染作品
- 網格佈局（3 列）

**深色模式觸發**:
- `/projects/coding` → Dark Mode
- `/projects/music` → Dark Mode
- `/projects/academic` → Light Mode

#### BlogListPage

**用途**: Blog 列表頁

**功能**:
- 顯示所有 Blog 文章
- 標籤篩選功能（使用 `TagFilter`）
- 按日期降序排序
- 使用 `BlogCard` 組件渲染

#### BlogPostPage

**用途**: Blog 文章詳情頁

**路由參數**:
```typescript
const { postId } = useParams<{ postId: string }>();
```

**功能**:
- 根據 `postId` 找到對應文章
- 顯示完整 Markdown 內容（使用 `SimpleMarkdown`）
- 顯示標籤、日期、閱讀時間
- 返回列表按鈕

---

## 實作步驟

### Phase 0: 環境準備

```bash
# 1. 創建新分支
git checkout -b feature/site-redesign

# 2. 安裝依賴
npm install react-router-dom

# 3. 創建備份目錄
mkdir -p components/legacy
```

### Phase 1: 基礎架構（2-3 小時）

#### 1.1 更新 index.html

```html
<!-- 在 <script> 區塊中更新 Tailwind 配置 -->
<script>
  tailwind.config = {
    darkMode: 'class', // 新增這行
    theme: {
      extend: {
        colors: {
          forest: {
            900: '#1A2F23', // 新增
            800: '#2C4C3B',
            600: '#4A6B5A',
            50: '#E8F0E8',
          },
          olive: {
            600: '#6B8E23',
            500: '#808000',
            400: '#8FB339', // 新增
            300: '#B8C76F', // 新增
            100: '#F4F8E6',
          },
          // ... 其他保持不變
        }
      }
    }
  }
</script>

<!-- 在 <style> 區塊中新增主題過渡動畫 -->
<style>
  /* ... 保留原有樣式 ... */

  /* 新增：主題切換過渡效果 */
  .theme-transitioning,
  .theme-transitioning * {
    transition: background-color 500ms cubic-bezier(0.4, 0, 0.2, 1),
                color 500ms cubic-bezier(0.4, 0, 0.2, 1),
                border-color 500ms cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  .dark {
    background-color: #1A2F23;
    color: #F7F3EB;
  }

  .dark .card-glow:hover {
    box-shadow: 0 0 30px rgba(143, 179, 57, 0.2);
  }

  .dark ::selection {
    background-color: rgba(143, 179, 57, 0.3);
    color: #F7F3EB;
  }
</style>
```

#### 1.2 創建 ThemeContext 與 ThemeProvider

```bash
# 創建目錄
mkdir -p components/layout

# 創建文件
touch components/layout/ThemeContext.ts
touch components/layout/ThemeProvider.tsx
```

按照「技術架構」章節的程式碼實作。

#### 1.3 更新 App.tsx

按照「技術架構」章節的 App.tsx 重構程式碼實作。

#### 1.4 創建佔位頁面

```bash
mkdir -p components/pages
touch components/pages/HomePage.tsx
touch components/pages/AboutPage.tsx
touch components/pages/ContactPage.tsx
touch components/pages/ProjectsPage.tsx
touch components/pages/ProjectCategoryPage.tsx
touch components/pages/BlogListPage.tsx
touch components/pages/BlogPostPage.tsx
```

每個頁面先創建簡單的佔位符：

```typescript
// components/pages/HomePage.tsx
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="pt-32 px-6 min-h-screen">
      <h1 className="text-4xl font-bold">首頁</h1>
      <p>HomePage 佔位符</p>
    </div>
  );
};

export default HomePage;
```

#### 1.5 測試基礎路由與主題切換

```bash
npm run dev
```

測試項目：
- [ ] 所有路由可正常訪問
- [ ] `/projects/coding` 自動切換為深色模式
- [ ] `/projects/music` 自動切換為深色模式
- [ ] 其他頁面保持淺色模式
- [ ] 主題切換有平滑過渡動畫（500ms）
- [ ] 瀏覽器前後按鈕功能正常

---

### Phase 2: 資料結構重組（1-2 小時）

#### 2.1 更新 types.ts

按照「資料結構規範」章節完整替換 `types.ts`。

#### 2.2 重組 constants.ts

按照「資料結構規範」章節重組 `constants.ts`：
- 為 2 件作品添加 `featured: true`
- 為 2 篇文章添加 `featured: true`
- 更新作品的 `category` 屬性

#### 2.3 創建 utils/featured.ts

```bash
mkdir -p utils
touch utils/featured.ts
```

按照「資料結構規範」章節實作工具函數。

#### 2.4 測試資料結構

```typescript
// 在瀏覽器 Console 測試
import { getFeaturedProjects, getLatestPosts } from './utils/featured';
console.log(getFeaturedProjects(2)); // 應該返回 2 件精選作品
console.log(getLatestPosts(2)); // 應該返回 2 篇最新文章
```

---

### Phase 3: 導航與版面（2 小時）

#### 3.1 備份舊版組件

```bash
cp components/Navigation.tsx components/legacy/Navigation.tsx
cp components/Footer.tsx components/legacy/Footer.tsx
```

#### 3.2 重構 Navigation.tsx

```typescript
// components/layout/Navigation.tsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: '首頁', path: '/' },
    { label: '關於我', path: '/about' },
    { label: '作品集', path: '/projects' },
    { label: 'Blog', path: '/blog' },
    { label: '聯絡', path: '/contact' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300
                     ${scrolled ? 'bg-white/90 dark:bg-forest-900/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-serif font-bold text-forest-800 dark:text-cream-100">
            李奕宏
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  text-sm font-medium transition-colors
                  ${isActive
                    ? 'text-olive-600 dark:text-olive-400'
                    : 'text-forest-600 dark:text-cream-200 hover:text-olive-600 dark:hover:text-olive-400'}
                `}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-forest-800 dark:text-cream-100"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden mt-4 py-4 space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  block py-2 text-base
                  ${isActive
                    ? 'text-olive-600 dark:text-olive-400 font-medium'
                    : 'text-forest-600 dark:text-cream-200'}
                `}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
```

#### 3.3 更新 Footer.tsx

```typescript
// components/layout/Footer.tsx
import React from 'react';
import { Mail } from 'lucide-react';
import { PROFILE } from '../../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-800 dark:bg-forest-900 text-cream-100 py-12 px-6 mt-20">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-2xl font-serif">{PROFILE.nameEn}</h2>
        <p className="text-olive-100 dark:text-olive-300/80 max-w-lg mx-auto text-sm leading-relaxed">
          {PROFILE.philosophy.substring(0, 100)}...
        </p>

        <div className="flex items-center justify-center gap-2 text-olive-100">
          <Mail size={16} />
          <a href={`mailto:${PROFILE.email}`} className="hover:text-olive-400 transition-colors">
            {PROFILE.email}
          </a>
        </div>

        <p className="text-xs text-mist-500 pt-4 border-t border-forest-600 dark:border-olive-600/20">
          © 2024 {PROFILE.name}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};
```

#### 3.4 測試導航

測試項目：
- [ ] 桌面版導航顯示正常
- [ ] 行動版漢堡選單功能正常
- [ ] NavLink 高亮顯示當前頁面
- [ ] 滾動時導航背景變化
- [ ] 深色模式下導航樣式正確

---

### Phase 4: 首頁重建（4-5 小時）

#### 4.1 備份舊版 Hero

```bash
cp components/Hero.tsx components/legacy/Hero.tsx
cp components/Philosophy.tsx components/legacy/Philosophy.tsx
```

#### 4.2 創建 HeroNew

```bash
mkdir -p components/home
touch components/home/HeroNew.tsx
```

按照「組件 API 文檔」章節的 HeroNew 程式碼實作。

#### 4.3 創建 IdentityGateway

```bash
touch components/home/IdentityGateway.tsx
```

按照「組件 API 文檔」章節的 IdentityGateway 程式碼實作。

#### 4.4 創建 FeaturedProjects

```bash
touch components/home/FeaturedProjects.tsx
```

```typescript
// components/home/FeaturedProjects.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PortfolioItem } from '../../types';
import { ProjectCard } from '../shared/ProjectCard';

interface FeaturedProjectsProps {
  projects: PortfolioItem[];
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
  return (
    <section className="py-20 px-6 bg-white dark:bg-forest-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold text-forest-800 dark:text-cream-100 mb-2">
              精選作品
            </h2>
            <p className="text-mist-500 dark:text-cream-200/60">
              探索我在不同領域的代表作品
            </p>
          </div>

          <Link
            to="/projects"
            className="flex items-center gap-2 text-olive-600 dark:text-olive-400 hover:gap-3 transition-all"
          >
            查看更多 <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map(project => (
            <ProjectCard key={project.id} item={project} />
          ))}
        </div>
      </div>
    </section>
  );
};
```

#### 4.5 創建 LatestPosts

```bash
touch components/home/LatestPosts.tsx
```

類似 `FeaturedProjects` 的結構，使用 `BlogCard` 組件。

#### 4.6 創建共用組件 ProjectCard 與 BlogCard

```bash
mkdir -p components/shared
touch components/shared/ProjectCard.tsx
touch components/shared/BlogCard.tsx
```

```typescript
// components/shared/ProjectCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Code, Music } from 'lucide-react';
import { PortfolioItem } from '../../types';

interface ProjectCardProps {
  item: PortfolioItem;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ item }) => {
  const navigate = useNavigate();

  const getCategoryIcon = () => {
    switch (item.category) {
      case 'academic': return <Award className="text-olive-600 dark:text-olive-400" size={20} />;
      case 'coding': return <Code className="text-olive-600 dark:text-olive-400" size={20} />;
      case 'music': return <Music className="text-olive-600 dark:text-olive-400" size={20} />;
    }
  };

  return (
    <div
      onClick={() => navigate(`/projects/${item.category}`)}
      className="card-glow group bg-white dark:bg-forest-800 rounded-2xl overflow-hidden
                 border border-camel-200 dark:border-olive-600/30
                 hover:border-olive-600 dark:hover:border-olive-400
                 hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* 圖片 */}
      {item.imageUrl && (
        <div className="aspect-video overflow-hidden bg-forest-50 dark:bg-forest-700">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}

      {/* 內容 */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {getCategoryIcon()}
          <span className="text-xs text-mist-500 dark:text-cream-200/60">{item.year}</span>
        </div>

        <h3 className="text-xl font-serif font-bold text-forest-800 dark:text-cream-100 mb-2 group-hover:text-olive-600 dark:group-hover:text-olive-400 transition-colors">
          {item.title}
        </h3>

        <p className="text-sm text-forest-600 dark:text-cream-200/80 line-clamp-3 mb-4">
          {item.description}
        </p>

        {/* 技術棧 / 獎項 */}
        {item.techStack && (
          <div className="flex flex-wrap gap-2">
            {item.techStack.slice(0, 3).map(tech => (
              <span key={tech} className="text-xs px-2 py-1 bg-olive-100 dark:bg-olive-600/20 text-olive-600 dark:text-olive-400 rounded-md">
                {tech}
              </span>
            ))}
          </div>
        )}

        {item.award && (
          <div className="text-xs text-olive-600 dark:text-olive-400 font-medium">
            🏆 {item.award}
          </div>
        )}
      </div>
    </div>
  );
};
```

#### 4.7 組裝 HomePage

```typescript
// components/pages/HomePage.tsx
import React from 'react';
import { HeroNew } from '../home/HeroNew';
import { IdentityGateway } from '../home/IdentityGateway';
import { FeaturedProjects } from '../home/FeaturedProjects';
import { LatestPosts } from '../home/LatestPosts';
import { Philosophy } from '../Philosophy'; // 保留原有組件
import { getFeaturedProjects, getLatestPosts } from '../../utils/featured';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroNew />
      <IdentityGateway />
      <FeaturedProjects projects={getFeaturedProjects(2)} />
      <LatestPosts posts={getLatestPosts(2)} />
      <Philosophy />

      {/* CTA Section */}
      <section className="py-20 px-6 bg-olive-100 dark:bg-forest-900 text-center">
        <h2 className="text-3xl font-serif font-bold text-forest-800 dark:text-cream-100 mb-4">
          讓我們一起探索
        </h2>
        <p className="text-forest-600 dark:text-cream-200/80 mb-8 max-w-lg mx-auto">
          無論您對心理諮商、學術研究或創作專案有興趣，都歡迎與我聯絡
        </p>
        <a
          href="/contact"
          className="inline-block px-8 py-3 bg-olive-600 dark:bg-olive-500 text-white rounded-full
                     hover:bg-olive-700 dark:hover:bg-olive-600 transition-colors"
        >
          與我聯絡
        </a>
      </section>
    </>
  );
};

export default HomePage;
```

#### 4.8 測試首頁

測試項目：
- [ ] HeroNew 顯示正確（圖片、標語）
- [ ] IdentityGateway 雙卡片可點擊導航
- [ ] 精選作品顯示 2 件
- [ ] 最新文章顯示 2 篇
- [ ] 所有組件響應式佈局正確
- [ ] 深色模式樣式正確

---

### Phase 5-9: 後續階段

後續階段包括：
- Phase 5: 作品集頁面
- Phase 6: Blog 頁面重構
- Phase 7: About 與 Contact 頁面
- Phase 8: 細節優化
- Phase 9: 測試與部署

詳細步驟請參考「李奕宏個人網站架構優化計劃」文檔。

---

## 測試檢查清單

### 功能測試

#### 路由測試
- [ ] 所有路由可正常訪問
- [ ] 瀏覽器前後按鈕功能正常
- [ ] 404 頁面自動重定向至首頁
- [ ] URL 使用 Hash 模式（`#/path`）

#### 主題切換測試
- [ ] `/projects/coding` 自動切換深色模式
- [ ] `/projects/music` 自動切換深色模式
- [ ] 其他頁面保持淺色模式
- [ ] 主題切換有 500ms 平滑過渡
- [ ] 切換過程無閃爍或跳動

#### 導航測試
- [ ] 桌面版導航正常顯示
- [ ] 行動版漢堡選單可開關
- [ ] 當前頁面正確高亮
- [ ] 滾動時導航背景變化
- [ ] 深色/淺色模式樣式正確

#### 內容測試
- [ ] 精選作品正確顯示（2 件）
- [ ] 最新文章正確顯示（2 篇）
- [ ] 作品卡片可點擊導航
- [ ] Blog 卡片可點擊導航
- [ ] 標籤篩選功能正常

### 響應式測試

#### 螢幕尺寸
- [ ] 桌面版（≥1024px）佈局正確
- [ ] 平板版（768px-1023px）佈局正確
- [ ] 手機版（<768px）佈局正確

#### 關鍵組件
- [ ] HeroNew 在各尺寸顯示正確
- [ ] IdentityGateway 卡片正確堆疊（手機版）
- [ ] Navigation 在手機版顯示漢堡選單
- [ ] Footer 在各尺寸顯示正確

### 深色模式測試

#### 視覺檢查
- [ ] 文字對比度符合 WCAG AA 標準
- [ ] 所有卡片邊框清晰可見
- [ ] Hover 效果明顯
- [ ] 發光效果（card-glow）正常運作

#### 色彩檢查
- [ ] 背景色：forest-900 (#1A2F23)
- [ ] 主文字：cream-100 (#F7F3EB)
- [ ] 強調色：olive-400 (#8FB339)
- [ ] 邊框色：olive-600/30

### 效能測試

- [ ] 首頁載入時間 < 3秒
- [ ] 主題切換無卡頓
- [ ] 圖片 lazy loading 正常
- [ ] 動畫流暢（60fps）

### 瀏覽器兼容性

- [ ] Chrome（最新版）
- [ ] Firefox（最新版）
- [ ] Safari（最新版）
- [ ] Edge（最新版）

---

## 部署指南

### 本地構建測試

```bash
# 構建生產版本
npm run build

# 預覽生產構建
npm run preview

# 訪問 http://localhost:4173 測試
```

測試項目：
- [ ] 所有路由正常
- [ ] HashRouter URL 格式正確
- [ ] 靜態資源載入正常
- [ ] 無 console 錯誤

### Cloudflare Pages 部署

#### 方式 1: 手動推送（推薦）

```bash
# 1. 確保所有更改已提交
git add .
git commit -m "完成網站重構"

# 2. 推送到 main 分支
git push origin feature/site-redesign:main
```

GitHub Actions 會自動觸發部署。

#### 方式 2: 合併分支

```bash
# 1. 切換到 main 分支
git checkout main

# 2. 合併 feature 分支
git merge feature/site-redesign

# 3. 推送
git push origin main
```

### 部署後檢查

訪問 Cloudflare Pages URL，檢查：
- [ ] 首頁正常載入
- [ ] 路由導航正常（HashRouter）
- [ ] 主題自動切換正常
- [ ] 圖片與靜態資源載入
- [ ] 深色模式樣式正確
- [ ] 行動版顯示正常

### 故障排除

#### 問題：路由 404 錯誤

**原因**: 使用 BrowserRouter 但未配置 `_redirects`

**解決**:
```bash
# 確認使用 HashRouter
# App.tsx 中應為 <HashRouter> 而非 <BrowserRouter>
```

#### 問題：深色模式不生效

**原因**: Tailwind `darkMode` 未啟用

**解決**:
```javascript
// 檢查 index.html 中的 tailwind.config
tailwind.config = {
  darkMode: 'class', // 確保有這行
  // ...
}
```

#### 問題：主題切換閃爍

**原因**: 過渡動畫 class 未正確添加

**解決**:
```typescript
// 檢查 ThemeProvider.tsx
document.documentElement.classList.add('theme-transitioning');
// ... 切換主題
setTimeout(() => {
  document.documentElement.classList.remove('theme-transitioning');
}, 500);
```

---

## 附錄

### 開發工具推薦

- **VSCode 擴展**:
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer

- **瀏覽器擴展**:
  - React Developer Tools
  - WCAG Color Contrast Checker

### 參考資源

- [React Router 官方文檔](https://reactrouter.com/)
- [Tailwind Dark Mode 指南](https://tailwindcss.com/docs/dark-mode)
- [WCAG 對比度檢查工具](https://webaim.org/resources/contrastchecker/)

---

**文檔結束**

如有任何問題或需要協助，請參考本文檔或聯絡開發團隊。
