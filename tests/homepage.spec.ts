import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/BaobabCat/i);
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');

    // Check for main navigation elements
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should navigate to AI Pulse page', async ({ page }) => {
    await page.goto('/');

    // Find and click AI Pulse link
    await page.click('a[href*="ai-pulse"]');
    await expect(page).toHaveURL(/ai-pulse/);
  });
});
