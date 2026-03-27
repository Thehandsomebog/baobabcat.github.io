import { test, expect } from '@playwright/test';

test.describe('Blog Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/blog.html');
    });

    test('has correct tab active', async ({ page }) => {
        const activeTab = page.locator('.status-bar__tab.active');
        await expect(activeTab).toContainText('3:blog');
    });

    test('shows blog entries', async ({ page }) => {
        const entries = page.locator('.blog-entry');
        await expect(entries).toHaveCount(3);
    });

    test('clicking entry opens reader pane', async ({ page }) => {
        const reader = page.locator('.blog-reader');
        await expect(reader).not.toHaveClass(/open/);

        await page.locator('.blog-entry').first().click();
        await expect(reader).toHaveClass(/open/);
    });

    test('close button hides reader pane', async ({ page }) => {
        await page.locator('.blog-entry').first().click();
        const reader = page.locator('.blog-reader');
        await expect(reader).toHaveClass(/open/);

        await page.locator('.blog-reader__close').click();
        await expect(reader).not.toHaveClass(/open/);
    });

    test('reader shows post content', async ({ page }) => {
        await page.locator('.blog-entry').first().click();
        const content = page.locator('.blog-reader__content');
        await expect(content).not.toBeEmpty();
    });
});
