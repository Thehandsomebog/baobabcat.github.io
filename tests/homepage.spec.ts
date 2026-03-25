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
