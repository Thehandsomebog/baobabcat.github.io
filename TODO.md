# BaobabCat Website Redesign - Superlist-Inspired Dark Theme

## Project Overview
Redesign baobabcat.com as a modern consulting business website with a dark theme inspired by Superlist.com.

---

## Phase 1: Planning & Design System
- [x] Finalize animation choices with client
  - Scroll: Fade + Slide up
  - Hero: Text reveal (words appear one by one)
  - Background: Subtle gradient shift
- [x] Define color palette (dark theme)
- [x] Choose typography (Inter font family)
- [x] Create SVG logo for BaobabCat

## Phase 2: Core Structure
- [x] Create new HTML structure for index.html (Home)
  - [x] Navigation (sticky, dark)
  - [x] Hero section with tagline
  - [x] About section
  - [x] Services section
  - [x] Testimonials section
  - [x] Contact/Stay Connected form (with SMS consent)
  - [x] Footer
- [x] Update privacy.html to match new dark theme
- [x] Update blog.html with new dark theme

## Phase 3: Styling
- [x] Create new styles.css with dark theme
  - [x] CSS custom properties (variables) for theming
  - [x] Base styles and reset
  - [x] Typography system
  - [x] Navigation styles
  - [x] Hero section styles
  - [x] Section layouts
  - [x] Card components
  - [x] Form styles (dark theme)
  - [x] Footer styles
  - [x] Responsive breakpoints (mobile, tablet, desktop)

## Phase 4: Animations
- [x] Implement scroll-triggered animations
  - [x] Fade-in effects
  - [x] Slide-up animations
  - [x] Staggered reveals
- [x] Add hover effects
  - [x] Button hover states
  - [x] Card hover effects
  - [x] Link underline animations
- [x] Hero section animations
  - [x] Text reveal on load
  - [x] Subtle background effects (gradient shift)
- [x] Smooth scroll behavior

## Phase 5: Assets
- [x] Create BaobabCat logo (SVG)
- [x] Add icons (using inline SVG)
- [x] Optimize for performance

## Phase 6: Testing & Launch
- [x] Test on mobile devices (via Playwright responsive tests)
- [x] Test on tablet (via Playwright responsive tests)
- [x] Test on desktop (via Playwright responsive tests)
- [x] Verify contact form works (via Playwright tests)
- [x] Check all links
- [x] Validate HTML/CSS
- [x] Commit and push to GitHub

---

## Color Palette (Superlist-Inspired)
```
--bg-primary: #0a0a0f        /* Deep dark background */
--bg-secondary: #12121a      /* Card/section backgrounds */
--bg-tertiary: #1a1a24       /* Elevated elements */
--bg-card: #16161f           /* Card backgrounds */
--text-primary: #ffffff      /* Main text */
--text-secondary: #a0a0b0    /* Muted text */
--text-muted: #6b6b7b        /* Very muted text */
--accent-primary: #ff6b35    /* Orange accent (baobab-inspired) */
--accent-secondary: #ff8c42  /* Light orange accent */
--border-color: #2a2a3a      /* Subtle borders */
```

## Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 700, 800 weight
- **Body**: 400, 500 weight
- **Accents**: 600 weight

---

## Files Created/Modified
- `index.html` - Complete redesign with all sections
- `privacy.html` - Updated to dark theme (SMS compliance content preserved)
- `blog.html` - Updated to dark theme
- `styles.css` - Complete rewrite with dark theme
- `animations.js` - New file for scroll animations and interactions
- `logo.svg` - New BaobabCat logo
- `TODO.md` - This file

---

## Features Implemented
1. **Dark Theme** - Superlist-inspired color palette
2. **Responsive Design** - Mobile, tablet, and desktop breakpoints
3. **Scroll Animations** - Fade + slide up on scroll using Intersection Observer
4. **Hero Text Reveal** - Words animate in sequentially on page load
5. **Gradient Background** - Subtle animated gradient in hero section
6. **Mobile Navigation** - Hamburger menu for mobile devices
7. **Smooth Scrolling** - Anchor links scroll smoothly
8. **Form Validation** - Basic client-side validation with visual feedback
9. **SMS Compliance** - Consent checkbox and legal disclaimers preserved
10. **Custom Logo** - Baobab tree + cat ears SVG logo

---

## Improvement Backlog

### High Priority
- [x] **Optimize og-image.png** - Converted to JPEG (104KB), resized to 1200x1200, updated all references
- [x] **Add 404 error page** - Create branded 404.html for broken links instead of generic error
- [ ] **Add analytics** - Requires GA4 Measurement ID from Google Analytics account to implement
- [x] **Improve form feedback** - Added visible success/error messages after Web3Forms submission

### Medium Priority
- [x] **Expand test coverage** - Added Playwright tests for:
  - Contact form validation and success messages
  - Blog page functionality
  - AI Pulse page and filters
  - Responsive breakpoints (mobile/tablet/desktop)
- [x] **Add image lazy loading** - N/A: Only logo images exist which are above-the-fold and shouldn't be lazy loaded
- [x] **Client-side form validation** - Added real-time validation on blur with email/phone format checking
- [x] **AI news error handling** - N/A: News is statically pre-rendered at build time, no client-side fetching

### Nice to Have
- [ ] **Blog CMS integration** - Consider headless CMS (Contentful, Sanity) or static site generator (11ty) for easier blog updates
- [ ] **Testimonial carousel** - If more than 3 testimonials, add carousel to showcase without overwhelming page
- [ ] **Dark/light mode toggle** - Add theme toggle for users who prefer light mode
- [ ] **Newsletter signup** - Add email capture form to build subscriber list
- [ ] **Case studies page** - Add detailed success stories for more credibility beyond brief testimonials
