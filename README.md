# HIE Lab Website

**High-speed Integrated Electronics Laboratory — UC Irvine**

Live site: **https://hie-uci.github.io** (pending DNS redirect from hie.eng.uci.edu)

---

## Project Overview

This is the official website for the HIE Lab at UC Irvine, led by Prof. Hamidreza Aghasi. The lab specializes in mm-wave and terahertz integrated circuit design, AI-driven analog design, and emerging device technologies.

**Tech Stack:**
- Next.js 16 (App Router, Static Export)
- React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion (animations)
- GitHub Pages (hosting)
- GitHub Actions (CI/CD)

---

## Repository Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Homepage (Hero, About, Chips, Research, News)
│   │   ├── layout.tsx         # Root layout (Navbar, Footer, ScrollToTop)
│   │   ├── globals.css        # Global styles, Tailwind config, custom animations
│   │   ├── research/          # 5 research thrust detail pages
│   │   ├── publications/      # 64 publications with search & filter
│   │   ├── team/              # PI, PhD students, undergrads, alumni
│   │   ├── chip-gallery/      # Full chip die photo gallery
│   │   ├── news/              # Lab news and achievements
│   │   ├── teaching/          # Courses taught by Prof. Aghasi
│   │   ├── contact/           # Contact form and lab info
│   │   └── available-positions/ # Open positions
│   └── components/            # Reusable UI components
│       ├── Navbar.tsx         # Sticky nav with active indicator + scroll progress bar
│       ├── Footer.tsx         # Multi-column footer
│       ├── ChipMarquee.tsx    # Auto-scrolling chip gallery with lightbox
│       ├── Lightbox.tsx       # Click-to-zoom image viewer
│       ├── ParticleField.tsx  # Animated particle network (Hero background)
│       ├── CircuitBackground.tsx # SVG circuit board pattern
│       ├── GradientMesh.tsx   # Animated gradient blobs
│       ├── AnimatedResearchIcon.tsx # Research area icons
│       ├── WaveformDivider.tsx # Wave-shaped section divider
│       ├── SectionHeader.tsx  # Reusable section header
│       ├── ScrollToTop.tsx    # Back-to-top button
│       └── PageWrapper.tsx    # Page transition wrapper
├── public/
│   └── images/                # Static images
│       ├── chips/individual/  # 14 chip die photos
│       ├── members/           # Team member photos
│       ├── research/          # Research area images
│       ├── logo/              # HIE Lab logo
│       └── teaching/          # University logos
├── .github/workflows/
│   └── deploy.yml             # GitHub Pages deployment workflow
└── next.config.ts             # Next.js config (static export, unoptimized images)
```

---

## Deployment History

### Initial Setup (April 2026)
- Migrated from UCI OIT WordPress platform (hie.eng.uci.edu) to custom Next.js site
- Originally deployed to `hie-uci/HIE-Lab-Website` repo at `hie-uci.github.io/HIE-Lab-Website`
- Required `basePath: "/HIE-Lab-Website"` configuration

### URL Migration (April 2026)
- Created organization repo `hie-uci/hie-uci.github.io` for root domain deployment
- Site now serves at **`https://hie-uci.github.io`** (no subdirectory)
- Removed `basePath` config, reverted image paths to `/images/...`
- DNS redirect from `hie.eng.uci.edu` pending OIT approval (request sent by Dan at Engineering IT)

### CI/CD Pipeline
- GitHub Actions workflow (`.github/workflows/deploy.yml`) auto-deploys on every push to `main`
- Build: `npm run build` → static export to `out/` directory
- Deploy: `actions/deploy-pages` uploads artifact to GitHub Pages
- Build time: ~35 seconds

---

## Design Features & Improvements

### Visual Design
- **Color scheme:** Navy blue (#00386d), UCI blue (#0064a4), Gold (#ffd200), Teal (#528188)
- **Typography:** Geist Sans (headings), Geist Mono (code), system fallbacks
- **Glass morphism:** Frosted glass effect on navbar, cards, and overlays
- **Gradient accents:** Used in section headers, buttons, and card highlights

### Animations & Interactions
- **Scroll progress bar:** Gradient bar at top of page (blue → gold → teal)
- **Active nav indicator:** Animated underline + background highlight on current page
- **Hero particle field:** Canvas-based floating particles with connection lines
- **Circuit background:** SVG circuit board pattern with interactive mouse tracking
- **Chip marquee:** Two-row auto-scrolling gallery with hover-to-pause
- **Chip lightbox:** Click any chip image to view full-size with title overlay
- **Research cards:** Numbered badges, gradient glow, scan-line hover effect
- **Team cards:** Gradient top bar, photo ring glow, tag hover effects
- **Animated counters:** Stats count up when scrolled into view
- **Page transitions:** Fade-in animations on page load and scroll

### Content Sections
- **Homepage:** Hero → About → Chip Showcase → Research Highlights → News → Publications → Positions
- **Publications:** 64 entries (23 journals, 22 conferences, 2 patents, 17 talks) with search + filter
- **Team:** PI spotlight, 6 PhD students, 2 undergrads, 3 PhD alumni, 9 other alumni
- **Research:** 5 thrust areas with detailed descriptions and images
- **News:** 4 recent highlights with date badges and category tags

---

## Publications Data Sync

Publications are synced from the old UCI website (hie.eng.uci.edu/publications/). Last sync: April 2026.

**Categories:**
- Selected Journal Publications: 23 entries (2011–2026)
- Selected Conference Publications: 22 entries (2011–2026)
- Invited Presentations and Talks: 17 entries (2016–2025)
- Pending Patents and Inventions: 2 entries (2022, 2025)

To update publications, edit the `publications` array in `src/app/publications/page.tsx`.

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npx serve out
```

---

## How to Update Content

### Add a new publication
Edit `src/app/publications/page.tsx` and add an entry to the `publications` array:
```typescript
{ authors: 'A, B, C', title: 'Paper Title', venue: 'IEEE JSSC', year: 2026, type: 'journal', link: 'https://...' }
```

### Add a news item
Edit `src/app/page.tsx` and add to the `newsItems` array:
```typescript
{ date: 'Jan 2026', text: 'Description of news.', tag: 'Award' }
```

### Add a team member
Edit `src/app/team/page.tsx` and add to the appropriate array (`phdStudents`, `undergradResearchers`, etc.).

### Add chip photos
Place images in `public/images/chips/individual/` and add the path to `ChipMarquee.tsx` and/or `chip-gallery/page.tsx`.

---

## Pending Tasks

- [ ] DNS redirect: hie.eng.uci.edu → hie-uci.github.io (waiting on OIT)
- [ ] Replace placeholder team photos with real photos
- [ ] Add more news items from lab history
- [ ] Add research result images (simulation plots, measurement data)
- [ ] Add Google Maps embed to Contact page
- [ ] Add citation counts to publications (optional, via Semantic Scholar API)
- [ ] Add chip specification tables in Chip Gallery

---

## Credits

- **PI:** Prof. Hamidreza Aghasi (haghasi@uci.edu)
- **Website built by:** Allen Huang (Yilun Huang)
- **Design inspiration:** Modern academic lab websites (Stanford, MIT, Berkeley)
- **Deployment:** GitHub Pages + GitHub Actions

---

*Last updated: April 28, 2026*
