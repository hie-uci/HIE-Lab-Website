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
- Placed massive, slow-pulsing background background mesh gradients (UCI Blue, EECS Teal, UCI Gold) at the absolute bottom layer (`z-0`) of the page.
- These orbs interact with the new Liquid Glass cards, causing beautiful, dynamic color refractions and edge highlights as the user scrolls, perfectly simulating premium physical materials.

---

## Date: May 11, 2026

### 1. iOS Safari Performance & Crash Fixes
- **Issue resolved:** Heavy `blur-[]` classes applied to massive DOM elements were exhausting WebKit GPU memory limits, causing total white-screen crashes on iOS devices.
- **Fix:** Swapped computationally expensive backdrop/background blurs with hardware-accelerated `radial-gradient` backgrounds. This achieves the exact same glowing/frosted visual aesthetic with near-zero performance cost on mobile.
- Added viewport height fallbacks (`min-height: 100vh` preceding `100dvh`) to ensure compatibility with older iOS Safari versions.
- Fixed a silent event listener memory leak in `FluidPlasmaBackground.tsx`.

### 2. Deep-Tech "RF Toolbox" Ecosystem Integration
- Built a highly structured, dedicated **RF Toolbox** page to serve as a world-class reference hub for the mmWave engineering community.
- Replaced static PNG formula sheets with beautiful, selectable native HTML math rendered via `KaTeX`.
- Added categorized tabs to streamline engineering workflows: **PCB & Transmission Lines**, **Antennas & Matching**, **System & Fundamentals**, and **Components & Waveguides**.

### 3. Complete Port of Private Swift Algorithms to Web
Deeply extracted and translated the algorithms from the lab's proprietary Swift `RFCalculationEngine` into interactive React components:
- **Impedance Matching Synthesizer:** Computes ideal High-Pass and Low-Pass L-Network topologies dynamically based on complex Source and Load impedances.
- **Custom Interactive Smith Chart:** Built a pure SVG React Smith Chart component that plots Source, Load, and intermediate tracking paths (Trajectories) in real-time.
- **Phased Array Synthesis:** Calculates HPBW, Grating Lobe conditions, and generates a dynamic SVG `PolarPlot` of the array factor radiation pattern.
- **Microstrip Patch Antenna:** Synthesizes width, length, and resonant edge impedance utilizing rigorous Hammerstad and Balanis radiation models.
- **Transmission Lines & Vias:** Features dynamic 3D isometric CSS-based previews of Microstrip, Stripline, and CPW structures. Implements the Goldfarb model for PCB through-hole via parasitics. Includes shared standard substrate presets (Rogers RO4350B, RO4003C, etc.).
- **System Cascade (Receiver):** Analyzes Thermal Noise Floor, SFDR, and total Sensitivity based on system IIP3, NF, and Bandwidth.

---

## 🔮 Future Directions & Handoff (State Saved)

The current platform is incredibly solid, but there is immense potential to grow the **RF Toolbox** into the absolute gold-standard web suite for RF/mmWave engineers globally. 

### ✅ Recently Completed
- **Interactive Drag-and-Drop Smith Chart Matching 🎯:** Upgraded the toolbox with an interactive canvas. Users can literally "drag" a node along constant resistance/conductance circles. The math maps SVG screen coordinates back to $\Gamma$ and $Z/Y$, instantly outputting the exact series/shunt L or C value required to make that move in real-time.
- **System Cascade Chain Builder (Block Diagram Tool) ⛓️:** Expanded the Receiver Calculator into a visual drag-and-drop block diagram (powered by `@xyflow/react`). Users can drop blocks (LNA, Mixer, Filter, PA) with Gain, NF, and OIP3. The engine automatically cascades the formulas (Friis equation for Noise Figure, cascade IP3 formulas) and displays the total system performance dynamically based on edge connections.
- **S-Parameter (.sNp) File Viewer & Calculator 📊:** Built a robust engine to upload and parse Touchstone `.sNp` files (up to 12 ports) supporting RI, MA, and DB formats. Rendered interactive Smith Charts and Rectangular Bode Plots (via `recharts`). Automatically converts S-Parameters to Z-Parameters to extract and plot precise Inductance ($L$) and Quality Factor ($Q$) across frequencies for arbitrary RF structures.

When you return to this project, consider tackling these **High-Priority Future Features**:

1. **PLL & Synthesizer Calculator 📻**
   - *Concept:* Loop filter design tool.
   - *Execution:* Input phase margin, loop bandwidth, and VCO $K_{vco}$. Output the values for a 2nd or 3rd order passive loop filter (C1, C2, R1).
