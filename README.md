# Airborne Phoenix — AAUB Design • Build • Fly Team website

Cinematic, engineering-first website for the Airborne Phoenix student aerospace team. Built with React 19, Vite, Tailwind CSS v4, React Router and React Three Fiber.

## Structure

```
src/
  data/            ← ALL editable content (team, aircraft, divisions, gallery, timeline, sponsors, news, site config)
  components/
    graphics.tsx   ← reusable SVG/CSS engineering graphics (flight paths, radar, wing sections, telemetry, badges…)
    ui.tsx         ← buttons, reveal, count-up, modal, accordion, breadcrumbs, responsive picture
    layout.tsx     ← navbar, drawer, command palette (Ctrl/⌘ K), footer, progress, back-to-top
    home/          ← Hero, Story (mission → flight), MissionControl (simulated telemetry), CommandCentre
    aircraft/      ← Aircraft3D (R3F scene) + AircraftViewer (lazy loader, hotspots, 2D fallback)
    Gallery.tsx    ← filterable gallery + lightbox
  pages/           ← route components (code-split)
public/
  videos/          airborne-phoenix-hero.mp4 · .webm · airborne-phoenix-mobile.mp4 · engineering/
  images/          hero/ aircraft/ team/ engineering/ gallery/ news/ sponsors/ (+ hero-poster.webp, icon-192/512.png)
  models/          airborne-phoenix-aircraft.glb
  documents/       sponsorship-deck.pdf · technical-summary.pdf · press/
  manifest.webmanifest · sw.js · offline.html
```

Each `public/` folder contains a README with **recommended dimensions, aspect ratios and maximum file sizes**.

## Asset guidelines (summary)

| Asset | Size / ratio | Max |
|---|---|---|
| Hero MP4 (desktop) | 1920×1080, 16:9, 10–20 s, muted | 8 MB |
| Hero WebM | same | 6 MB |
| Hero MP4 (mobile) | 1080×1350 or 1080×1920 | 4 MB |
| Hero poster | 1920×1080 WebP | 250 KB |
| Aircraft photos | 2000×1333 (3:2) WebP/AVIF | 400 KB |
| Team portraits | 800×1000 (4:5) WebP | 200 KB |
| Gallery | 1600 px long edge WebP/AVIF | 350 KB |
| Sponsor logos | SVG or PNG ≥ 600 px wide | 100 KB |
| 3D model | GLB, < 150 k tris | 3 MB |
| PDFs | — | 10 MB |

## Content rules baked into the code

- **Specifications** render only when `status: "verified"`; `target` values show a *Design target* badge; `null` shows *Specification pending team verification*.
- **Timeline** entries with `date: null` are marked *team confirmation required*.
- **Team** roster shows a warning banner until `rosterVerified = true` in `src/data/team.ts`.
- **Sponsors**: tiers/benefits/reach show *pending approval* until values are supplied. Download buttons appear only when `documents.*.available = true`.
- **3D viewer** loads `/models/airborne-phoenix-aircraft.glb`; if absent it shows a clearly-labelled temporary demonstration model. WebGL-less or low-power devices get an interactive 2D diagram.
- **Mission control** is a deterministic simulation and is labelled `INTERACTIVE AVIONICS DEMONSTRATION — NOT LIVE FLIGHT DATA`.
- **Placeholder imagery** comes from Pexels via `px(id)` in `src/data/media.ts`; replace with local paths.

## Features

Dark/light theme (system + persisted) · reduced-motion mode (system + toggle) · command palette · shareable aircraft/team URLs · breadcrumbs · reading progress · back-to-top · PWA manifest + service worker + offline page · analytics-ready (disabled by default) · privacy notice · English primary with Bangla dictionary scaffold (`src/data/site.ts`).

## Performance safeguards

Lazy 3D scene and below-the-fold sections, route-level code splitting, responsive `srcset` + blur-up images, video pause when off-screen/hidden, `save-data` and low-power detection, rAF-throttled scroll handlers, transform/opacity-only animations, fixed media aspect ratios (no CLS), paginated gallery.

## Development

```
npm install
npm run dev
npm run build
```
