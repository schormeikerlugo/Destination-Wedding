# Kathrin Ledwon — Destination Wedding Photography

Editorial landing page for award-winning destination wedding photographer Kathrin Ledwon. Built with Astro, modular CSS, and GSAP-driven motion.

## Stack

- **Astro 5** — static output, islands of JS only where needed
- **CSS modular** — one stylesheet per component, design tokens in `src/styles/tokens.css`
- **GSAP + ScrollTrigger + Lenis** — smooth scroll and scroll-driven motion
- **astro-icon + Lucide** — minimal icon set
- **Fraunces + Inter** — serif display + neutral sans

## Scripts

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build to ./dist
npm run preview  # preview the production build
```

## Structure

```
src/
  components/
    layout/      # Header, Footer
    sections/    # Hero, About, Gallery, Packages, Faq, Contact
    ui/          # Marquee, ScrollIndicator, …
  data/          # site, packages, faq content
  lib/           # gsap, lenis init
  styles/        # tokens, reset, typography, global
  layouts/       # Base layout
  pages/         # index.astro
public/
  images/        # photographer assets (galeria/, hero/, about/)
  videos/        # optional reel
```

Each section ships its markup (`.astro`), styles (`.css`) and motion (`.client.ts`) side by side — no monoliths.

## Adding photographer assets

Drop the photographer's images and video into:

- `public/images/galeria/` — gallery photos (12–18 recommended, mix landscape/portrait)
- `public/images/about/kathrin.jpg` — about portrait
- `public/videos/reel.mp4` — optional hero mini-reel

Filenames listed in `src/data/gallery.ts` will be picked up automatically.
