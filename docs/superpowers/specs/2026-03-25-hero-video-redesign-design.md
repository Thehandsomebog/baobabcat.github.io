# Hero Section Video Redesign — Design Spec

## Overview

Redesign the BaobabCat homepage hero section from a static text-based hero to a cinematic fullscreen video background with glassmorphic UI, left-aligned layout, and a bottom info bar. Implementation stays in the existing HTML/CSS/JS stack (no React migration).

## Visual Direction

Blend of two references:
- **Neonix** — left-aligned layout, glassmorphic nav pills, bottom info bar with mission statements + social icons
- **Velorah** — cinematic video background, elegant serif typography, fade-rise entrance animations, liquid glass effects

## Typography

- **Display:** Instrument Serif (Google Fonts) — headings, brand name
- **Body:** Inter 400/500 (already loaded) — nav, subtitles, body text
- CSS variables: `--font-display: 'Instrument Serif', serif` and `--font-body: 'Inter', sans-serif`

## Color Theme

- **Background:** Dark navy `#0a0e1a`
- **Text primary:** `#ffffff`
- **Text muted:** `rgba(255, 255, 255, 0.4)` — used for contrast words in headline
- **Accent:** Cyan/teal `#00dcc8` — used for numbered badges, subtle glows
- **Borders/glass:** `rgba(255, 255, 255, 0.1)` range
- **Existing orange accent (`#ff6b35`)** retained for rest of site, not used in hero

## Layout — Hero Section

### Navigation Bar
- Flex row, space-between, `px-8 py-6`, max-width 1200px centered
- **Left:** "BaobabCat" logo in Instrument Serif, text-white, tracking-tight
- **Right:** Nav links — Home (active, glassmorphic pill), The Team, What We Build, AI Pulse, Let's Talk
- Active link: glassmorphic pill with `backdrop-filter: blur(4px)`, subtle border
- Inactive links: `text-muted-foreground`, hover → `text-white` transition
- Mobile: hamburger menu toggle (preserve existing mobile nav behavior)

### Hero Content (Left-Aligned)
- `padding: ~8rem 2rem 10rem 2rem`, max-width ~60% on desktop
- **H1:** "The future _doesn't wait._ Neither should _you._"
  - Instrument Serif, `~5rem` desktop / `~3rem` mobile
  - `leading-[0.95]`, `tracking-[-2.46px]`, `font-weight: normal`
  - Muted words ("doesn't wait." and "you.") in `rgba(255,255,255,0.4)`
- **Subtitle:** "We architect AI systems that sharpen decisions, automate complexity, and give forward-thinking businesses the edge they need — before the competition catches up."
  - Inter, `text-muted-foreground`, `text-base/lg`, `max-width: ~600px`, `margin-top: 2rem`
- **CTA:** "Begin Journey →"
  - Liquid glass style, `rounded-full`, `px-14 py-5`
  - `hover:scale-[1.03]`, cursor-pointer
  - `margin-top: 3rem`

### Video Background
- `<video autoplay loop muted playsinline>` with `<source src="assets/hero-video.mp4" type="video/mp4">`
- Positioned `absolute inset-0 w-full h-full object-cover z-0`
- Optional dark overlay for text readability: `rgba(0, 0, 0, 0.3–0.5)`
- Poster image fallback (first frame or static image)

### Bottom Info Bar
- Absolute bottom, full-width, `border-top: 1px solid rgba(255,255,255,0.06)`
- `background: rgba(0,0,0,0.3)` with `backdrop-filter: blur(8px)`
- Three sections flex row:
  1. **Left — "Our Reel":** Play icon circle + "AI Showreel" label (placeholder, no video link yet)
  2. **Center — Mission statements:**
     - ① "To deliver intelligent AI systems that empower businesses to make sharper, faster decisions."
     - ② "To bridge the gap between human ambition and machine intelligence, building a future worth leading."
     - Numbered badges in cyan/teal
  3. **Right — Social icons:** Placeholder circles for Facebook, LinkedIn, Instagram, X (user will provide links later)

## Liquid Glass Effect

```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

## Animations

```css
@keyframes fade-rise {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-rise { animation: fade-rise 0.8s ease-out both; }
.animate-fade-rise-delay { animation: fade-rise 0.8s ease-out 0.2s both; }
.animate-fade-rise-delay-2 { animation: fade-rise 0.8s ease-out 0.4s both; }
```

- H1 → `animate-fade-rise`
- Subtitle → `animate-fade-rise-delay`
- CTA button → `animate-fade-rise-delay-2`

## Scope

### Changed
- `index.html` — hero section markup, nav links, font import
- `styles.css` — new hero styles, liquid glass, animations, color variables for hero

### Unchanged
- About, Services, Testimonials, Contact sections
- `ai-pulse.html`, `blog.html`, `privacy.html`
- `animations.js` — existing scroll animations preserved
- Contact form (Web3Forms)
- GitHub Actions workflows

### New Files
- `assets/hero-video.mp4` — already in place (3.5MB)

## Mobile Responsive
- Hero text goes full-width on mobile
- Font sizes scale down (`5rem` → `3rem`)
- Bottom bar stacks vertically or simplifies
- Video continues playing (most mobile browsers support autoplay when muted)
- Nav collapses to hamburger (preserve existing mobile nav)

## Social Links
- Placeholder icon circles rendered; user will provide actual URLs later
