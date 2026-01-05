# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal professional portfolio website for Lee Yi-hung (李奕宏), a counseling psychology intern. Built with React 19, TypeScript, Vite, and React Router. All content is in Traditional Chinese.

## Commands

```bash
# Setup
npm install      # Install dependencies (first time or after package.json changes)

# Development
npm run dev      # Start dev server on http://localhost:3000

# Production
npm run build    # Build to /dist + generate RSS feed
npm run preview  # Preview production build
```

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.1 | UI framework |
| TypeScript | ~5.8.2 | Type safety |
| Vite | 6.2.0 | Build tool |
| React Router DOM | 7.9.6 | Client-side routing |
| Tailwind CSS | CDN | Styling (with custom theme) |
| Lucide React | 0.554.0 | Icons |
| gray-matter | 4.0.3 | Markdown frontmatter parsing |
| marked | 17.0.1 | Markdown to HTML |
| feed | 5.1.0 | RSS feed generation |

## Project Structure

**Important:** Core files are in the root directory, not in a `src/` folder.

```
├── App.tsx                 # Root component with React Router
├── index.tsx               # Entry point
├── types.ts                # TypeScript type definitions
├── constants.ts            # Static data (profile, experiences, etc.)
├── styles.css              # Global styles
├── vite.config.ts          # Vite configuration
├── components/
│   ├── Navigation.tsx      # Top navigation bar (responsive, dark mode toggle)
│   ├── Footer.tsx          # Site footer with contact info
│   ├── PowerSwitchToggle.tsx   # Dark/light mode toggle switch
│   ├── InteractiveAvatar.tsx   # Interactive profile avatar
│   ├── layout/
│   │   ├── ThemeProvider.tsx   # Theme context provider
│   │   └── ScrollToTop.tsx     # Scroll to top button
│   ├── pages/
│   │   ├── HomePage.tsx            # Home page
│   │   ├── AboutPage.tsx           # About page (academic & music experiences)
│   │   ├── ContactPage.tsx         # Contact page
│   │   ├── ProjectsPage.tsx        # Projects overview
│   │   ├── ProjectCategoryPage.tsx # Category-filtered projects
│   │   ├── ProjectDetailPage.tsx   # Single project detail
│   │   ├── BlogListPage.tsx        # Blog listing
│   │   └── BlogPostPage.tsx        # Single blog post
│   ├── home/
│   │   ├── HeroNew.tsx             # Hero section
│   │   ├── IdentityGateway.tsx     # Identity gateway component
│   │   ├── LatestPosts.tsx         # Latest blog posts preview
│   │   └── FeaturedProjects.tsx    # Featured projects showcase
│   ├── contact/
│   │   ├── HeroSection.tsx         # Contact hero section
│   │   ├── ContactForm.tsx         # Contact form
│   │   ├── ScrollTextSection.tsx   # Scrolling text section
│   │   └── TransitionSection.tsx   # Transition animation section
│   ├── music/
│   │   └── MusicPlayer.tsx         # Audio player (multi-track support)
│   └── shared/
│       ├── MarkdownRenderer.tsx    # Custom Markdown renderer
│       ├── UtterancesComments.tsx  # Utterances comment system
│       └── UtterancesCallback.tsx  # Utterances callback handler
├── plugins/
│   └── vite-plugin-markdown.ts     # Custom Vite plugin for Markdown loading
├── utils/
│   ├── contentLoader.ts            # Content loading utilities
│   └── featured.ts                 # Featured items filtering
├── scripts/
│   ├── generate-rss.ts             # RSS feed generation script
│   └── convertToMarkdown.ts        # Markdown conversion utility
└── public/
    ├── content/
    │   ├── blog/                   # Blog post Markdown files
    │   └── portfolio/              # Portfolio item Markdown files
    ├── assets/                     # Images and media
    ├── robots.txt
    ├── sitemap.xml
    └── _redirects                  # Cloudflare redirects
```

## Routing

Uses React Router DOM for client-side routing:

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Home page |
| `/about` | AboutPage | About page with experiences |
| `/contact` | ContactPage | Contact form |
| `/projects` | ProjectsPage | All projects overview |
| `/projects/:category` | ProjectCategoryPage | Filtered by category (academic/coding/music) |
| `/projects/:category/:projectId` | ProjectDetailPage | Single project detail |
| `/blog` | BlogListPage | Blog post listing |
| `/blog/:postId` | BlogPostPage | Single blog post |

Navigation menu: 首頁 → 關於 → 作品 → Blog → 聯絡

## Content Management

### Markdown File System

Content is managed through Markdown files with YAML frontmatter:

- **Blog posts:** `public/content/blog/*.md`
- **Portfolio items:** `public/content/portfolio/*.md`

### Frontmatter Format

**Blog Post:**
```yaml
---
id: 2025-12-06
title: 文章標題
date: 2025-12-06
category: professional  # professional | creative | casual
summary: 簡短摘要
tags: [標籤1, 標籤2]
featured: true
readTime: 5
---
```

**Portfolio Item:**
```yaml
---
id: project-id
title: 作品標題
description: 作品描述
category: academic  # academic | coding | music
type: research      # research | publication | tool | app | composition
date: 2025-12-06
featured: true
technologies: [React, TypeScript]
links:
  demo: https://example.com
  github: https://github.com/...
---
```

### Vite Plugin

The custom plugin (`plugins/vite-plugin-markdown.ts`) automatically:
1. Reads Markdown files from `public/content/blog/` and `public/content/portfolio/`
2. Parses frontmatter with `gray-matter`
3. Exports `BLOG_POSTS` and `PORTFOLIO_ITEMS` via virtual module `virtual:content`

## Theme System

### Color Palette

**Light Mode:**
- **Charcoal** (900-600): Primary text colors
- **Warm Cream** (50-400): Background colors
- **Ochre** (300-700): Accent highlights
- **Sage** (300-600): Secondary accents
- **Rust** (300-600): Tertiary accents

**Dark Mode:**
- Background: `#2a2826` (primary), `#35322f` (cards)
- Text: `#e8e3db` (primary), `#b8b0a6` (secondary)
- Border: `#44413d`

### Theme Persistence

Theme preference is stored in `localStorage` and managed by `ThemeProvider.tsx`.

## Features

- **Dark/Light Mode:** Toggle switch with system preference detection
- **RSS Feed:** Auto-generated at build time (`scripts/generate-rss.ts`)
- **Utterances Comments:** GitHub-based commenting on blog posts
- **Music Player:** Multi-track audio player with Cloudflare R2 storage
- **Responsive Design:** Mobile-first with responsive navigation
- **Smooth Animations:** Fade-in, slide, and floating effects
- **SEO:** Meta tags, sitemap.xml, robots.txt

## TypeScript Types

Key types defined in `types.ts`:

| Type | Description |
|------|-------------|
| `ThemeMode` | `'light' \| 'dark'` |
| `PageType` | `'professional' \| 'creative'` |
| `ProjectCategory` | `'academic' \| 'coding' \| 'music'` |
| `ProjectType` | `'research' \| 'publication' \| 'tool' \| 'app' \| 'composition'` |
| `BlogPost` | Blog post structure (id, title, date, content, tags, etc.) |
| `PortfolioItem` | Portfolio item structure |
| `ExperienceItem` | Work/award/education experience |
| `TrainingItem` | Training course record |
| `MusicTrack` | Audio track (id, title, audioUrl, duration) |
| `AcademicExperienceItem` | Academic conference experience |
| `MusicExperienceItem` | Music performance experience |

## Key Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Dev server (port 3000), path alias `@`, custom Markdown plugin |
| `index.html` | Tailwind CDN, Google Fonts, React 19 importmap |
| `.env.local` | Environment variables (`VITE_WORKER_URL` for contact form) |
| `plugins/vite-plugin-markdown.ts` | Auto-loads Markdown content |
| `scripts/generate-rss.ts` | Generates RSS feed during build |
| `constants.ts` | Static profile data, experiences, skills |

## Deployment

Automated deployment via GitHub Actions to Cloudflare Pages.

### Triggers
- Push to `main` branch
- Scheduled: Daily at UTC 16:01 (Taiwan 00:01)
- Manual: `workflow_dispatch`

### GitHub Secrets Required
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Pages edit permissions
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID

### GitHub Variables Required
- `CLOUDFLARE_PROJECT_NAME` - Cloudflare Pages project name

### Workflows
- `.github/workflows/deploy.yml` - Main Pages deployment
- `.github/workflows/deploy-worker.yml` - Worker deployment (contact form backend)

## Content Language

All user-facing content is in Traditional Chinese. Maintain this convention for any new content additions.
