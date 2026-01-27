import { test, expect } from '@playwright/test';

test.describe('Blog Page', () => {
  test('should load the blog page', async ({ page }) => {
    await page.goto('/blog.html');
    await expect(page).toHaveTitle(/Blog|Insights/i);
  });

  test('should display blog cards', async ({ page }) => {
    await page.goto('/blog.html');

    // Check that blog cards exist
    const blogCards = page.locator('.blog-card');
    await expect(blogCards.first()).toBeVisible();

    // Verify at least one post is present
    const count = await blogCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have page header with title', async ({ page }) => {
    await page.goto('/blog.html');

    const header = page.locator('.page-header h1');
    await expect(header).toBeVisible();
    await expect(header).toContainText(/Insights|Updates/i);
  });

  test('should have navigation', async ({ page }) => {
    await page.goto('/blog.html');

    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should navigate back to homepage', async ({ page }) => {
    await page.goto('/blog.html');

    await page.click('.nav-logo');
    await expect(page).toHaveURL(/index\.html|\/$/);
  });
});
