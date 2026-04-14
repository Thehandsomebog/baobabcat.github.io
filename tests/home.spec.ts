import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has the home tab active', async ({ page }) => {
    await expect(page.locator('.status-bar__tab.active')).toContainText('0:home');
  });

  test('shows the terminal entrance and continue interaction', async ({ page }) => {
    await expect(page.locator('#typed-output')).toBeVisible();
    await expect(page.locator('[data-continue]')).toBeVisible();
  });

  test('renders homepage sections for services, blog preview, and contact CTA', async ({ page }) => {
    await expect(page.locator('.section-title').filter({ hasText: 'Services' })).toBeVisible();
    await expect(page.locator('.section-title').filter({ hasText: 'Recent blog posts' })).toBeVisible();
    await expect(page.locator('.post-preview')).toHaveCount(3);
    await expect(page.locator('.section-title').filter({ hasText: 'Need help turning AI into working systems?' })).toBeVisible();
  });

  test('top-level nav points to active terminal pages only', async ({ page }) => {
    const links = page.locator('.status-bar__tab a');
    await expect(links).toHaveCount(5);
    await expect(links.nth(0)).toHaveAttribute('href', 'index.html');
    await expect(links.nth(1)).toHaveAttribute('href', 'services.html');
    await expect(links.nth(2)).toHaveAttribute('href', 'blog.html');
    await expect(links.nth(3)).toHaveAttribute('href', 'case-studies.html');
    await expect(links.nth(4)).toHaveAttribute('href', 'contact.html');
  });
});
