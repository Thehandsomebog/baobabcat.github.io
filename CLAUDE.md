# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BaobabCat is a static business consulting website hosted on GitHub Pages. It features a dark theme inspired by Superlist.com, with an AI news aggregation page that auto-updates hourly.

## Common Commands

```bash
# Run Playwright tests (requires local server)
npm test

# Run tests with browser visible
npm run test:headed

# Run tests in debug mode
npm run test:debug

# View test report
npm run test:report

# Start local dev server (port 3000)
npx serve -l 3000

# Fetch fresh AI news (updates ai-pulse.html)
node scripts/fetch-ai-news.js
```

## Architecture

### Static Site Structure
- **index.html** - Main homepage with sections: hero, about, services, testimonials, contact form
- **ai-pulse.html** - AI news feed page with filterable posts (auto-updated by GitHub Actions)
- **blog.html**, **privacy.html** - Supporting pages
- **styles.css** - Single CSS file with dark theme variables and responsive breakpoints
- **animations.js** - Scroll animations via Intersection Observer, mobile nav toggle, form handling

### AI News System
- **scripts/fetch-ai-news.js** - Node.js script that fetches Google News RSS feeds, parses them, and updates ai-pulse.html
- **.github/workflows/update-ai-news.yml** - Runs hourly to auto-update the news feed
- **.github/workflows/static.yml** - Deploys to GitHub Pages on push to main

### Testing
- Tests live in `tests/` directory using Playwright
- Config in `playwright.config.ts` - uses Brave browser, spins up local server automatically
- Base URL: `http://localhost:3000`

### Contact Form
- Uses Web3Forms API for submission (access key in hidden form field)
- Redirects to `https://baobabcat.com/?submitted=true` on success
- SMS consent checkbox required

## CSS Variables

Theme colors are defined at the top of `styles.css`:
- `--bg-primary: #0a0a0f` (main background)
- `--accent-primary: #ff6b35` (baobab orange)
- `--text-primary: #ffffff`

## Issue Tracking

This project uses **bd** (beads) for issue tracking. See AGENTS.md for the workflow.
