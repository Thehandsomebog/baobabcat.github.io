import { test, expect } from '@playwright/test';

test.describe('Manifesto Page', () => {
    test('loads and has correct tab active', async ({ page }) => {
        await page.goto('/manifesto.html');
        const activeTab = page.locator('.status-bar__tab.active');
        await expect(activeTab).toContainText('1:manifesto');
    });

    test('shows manifesto content', async ({ page }) => {
        await page.goto('/manifesto.html');
        await expect(page.locator('.manifesto-pane')).toBeVisible();
        await expect(page.locator('.manifesto-cmd').first()).toContainText('cat MANIFESTO.md');
    });
});

test.describe('What We Do Page', () => {
    test('loads and has correct tab active', async ({ page }) => {
        await page.goto('/what-we-do.html');
        const activeTab = page.locator('.status-bar__tab.active');
        await expect(activeTab).toContainText('2:what-we-do');
    });

    test('shows 6 service cards', async ({ page }) => {
        await page.goto('/what-we-do.html');
        const cards = page.locator('.service-card');
        await expect(cards).toHaveCount(6);
    });

    test('shows testimonials', async ({ page }) => {
        await page.goto('/what-we-do.html');
        const testimonials = page.locator('.testimonial');
        await expect(testimonials).toHaveCount(3);
    });
});

test.describe('Contact Page', () => {
    test('loads and has correct tab active', async ({ page }) => {
        await page.goto('/contact.html');
        const activeTab = page.locator('.status-bar__tab.active');
        await expect(activeTab).toContainText('4:contact');
    });

    test('shows contact info', async ({ page }) => {
        await page.goto('/contact.html');
        await expect(page.locator('.contact-info')).toBeVisible();
    });

    test('contact form has required fields', async ({ page }) => {
        await page.goto('/contact.html');
        await expect(page.locator('input[name="name"]')).toBeVisible();
        await expect(page.locator('input[name="email"]')).toBeVisible();
        await expect(page.locator('textarea[name="message"]')).toBeVisible();
    });

    test('form has Web3Forms hidden key', async ({ page }) => {
        await page.goto('/contact.html');
        const key = page.locator('input[name="access_key"]');
        await expect(key).toHaveValue('372f2f8e-3b9a-4338-aaf3-b24cfd63534b');
    });
});
