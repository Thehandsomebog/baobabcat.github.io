import { test, expect } from '@playwright/test';
// The generated blog list should mirror the first published post in source content.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const posts = require('../content/posts.cjs');

test.describe('Blog Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog.html');
  });

  test('has the blog tab active', async ({ page }) => {
    await expect(page.locator('.status-bar__tab.active')).toContainText('2:blog');
  });

  test('shows blog entries', async ({ page }) => {
    await expect.poll(async () => page.locator('.blog-entry').count()).toBeGreaterThanOrEqual(6);
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
    const newestPublishedSlug = posts.find((post: { status: string; slug: string }) => post.status === 'published')?.slug;

    expect(newestPublishedSlug).toBeTruthy();
    await expect(firstEntry).toHaveAttribute('data-post', newestPublishedSlug);
  });

  test('opens the reader when clicking a post', async ({ page }) => {
    const reader = page.locator('.blog-reader');
    await expect(reader).not.toHaveClass(/open/);
    await page.locator('.blog-entry').first().click();
    await expect(reader).toHaveClass(/open/);
    await expect(page.locator('.blog-reader__content')).not.toBeEmpty();
  });
});
