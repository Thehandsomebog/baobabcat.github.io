import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('has correct title', async ({ page }) => {
        await expect(page).toHaveTitle(/BaobabCat/);
    });

    test('status bar is visible with 5 tabs', async ({ page }) => {
        const statusBar = page.locator('.status-bar');
        await expect(statusBar).toBeVisible();
        const tabs = statusBar.locator('.status-bar__tab');
        await expect(tabs).toHaveCount(5);
    });

    test('home tab is active', async ({ page }) => {
        const homeTab = page.locator('.status-bar__tab.active');
        await expect(homeTab).toContainText('0:home');
    });

    test('hero section has typing output area', async ({ page }) => {
        const output = page.locator('#typed-output');
        await expect(output).toBeVisible();
    });

    test('stats section exists', async ({ page }) => {
        const stats = page.locator('.home-stats');
        await expect(stats).toBeVisible();
    });

    test('CTA buttons link to correct pages', async ({ page }) => {
        const beginBtn = page.locator('a.btn-terminal--primary');
        await expect(beginBtn).toHaveAttribute('href', 'contact.html');

        const learnBtn = page.locator('a.btn-terminal:not(.btn-terminal--primary)');
        await expect(learnBtn).toHaveAttribute('href', 'manifesto.html');
    });

    test('typing animation starts', async ({ page }) => {
        // Wait for first character to appear
        await page.waitForFunction(() => {
            const el = document.getElementById('typed-output');
            return el && el.textContent && el.textContent.length > 0;
        }, null, { timeout: 5000 });
    });
});
