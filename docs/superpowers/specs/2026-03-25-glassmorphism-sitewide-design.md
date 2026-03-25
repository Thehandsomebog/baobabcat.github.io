# Glassmorphism Sitewide — Design Spec

## Overview

Extend the liquid glass aesthetic from the hero section to every element on the site. Replace all solid backgrounds with semi-transparent frosted glass panels over a subtle page-wide gradient.

## Body Background

Replace the solid `--bg-primary: #0a0a0f` with a vertical gradient on `body`:
- Top: `#0a0e1a` (hero navy)
- Middle: `#0d1220` (warmer deep)
- Bottom: `#080c14` (darker)

This gradient gives the glass layers something to reveal at each scroll depth.

## Glass Treatment by Element

### Navigation Bar
- Already semi-transparent — enhance with liquid glass `::before` gradient border
- Background stays `rgba(10, 14, 26, 0.6)` with `backdrop-filter: blur(20px)`
- Add the gradient border from `.liquid-glass::before`

### Service Cards (`.service-card`)
- Replace solid `--bg-card` with `rgba(255, 255, 255, 0.03)`
- Add `backdrop-filter: blur(12px)`
- Replace solid `1px solid var(--border-color)` with `1px solid rgba(255, 255, 255, 0.08)`
- Add `box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.06)`
- Hover: border brightens to `rgba(255, 255, 255, 0.15)` instead of orange

### Stat Cards (`.stat-card`)
- Same glass treatment as service cards
- Keep the orange gradient on `.stat-number` — it provides needed color pop

### Testimonial Cards (`.testimonial-card`)
- Same glass treatment as service cards
- Keep author avatar orange gradient

### Contact Form Wrapper (`.contact-form-wrapper`)
- Glass background: `rgba(255, 255, 255, 0.03)` with `backdrop-filter: blur(12px)`
- Glass border: `1px solid rgba(255, 255, 255, 0.08)`

### Form Inputs (`.form-group input`, `.form-group textarea`)
- Replace solid `--bg-tertiary` with `rgba(255, 255, 255, 0.04)`
- Border: `1px solid rgba(255, 255, 255, 0.08)`
- Focus: border goes to `rgba(0, 220, 200, 0.4)` (teal) with teal glow instead of orange

### Buttons
- `.btn-primary`: Replace orange gradient with liquid glass + subtle teal border glow on hover
- `.btn-secondary`: Already transparent — update border to `rgba(255, 255, 255, 0.1)`, hover border to teal

### Section Backgrounds
- `.about-section` and `.testimonials-section`: Remove solid `--bg-secondary`, replace with `rgba(255, 255, 255, 0.02)` frosted panel with top/bottom subtle borders
- `.contact-section`: Same treatment

### Footer
- Replace solid `--bg-secondary` with glass panel: `rgba(255, 255, 255, 0.02)` with `backdrop-filter: blur(8px)`
- Border-top: `1px solid rgba(255, 255, 255, 0.06)`

### Newsletter Input
- Same glass input styling as contact form

### Form Disclaimer
- Replace solid `--bg-tertiary` with glass: `rgba(255, 255, 255, 0.03)`
- Replace orange left border with teal: `3px solid rgba(0, 220, 200, 0.3)`

## Colors Retained
- `--accent-primary` (orange) stays for: service icons, section labels, stat numbers, author avatars, post categories
- Teal (`--hero-accent`) used for: focus states, hover borders, form disclaimer accent, button hover glow

## Scope

### Changed
- `styles.css` — body background, all card styles, section backgrounds, nav, footer, buttons, form inputs

### Unchanged
- `index.html` — no markup changes needed
- `animations.js` — no changes
- `ai-pulse.html`, `blog.html`, `privacy.html` — they inherit styles.css changes automatically
- Hero section — already glass, no changes
