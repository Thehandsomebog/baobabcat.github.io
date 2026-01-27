import { test, expect } from '@playwright/test';

test.describe('AI Pulse Page', () => {
  test('should load the AI Pulse page', async ({ page }) => {
    await page.goto('/ai-pulse.html');
    await expect(page).toHaveTitle(/AI Pulse/i);
  });

  test('should display feed posts', async ({ page }) => {
    await page.goto('/ai-pulse.html');

    // Check that feed posts exist
    const feedPosts = page.locator('.feed-post');
    await expect(feedPosts.first()).toBeVisible();

    // Verify at least one post is present
    const count = await feedPosts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have working filter buttons', async ({ page }) => {
    await page.goto('/ai-pulse.html');

    // Check filter buttons exist
    const filterAll = page.locator('.filter-btn[data-filter="all"]');
    const filterNews = page.locator('.filter-btn[data-filter="news"]');
    const filterTools = page.locator('.filter-btn[data-filter="tools"]');
    const filterBusiness = page.locator('.filter-btn[data-filter="business"]');

    await expect(filterAll).toBeVisible();
    await expect(filterNews).toBeVisible();
    await expect(filterTools).toBeVisible();
    await expect(filterBusiness).toBeVisible();

    // The "All" filter should be active by default
    await expect(filterAll).toHaveClass(/active/);
  });

  test('should filter posts when clicking filter buttons', async ({ page }) => {
    await page.goto('/ai-pulse.html');

    // Click on News filter
    await page.click('.filter-btn[data-filter="news"]');

    // Check that News filter is now active
    const filterNews = page.locator('.filter-btn[data-filter="news"]');
    await expect(filterNews).toHaveClass(/active/);

    // The "All" filter should no longer be active
    const filterAll = page.locator('.filter-btn[data-filter="all"]');
    await expect(filterAll).not.toHaveClass(/active/);
  });

  test('should have navigation back to homepage', async ({ page }) => {
    await page.goto('/ai-pulse.html');

    // Click on the logo to go back to homepage
    await page.click('.nav-logo');
    await expect(page).toHaveURL(/index\.html|\/$/);
  });
});
