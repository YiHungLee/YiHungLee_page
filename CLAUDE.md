# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal professional portfolio website for Lee Yi-hung (李奕宏), a counseling psychology intern. Built with React 19, TypeScript, and Vite. All content is in Traditional Chinese.

## Commands

```bash
# Setup
npm install      # Install dependencies (first time or after package.json changes)

# Development
npm run dev      # Start dev server on http://localhost:3000

# Production
npm run build    # Build to /dist
npm run preview  # Preview production build
```

## Architecture

### Tech Stack
- React 19 + TypeScript + Vite
- TailwindCSS (via CDN with custom forest/olive/cream color theme)
- Lucide React for icons

### Project Structure
**Important:** Files are in the root directory, not in a `src/` folder.

- `App.tsx` - Root component managing page navigation state (home/blog/portfolio)
- `index.tsx` - Entry point that renders App into the DOM
- `constants.ts` - All content data (profile, experience, blog posts, portfolio items)
- `types.ts` - TypeScript interfaces for all data structures
- `components/` - React functional components for each section
  - `Navigation.tsx` - Top navigation bar
  - `Hero.tsx`, `Philosophy.tsx`, `Resume.tsx`, `Training.tsx` - Home page sections
  - `Blog.tsx` - Blog list and single post views with custom markdown renderer
  - `Portfolio.tsx` - Portfolio items categorized by type (poster/code/music)
  - `Section.tsx` - Reusable wrapper component for consistent section styling
  - `Footer.tsx` - Site footer with contact information

### Navigation Pattern
Single Page Application with state-based routing:
- Three pages: `home`, `blog`, `portfolio`
- Home page sections: Hero, Philosophy, Resume, Training
- No external routing library - navigation handled via `currentPage` state in App.tsx

### Data Flow
- All content centralized in `constants.ts`
- Types defined in `types.ts` with interfaces: `ExperienceItem`, `BlogPost`, `PortfolioItem`, `NavItem`, `SkillItem`, `TrainingItem`
- Components receive data via props

### Component Patterns
- Functional components with React hooks (`useState`, `useEffect`)
- `Section` wrapper component for consistent styling
- Blog uses custom markdown renderer (`SimpleMarkdown` component in `Blog.tsx`)
  - Supports: headers (h1-h3), bold text (`**text**`), lists (unordered/ordered), paragraphs
  - No external markdown library - keeps bundle size small
- Portfolio categorized into: poster, code, music
  - Music items include audio playback functionality
  - Code items display tech stack and links

### Custom Theme Colors
- `forest-800/600/50` - Primary greens
- `olive-600/500/100` - Accent highlights
- `cream-50/100/200` - Background colors
- `camel-400/500/50` - Borders and active states

## Key Files

- `vite.config.ts` - Dev server config (port 3000, host 0.0.0.0), path alias `@` to root
- `.env.local` - Contains environment variables (e.g., `VITE_WORKER_URL` for contact form)
- `index.html` - TailwindCSS CDN config with custom theme colors, Google Fonts (Noto Sans/Serif TC), importmap for React 19
- `tsconfig.json` - TypeScript config with path alias support

## Deployment

Automated deployment via GitHub Actions to Cloudflare Pages on push to `main` branch.

### GitHub Secrets Required
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Pages edit permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

### GitHub Variables Required
- `CLOUDFLARE_PROJECT_NAME` - Cloudflare Pages project name

### Workflow
- Located at `.github/workflows/deploy.yml`
- Triggers on push to `main` or manual dispatch
- Builds with Node.js 20, deploys `/dist` to Cloudflare Pages

## Content Language

All user-facing content is in Traditional Chinese. Maintain this convention for any new content additions.
