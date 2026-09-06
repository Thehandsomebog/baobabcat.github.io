import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('baobabcat_analytics_consent', 'denied'));
});

test('reader keeps navigation rooted and restores Forward, focus, and scroll', async ({ page, request }) => {
  await page.goto('/blog.html');
  const first = page.locator('.blog-entry').first();
  await first.click();
  await expect(page.locator('.blog-reader')).not.toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('.blog-reader h2').first()).toBeFocused();
  const links = await page.locator('.blog-reader a, .status-bar a').evaluateAll((nodes) => nodes.map((node) => (node as HTMLAnchorElement).href));
  for (const url of new Set(links)) expect((await request.get(url)).status(), url).toBe(200);
  const articleUrl = page.url();
  await page.goBack();
  await expect(page).toHaveURL(/\/blog\.html$/);
  await expect(first).toBeFocused();
  await page.goForward();
  await expect(page).toHaveURL(articleUrl);
  await expect(page.locator('.blog-reader')).toHaveClass(/open/);
  await expect(page.locator('.blog-reader h2').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/blog\.html$/);
  await first.click();
  await page.reload();
  await expect(page.locator('body')).toHaveClass('page-article');
  await expect(page.locator('.status-bar [aria-current="page"]')).toHaveText('2:blog');
});

test('reader does not fetch bodies initially and preserves a fallback on failure', async ({ page }) => {
  const bodies: string[] = [];
  page.on('request', (request) => { if (/\/blog\/.+\/$/.test(request.url())) bodies.push(request.url()); });
  await page.goto('/blog.html');
  expect(bodies).toEqual([]);
  expect(await page.locator('template').count()).toBe(0);
  await page.route('**/blog/*/', (route) => route.fulfill({ status: 503, body: '' }));
  await page.locator('.blog-entry').first().click();
  await expect(page.locator('.blog-reader')).toContainText('preview could not load');
  await expect(page.getByRole('link', { name: 'Open full article' })).toBeFocused();
});

test('late preview responses cannot reopen a closed reader', async ({ page }) => {
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/blog/*/', async (route) => { await gate; await route.continue(); });
  await page.goto('/blog.html');
  await page.locator('.blog-entry').first().click();
  await page.keyboard.press('Escape');
  release();
  await expect(page).toHaveURL(/\/blog\.html$/);
  await expect(page.locator('.blog-reader')).not.toHaveClass(/open/);
});

test('nested 404 retains styling and working recovery links', async ({ page, request }) => {
  const response = await page.goto('/missing/deeply/nested/page.html');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('could not be found');
  expect(await page.locator('link[rel="stylesheet"]').getAttribute('href')).toBe('/styles.css');
  for (const url of await page.locator('.error-actions a').evaluateAll((nodes) => nodes.map((node) => (node as HTMLAnchorElement).href))) {
    expect((await request.get(url)).status()).toBe(200);
  }
});

test('search and filter events have correct semantics and total counts', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('baobabcat_analytics_consent', 'granted'));
  await page.route('https://www.googletagmanager.com/**', (route) => route.fulfill({ body: '' }));
  await page.goto('/blog.html');
  await page.getByRole('button', { name: 'Practical tips', exact: true }).click();
  await page.locator('#blog-search').fill('clean up');
  await expect.poll(() => page.evaluate(() => (window.dataLayer || []).filter((entry) => entry[1] === 'blog_search').length)).toBe(1);
  const events = await page.evaluate(() => (window.dataLayer || []).filter((entry) => entry[0] === 'event').map((entry) => Array.from(entry)));
  expect(events.filter((entry) => entry[1] === 'blog_filter')).toHaveLength(1);
  const search = events.find((entry) => entry[1] === 'blog_search')?.[2] as { result_count: number; query_length_bucket: string };
  expect(search.query_length_bucket).toBe('4-8');
  expect(search.result_count).toBeGreaterThan(12);
  expect(JSON.stringify(events)).not.toContain('clean up');
});

test('publishing removes stale articles from the artifact and gates result claims', ({ browserName }) => {
  test.skip(browserName !== 'chromium');
  const generator = require('../scripts/generate-blog');
  const published = generator.getPublishedPosts();
  expect(() => generator.getPublishedPosts([{ ...published[0], claimsResults: true }])).toThrow(/proofSlug/);
  expect(() => generator.getPublishedPosts([{ ...published[0], slug: '../escape' }])).toThrow(/Invalid slug/);
  const longTitle = 'A complete editorial title that intentionally exceeds the configured publishing length budget';
  expect(generator.getSeoTitle({ ...published[0], seoTitle: longTitle })).toBe(longTitle);
  expect(() => generator.getPublishedPosts([{ ...published[0], seoTitle: longTitle }])).toThrow(/SEO title length/);
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'baobabcat-publish-test-'));
  try {
    const destination = path.join(temporary, 'site');
    const prepare = require('../scripts/prepare-deploy').prepareDeploy;
    prepare(destination, published.slice(0, 2));
    prepare(destination, published.slice(0, 1));
    expect(fs.existsSync(path.join(destination, 'blog', published[1].slug))).toBe(false);
    expect(fs.existsSync(path.join(destination, 'assets/social', `${published[1].slug}.jpg`))).toBe(false);
    expect(fs.existsSync(path.join(destination, 'blog', published[0].slug, 'index.html'))).toBe(true);
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
});
