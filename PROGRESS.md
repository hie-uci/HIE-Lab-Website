# HIE Lab Website - Progress Update

## Date: April 28, 2026

### 1. Physics-Based Interactive Backgrounds
- Replaced the generic particle/circuit backgrounds with a custom **Fluid Plasma Physics Engine** (`FluidPlasmaBackground.tsx`).
- **Dark Mode (Night):** Renders high-energy, glowing plasma nodes with a strong electromagnetic repulsion effect when the mouse interacts with the grid.
- **Light Mode (Day):** Renders a clean, subtle water-like plasma grid (opacity reduced to 15%) with wider spacing. It functions like an elegant, interactive watermark without cluttering the cleanroom aesthetic.
- The physics engine simulates an electromagnetic field with mouse repulsion force, ambient wind/RF field wave propagation, and spring-based restoring forces.

### 2. Apple visionOS / iOS 18 "Liquid Glassmorphism" UI
- Upgraded all glass panels (`.glass-ios` in `globals.css`) from basic blurring to the latest Apple design standards.
- Increased backdrop blur to `40px` and saturation to `200%`.
- Replaced flat borders with 3D specular highlight gradients (light top-left, dark bottom-right) to simulate physical glass thickness.
- Implemented multi-layered inner and outer drop shadows to elevate the cards.
- Integrated a micro-level SVG fractal noise overlay using `mix-blend-mode: overlay` to give the glass a realistic frosted texture.

### 3. Dark Mode Integration & Text Contrast Fixes
- Added a permanent **Theme Switcher** to the main `Navbar` (sun/moon icon) allowing seamless toggling between "Cleanroom" (Light) and "Dark Space" (Dark) modes.
- **Critical Tailwind v4 Fix:** Resolved an underlying framework conflict where Tailwind v4 ignored the manual theme toggle in favor of the macOS system settings (causing "white text on white background" bugs). Implemented `@custom-variant dark (&:where(.dark, .dark *));` in `globals.css` to manually override the dark mode trigger.
- **Text Contrast Audit:** Swept through the entire homepage, converting all low-contrast gray text (`text-gray-500`, `text-slate-600`) on glass panels to high-contrast slate colors (`text-slate-900` for light mode, `text-slate-200` for dark mode) to ensure perfect readability against the vibrant underlying light refractions.

### 4. Refraction Orbs (Mesh Gradients)
- Placed massive, slow-pulsing background mesh gradients (UCI Blue, EECS Teal, UCI Gold) at the absolute bottom layer (`z-0`) of the page.
- These orbs interact with the new Liquid Glass cards, causing beautiful, dynamic color refractions and edge highlights as the user scrolls, perfectly simulating premium physical materials.
