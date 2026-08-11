# ClearView AI — Project Memory

Last updated: 2026-08-06

## Project
A marketing landing page for **ClearView AI** — "Understand any website in seconds" (AI website analysis: summaries, structure maps, readability, clutter detection).

Location: `C:\Users\sanje\OneDrive\Desktop\clearview`
Git: **not initialized** (no repo yet)

## Stack
- Next.js 15.5 (App Router) + TypeScript + React 19
- Tailwind CSS v3 (`tailwind.config.ts`, dark theme on `#050816`)
- Framer Motion 13, React Three Fiber 9 + drei 10 (three 0.185)
- GSAP ScrollTrigger, React Flow 12 (`@xyflow/react`), lucide-react, class-variance-authority, tailwind-merge, clsx
- Fonts (next/font): Space Grotesk (headings), DM Sans (body), JetBrains Mono (mono)

## Structure
- `app/layout.tsx` — fonts, metadata/OG, `<MotionConfig reducedMotion="user">` wrapper
- `app/page.tsx` — assembles sections + ParticleField + ParallaxOrbs + skip link
- `components/three/hero-scene.tsx` — holographic "website globe" (wireframe shells, glowing core, orbital rings, 420 surface dots, structure arcs, hierarchy nodes, drei `Html` labels), **cursor-follow + tilt on hover**, faster spin while hovered, reduced-motion aware
- `components/three/particle-scene.tsx` — 2,200-particle neural field with network lines, mouse parallax
- `components/` — navbar (Features / How It Works / Dashboard / About), hero (analyze simulation → smooth-scrolls to dashboard), demo-modal (focus-trapped dialog), features bento w/ tilt+glow cards, how-it-works scroll progress timeline, dashboard-preview + React Flow structure tree, animated counters (stats), creator (sanjeevikumar), CTA, footer, reveal, section-heading, logo, particle-field, parallax-orbs
- `lib/data.ts` — SITE_NODES, STRUCTURE_EDGES, NAV_LINKS
- `lib/utils.ts` — `cn()` helper

## Personal branding (user request)
- Testimonials section REMOVED
- Creator section added: name **sanjeevikumar**, "Developing a whole project", solo-founder badges
- Footer bottom line: "Built with ❤ for a simpler web — by sanjeevikumar"
- Navbar: "Testimonials" link replaced with "About" → `#creator`

## Verified state (all PASS)
- `npm run build` — clean, no warnings
- `npm run lint` — clean
- `npx tsc --noEmit` — clean
- Headless-browser (Chrome via puppeteer-core) checks on prod build (port 3100):
  - 2 WebGL canvases mount (hero globe + particle field), 0 console errors, 0 hydration errors
  - React Flow structure tree renders, stat counters animate (1,250,000+ / 980,000+ / 4.2M hrs)
- puppeteer-core was a temp devDep for testing and was **uninstalled**

## Notable fixes made
1. **Hydration mismatch (#418)** — framer-motion `useReducedMotion()` returned different values during SSR vs first client render. Removed all initial-render branches (stats, reveal, timeline, CTA) and centralized handling via `MotionConfig reducedMotion="user"` in layout. Remaining `useReducedMotion` uses are post-hydration or client-only.
2. **hero.tsx dead cleanup** — the 4s "reset to idle" timer's `return () => clearTimeout(reset)` was inside a timeout callback (dead code). Split reset into its own effect keyed on `state === "done"`; also made the dashboard scroll respect `prefers-reduced-motion`.
3. **demo-modal focus management** — added focus trap (Tab/Shift+Tab), focus panel on open, restore on close, `role="dialog"`/`aria-modal` moved to the panel, stable Escape handler via ref.
4. **Hero globe sizing** — camera z went 6.5 → 7.5 (smaller than original per user request).
5. **Cursor follow** — globe tilts and slides toward the cursor on hover (follow x ±0.7, y ±0.5 world units), eases back on leave; reduced-motion respected.

## Environment / workflow notes
- User runs `npm run dev` on port 3000 (dev server their workflow)
- I test prod builds on port 3100 (`node node_modules/next/dist/bin/next start -p 3100`)
- Temp test scripts live in `C:\Users\sanje\AppData\Local\Temp\opencode` (cv-test.cjs, cv-scroll.cjs)

## Possible next steps (NOT done, user has not decided)
- Git init + first commit
- Deploy setup (Vercel)
- Custom favicon, metadataBase, OG image (currently default Next favicon)
- Real analyzer functionality behind the analyze bar / dashboard (currently a UI simulation)
- Trim unused tailwind keyframes/container config (dead config)
- Optional mobile perf: reduce particle count / edge count or pause offscreen canvases
