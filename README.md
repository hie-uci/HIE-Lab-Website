# HIE Lab Website

**High-speed Integrated Electronics Laboratory — UC Irvine**

🌐 **Live site:** https://hie-uci.github.io

📧 **Contact:** Prof. Hamidreza Aghasi (haghasi@uci.edu)

---

## About

This is the official website for the HIE Lab at UC Irvine, led by Prof. Hamidreza Aghasi. The lab specializes in mm-wave and terahertz integrated circuit design, AI-driven analog design, and emerging device technologies.

The site was migrated from the old UCI WordPress platform (hie.eng.uci.edu) to a custom Next.js application in April 2026.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npx serve out
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Static Export) |
| UI | React 19 + TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion 12 |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

---

## Project Structure

```
src/
├── app/                    # Pages (file-based routing)
│   ├── page.tsx           # Homepage
│   ├── research/          # Research highlights
│   ├── publications/      # 64 publications with search & filter
│   ├── team/              # Team members
│   ├── chip-gallery/      # Chip photo gallery
│   ├── news/              # Lab news timeline
│   ├── teaching/          # Courses
│   ├── contact/           # Contact info
│   └── available-positions/  # Open positions
├── components/            # Reusable UI components
│   ├── Navbar.tsx         # Navigation with active indicator
│   ├── ChipMarquee.tsx    # Chip gallery with lightbox
│   ├── Lightbox.tsx       # Image zoom viewer
│   ├── ParticleField.tsx  # Hero particle animation
│   └── ...                # 10+ more components
public/
└── images/                # Static images (chips, members, research, logos)
```

---

## How to Update Content

### Add a publication
Edit `src/app/publications/page.tsx`, add to the `publications` array:
```typescript
{ authors: 'A, B, C', title: 'Paper Title', venue: 'IEEE JSSC', year: 2026, type: 'journal', link: 'https://...' }
```

### Add news
Edit `src/app/page.tsx` (homepage) and/or `src/app/news/page.tsx` (full timeline).

### Add a team member
Edit `src/app/team/page.tsx`, add to `phdStudents`, `undergradResearchers`, or alumni arrays.

### Add chip photos
Place images in `public/images/chips/individual/`, then add paths to `ChipMarquee.tsx` and `chip-gallery/page.tsx`.

---

## Deployment

Deployment is automatic via GitHub Actions:
1. Push to `main` branch
2. GitHub Actions builds the site (~35s)
3. Deploys to GitHub Pages (~8s)
4. Site updates at https://hie-uci.github.io

Two repos are kept in sync:
- `hie-uci/hie-uci.github.io` (primary — serves the site)
- `hie-uci/HIE-Lab-Website` (backup)

---

## Content Summary

| Section | Count | Source |
|---------|-------|--------|
| Publications | 64 | Synced from hie.eng.uci.edu (April 2026) |
| News items | 33 | Collected from old website (2019-2025) |
| Research areas | 5 | mm-Wave Radars, THz Power, Signal Gen, AI+RF, Emerging Devices |
| Team members | 18 | PI + 6 PhD + 2 undergrad + 3 PhD alumni + 9 other alumni |
| Chip photos | 14 | Fabricated IC die photos |

---

## Design Features

- 🎨 UCI brand colors (navy blue, gold, teal)
- ✨ Particle field animation in Hero section
- 📊 Scroll progress bar (gradient: blue → gold → teal)
- 🎯 Active page indicator in navigation
- 🔍 Chip gallery with click-to-zoom lightbox
- 🃏 Glass morphism cards with refined hover effects
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Static export — fast loading, no server needed

---

## For AI Agents

See [AGENTS.md](./AGENTS.md) for detailed project guide, architecture, conventions, and pending tasks.

---

*Last updated: April 28, 2026*
