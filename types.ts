export interface ExperienceItem {
  year: string;
  title: string;
  description?: string;
  type: 'work' | 'award' | 'education';
}

export interface SkillItem {
  category: string;
  skills: string[];
}

export interface TrainingItem {
  title: string;
  details?: string;
}

export interface NavItem {
  label: string;
  href: string;
  type: 'section' | 'page';
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  tags: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'poster' | 'code' | 'music';
  description: string;
  imageUrl?: string;
  link?: string; // For code repositories or external links
  techStack?: string[]; // For code projects
  audioUrl?: string; // For music playback
  year?: string;
}
