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
  year: string | number;     // 支援字串或數字（markdown frontmatter 可能解析為數字）
  description: string;       // 簡短描述（用於列表頁）
  content?: string;          // Markdown 正文內容（用於詳細頁）
  featured?: boolean;        // 首頁精選標記

  // 專業領域專屬
  award?: string;            // 獎項
  venue?: string;            // 發表場合

  // 程式專案專屬
  techStack?: string[];      // 技術棧
  githubUrl?: string;        // GitHub 連結
  liveUrl?: string;          // Live Demo 連結

  // 音樂作品專屬
  audioUrl?: string;         // 音訊檔案 URL（向後相容）
  duration?: string;         // 時長（向後相容）
  tracks?: MusicTrack[];     // 專輯曲目列表
  albumCover?: string;       // 專輯封面圖片
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
  category: 'professional' | 'creative' | 'casual'; // 主分類
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

// ===== 音樂經歷項目介面 =====
export interface MusicExperienceItem {
  date: string;
  title: string;
  images: string[];
}

// ===== 學術經歷圖片介面 =====
export interface AcademicImage {
  url: string;
  caption?: string;  // 人物姓名或圖片說明
}

// ===== 學術經歷項目介面 =====
export interface AcademicExperienceItem {
  date: string;
  title: string;
  images: (string | AcademicImage)[];  // 支援純字串或帶註解的物件
  portfolioLink?: string;  // 連結到作品集的 ID
  credentialUrl?: string;  // 外部認證連結（如 Credly）
}

// ===== 音樂曲目介面 =====
export interface MusicTrack {
  id: string;               // 曲目唯一 ID
  title: string;            // 曲名
  audioUrl: string;         // Cloudflare R2 URL
  duration: string;         // 時長（如 "3:45"）
  trackNumber?: number;     // 曲目編號
  albumTitle?: string;      // 所屬專輯（用於全站播放器）
  albumCover?: string;      // 專輯封面
  description?: string;     // 曲目描述
}

// ===== 導航項目介面 =====
export interface NavItem {
  label: string;
  path: string;
  showInNav: boolean;
}
