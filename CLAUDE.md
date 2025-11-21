# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal professional portfolio website for Lee Yi-hung (李奕宏), a counseling psychology intern. Built with React 19, TypeScript, and Vite. All content is in Traditional Chinese.

## Commands

```bash
# Development
npm run dev      # Start dev server on port 3000

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
- `App.tsx` - Root component managing page navigation state (home/blog/portfolio)
- `constants.ts` - All content data (profile, experience, blog posts, portfolio items)
- `types.ts` - TypeScript interfaces for all data structures
- `components/` - React functional components for each section

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
- Blog uses custom markdown renderer (handles headers, lists, bold text)
- Portfolio categorized into: poster, code, music

### Custom Theme Colors
- `forest-800/600/50` - Primary greens
- `olive-600/500/100` - Accent highlights
- `cream-50/100/200` - Background colors
- `camel-400/500/50` - Borders and active states

## Key Files

- `vite.config.ts` - Dev server config, path alias `@` to root, Gemini API key setup
- `.env.local` - Contains `GEMINI_API_KEY` placeholder (configured but not currently used)
- `index.html` - TailwindCSS CDN and Google Fonts (Noto Sans/Serif TC)

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
