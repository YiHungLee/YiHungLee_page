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
npm run build    # vite build + RSS feed + SEO prerendering + sitemap + llms.txt
npm run preview  # Preview production build
```

Note: `npm run build` does NOT run TypeScript type checking. Run `npx tsc --noEmit` to type-check.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.1 | UI framework |
| TypeScript | ~5.8.2 | Type safety |
| Vite | 6.2.0 | Build tool |
| React Router DOM | 7.9.6 | Client-side routing |
| Tailwind CSS | 3.4.x | Styling, compiled at build time via PostCSS (custom theme in `tailwind.config.js`) |
| Lucide React | 0.554.0 | Icons (primary) |
| @phosphor-icons/react | 2.1.x | Icons (used in `MobileHero.tsx`) |
| gray-matter | 4.0.3 | Markdown frontmatter parsing |
| marked | 17.0.1 | Markdown to HTML |
| feed | 5.1.0 | RSS feed generation (devDependency, build-time only) |
| tsx | 4.x | Runs build-time TypeScript scripts |
| sharp / png-to-ico | - | Favicon generation (`scripts/generate-favicon.ts`) |

## Project Structure

**Important:** Core files are in the root directory, not in a `src/` folder.

```
├── App.tsx                 # Root component with React Router
├── index.tsx               # Entry point
├── types.ts                # TypeScript type definitions
├── constants.ts            # Static data (profile, experiences, etc.)
├── styles.css              # Global styles (Tailwind directives + custom CSS)
├── tailwind.config.js      # Tailwind custom theme (colors, fonts, animations)
├── postcss.config.js       # PostCSS config (Tailwind + Autoprefixer)
├── vite.config.ts          # Vite configuration
├── vite-env.d.ts           # Type declarations for virtual:content module
├── components/
│   ├── Navigation.tsx      # Top navigation bar (responsive, dark mode toggle)
│   ├── Footer.tsx          # Site footer with contact info
│   ├── PowerSwitchToggle.tsx   # Dark/light mode toggle switch
│   ├── InteractiveAvatar.tsx   # Interactive profile avatar
│   ├── layout/
│   │   ├── ThemeContext.ts     # Theme context definition + useTheme hook
│   │   ├── ThemeProvider.tsx   # Theme context provider
│   │   └── ScrollToTop.tsx     # Scroll to top on route change
│   ├── pages/
│   │   ├── HomePage.tsx            # Home page
│   │   ├── AboutPage.tsx           # About page (academic & music experiences)
│   │   ├── ContactPage.tsx         # Contact page
│   │   ├── ProjectsPage.tsx        # Projects overview
│   │   ├── ProjectCategoryPage.tsx # Category-filtered projects
│   │   ├── ProjectDetailPage.tsx   # Single project detail
│   │   ├── BlogListPage.tsx        # Blog listing (search, category filter, pagination)
│   │   └── BlogPostPage.tsx        # Single blog post
│   ├── home/
│   │   ├── HeroNew.tsx             # Hero section (desktop)
│   │   ├── MobileHero.tsx          # Hero section (mobile)
│   │   ├── IdentityGateway.tsx     # Identity gateway component
│   │   ├── LatestPosts.tsx         # Latest blog posts preview
│   │   └── FeaturedProjects.tsx    # Featured projects showcase
│   ├── contact/
│   │   ├── HeroSection.tsx         # Contact hero section
│   │   ├── ContactForm.tsx         # Contact form (posts to Cloudflare Worker)
│   │   ├── ScrollTextSection.tsx   # Scrolling text section
│   │   └── TransitionSection.tsx   # Transition animation section
│   ├── music/
│   │   └── MusicPlayer.tsx         # Audio player (multi-track support)
│   └── shared/
│       ├── MarkdownRenderer.tsx    # Custom Markdown renderer
│       ├── StructuredData.tsx      # JSON-LD structured data for SEO
│       ├── EmailOctopusForm.tsx    # Newsletter subscription form
│       ├── UtterancesComments.tsx  # Utterances comment system
│       └── UtterancesCallback.tsx  # Utterances OAuth callback handler
├── plugins/
│   └── vite-plugin-markdown.ts     # Custom Vite plugin for Markdown loading
├── utils/
│   ├── contentLoader.ts            # Re-exports BLOG_POSTS / PORTFOLIO_ITEMS from virtual:content
│   └── featured.ts                 # Featured/published filtering, date formatting
├── scripts/                        # Build-time scripts (run with tsx)
│   ├── generate-rss.ts             # RSS feed generation (dist/feed.xml)
│   ├── prerender.ts                # SEO prerendering (static HTML per route)
│   ├── generate-sitemap.ts         # Sitemap generation (dist/sitemap.xml)
│   ├── generate-llms-txt.ts        # llms.txt / llms-full.txt generation
│   ├── generate-favicon.ts         # Favicon generation from source image
│   ├── convertToMarkdown.ts        # One-off Markdown conversion utility
│   └── utils/
│       ├── route-collector.ts      # Collects all routes (static + blog + portfolio)
│       ├── meta-generator.ts       # Per-route SEO meta tags
│       ├── jsonld-generator.ts     # Per-route JSON-LD schemas
│       └── body-renderer.ts        # Prerendered HTML body for each route
└── public/
    ├── content/
    │   ├── blog/                   # Blog post Markdown files
    │   └── portfolio/              # Portfolio item Markdown files
    ├── assets/                     # Images and media
    ├── robots.txt
    └── _redirects                  # Cloudflare redirects
```

## Routing

Uses React Router DOM for client-side routing (defined in `App.tsx`):

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
| `*` | - | Redirects to `/` |

Navigation menu: 首頁 → 關於 → 作品 → Blog → 聯絡

**Note:** The prerender scripts (`scripts/utils/route-collector.ts`) and sitemap also list a `/bio` route that has no matching React route in `App.tsx`. Keep these two route lists in sync when adding or removing pages.

## Content Management

### Markdown File System

Content is managed through Markdown files with YAML frontmatter:

- **Blog posts:** `public/content/blog/*.md`
- **Portfolio items:** `public/content/portfolio/*.md`

Files prefixed with `_` are treated as drafts and excluded everywhere.

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
3. Exports `BLOG_POSTS` and `PORTFOLIO_ITEMS` via virtual module `virtual:content` (typed in `vite-env.d.ts`)

Note: the plugin has no HMR support — restart the dev server after editing Markdown files.

### Scheduled Publishing

Posts with a future `date` are filtered out of the UI, RSS, prerendered pages, and sitemap until that date (compared against Taiwan time, UTC+8, in build scripts). The daily scheduled GitHub Actions deploy (Taiwan 00:01) rebuilds the site so future-dated posts go live automatically on their publish date.

## Build Pipeline

`npm run build` runs these steps in order:

1. `vite build` — bundle the SPA into `dist/`
2. `tsx scripts/generate-rss.ts` — generate `dist/feed.xml` (published posts only)
3. `tsx scripts/prerender.ts` — write a static `index.html` per route into `dist/` with route-specific `<title>`, SEO meta tags (between `SEO_META_START`/`SEO_META_END` markers in `index.html`), JSON-LD, and prerendered body content injected into `#root` (replaced by React on hydration)
4. `tsx scripts/generate-sitemap.ts` — generate `dist/sitemap.xml`
5. `tsx scripts/generate-llms-txt.ts` — generate `dist/llms.txt` and `dist/llms-full.txt`

## Theme System

### Color Palette

Defined in `tailwind.config.js` (dark mode uses the `class` strategy).

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

Theme preference is stored in `localStorage` (`theme-mode`, `theme-manually-set`) and managed by `ThemeProvider.tsx`. If the user never toggled manually, the site follows the system preference. An inline script in `index.html` applies the theme before React loads to prevent a flash of the wrong theme.

## Features

- **Dark/Light Mode:** Toggle switch with system preference detection
- **SEO Prerendering:** Static HTML per route at build time (`scripts/prerender.ts`)
- **RSS Feed:** Auto-generated at build time (`scripts/generate-rss.ts`)
- **llms.txt:** AI-readable site summary generated at build time
- **Scheduled Publishing:** Future-dated posts auto-publish via daily scheduled deploy
- **Utterances Comments:** GitHub-based commenting on blog posts
- **Newsletter:** EmailOctopus subscription form (BlogListPage, BlogPostPage)
- **Music Player:** Multi-track audio player with Cloudflare R2 storage
- **Responsive Design:** Mobile-first with responsive navigation
- **Smooth Animations:** Fade-in, slide, and floating effects
- **SEO:** Meta tags, sitemap.xml, robots.txt, structured data (JSON-LD)

## Structured Data (JSON-LD)

The site uses Schema.org structured data for SEO, managed by `components/shared/StructuredData.tsx` (client-side) and `scripts/utils/jsonld-generator.ts` (prerendered).

### Static Schema (index.html)
- **WebSite** - Site metadata
- **Person** - Author information
- **ProfilePage** - About page reference

### Dynamic Schema (StructuredData component)
| Type | Page | Description |
|------|------|-------------|
| `article` | BlogPostPage | BlogPosting schema for blog posts |
| `portfolio` | ProjectDetailPage | MusicComposition / SoftwareApplication / ScholarlyArticle |
| `breadcrumb` | BlogPostPage, ProjectDetailPage | BreadcrumbList navigation |
| `blogList` | BlogListPage | CollectionPage + ItemList for blog listing |
| `portfolioList` | ProjectsPage, ProjectCategoryPage | CollectionPage + ItemList for portfolio |
| `about` | AboutPage | Person + EducationalOccupationalCredential + Organization |

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
| `index.html` | SEO meta tags (with prerender markers), JSON-LD, Google Fonts, theme FOUC-prevention script |
| `tailwind.config.js` | Custom theme: colors, fonts, animations |
| `.env.local` | Environment variables (`VITE_WORKER_URL` for contact form) |
| `plugins/vite-plugin-markdown.ts` | Auto-loads Markdown content |
| `scripts/prerender.ts` | SEO prerendering during build |
| `scripts/generate-rss.ts` | Generates RSS feed during build |
| `constants.ts` | Static profile data, experiences, skills |

## Deployment

Automated deployment via GitHub Actions to Cloudflare Pages.

### Triggers
- Push to `main` branch
- Scheduled: Daily at UTC 16:01 (Taiwan 00:01) — enables scheduled publishing of future-dated posts
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
