# Hero Video Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static hero section with a fullscreen looping video background, glassmorphic UI, left-aligned cinematic layout, and bottom info bar.

**Architecture:** Modify `index.html` hero section and nav markup. Add new CSS for video hero, liquid glass, fade-rise animations, and bottom bar to `styles.css`. Add Instrument Serif font import. Update `animations.js` navbar scroll handler for new dark navy color. No new files except the already-placed `assets/hero-video.mp4`.

**Tech Stack:** HTML5 video, CSS custom properties, CSS animations, Google Fonts (Instrument Serif)

---

## File Structure

- **Modify:** `index.html` — hero section markup (lines 172–217), font import (line 53), nav links (lines 184–190)
- **Modify:** `styles.css` — replace hero CSS (lines 233–337), add liquid glass + bottom bar + fade-rise styles, update nav styles for glassmorphic active state
- **Modify:** `animations.js` — update navbar scroll colors (lines 171–182) to match new dark navy theme
- **Existing:** `assets/hero-video.mp4` — already in place (3.5MB)

---

## Chunk 1: Font Import + Color Variables + Liquid Glass CSS

### Task 1: Add Instrument Serif Font Import

**Files:**
- Modify: `index.html:53`

- [ ] **Step 1: Add Instrument Serif to Google Fonts import**

In `index.html`, replace the existing Google Fonts link (line 53):

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add Instrument Serif font import"
```

### Task 2: Add Hero Color Variables and Font Variables

**Files:**
- Modify: `styles.css:6-32`

- [ ] **Step 1: Add new CSS variables to :root block**

Add these variables inside the existing `:root` block in `styles.css`, after the existing `--transition-slow` line (line 31):

```css
    /* Hero Theme */
    --hero-bg: #0a0e1a;
    --hero-text-muted: rgba(255, 255, 255, 0.4);
    --hero-accent: #00dcc8;
    --hero-border: rgba(255, 255, 255, 0.1);
    --hero-glass-bg: rgba(255, 255, 255, 0.01);

    /* Display Font */
    --font-display: 'Instrument Serif', serif;
```

- [ ] **Step 2: Commit**

```bash
git add styles.css
git commit -m "feat: add hero theme color and font variables"
```

### Task 3: Add Liquid Glass and Fade-Rise Animation CSS

**Files:**
- Modify: `styles.css` — add after the existing `@keyframes fadeInUp` block (after line 332)

- [ ] **Step 1: Add liquid glass CSS class**

Insert after the `.hero-subtitle, .hero-cta { transform: translateY(20px); }` block (after line 337):

```css
/* ========================================
   Liquid Glass Effect
   ======================================== */
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
        rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.15) 20%,
        rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0) 60%,
        rgba(255, 255, 255, 0.15) 80%, rgba(255, 255, 255, 0.45) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
}

/* ========================================
   Fade Rise Animations
   ======================================== */
@keyframes fade-rise {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-fade-rise {
    animation: fade-rise 0.8s ease-out both;
}

.animate-fade-rise-delay {
    animation: fade-rise 0.8s ease-out 0.2s both;
}

.animate-fade-rise-delay-2 {
    animation: fade-rise 0.8s ease-out 0.4s both;
}

.animate-fade-rise-delay-3 {
    animation: fade-rise 0.8s ease-out 0.6s both;
}
```

- [ ] **Step 2: Commit**

```bash
git add styles.css
git commit -m "feat: add liquid glass effect and fade-rise animation classes"
```

---

## Chunk 2: Hero Section HTML + CSS

### Task 4: Replace Hero Section HTML

**Files:**
- Modify: `index.html:198-217`

- [ ] **Step 1: Replace the hero section markup**

Replace everything from `<!-- Hero Section -->` (line 198) through the closing `</section>` (line 217) with:

```html
    <!-- Hero Section -->
    <section class="hero">
        <video class="hero-video" autoplay loop muted playsinline>
            <source src="assets/hero-video.mp4" type="video/mp4">
        </video>
        <div class="hero-overlay"></div>
        <div class="hero-content animate-fade-rise">
            <h1 class="hero-title">
                The future <em class="hero-muted">doesn't wait.</em><br>
                Neither should <em class="hero-muted">you.</em>
            </h1>
            <p class="hero-subtitle animate-fade-rise-delay">
                We architect AI systems that sharpen decisions, automate complexity, and give forward-thinking businesses the edge they need — before the competition catches up.
            </p>
            <div class="hero-cta animate-fade-rise-delay-2">
                <a href="#contact" class="btn-hero liquid-glass">Begin Journey &rarr;</a>
            </div>
        </div>
        <div class="hero-bottom-bar animate-fade-rise-delay-3">
            <div class="bottom-bar-reel">
                <div class="reel-icon">&#9654;</div>
                <div class="reel-text">
                    <span class="reel-label">Our Reel</span>
                    <span class="reel-title">AI Showreel</span>
                </div>
            </div>
            <div class="bottom-bar-missions">
                <div class="mission-item">
                    <span class="mission-number">1</span>
                    <p>To deliver intelligent AI systems that empower businesses to make sharper, faster decisions.</p>
                </div>
                <div class="mission-item">
                    <span class="mission-number">2</span>
                    <p>To bridge the gap between human ambition and machine intelligence, building a future worth leading.</p>
                </div>
            </div>
            <div class="bottom-bar-socials">
                <a href="#" class="social-icon" aria-label="Facebook">f</a>
                <a href="#" class="social-icon" aria-label="LinkedIn">in</a>
                <a href="#" class="social-icon" aria-label="Instagram">ig</a>
                <a href="#" class="social-icon" aria-label="X">X</a>
            </div>
        </div>
    </section>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: replace hero section with video background and cinematic layout"
```

### Task 5: Replace Hero CSS

**Files:**
- Modify: `styles.css:233-337`

- [ ] **Step 1: Replace existing hero CSS block**

Replace everything from `/* Hero Section */` comment (line 230) through `.hero-subtitle, .hero-cta { transform: translateY(20px); }` (line 337) with:

```css
/* ========================================
   Hero Section — Video Background
   ======================================== */
.hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    padding: 120px 48px 0;
    overflow: hidden;
    background: var(--hero-bg);
}

.hero-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 1;
}

.hero-content {
    position: relative;
    z-index: 2;
    max-width: 720px;
    padding-bottom: 80px;
}

.hero-title {
    font-family: var(--font-display);
    font-size: clamp(3rem, 7vw, 5.5rem);
    font-weight: 400;
    line-height: 0.95;
    letter-spacing: -2.46px;
    margin-bottom: 0;
    color: var(--text-primary);
}

.hero-muted {
    font-style: normal;
    color: var(--hero-text-muted);
}

.hero-subtitle {
    font-size: clamp(0.95rem, 2vw, 1.125rem);
    color: var(--hero-text-muted);
    max-width: 600px;
    margin-top: 2rem;
    line-height: 1.7;
}

.hero-cta {
    margin-top: 3rem;
}

.btn-hero {
    display: inline-block;
    padding: 1.25rem 3.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-primary);
    text-decoration: none;
    border-radius: 50px;
    transition: transform 0.2s ease;
    cursor: pointer;
}

.btn-hero:hover {
    transform: scale(1.03);
}

/* ========================================
   Hero Bottom Bar
   ======================================== */
.hero-bottom-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.bottom-bar-reel {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.reel-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    color: #fff;
    cursor: pointer;
    transition: border-color 0.2s ease;
}

.reel-icon:hover {
    border-color: var(--hero-accent);
}

.reel-text {
    display: flex;
    flex-direction: column;
}

.reel-label {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.reel-title {
    font-size: 0.8rem;
    color: #fff;
    font-weight: 500;
}

.bottom-bar-missions {
    display: flex;
    gap: 2.5rem;
}

.mission-item {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    max-width: 240px;
}

.mission-number {
    font-size: 0.65rem;
    color: var(--hero-accent);
    border: 1px solid rgba(0, 220, 200, 0.25);
    border-radius: 50%;
    min-width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2px;
    flex-shrink: 0;
}

.mission-item p {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.45);
    line-height: 1.5;
    margin: 0;
}

.bottom-bar-socials {
    display: flex;
    gap: 0.6rem;
}

.social-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.4);
    text-decoration: none;
    transition: border-color 0.2s ease, color 0.2s ease;
}

.social-icon:hover {
    border-color: var(--hero-accent);
    color: var(--hero-accent);
}
```

- [ ] **Step 2: Commit**

```bash
git add styles.css
git commit -m "feat: add video hero and bottom bar CSS"
```

---

## Chunk 3: Navigation Updates

### Task 6: Update Navigation Links and Add Glassmorphic Active State

**Files:**
- Modify: `index.html:184-190`
- Modify: `styles.css` — nav section (lines 78–161)

- [ ] **Step 1: Update nav links in index.html**

Replace the `<ul class="nav-menu">` block (lines 184–190) with:

```html
            <ul class="nav-menu">
                <li><a href="index.html" class="nav-link-active liquid-glass">Home</a></li>
                <li><a href="#about">The Team</a></li>
                <li><a href="#services">What We Build</a></li>
                <li><a href="ai-pulse.html">AI Pulse</a></li>
                <li><a href="#contact">Let's Talk</a></li>
            </ul>
```

- [ ] **Step 2: Add glassmorphic active nav link CSS**

Add after the existing `.nav-menu a:hover::after` block (after line 160) in `styles.css`:

```css
.nav-link-active {
    color: var(--text-primary) !important;
    padding: 0.4rem 1rem;
    border-radius: 20px;
}
```

- [ ] **Step 3: Commit**

```bash
git add index.html styles.css
git commit -m "feat: update nav links and add glassmorphic active state"
```

### Task 7: Update Navbar Scroll Colors

**Files:**
- Modify: `animations.js:171-182`

- [ ] **Step 1: Update navbar scroll handler colors**

Replace the `updateNavbar` function (lines 171–182 in `animations.js`) with:

```javascript
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 14, 26, 0.95)';
            navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.06)';
        } else {
            navbar.style.background = 'rgba(10, 14, 26, 0.6)';
            navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.06)';
        }
    }
```

- [ ] **Step 2: Commit**

```bash
git add animations.js
git commit -m "feat: update navbar scroll colors for dark navy hero"
```

---

## Chunk 4: Responsive Design + Light Theme Fix

### Task 8: Add Responsive Styles for Hero

**Files:**
- Modify: `styles.css` — within the `@media (max-width: 768px)` block (after line 1483)

- [ ] **Step 1: Add mobile hero styles**

Inside the existing `@media (max-width: 768px)` block, replace the `.hero-cta` and `.btn` rules (lines 1480–1488) with:

```css
    .hero {
        padding: 100px 24px 0;
    }

    .hero-content {
        max-width: 100%;
        padding-bottom: 60px;
    }

    .hero-title {
        font-size: clamp(2.5rem, 10vw, 3.5rem);
    }

    .hero-cta {
        margin-top: 2rem;
    }

    .btn-hero {
        padding: 1rem 2.5rem;
        font-size: 0.9rem;
    }

    .hero-bottom-bar {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem 1.5rem;
        align-items: flex-start;
    }

    .bottom-bar-missions {
        flex-direction: column;
        gap: 0.75rem;
    }

    .mission-item {
        max-width: 100%;
    }

    .bottom-bar-socials {
        align-self: center;
    }

    .btn {
        width: 100%;
        max-width: 300px;
    }
```

- [ ] **Step 2: Add light theme override for hero**

Add inside the existing `[data-theme="light"]` section (after line 1362):

```css
[data-theme="light"] .hero {
    background: var(--hero-bg);
}

[data-theme="light"] .hero-bottom-bar {
    background: rgba(0, 0, 0, 0.4);
}
```

This ensures the hero always stays dark even in light theme mode, since the video background requires it.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: add responsive hero styles and light theme hero override"
```

---

## Chunk 5: Update Tests + Final Verification

### Task 9: Update Playwright Tests

**Files:**
- Modify: `tests/homepage.spec.ts`

- [ ] **Step 1: Update tests to match new hero markup**

Replace the full content of `tests/homepage.spec.ts` with:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/BaobabCat/i);
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should have video hero section', async ({ page }) => {
    await page.goto('/');
    const video = page.locator('.hero-video');
    await expect(video).toBeVisible();
  });

  test('should have hero headline', async ({ page }) => {
    await page.goto('/');
    const title = page.locator('.hero-title');
    await expect(title).toContainText("The future");
    await expect(title).toContainText("doesn't wait");
  });

  test('should have bottom bar with missions', async ({ page }) => {
    await page.goto('/');
    const bottomBar = page.locator('.hero-bottom-bar');
    await expect(bottomBar).toBeVisible();
  });

  test('should navigate to AI Pulse page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href*="ai-pulse"]');
    await expect(page).toHaveURL(/ai-pulse/);
  });
});
```

- [ ] **Step 2: Run tests to verify**

Run: `npx playwright test tests/homepage.spec.ts`
Expected: All 6 tests PASS

- [ ] **Step 3: Commit**

```bash
git add tests/homepage.spec.ts
git commit -m "test: update homepage tests for video hero redesign"
```

### Task 10: Visual Verification and Final Commit

- [ ] **Step 1: Start local server and visually verify**

Run: `npx serve -l 3000`

Check in browser at `http://localhost:3000`:
- Video plays fullscreen in hero background
- "The future doesn't wait. Neither should you." headline is left-aligned, Instrument Serif
- Muted words are in `rgba(255,255,255,0.4)`
- "Begin Journey →" button has liquid glass effect
- Bottom bar shows reel, 2 mission statements, 4 social placeholders
- Navigation has glassmorphic "Home" pill, updated links
- Fade-rise animations play on load
- Scrolling below hero shows existing sections unchanged
- Mobile responsive (shrink browser or use devtools)

- [ ] **Step 2: Run full test suite**

Run: `npx playwright test`
Expected: All tests pass across homepage, ai-pulse, blog, responsive, contact-form specs

- [ ] **Step 3: Final commit if any adjustments were needed**

```bash
git add -A
git commit -m "feat: complete hero video redesign"
```
