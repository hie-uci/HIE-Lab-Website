# AGENTS.md — HIE Lab Website Project Guide

> **This file is for AI agents (Hermes, Claude, Copilot, Cursor, etc.) working on this project.**
> Read this file first to understand the project state, architecture, and conventions.

---

## Project Status (as of April 28, 2026)

**Status:** ✅ LIVE — deployed and serving at https://hie-uci.github.io

**Pending:** DNS redirect from hie.eng.uci.edu → hie-uci.github.io (waiting on OIT, Dan from Engineering IT handling)

---

## Quick Reference

| Item | Value |
|------|-------|
| Project path | `/Users/allenhuang/Desktop/Allen_main/HIE_webcite` |
| GitHub org | `hie-uci` (account: allenh12@uci.edu) |
| Live URL | https://hie-uci.github.io |
| Old URL | https://hie.eng.uci.edu (WordPress, being retired) |
| Main repo | https://github.com/hie-uci/hie-uci.github.io |
| Backup repo | https://github.com/hie-uci/HIE-Lab-Website |
| PI | Prof. Hamidreza Aghasi (haghasi@uci.edu) |
| Built by | Allen Huang (Yilun Huang), PhD student |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Rendering:** Static Export (`output: "export"` in next.config.ts)
- **React:** 19.2.3
- **Styling:** Tailwind CSS 4 (via @tailwindcss/postcss)
- **Animations:** Framer Motion 12
- **Language:** TypeScript 5
- **Icons:** @heroicons/react 2
- **Hosting:** GitHub Pages (free, no server needed)
- **CI/CD:** GitHub Actions (auto-deploy on push to `main`)

---

## Architecture

```
src/
├── app/                          # Next.js App Router (file-based routing)
│   ├── layout.tsx                # Root layout: Navbar + Footer + ScrollToTop
│   ├── page.tsx                  # HOMEPAGE (724 lines) — Hero, About, Chips, Research, News, Publications, Positions
│   ├── globals.css               # Global styles, Tailwind theme, custom animations
│   ├── research/page.tsx         # Research highlights (5 thrust areas)
│   ├── publications/page.tsx     # 64 publications with search + filter tabs
│   ├── team/page.tsx             # PI, PhD students, undergrads, alumni
│   ├── chip-gallery/page.tsx     # Full chip photo gallery with lightbox
│   ├── news/page.tsx             # 33 news items (2019-2025) with timeline + filter
│   ├── teaching/page.tsx         # Courses taught by Prof. Aghasi
│   ├── contact/page.tsx          # Contact form + lab info
│   └── available-positions/page.tsx  # Open positions
│
├── components/                   # Reusable UI components
│   ├── Navbar.tsx                # Sticky nav: active page indicator + scroll progress bar
│   ├── Footer.tsx                # Multi-column footer with links
│   ├── ChipMarquee.tsx           # Two-row auto-scrolling chip gallery with lightbox
│   ├── Lightbox.tsx              # Click-to-zoom image viewer (ESC to close)
│   ├── ParticleField.tsx         # Canvas-based particle network (Hero background)
│   ├── CircuitBackground.tsx     # SVG circuit board pattern with mouse tracking
│   ├── GradientMesh.tsx          # Animated gradient blobs
│   ├── AnimatedResearchIcon.tsx  # Research area animated icons
│   ├── WaveformDivider.tsx       # Wave-shaped section divider
│   ├── SectionHeader.tsx         # Reusable section header (badge + title + subtitle)
│   ├── ScrollToTop.tsx           # Back-to-top button
│   └── PageWrapper.tsx           # Page transition wrapper
│
└── lib/
    └── basePath.ts               # (unused — basePath removed for root domain deploy)

public/
└── images/
    ├── logo/hie-logo.png         # Lab logo
    ├── chips/individual/         # 14 chip die photos
    ├── members/                  # Team member photos (PI, PhD, undergrads, alumni)
    ├── research/                 # Research area images (radar, THz, siggen, AI, device)
    └── teaching/                 # University logos
```

---

## Key Configuration

### next.config.ts
```typescript
const nextConfig: NextConfig = {
  output: "export",        // Static HTML export (no server needed)
  images: {
    unoptimized: true,     // Required for GitHub Pages (no image optimization API)
  },
  // NO basePath — deploying to root domain hie-uci.github.io
};
```

### Deployment Workflow (.github/workflows/deploy.yml)
- Triggers on push to `main`
- Runs `npm ci` → `npm run build` → uploads `out/` to GitHub Pages
- Build time: ~35 seconds
- Deploy time: ~8 seconds

---

## Content Data Locations

| Content | File | How to Update |
|---------|------|---------------|
| Homepage news | `src/app/page.tsx` → `newsItems` array | Add `{ date, text, tag }` objects |
| Research areas | `src/app/page.tsx` → `researchAreas` array | Add objects with title, description, iconVariant, gradient |
| Publications | `src/app/publications/page.tsx` → `publications` array | Add `{ authors, title, venue, year, type, link }` |
| News timeline | `src/app/news/page.tsx` → `newsItems` array | Add `{ date, month, year, title, category }` |
| Team members | `src/app/team/page.tsx` → `phdStudents`, `undergradResearchers`, etc. | Add Member/Alumnus objects |
| PI info | `src/app/team/page.tsx` → `director` object | Edit name, title, email, education, achievements |
| Chip photos | `src/components/ChipMarquee.tsx` + `src/app/chip-gallery/page.tsx` | Add image paths to arrays |
| Images | `public/images/` | Place files in appropriate subdirectory |

---

## Design System

### Colors (UCI Brand)
```
uci-blue:     #0064a4   (primary blue)
eng-blue:     #00386d   (dark blue, headings)
navy:         #203043   (darkest blue)
uci-gold:     #ffd200   (accent gold)
eng-gold:     #f5a90f   (secondary gold)
eecs-teal:    #528188   (teal accent)
slate-warm:   #f8f9fc   (light background)
```

### Typography
- Font: Geist Sans (headings), Geist Mono (code)
- H1/H2: `letter-spacing: -0.03em`, `line-height: 1.1`
- H3: `letter-spacing: -0.02em`
- Hero heading: `font-semibold` (600), `tracking: -0.04em`
- Body: `font-normal` (400)

### Animations
- Scroll progress bar: gradient (blue → gold → teal) at top of page
- Active nav indicator: animated underline with `layoutId`
- Card hover: `translateY(-6px)` + dual shadow, `cubic-bezier(0.22, 1, 0.36, 1)`
- Glass morphism: `backdrop-filter: blur(16px) saturate(180%)`
- Chip gallery: two-row marquee, hover to pause, click for lightbox
- Hero: particle field + circuit background + gradient mesh

---

## Publications Data

Synced from old website (hie.eng.uci.edu/publications/) on April 28, 2026.

**Counts:**
- Journal publications: 23 (2011–2026)
- Conference publications: 22 (2011–2026)
- Patents: 2 (2022, 2025)
- Invited talks: 17 (2016–2025)
- **Total: 64 entries**

**Data is the source of truth for the old website.** To update, edit `publications` array in `src/app/publications/page.tsx`.

---

## How to Deploy

🚨 **CRITICAL DEPLOYMENT WARNING (origin vs pages)** 🚨
This local project is connected to TWO remote repositories:
1. `origin` -> `HIE-Lab-Website` (Stores the source code)
2. `pages` -> `hie-uci.github.io` (The actual LIVE website that triggers the deployment Action)

A standard `git push` or `git push origin main` will **ONLY update the source code** but will **NOT update the live website**. To deploy changes to the live site, you **MUST** push to the `pages` remote.

```bash
# Local development
npm install
npm run dev          # → http://localhost:3000

# Build & test locally
npm run build
npx serve out        # → http://localhost:3000

# Deploy (MUST run BOTH commands to update source AND live site)
git add -A
git commit -m "your message"
git push origin main   # 1. Saves source code to HIE-Lab-Website repo
git push pages main    # 2. 🚨 CRITICAL: Triggers build + deploy to live hie-uci.github.io
```

---

## Common Pitfalls

1. **Images not loading?** — Check that image paths use `/images/...` (not `/HIE-Lab-Website/images/...`). We removed basePath.
2. **Build fails?** — Run `npm run build` locally first. Check TypeScript errors.
3. **Changes not showing?** — GitHub Actions takes ~45 seconds. Check https://github.com/hie-uci/hie-uci.github.io/actions
4. **Adding new pages?** — Create `src/app/your-page/page.tsx` (folder name = URL path). Add to `navLinks` in Navbar.tsx.
5. **Image component issues?** — With `output: "export"`, always use `unoptimized` prop on `<Image>`.

---

## Pending Tasks

- [ ] DNS redirect: hie.eng.uci.edu → hie-uci.github.io (OIT processing)
- [ ] Replace placeholder team photos with real lab photos
- [ ] Add research result images (simulation plots, measurement data)
- [ ] Add Google Maps embed to Contact page
- [ ] Optional: citation counts via Semantic Scholar API
- [ ] Optional: chip specification tables in Chip Gallery

---

## Changelog

### April 28, 2026
- Migrated from WordPress (hie.eng.uci.edu) to Next.js + GitHub Pages
- Created org repo hie-uci/hie-uci.github.io for root domain deployment
- Synced 64 publications from old website
- Added 33 news items (2019-2025)
- Implemented: scroll progress bar, active nav indicator, chip lightbox, particle field
- Enhanced: research cards (numbered badges, gradient glow), team cards (larger avatars, gradient accents)
- UI polish: tighter heading tracking, refined glass morphism, improved card hover easing
- PI homepage intro rewritten (concise, achievement-focused)

---

*Last updated: April 28, 2026*
