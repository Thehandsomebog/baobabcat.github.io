import { test, expect } from '@playwright/test';

const latestPostTitle = 'AI authorized-contact review for commercial service teams';

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
    await page.locator('.blog-entry').first().click();
    await expect(page.locator('.blog-reader__content')).toContainText(latestPostTitle);
  });

  test('opens the reader when clicking a post', async ({ page }) => {
    const reader = page.locator('.blog-reader');
    await expect(reader).not.toHaveClass(/open/);
    await page.locator('.blog-entry').first().click();
    await expect(reader).toHaveClass(/open/);
    await expect(page.locator('.blog-reader__content')).not.toBeEmpty();
  });
});
