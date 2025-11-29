// ===== 主題與頁面類型 =====
export type ThemeMode = 'light' | 'dark';
export type PageType = 'professional' | 'creative';

export interface ThemeContextType {
  mode: ThemeMode;
  pageType: PageType;
  setMode: (mode: ThemeMode) => void;
}

// ===== 作品分類 =====
export type ProjectCategory = 'academic' | 'coding' | 'music';
export type ProjectType =
  | 'research'      // 學術研究
  | 'workshop'      // 講座工作坊
  | 'tool'          // 專業工具
  | 'app'           // 應用程式
  | 'composition';  // 音樂創作

// ===== 作品項目介面 =====
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

// ===== Blog 文章介面 =====
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

// ===== 經歷項目介面（保留原有） =====
export interface ExperienceItem {
  year: string;
  title: string;
  description?: string;
  type: 'work' | 'award' | 'education';
}

// ===== 技能項目介面（保留原有） =====
export interface SkillItem {
  category: string;
  skills: string[];
}

// ===== 訓練項目介面（保留原有） =====
export interface TrainingItem {
  title: string;
  details?: string;
}

// ===== 導航項目介面 =====
export interface NavItem {
  label: string;
  path: string;
  showInNav: boolean;
}
