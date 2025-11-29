import { ExperienceItem, SkillItem, TrainingItem, BlogPost, PortfolioItem } from './types';

// ===== 個人資料 =====
export const PROFILE = {
  name: "李奕宏",
  nameEn: "Yi-Hung Lee",
  title: "全職實習心理師",
  school: "臺北市立大學 心理與諮商研究所",
  currentRole: "世新大學諮商中心 全職實習諮商心理師",
  email: "lee2952000@gmail.com",
  philosophy: "活在當下，投入生活。困難會存在，但我們永遠有能力去尋找更多快樂",
  heroTagline: "我是奕宏，在諮商中陪伴，在學術中探索，在音樂與科技中敘說"
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
    description: '專為心理助人工作者設計的個案紀錄管理系統。結合安全隱私設計與直覺的介面，協助諮商師進行個案紀錄管理與結構化整理。支援多種紀錄範本、標籤分類、搜尋功能，並採用本地加密儲存確保個案隱私安全。',
    techStack: ['React', 'TypeScript', 'TailwindCSS', 'Electron', 'SQLite'],
    githubUrl: 'https://github.com/YiHungLee/TheraNotes',
    tags: ['心理工具', '電子病歷', '隱私保護', 'Electron'],
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
    tools: ['Cubase', 'Kontakt', 'Valhalla VintageVerb'],
    tags: ['環境音樂', '正念', '療癒', '鋼琴'],
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
