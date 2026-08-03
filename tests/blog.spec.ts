import { test, expect } from '@playwright/test';

// Keep the blog ordering test aligned with the generated source of truth.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const posts = require('../content/posts.cjs');
const newestPublishedSlug = [...posts]
  .filter((post) => (post.status || 'published') === 'published')
  .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())[0]?.slug;
const newestPublishedTitle = [...posts]
  .filter((post) => (post.status || 'published') === 'published')
  .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())[0]?.title;

test.describe('Blog Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog.html');
  });

  test('has the blog tab active', async ({ page }) => {
    await expect(page.locator('.status-bar__tab.active')).toContainText('2:blog');
  });

  test('shows blog entries', async ({ page }) => {
    await expect.poll(async () => page.locator('.blog-entry').count()).toBeGreaterThanOrEqual(6);
    await expect(page.locator('.blog-entry:visible')).toHaveCount(12);
    await expect(page.locator('.blog-entry').first()).toHaveAttribute('href', /\/blog\/.+\/$/);
  });

  test('shows the latest generated post title', async ({ page }) => {
    const firstEntry = page.locator('.blog-entry').first();
    const postId = await firstEntry.getAttribute('data-post');

    expect(postId).not.toBeNull();

    const expectedTitle = await page.evaluate((id) => {
      const template = document.getElementById(`post-${id}`) as HTMLTemplateElement | null;
      return template?.content.querySelector('h2')?.textContent?.trim() ?? '';
    }, postId);

    await firstEntry.click();
    await expect(page.locator('.blog-reader__content')).toContainText(expectedTitle);
  });

  test('shows the newest published post first after generation', async ({ page }) => {
    const firstEntry = page.locator('.blog-entry').first();

    expect(newestPublishedSlug).toBeTruthy();
    await expect(firstEntry).toHaveAttribute('data-post', newestPublishedSlug);
  });

  test('renders the newest published post as the first readable entry', async ({ page }) => {
    const firstEntry = page.locator('.blog-entry').first();

    expect(newestPublishedSlug).toBeTruthy();
    expect(newestPublishedTitle).toBeTruthy();

    await expect(firstEntry).toHaveAttribute('data-post', newestPublishedSlug);
    await firstEntry.click();
    await expect(page.locator('.blog-reader__content')).toContainText(newestPublishedTitle);
  });

  test('opens the reader when clicking a post', async ({ page }) => {
    const reader = page.locator('.blog-reader');
    const firstEntry = page.locator('.blog-entry').first();
    await expect(reader).not.toHaveClass(/open/);
    await firstEntry.click();
    await expect(reader).toHaveClass(/open/);
    await expect(page.locator('.blog-reader__content')).not.toBeEmpty();
    await expect(firstEntry).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.blog-reader__content h2')).toBeFocused();
  });

  test('uses concise archive titles while preserving the full article title', async ({ page }) => {
    const seriesEntry = page.locator(
      '.blog-entry[data-post="what-to-clean-up-before-ai-touches-your-customer-data-retention-rules"]',
    );
    await expect(seriesEntry.locator('.blog-entry__series')).toContainText('Before AI touches');
    await expect(seriesEntry.locator('.blog-entry__name')).toHaveText('Customer data retention rules');
    await seriesEntry.click();
    await expect(page.locator('.blog-reader__content h2')).toContainText('What to clean up before AI touches');
  });

  test('filters the archive by topic and search text', async ({ page }) => {
    await page.getByRole('button', { name: 'Strategy', exact: true }).click();
    await expect(page.locator('.blog-entry:visible')).not.toHaveCount(0);
    await expect(page.locator('.blog-entry:visible').first()).toHaveAttribute('data-category', 'strategy-opinion');

    await page.locator('#blog-search').fill('supervisor interrupt');
    await expect(page.locator('.blog-entry:visible')).toHaveCount(1);
    await expect(page.locator('.blog-entry:visible').first()).toContainText('supervisor interrupt');
  });

  test('loads more articles without hiding the initial archive', async ({ page }) => {
    await page.getByRole('button', { name: '[Show more articles]' }).click();
    await expect(page.locator('.blog-entry:visible')).toHaveCount(24);
  });
});
