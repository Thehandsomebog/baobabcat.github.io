import { test, expect } from '@playwright/test';

test.describe('Responsive touch and layout behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('baobabcat_analytics_consent', 'denied'));
  });

  test('bottom navigation remains usable and touch-sized', async ({ page }) => {
    await page.goto('/');
    for (const link of await page.locator('.status-bar__tab a').all()) {
      const box = await link.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('article titles wrap without horizontal overflow', async ({ page }) => {
    await page.goto('/blog/what-to-clean-up-before-ai-touches-your-partial-completion-billing-rules/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('archive article taps navigate to the standalone page below desktop width', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This behavior is specific to touch-sized projects.');
    await page.goto('/blog.html');
    const href = await page.locator('.blog-entry').first().getAttribute('href');
    await page.locator('.blog-entry').first().click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
  });

  test('contact fields stay visible when focused', async ({ page }) => {
    await page.goto('/contact.html');
    await page.locator('#message').focus();
    await page.locator('#message').scrollIntoViewIfNeeded();
    await expect(page.locator('#message')).toBeInViewport();
  });
});
