# BaobabCat Terminal Design — Design Spec

## Overview

Complete visual rebuild of the BaobabCat website using a terminal/tmux aesthetic. Dark background, monospace typography, tmux-style bottom status bar navigation, pane borders, and terminal interactions. The design looks like a terminal but remains intuitive for non-technical visitors.

## Global Chrome

### Bottom Status Bar (Navigation)
- Fixed to bottom of viewport, always visible
- Left side: `BaobabCat` session name (like tmux session label)
- Center/right: tabs `0:home | 1:manifesto | 2:what-we-do | 3:blog | 4:contact`
- Active tab: `#febc2e` yellow background with dark text
- Inactive tabs: `#666` text, hover brightens to `#c8c8c8`
- Bar background: `#1a1a1a` with `1px solid #333` top border
- Height: ~40px, monospace font

### No Top Bar
- No traditional navbar or header
- Branding lives in the status bar (session name) and hero section
- Traffic lights (red/yellow/green dots) used decoratively on key panels

### Typography
- All text: `'Courier New', 'Consolas', 'Monaco', monospace`
- No serif or sans-serif fonts anywhere
- Text color: `#c8c8c8` (primary), `#666` (muted/comments), `#febc2e` (accent), `#57c754` (green/success)

### Colors
- `--bg-primary: #0f0f0f` (page background)
- `--bg-panel: #1a1a1a` (panel/card backgrounds)
- `--text-primary: #c8c8c8`
- `--text-muted: #666`
- `--accent-yellow: #febc2e` (tmux active, highlights)
- `--accent-green: #57c754` (prompts, success, active status)
- `--accent-red: #e55a5a` (traffic light, errors)
- `--border: #333` (pane borders)

### Pane Borders
- Terminal pane borders: `1px solid #333`
- Used on content sections, cards, panels
- Rounded corners: `0` (terminals don't have rounded corners) — or `2px` max

## Pages

Each page is a separate HTML file. Clicking a status bar tab navigates to that page (not single-page scroll).

### 0:home (index.html)

**Layout:** Two-pane split (like tmux vertical split)

**Left pane (~60% width):**
- Traffic lights (●●●) in top-left corner of pane
- Pane label: `~/baobabcat` in muted text
- `$ _` blinking cursor, then typing animation for:
  - Line 1: `Deploy AI.` (green)
  - Line 2: `Stay human.` (yellow)
- Subtitle types out after: `AI consulting for businesses ready to grow.`
- Two CTA buttons styled as terminal commands:
  - `[Begin →]` (yellow border) → links to contact
  - `[Learn More]` (muted border) → links to manifesto

**Right pane (~40% width):**
- Pane label: `~/stats`
- Simulated terminal session that types out line by line:
  ```
  $ baobabcat status

  models_deployed    : 50+
  hours_saved_weekly : 500+
  client_satisfaction: 98%
  efficiency_gain    : 10x

  status: all systems operational ✓
  ```
- Each line appears with a slight delay (typewriter effect)
- Values in yellow, keys in muted, `✓` in green

**Responsive (mobile):** Panes stack vertically — left on top, right below.

### 1:manifesto (manifesto.html)

**Layout:** Single centered pane (max-width ~800px)

- Traffic lights in top-left
- Pane label: `~/manifesto`
- Opens with: `$ cat MANIFESTO.md`
- Content rendered like a markdown file in terminal:
  - `#` headers in yellow
  - Body text in primary color
  - `---` horizontal rules as section dividers
  - Bullet points with `-` prefix
- Sections:
  1. Why "Deploy AI. Stay human."
  2. Our approach — practical AI, not hype
  3. `$ cat stack.txt` — lists tools: Claude, GPT-4, n8n, Python, Make
  4. About Dan Djaker — founder bio
- Content is static (no typing animations — it's a "rendered file")

### 2:what-we-do (what-we-do.html)

**Layout:** Services grid + testimonials section

**Services section:**
- Header: `$ ls ~/services/`
- 6 service cards in a 2x3 grid (or 3x2)
- Each card:
  - Top line: `~/services/ai-strategy` (file path style, in green)
  - `✓ active` status badge (green)
  - Service name as heading
  - Description paragraph
  - `$ info →` link to learn more (or just descriptive)
- Cards have pane borders (`1px solid #333`), `#1a1a1a` background

**Testimonials section (below services):**
- Header: `$ cat reviews/*.txt`
- 3 testimonials, each formatted as:
  ```
  $ cat reviews/techflow.txt
  ───────────────────────────────
  "Cut our support response time by 80%. Their OpenClaw deployment
  handles thousands of inquiries daily."

  — James Mitchell, CEO, TechFlow Solutions
  ───────────────────────────────
  ```
- Testimonials displayed sequentially (not in a grid)
- File path in green, quote in primary, attribution in muted

**Responsive:** Service cards go to single column on mobile.

### 3:blog (blog.html)

**Layout:** Split-pane interaction (the standout feature)

**Default state — left pane (full width):**
- Header: `$ ls -la ~/blog/`
- Blog posts listed as a directory listing:
  ```
  -rw-r--r--  Mar 26  8min  how-we-cut-response-time-80-percent.md
  -rw-r--r--  Mar 20  5min  ai-automation-for-small-business.md
  -rw-r--r--  Mar 15  6min  why-deploy-ai-stay-human.md
  ```
- Each row is clickable
- Date, read time, filename as the title (kebab-case, `.md` extension)

**After clicking a post — split pane:**
- Left pane shrinks to ~35% width, becomes the blog list (still visible)
- Right pane slides in from the right (~65% width) with a tmux-style vertical border
- Right pane shows the full blog post:
  - Traffic lights in top-right of pane
  - Pane label: `~/blog/post-name.md`
  - Content rendered as markdown in terminal (headers in yellow, body in primary, code blocks in darker bg)
  - `[x] close` button to collapse back to full-width list

**Responsive (mobile):** No split — clicking a post opens it full-screen with a back button.

**Note:** Blog posts are written content (not the auto-updating AI Pulse feed). Posts can be stored as HTML sections or separate files.

### 4:contact (contact.html)

**Layout:** Single centered pane (max-width ~700px)

- Traffic lights in top-left
- Pane label: `~/contact`

**Contact info section:**
```
$ cat contact.txt

name     : BaobabCat LLC
location : 3122 Produce Row, Houston, TX 77023
email    : baobabcatllc@gmail.com
phone    : (510) 299-5399
founder  : Dan Djaker
```

**Contact form (below):**
- Styled as terminal input prompts:
  ```
  name    : [________________]
  email   : [________________]
  phone   : [________________]
  message : [________________]
            [________________]
            [________________]
  ```
- Input fields: transparent background, bottom-border only (`1px solid #333`), monospace text
- Focus state: border changes to `#febc2e` yellow
- SMS consent checkbox styled with `[x]` / `[ ]` terminal checkbox
- Submit button: `$ send --message` (yellow border, hover fills yellow with dark text)

**Form backend:** Web3Forms (same as current site)

## Interactions & Animations

### Typing Animation (home page)
- Characters appear one at a time (~50ms per character)
- Blinking cursor (`█`) at end of current line
- Cursor blinks at ~530ms interval
- After all lines typed, cursor remains blinking on last line

### Status Bar Tab Switching
- Active tab has `#febc2e` background — switches on page load based on current page
- No animation needed — standard page navigation

### Blog Pane Split
- Right pane slides in from right over ~300ms (`transform: translateX`)
- Left pane width transition ~300ms
- Tmux-style border appears between panes

### Hover States
- Links: muted → yellow on hover
- Cards: border `#333` → `#555` on hover
- Status bar tabs: text brightens on hover

## Scope

### Files Created
- `index.html` — home page (complete rewrite)
- `manifesto.html` — new page
- `what-we-do.html` — services + testimonials
- `blog.html` — blog with split-pane reading
- `contact.html` — contact form
- `styles.css` — complete rewrite
- `terminal.js` — typing animations, blog split-pane, status bar active state

### Files Retained
- `assets/nav-logo.png` — may reuse or replace
- `assets/hero-video.mp4` — not used in terminal design
- `ai-pulse.html` — kept but not linked (archived)
- Form backend (Web3Forms) — same API key and setup

### Files Not Changed
- `.github/workflows/` — deployment stays the same
- `playwright.config.ts` — test config stays
- `tests/` — will need updating for new pages

## Responsive Breakpoints
- Desktop: ≥1024px — full two-pane layouts
- Tablet: 768–1023px — smaller panes, same layout
- Mobile: <768px — single column, panes stack, status bar becomes compact bottom tabs
