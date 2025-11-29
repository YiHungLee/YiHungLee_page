import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM 環境下取得 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 手動複製現有資料（因為執行時 constants.ts 尚未重構）
const BLOG_POSTS = [
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

const PORTFOLIO_ITEMS = [
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

// 確保目錄存在
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 轉換部落格文章
const convertBlogPosts = () => {
  const blogDir = path.join(__dirname, '../content/blog');
  ensureDir(blogDir);

  BLOG_POSTS.forEach(post => {
    const frontmatter = `---
id: ${post.id}
title: ${post.title}
date: ${post.date}
category: ${post.category}
summary: ${post.summary}
tags:
${post.tags.map(tag => `  - ${tag}`).join('\n')}
featured: ${post.featured || false}
readTime: ${post.readTime || 5}
---
${post.content.trim()}`;

    fs.writeFileSync(
      path.join(blogDir, `${post.id}.md`),
      frontmatter,
      'utf-8'
    );
  });

  console.log(`✓ 已轉換 ${BLOG_POSTS.length} 篇部落格文章`);
};

// 轉換作品集項目
const convertPortfolioItems = () => {
  const portfolioDir = path.join(__dirname, '../content/portfolio');
  ensureDir(portfolioDir);

  PORTFOLIO_ITEMS.forEach(item => {
    const fields = [
      `id: ${item.id}`,
      `category: ${item.category}`,
      `type: ${item.type}`,
      `title: ${item.title}`,
      `year: ${item.year}`,
      `description: ${item.description}`,
      `featured: ${item.featured || false}`,
    ];

    if (item.award) fields.push(`award: ${item.award}`);
    if (item.venue) fields.push(`venue: ${item.venue}`);
    if (item.techStack) {
      fields.push(`techStack:\n${item.techStack.map(t => `  - ${t}`).join('\n')}`);
    }
    if (item.githubUrl) fields.push(`githubUrl: ${item.githubUrl}`);
    if (item.liveUrl) fields.push(`liveUrl: ${item.liveUrl}`);
    if (item.audioUrl) fields.push(`audioUrl: ${item.audioUrl}`);
    if (item.duration) fields.push(`duration: ${item.duration}`);
    if (item.tools) {
      fields.push(`tools:\n${item.tools.map(t => `  - ${t}`).join('\n')}`);
    }
    if (item.imageUrl) fields.push(`imageUrl: ${item.imageUrl}`);
    if (item.tags) {
      fields.push(`tags:\n${item.tags.map(t => `  - ${t}`).join('\n')}`);
    }

    const frontmatter = `---\n${fields.join('\n')}\n---\n\n# ${item.title}\n\n${item.description}`;

    fs.writeFileSync(
      path.join(portfolioDir, `${item.id}.md`),
      frontmatter,
      'utf-8'
    );
  });

  console.log(`✓ 已轉換 ${PORTFOLIO_ITEMS.length} 個作品集項目`);
};

// 執行轉換
console.log('開始轉換內容到 Markdown 檔案...\n');
convertBlogPosts();
convertPortfolioItems();
console.log('\n✓ 轉換完成！');
