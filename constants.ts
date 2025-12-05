import { ExperienceItem, SkillItem, TrainingItem, MusicExperienceItem, AcademicExperienceItem, AcademicImage } from './types';

// 從 virtual module 重新 export（透過 contentLoader）
export { BLOG_POSTS, PORTFOLIO_ITEMS } from './utils/contentLoader';

// ===== 個人資料 =====
export const PROFILE = {
  name: "李奕宏",
  nameEn: "Yi-Hung Lee",
  title: "全職實習心理師",
  school: "臺北市立大學 心理與諮商研究所",
  currentRole: "世新大學諮商中心 全職實習諮商心理師",
  email: "lee2952000@gmail.com",
  philosophy: "活在當下，投入生活。困難會存在，但我們永遠有能力去尋找更多快樂",
  heroTagline: "我是奕宏，喜歡探索科技、創作音樂。在學術與助人工作中發展。"
};
// ===== 經歷（保留原有） =====
export const EXPERIENCE: ExperienceItem[] = [
  { year: "2025 ~", title: "國立臺北教育大學劉彥君教授 研究助理", type:"work"},
  { year: "2024 ~ 2025", title: "好窩心理諮商所 兼職實習諮商心理師", type: "work" },
  { year: "2023 ~ 2025", title: "臺北市立大學劉彥君教授 研究助理", type: "work" },
  { year: "2022", title: "臺北市中正區河堤國小 特教課輔班教師", type: "work" },
  { year: "2021", title: "臺北市信義區興雅國小 實習輔導教師", type: "work" },
  { year: "2020", title: "臺北市立大學游錦雲教授 研究助理", type: "work" },
  { year: "2020", title: "臺北市立大學心理與諮商學系 辦公室行政人員", type: "work" },
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
  { title: "心理劇導演訓練團體", details: "累計時數48小時 UP" },
  { title: "臺北市立大學心理與諮商學系 研究生心理劇訓練團體", details: "第3年" },
  { title: "結構家族治療理論與個案研討會", details: "6小時" },
  { title: "完形治療個案研討會", details: "2.5小時" },
  { title: "黃盛璘老師園藝治療工作坊", details: "3小時" },
];

export const OTHER_SKILLS: SkillItem[] = [
  { category: "多媒體製作", skills: ["影片剪輯 (Sony Vegas)", "網站設計 (基礎 HTML, CSS, JS)", "混音、錄音等音訊處理能力 (Reason, Cubase)"] },
  { category: "AI應用", skills:["AI輔助程式設計", "Gemini Certified Educator - -by Google for Education","AI工具應用（如RAG建置、模型微調、本機模型搭建）"]}
];

// ===== 學術經歷 =====
export const ACADEMIC_EXPERIENCES: AcademicExperienceItem[] = [
  {
    date: "2025-09-13",
    title: "Google 認證AI教育者",
    images: ["assets/about/2025-09-13.webp"]
  },
  {
    date: "2025-08-08",
    title: "北一區大專校院輔諮中心研習",
    images: ["assets/about/2025-08-08.webp"]
  },
  {
    date: "2024-12-13",
    title: "完形治療-個案研討會",
    images: [
      "assets/about/2024-12-13.webp",
      { url: "assets/about/2024-12-13-02.svg", caption: "Pictured with\n曹中瑋老師" }
    ]
  },
  {
    date: "2024-12-07",
    title: "2024團體與個別心理治療年度研討會",
    images: ["assets/about/2024-12-07.webp", "assets/about/2024-12-07-02.webp"],
    portfolioLink: "#/projects/academic/2024-12-07T00:00:00.000Z"
  },
  {
    date: "2024-07-28",
    title: "結構家族治療理論與個案研討會",
    images: ["assets/about/2024-07-28.webp"]
  },
  {
    date: "2024-01-28",
    title: "2024心理劇學會年度研討會",
    images: [
      { url: "assets/about/2024-01-28.webp", caption: "Pictured with Antonina Garcia, EdD" },
      { url: "assets/about/2024-01-28 17-36-05.jpeg", caption: "Pictured with \nDr. Maeda Jun" }
    ]
  },
  {
    date: "2023-11-05",
    title: "2023臺灣遊戲治療年會暨國際研討會",
    images: [
      { url: "assets/about/2023-11-05.webp", caption: "Pictured with \nMs. Paris Goodyear Brown" }
    ]
  },
  {
    date: "2023-10-25",
    title: "心理位移講座",
    images: [
      { url: "assets/about/2023-10-25.webp", caption: "Pictured with \n金樹人老師" }
    ]
  },
  {
    date: "2023-09-12",
    title: "臺北市立大學心理諮商學系111學年度壁報論文發表會",
    images: ["assets/about/2023-09-12.webp"],
    portfolioLink: "#/projects/academic/resilience-scale-2022"
  }
];

// ===== 音樂經歷 =====
export const MUSIC_EXPERIENCES: MusicExperienceItem[] = [
  {
    date: "2024 ~",
    title: "暫緩演出，持續進行純音樂創作",
    images: []
  },
  {
    date: "2023-11-15",
    title: "臺灣遊戲治療年會暨國際研討會開場演出",
    images: ["assets/2023-11-05 18-57-11.jpeg"]
  },
  {
    date: "2023-06-05",
    title: "《結》-洪恩毅畢業專場 特別來賓",
    images: ["assets/2023-06-05 20-19-27.jpeg"]
  },
  {
    date: "2022-11-18",
    title: "臺北市立大學心諮系 系內演出",
    images: ["assets/2022-11-18 18-32-52.jpeg"]
  },
  {
    date: "2021-2023",
    title: "《朔樂團》成團與活躍",
    images: ["assets/2022-04-16 03-29-34.jpeg", "assets/2022-04-16 03-29-35.jpeg"]
  },
  {
    date: "2022-03-18",
    title: "《北市大好聲音》校園歌唱大賽 16強",
    images: ["assets/2022-03-18 18-19-13.jpeg"]
  },
  {
    date: "2022-01-28",
    title: "《臺北市立大學心諮營》營隊閉幕演出",
    images: ["assets/2022-01-28 16-58-07.jpeg"]
  },
  {
    date: "2021-11-26",
    title: "臺北市立大學心諮系 系內演出",
    images: ["assets/2021-11-26 00-11-31.jpeg"]
  },
  {
    date: "2021-03-15",
    title: "臺北市立大學吉他社社內演出",
    images: ["assets/2021-03-15 21-17-08.jpeg"]
  },
  {
    date: "2020-10-17",
    title: "《三系聯合宿營-英雄心攻略》晚會演出",
    images: ["assets/2020-10-17 19-45-17.jpeg"]
  }
];
