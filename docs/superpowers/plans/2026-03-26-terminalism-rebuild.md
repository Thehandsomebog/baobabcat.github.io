# BaobabCat Terminal Redesign — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the BaobabCat website with a terminal/tmux aesthetic — dark background, monospace type, bottom status bar navigation, pane borders, typing animations, and a split-pane blog reader.

**Architecture:** Five separate HTML pages (index, manifesto, what-we-do, blog, contact) sharing one CSS file (styles.css) and one JS file (terminal.js). Bottom status bar fixed to viewport bottom provides tmux-style tab navigation. All pages use the same terminal chrome (status bar, colors, fonts). Blog page features a split-pane reader that slides in when a post is clicked.

**Tech Stack:** HTML5, CSS3 (custom properties, flexbox, grid, transitions), vanilla JavaScript, Web3Forms (contact), Google Analytics

---

## Chunk 1: Foundation + Home Page

### Task 1: CSS Theme Foundation (styles.css)

**Files:**
- Create: `styles.css` (complete rewrite)

- [ ] **Step 1: Write CSS reset and custom properties**

```css
/* styles.css — Terminal Theme */
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --bg-primary: #0f0f0f;
    --bg-panel: #1a1a1a;
    --text-primary: #c8c8c8;
    --text-muted: #666;
    --accent-yellow: #febc2e;
    --accent-green: #57c754;
    --accent-red: #e55a5a;
    --border: #333;
    --font-mono: 'Courier New', 'Consolas', 'Monaco', monospace;
    --status-bar-height: 40px;
}

html, body {
    height: 100%;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 15px;
    line-height: 1.6;
}

a {
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.2s;
}

a:hover {
    color: var(--accent-yellow);
}
```

- [ ] **Step 2: Write status bar CSS**

```css
/* Status Bar — fixed bottom navigation */
.status-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--status-bar-height);
    background: var(--bg-panel);
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 16px;
    z-index: 1000;
    font-size: 13px;
}

.status-bar__session {
    color: var(--accent-green);
    margin-right: 24px;
    font-weight: bold;
}

.status-bar__tabs {
    display: flex;
    list-style: none;
    gap: 0;
}

.status-bar__tab {
    padding: 6px 14px;
    color: var(--text-muted);
    cursor: pointer;
    transition: color 0.2s, background 0.2s;
    white-space: nowrap;
}

.status-bar__tab:hover {
    color: var(--text-primary);
}

.status-bar__tab.active {
    background: var(--accent-yellow);
    color: #0f0f0f;
    font-weight: bold;
}

.status-bar__tab a {
    color: inherit;
    text-decoration: none;
}

.status-bar__tab.active a {
    color: inherit;
}

/* Page content must not be hidden behind status bar */
body {
    padding-bottom: var(--status-bar-height);
}
```

- [ ] **Step 3: Write pane/panel utility CSS**

```css
/* Terminal Pane */
.pane {
    border: 1px solid var(--border);
    background: var(--bg-panel);
    border-radius: 2px;
    position: relative;
}

.pane__label {
    color: var(--text-muted);
    font-size: 12px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
}

/* Traffic Lights */
.traffic-lights {
    display: flex;
    gap: 6px;
    padding: 10px 12px;
}

.traffic-lights span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
}

.traffic-lights .red { background: var(--accent-red); }
.traffic-lights .yellow { background: var(--accent-yellow); }
.traffic-lights .green { background: var(--accent-green); }

/* CTA buttons */
.btn-terminal {
    display: inline-block;
    padding: 10px 24px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
    border-radius: 2px;
}

.btn-terminal--primary {
    border-color: var(--accent-yellow);
    color: var(--accent-yellow);
}

.btn-terminal--primary:hover {
    background: var(--accent-yellow);
    color: #0f0f0f;
}

.btn-terminal:hover {
    border-color: #555;
}

/* Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}
```

- [ ] **Step 4: Verify CSS file renders correctly**

Open a browser or serve locally and confirm:
- Dark background (#0f0f0f)
- Monospace font
- Status bar at bottom

Run: `npx serve -l 3000 &` then open localhost:3000

- [ ] **Step 5: Commit**

```bash
git add styles.css
git commit -m "feat: terminal theme CSS foundation with status bar and pane utilities"
```

---

### Task 2: Home Page (index.html)

**Files:**
- Create: `index.html` (complete rewrite)

**Content to preserve:**
- Google Analytics: G-CH13JG6L1S
- Web3Forms key: 372f2f8e-3b9a-4338-aaf3-b24cfd63534b
- Favicon links
- SEO meta tags (updated for new branding)
- Logo: assets/nav-logo.png

- [ ] **Step 1: Write index.html head section**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-CH13JG6L1S"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-CH13JG6L1S');
    </script>

    <title>BaobabCat | Deploy AI. Stay human.</title>
    <meta name="description" content="AI consulting for businesses ready to grow. Strategy, automation, and custom AI solutions.">
    <meta name="keywords" content="AI consulting, AI automation, business AI, AI strategy">
    <meta name="author" content="BaobabCat LLC">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://baobabcat.com/">

    <meta property="og:type" content="website">
    <meta property="og:url" content="https://baobabcat.com/">
    <meta property="og:title" content="BaobabCat | Deploy AI. Stay human.">
    <meta property="og:description" content="AI consulting for businesses ready to grow.">
    <meta property="og:image" content="https://baobabcat.com/og-image.jpg">
    <meta property="og:site_name" content="BaobabCat">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="BaobabCat | Deploy AI. Stay human.">
    <meta name="twitter:description" content="AI consulting for businesses ready to grow.">

    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

    <link rel="stylesheet" href="styles.css">
</head>
```

- [ ] **Step 2: Write index.html body — hero split pane layout**

```html
<body class="page-home">
    <main class="home-split">
        <!-- Left Pane: Hero -->
        <section class="pane home-hero">
            <div class="traffic-lights">
                <span class="red"></span>
                <span class="yellow"></span>
                <span class="green"></span>
            </div>
            <div class="pane__label">~/baobabcat</div>
            <div class="home-hero__content">
                <div class="home-hero__prompt">
                    <span class="prompt-symbol">$ </span>
                    <span id="typed-output" class="typed-text"></span>
                    <span class="cursor">█</span>
                </div>
                <p class="home-hero__subtitle" id="subtitle-text"></p>
                <div class="home-hero__cta">
                    <a href="contact.html" class="btn-terminal btn-terminal--primary">[Begin →]</a>
                    <a href="manifesto.html" class="btn-terminal">[Learn More]</a>
                </div>
            </div>
        </section>

        <!-- Right Pane: Stats -->
        <section class="pane home-stats">
            <div class="pane__label">~/stats</div>
            <div class="home-stats__content">
                <div class="stats-prompt">$ baobabcat status</div>
                <div id="stats-output" class="stats-lines"></div>
            </div>
        </section>
    </main>

    <!-- Status Bar -->
    <nav class="status-bar">
        <span class="status-bar__session">BaobabCat</span>
        <ul class="status-bar__tabs">
            <li class="status-bar__tab active"><a href="index.html">0:home</a></li>
            <li class="status-bar__tab"><a href="manifesto.html">1:manifesto</a></li>
            <li class="status-bar__tab"><a href="what-we-do.html">2:what-we-do</a></li>
            <li class="status-bar__tab"><a href="blog.html">3:blog</a></li>
            <li class="status-bar__tab"><a href="contact.html">4:contact</a></li>
        </ul>
    </nav>

    <script src="terminal.js"></script>
</body>
</html>
```

- [ ] **Step 3: Write home page specific CSS in styles.css**

```css
/* === HOME PAGE === */
.home-split {
    display: flex;
    min-height: calc(100vh - var(--status-bar-height));
    gap: 0;
}

.home-hero {
    flex: 0 0 60%;
    display: flex;
    flex-direction: column;
    border-right: none;
    border-radius: 0;
    border: none;
    border-right: 1px solid var(--border);
}

.home-stats {
    flex: 0 0 40%;
    display: flex;
    flex-direction: column;
    border: none;
    border-radius: 0;
}

.home-hero__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 48px;
}

.home-hero__prompt {
    font-size: 36px;
    margin-bottom: 16px;
    min-height: 100px;
}

.prompt-symbol {
    color: var(--accent-green);
}

.typed-text {
    white-space: pre-wrap;
}

.cursor {
    animation: blink 1.06s step-end infinite;
    color: var(--accent-green);
}

@keyframes blink {
    50% { opacity: 0; }
}

.home-hero__subtitle {
    color: var(--text-muted);
    font-size: 16px;
    margin-bottom: 32px;
    min-height: 24px;
}

.home-hero__cta {
    display: flex;
    gap: 16px;
}

/* Stats pane */
.home-stats__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 32px;
}

.stats-prompt {
    color: var(--accent-green);
    margin-bottom: 20px;
}

.stats-lines .stat-line {
    margin-bottom: 4px;
    opacity: 0;
    transition: opacity 0.3s;
}

.stats-lines .stat-line.visible {
    opacity: 1;
}

.stat-key {
    color: var(--text-muted);
}

.stat-value {
    color: var(--accent-yellow);
}

.stat-status {
    color: var(--accent-green);
    margin-top: 12px;
}
```

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: home page with two-pane hero layout and status bar nav"
```

---

### Task 3: Terminal JavaScript (terminal.js)

**Files:**
- Create: `terminal.js`

- [ ] **Step 1: Write typing animation engine**

```javascript
// terminal.js — Typing animations and interactions

/**
 * Types text character by character into an element.
 * @param {HTMLElement} element - Target element
 * @param {string} text - Text to type
 * @param {number} speed - ms per character
 * @returns {Promise} resolves when done
 */
function typeText(element, text, speed = 50) {
    return new Promise(resolve => {
        let i = 0;
        function tick() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(tick, speed);
            } else {
                resolve();
            }
        }
        tick();
    });
}
```

- [ ] **Step 2: Write home page hero animation sequence**

```javascript
/**
 * Runs the hero typing animation sequence.
 * Line 1: "Deploy AI." in green
 * Line 2: "Stay human." in yellow
 * Then subtitle types out.
 */
async function animateHero() {
    const output = document.getElementById('typed-output');
    const subtitle = document.getElementById('subtitle-text');
    if (!output || !subtitle) return;

    // Create line 1 span
    const line1 = document.createElement('span');
    line1.style.color = 'var(--accent-green)';
    output.appendChild(line1);
    await typeText(line1, 'Deploy AI.', 50);

    // Line break
    output.appendChild(document.createTextNode('\n'));

    // Create line 2 span
    const line2 = document.createElement('span');
    line2.style.color = 'var(--accent-yellow)';
    output.appendChild(line2);
    await typeText(line2, 'Stay human.', 50);

    // Pause, then type subtitle
    await new Promise(r => setTimeout(r, 400));
    await typeText(subtitle, 'AI consulting for businesses ready to grow.', 30);
}
```

- [ ] **Step 3: Write stats typing animation**

```javascript
/**
 * Animates the stats pane, revealing lines one by one.
 */
function animateStats() {
    const container = document.getElementById('stats-output');
    if (!container) return;

    const stats = [
        { key: 'models_deployed    ', value: ': 50+' },
        { key: 'hours_saved_weekly ', value: ': 500+' },
        { key: 'client_satisfaction', value: ': 98%' },
        { key: 'efficiency_gain    ', value: ': 10x' },
        { key: '', value: '' },
        { status: 'status: all systems operational ✓' }
    ];

    stats.forEach((stat, i) => {
        const line = document.createElement('div');
        line.className = 'stat-line';

        if (stat.status) {
            line.className += ' stat-status';
            line.textContent = stat.status;
        } else if (stat.key) {
            const keySpan = document.createElement('span');
            keySpan.className = 'stat-key';
            keySpan.textContent = stat.key;
            line.appendChild(keySpan);

            const valSpan = document.createElement('span');
            valSpan.className = 'stat-value';
            valSpan.textContent = stat.value;
            line.appendChild(valSpan);
        }

        container.appendChild(line);

        setTimeout(() => {
            line.classList.add('visible');
        }, 800 + (i * 300));
    });
}
```

- [ ] **Step 4: Write status bar active tab detection and init**

```javascript
/**
 * Highlights the active status bar tab based on current page filename.
 */
function setActiveTab() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    const tabs = document.querySelectorAll('.status-bar__tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        const link = tab.querySelector('a');
        if (link) {
            const href = link.getAttribute('href');
            if (href === page || (page === '' && href === 'index.html')) {
                tab.classList.add('active');
            }
        }
    });
}

/**
 * Initialize on DOM ready.
 */
document.addEventListener('DOMContentLoaded', () => {
    setActiveTab();

    // Home page animations
    if (document.body.classList.contains('page-home')) {
        animateHero();
        animateStats();
    }
});
```

- [ ] **Step 5: Commit**

```bash
git add terminal.js
git commit -m "feat: terminal.js with typing animations and status bar tab detection"
```

---

### Task 4: Home Page Tests

**Files:**
- Create: `tests/home.spec.ts`

- [ ] **Step 1: Write home page tests**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('has correct title', async ({ page }) => {
        await expect(page).toHaveTitle(/BaobabCat/);
    });

    test('status bar is visible with 5 tabs', async ({ page }) => {
        const statusBar = page.locator('.status-bar');
        await expect(statusBar).toBeVisible();
        const tabs = statusBar.locator('.status-bar__tab');
        await expect(tabs).toHaveCount(5);
    });

    test('home tab is active', async ({ page }) => {
        const homeTab = page.locator('.status-bar__tab.active');
        await expect(homeTab).toContainText('0:home');
    });

    test('hero section has typing output area', async ({ page }) => {
        const output = page.locator('#typed-output');
        await expect(output).toBeVisible();
    });

    test('stats section exists', async ({ page }) => {
        const stats = page.locator('.home-stats');
        await expect(stats).toBeVisible();
    });

    test('CTA buttons link to correct pages', async ({ page }) => {
        const beginBtn = page.locator('a.btn-terminal--primary');
        await expect(beginBtn).toHaveAttribute('href', 'contact.html');

        const learnBtn = page.locator('a.btn-terminal:not(.btn-terminal--primary)');
        await expect(learnBtn).toHaveAttribute('href', 'manifesto.html');
    });

    test('typing animation starts', async ({ page }) => {
        // Wait for first character to appear
        await page.waitForFunction(() => {
            const el = document.getElementById('typed-output');
            return el && el.textContent && el.textContent.length > 0;
        }, null, { timeout: 5000 });
    });
});
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `npx playwright test tests/home.spec.ts --reporter=list`
Expected: All tests PASS

- [ ] **Step 3: Commit**

```bash
git add tests/home.spec.ts
git commit -m "test: home page tests for status bar, hero, stats, and typing animation"
```

---

## Chunk 2: Inner Pages

### Task 5: Manifesto Page (manifesto.html)

**Files:**
- Create: `manifesto.html`

- [ ] **Step 1: Write manifesto.html**

Full page with:
- Same head boilerplate (analytics, meta, favicon, styles.css)
- Single centered pane (max-width 800px), traffic lights, label `~/manifesto`
- Opens with `$ cat MANIFESTO.md`
- Content sections:
  1. "Why 'Deploy AI. Stay human.'" — headers in yellow (#febc2e), body in primary, `---` dividers
  2. Our approach — practical AI, not hype
  3. `$ cat stack.txt` — lists: Claude, GPT-4, n8n, Python, Make
  4. About Dan Djaker — founder bio
- Static content (no typing animations)
- Same status bar nav with tab 1 active
- Script: terminal.js

- [ ] **Step 2: Write manifesto-specific CSS in styles.css**

```css
/* === MANIFESTO PAGE === */
.manifesto-pane {
    max-width: 800px;
    margin: 40px auto;
}

.manifesto-content {
    padding: 24px 32px 40px;
}

.manifesto-content h2 {
    color: var(--accent-yellow);
    font-size: 20px;
    margin: 32px 0 12px;
}

.manifesto-content h2:first-child {
    margin-top: 0;
}

.manifesto-content p {
    margin-bottom: 16px;
    color: var(--text-primary);
}

.manifesto-content hr {
    border: none;
    border-top: 1px solid var(--border);
    margin: 24px 0;
}

.manifesto-content ul {
    list-style: none;
    padding-left: 0;
}

.manifesto-content ul li::before {
    content: '- ';
    color: var(--text-muted);
}

.manifesto-cmd {
    color: var(--accent-green);
    margin-bottom: 20px;
    padding: 12px;
}
```

- [ ] **Step 3: Commit**

```bash
git add manifesto.html styles.css
git commit -m "feat: manifesto page with terminal markdown rendering"
```

---

### Task 6: What We Do Page (what-we-do.html)

**Files:**
- Create: `what-we-do.html`

**Content to preserve from current site:**
- 6 services: AI Strategy & Readiness, AI Workflow Automation, OpenClaw Deployment, Custom AI Solutions, AI Training & Enablement, AI Data & Analytics
- 3 testimonials (from design spec)

- [ ] **Step 1: Write what-we-do.html**

Full page with:
- Head boilerplate
- Services grid: `$ ls ~/services/`
  - 6 cards in 2x3 grid, each with file path label in green, `✓ active` badge, name, description
- Testimonials: `$ cat reviews/*.txt`
  - 3 testimonials formatted as terminal file reads with `───` dividers
- Status bar with tab 2 active
- Script: terminal.js

- [ ] **Step 2: Write what-we-do specific CSS**

```css
/* === WHAT WE DO PAGE === */
.services-section {
    max-width: 1100px;
    margin: 40px auto;
    padding: 0 20px;
}

.services-header {
    color: var(--accent-green);
    font-size: 16px;
    margin-bottom: 24px;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 48px;
}

.service-card {
    border: 1px solid var(--border);
    background: var(--bg-panel);
    padding: 20px 24px;
    border-radius: 2px;
    transition: border-color 0.2s;
}

.service-card:hover {
    border-color: #555;
}

.service-card__path {
    color: var(--accent-green);
    font-size: 12px;
    margin-bottom: 4px;
}

.service-card__status {
    color: var(--accent-green);
    font-size: 11px;
    margin-bottom: 12px;
}

.service-card h3 {
    color: var(--text-primary);
    font-size: 16px;
    margin-bottom: 8px;
}

.service-card p {
    color: var(--text-muted);
    font-size: 13px;
}

/* Testimonials */
.testimonials-section {
    max-width: 800px;
    margin: 0 auto 60px;
    padding: 0 20px;
}

.testimonials-header {
    color: var(--accent-green);
    font-size: 16px;
    margin-bottom: 24px;
}

.testimonial {
    margin-bottom: 32px;
}

.testimonial__file {
    color: var(--accent-green);
    font-size: 13px;
    margin-bottom: 8px;
}

.testimonial__divider {
    color: var(--border);
    margin-bottom: 12px;
    user-select: none;
}

.testimonial__quote {
    color: var(--text-primary);
    font-size: 14px;
    padding-left: 16px;
    margin-bottom: 8px;
}

.testimonial__author {
    color: var(--text-muted);
    font-size: 13px;
    padding-left: 16px;
}
```

- [ ] **Step 3: Commit**

```bash
git add what-we-do.html styles.css
git commit -m "feat: what-we-do page with service grid and testimonials"
```

---

### Task 7: Contact Page (contact.html)

**Files:**
- Create: `contact.html` (complete rewrite)

**Content to preserve:**
- Web3Forms API key: 372f2f8e-3b9a-4338-aaf3-b24cfd63534b
- Redirect URL: https://baobabcat.com/?submitted=true
- Contact info: BaobabCat LLC, 3122 Produce Row Houston TX 77023, baobabcatllc@gmail.com, (510) 299-5399, Dan Djaker

- [ ] **Step 1: Write contact.html**

Full page with:
- Head boilerplate
- Single centered pane (max-width 700px), traffic lights, label `~/contact`
- Contact info section: `$ cat contact.txt` with key-value pairs
- Form styled as terminal prompts: labels like `name    :`, transparent inputs with bottom border, yellow focus state
- SMS consent checkbox styled as `[x]`/`[ ]`
- Submit: `$ send --message` button
- Hidden Web3Forms fields (access key, redirect, subject)
- Status bar with tab 4 active

- [ ] **Step 2: Write contact-specific CSS**

```css
/* === CONTACT PAGE === */
.contact-pane {
    max-width: 700px;
    margin: 40px auto;
}

.contact-info {
    padding: 20px 32px;
    border-bottom: 1px solid var(--border);
}

.contact-info__cmd {
    color: var(--accent-green);
    margin-bottom: 16px;
}

.contact-info__line {
    margin-bottom: 4px;
}

.contact-info__key {
    color: var(--text-muted);
}

.contact-info__value {
    color: var(--accent-yellow);
}

/* Contact Form */
.contact-form {
    padding: 24px 32px 40px;
}

.form-field {
    display: flex;
    align-items: baseline;
    margin-bottom: 16px;
}

.form-field label {
    color: var(--text-muted);
    min-width: 100px;
    flex-shrink: 0;
}

.form-field input,
.form-field textarea {
    flex: 1;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--border);
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 14px;
    padding: 6px 4px;
    outline: none;
    transition: border-color 0.2s;
}

.form-field input:focus,
.form-field textarea:focus {
    border-bottom-color: var(--accent-yellow);
}

.form-field textarea {
    resize: vertical;
    min-height: 80px;
}

/* Terminal-style checkbox */
.form-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 20px 0;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 13px;
}

.form-checkbox input[type="checkbox"] {
    display: none;
}

.form-checkbox__indicator::before {
    content: '[ ]';
    font-family: var(--font-mono);
    color: var(--text-muted);
}

.form-checkbox input:checked + .form-checkbox__indicator::before {
    content: '[x]';
    color: var(--accent-green);
}

.contact-submit {
    margin-top: 24px;
}
```

- [ ] **Step 3: Commit**

```bash
git add contact.html styles.css
git commit -m "feat: contact page with terminal-style form and Web3Forms integration"
```

---

### Task 8: Inner Page Tests

**Files:**
- Create: `tests/inner-pages.spec.ts`

- [ ] **Step 1: Write tests for manifesto, what-we-do, contact**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Manifesto Page', () => {
    test('loads and has correct tab active', async ({ page }) => {
        await page.goto('/manifesto.html');
        const activeTab = page.locator('.status-bar__tab.active');
        await expect(activeTab).toContainText('1:manifesto');
    });

    test('shows manifesto content', async ({ page }) => {
        await page.goto('/manifesto.html');
        await expect(page.locator('.manifesto-pane')).toBeVisible();
        await expect(page.locator('.manifesto-cmd')).toContainText('cat MANIFESTO.md');
    });
});

test.describe('What We Do Page', () => {
    test('loads and has correct tab active', async ({ page }) => {
        await page.goto('/what-we-do.html');
        const activeTab = page.locator('.status-bar__tab.active');
        await expect(activeTab).toContainText('2:what-we-do');
    });

    test('shows 6 service cards', async ({ page }) => {
        await page.goto('/what-we-do.html');
        const cards = page.locator('.service-card');
        await expect(cards).toHaveCount(6);
    });

    test('shows testimonials', async ({ page }) => {
        await page.goto('/what-we-do.html');
        const testimonials = page.locator('.testimonial');
        await expect(testimonials).toHaveCount(3);
    });
});

test.describe('Contact Page', () => {
    test('loads and has correct tab active', async ({ page }) => {
        await page.goto('/contact.html');
        const activeTab = page.locator('.status-bar__tab.active');
        await expect(activeTab).toContainText('4:contact');
    });

    test('shows contact info', async ({ page }) => {
        await page.goto('/contact.html');
        await expect(page.locator('.contact-info')).toBeVisible();
    });

    test('contact form has required fields', async ({ page }) => {
        await page.goto('/contact.html');
        await expect(page.locator('input[name="name"]')).toBeVisible();
        await expect(page.locator('input[name="email"]')).toBeVisible();
        await expect(page.locator('textarea[name="message"]')).toBeVisible();
    });

    test('form has Web3Forms hidden key', async ({ page }) => {
        await page.goto('/contact.html');
        const key = page.locator('input[name="access_key"]');
        await expect(key).toHaveValue('372f2f8e-3b9a-4338-aaf3-b24cfd63534b');
    });
});
```

- [ ] **Step 2: Run tests**

Run: `npx playwright test tests/inner-pages.spec.ts --reporter=list`
Expected: All tests PASS

- [ ] **Step 3: Commit**

```bash
git add tests/inner-pages.spec.ts
git commit -m "test: inner page tests for manifesto, what-we-do, and contact"
```

---

## Chunk 3: Blog + Responsive + Cleanup

### Task 9: Blog Page with Split-Pane Reader (blog.html)

**Files:**
- Create: `blog.html`

- [ ] **Step 1: Write blog.html with directory listing and reader pane**

Full page with:
- Head boilerplate
- Directory listing view: `$ ls -la ~/blog/`
  - 3 posts as clickable rows: permissions, date, read time, filename.md
- Reader pane: hidden by default, slides in from right with tmux border
  - Traffic lights, pane label, rendered markdown content, `[x] close` button
- Status bar with tab 3 active
- Each post's content stored in `<template>` elements or data attributes

- [ ] **Step 2: Write blog-specific CSS**

```css
/* === BLOG PAGE === */
.blog-container {
    display: flex;
    min-height: calc(100vh - var(--status-bar-height));
    position: relative;
    overflow: hidden;
}

.blog-list {
    flex: 1;
    padding: 40px 32px;
    transition: flex 0.3s ease;
    min-width: 0;
}

.blog-list.split {
    flex: 0 0 35%;
}

.blog-list__header {
    color: var(--accent-green);
    font-size: 16px;
    margin-bottom: 24px;
}

.blog-entry {
    display: flex;
    gap: 16px;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 2px;
    transition: background 0.2s;
    font-size: 13px;
}

.blog-entry:hover {
    background: rgba(255, 255, 255, 0.03);
}

.blog-entry__perms {
    color: var(--text-muted);
    flex-shrink: 0;
}

.blog-entry__date {
    color: var(--text-muted);
    flex-shrink: 0;
    min-width: 60px;
}

.blog-entry__time {
    color: var(--text-muted);
    flex-shrink: 0;
    min-width: 40px;
}

.blog-entry__name {
    color: var(--accent-yellow);
}

/* Blog Reader Pane */
.blog-reader {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 65%;
    background: var(--bg-panel);
    border-left: 1px solid var(--border);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.blog-reader.open {
    transform: translateX(0);
}

.blog-reader__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
}

.blog-reader__label {
    color: var(--text-muted);
    font-size: 12px;
}

.blog-reader__close {
    color: var(--accent-red);
    cursor: pointer;
    font-size: 13px;
    background: none;
    border: none;
    font-family: var(--font-mono);
    padding: 4px 8px;
}

.blog-reader__close:hover {
    color: #ff8a8a;
}

.blog-reader__content {
    padding: 24px 32px 40px;
    flex: 1;
}

.blog-reader__content h2 {
    color: var(--accent-yellow);
    font-size: 20px;
    margin-bottom: 16px;
}

.blog-reader__content p {
    margin-bottom: 16px;
    line-height: 1.7;
}

.blog-reader__content code {
    background: rgba(0, 0, 0, 0.3);
    padding: 2px 6px;
    border-radius: 2px;
    font-size: 13px;
}
```

- [ ] **Step 3: Commit**

```bash
git add blog.html styles.css
git commit -m "feat: blog page with directory listing and split-pane reader"
```

---

### Task 10: Blog Split-Pane JavaScript

**Files:**
- Modify: `terminal.js`

- [ ] **Step 1: Add blog pane logic to terminal.js**

```javascript
/**
 * Blog split-pane reader.
 * Clicking an entry opens the reader pane and shrinks the list.
 */
function initBlog() {
    const list = document.querySelector('.blog-list');
    const reader = document.querySelector('.blog-reader');
    const readerContent = document.querySelector('.blog-reader__content');
    const readerLabel = document.querySelector('.blog-reader__label');
    const closeBtn = document.querySelector('.blog-reader__close');

    if (!list || !reader) return;

    // Entry click handler
    document.querySelectorAll('.blog-entry').forEach(entry => {
        entry.addEventListener('click', () => {
            const postId = entry.dataset.post;
            const template = document.getElementById('post-' + postId);
            if (!template) return;

            // Clear and populate reader using DOM cloning
            while (readerContent.firstChild) {
                readerContent.removeChild(readerContent.firstChild);
            }
            const content = template.content.cloneNode(true);
            readerContent.appendChild(content);

            // Update pane label
            if (readerLabel) {
                readerLabel.textContent = '~/blog/' + postId + '.md';
            }

            // Open split
            list.classList.add('split');
            reader.classList.add('open');
        });
    });

    // Close handler
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            reader.classList.remove('open');
            list.classList.remove('split');
        });
    }
}
```

- [ ] **Step 2: Update DOMContentLoaded init to include blog**

Add to the existing DOMContentLoaded handler:

```javascript
    // Blog page
    if (document.body.classList.contains('page-blog')) {
        initBlog();
    }
```

- [ ] **Step 3: Commit**

```bash
git add terminal.js
git commit -m "feat: blog split-pane reader with template cloning"
```

---

### Task 11: Blog Page Tests

**Files:**
- Create: `tests/blog.spec.ts`

- [ ] **Step 1: Write blog tests**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Blog Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/blog.html');
    });

    test('has correct tab active', async ({ page }) => {
        const activeTab = page.locator('.status-bar__tab.active');
        await expect(activeTab).toContainText('3:blog');
    });

    test('shows blog entries', async ({ page }) => {
        const entries = page.locator('.blog-entry');
        await expect(entries).toHaveCount(3);
    });

    test('clicking entry opens reader pane', async ({ page }) => {
        const reader = page.locator('.blog-reader');
        await expect(reader).not.toHaveClass(/open/);

        await page.locator('.blog-entry').first().click();
        await expect(reader).toHaveClass(/open/);
    });

    test('close button hides reader pane', async ({ page }) => {
        await page.locator('.blog-entry').first().click();
        const reader = page.locator('.blog-reader');
        await expect(reader).toHaveClass(/open/);

        await page.locator('.blog-reader__close').click();
        await expect(reader).not.toHaveClass(/open/);
    });

    test('reader shows post content', async ({ page }) => {
        await page.locator('.blog-entry').first().click();
        const content = page.locator('.blog-reader__content');
        await expect(content).not.toBeEmpty();
    });
});
```

- [ ] **Step 2: Run tests**

Run: `npx playwright test tests/blog.spec.ts --reporter=list`
Expected: All tests PASS

- [ ] **Step 3: Commit**

```bash
git add tests/blog.spec.ts
git commit -m "test: blog page tests for split-pane reader interaction"
```

---

### Task 12: Responsive Design

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Add responsive breakpoints**

```css
/* === RESPONSIVE === */

/* Tablet */
@media (max-width: 1023px) {
    .home-hero__content {
        padding: 32px;
    }

    .home-hero__prompt {
        font-size: 28px;
    }

    .services-grid {
        grid-template-columns: 1fr;
    }
}

/* Mobile */
@media (max-width: 767px) {
    /* Stack home panes vertically */
    .home-split {
        flex-direction: column;
    }

    .home-hero {
        flex: none;
        border-right: none;
        border-bottom: 1px solid var(--border);
    }

    .home-stats {
        flex: none;
    }

    .home-hero__content {
        padding: 24px 20px;
    }

    .home-hero__prompt {
        font-size: 22px;
        min-height: auto;
    }

    .home-hero__cta {
        flex-direction: column;
        gap: 12px;
    }

    /* Status bar compact */
    .status-bar {
        font-size: 11px;
        padding: 0 8px;
        overflow-x: auto;
    }

    .status-bar__session {
        display: none;
    }

    .status-bar__tab {
        padding: 6px 10px;
    }

    /* Blog: no split on mobile */
    .blog-list.split {
        flex: 1;
    }

    .blog-reader {
        position: fixed;
        width: 100%;
        left: 0;
        z-index: 999;
    }

    .blog-entry {
        flex-wrap: wrap;
        gap: 4px 12px;
    }

    .blog-entry__perms {
        display: none;
    }

    /* Contact form stack */
    .form-field {
        flex-direction: column;
    }

    .form-field label {
        margin-bottom: 4px;
    }

    /* Pane padding */
    .manifesto-content,
    .contact-form,
    .contact-info {
        padding-left: 16px;
        padding-right: 16px;
    }
}
```

- [ ] **Step 2: Test at mobile viewport manually or with Playwright**

Run: `npx playwright test --reporter=list` (full suite)

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: responsive breakpoints for tablet and mobile"
```

---

### Task 13: Cleanup and Final Verification

**Files:**
- Remove old files no longer needed: `animations.js` (replaced by terminal.js)
- Keep: `ai-pulse.html` (archived, not linked)
- Keep: `assets/nav-logo.png`
- Keep: all service pages in `services/` (can be retained or removed based on preference)

- [ ] **Step 1: Remove animations.js (replaced by terminal.js)**

```bash
git rm animations.js
```

- [ ] **Step 2: Run full test suite**

Run: `npx playwright test --reporter=list`
Expected: All tests PASS

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: remove old animations.js and finalize terminal redesign"
```

- [ ] **Step 4: Push branch**

```bash
git push -u origin terminalism-v1
```

- [ ] **Step 5: Verify deployment (if GitHub Pages is configured for branches)**

Or merge to main when ready.
