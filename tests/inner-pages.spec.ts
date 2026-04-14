import { test, expect } from '@playwright/test';

test.describe('Core page existence', () => {
  test('services page exists', async ({ page }) => {
    await page.goto('/services.html');
    await expect(page.locator('.status-bar__tab.active')).toContainText('1:services');
    await expect(page.locator('h1')).toContainText('Services');
  });

  test('case studies page exists', async ({ page }) => {
    await page.goto('/case-studies.html');
    await expect(page.locator('.status-bar__tab.active')).toContainText('3:cases');
    await expect(page.locator('h1')).toContainText('Proof');
  });

  test('contact page contains the contact form', async ({ page }) => {
    await page.goto('/contact.html');
    await expect(page.locator('form.contact-form')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('privacy page exists', async ({ page }) => {
    await page.goto('/privacy.html');
    await expect(page.locator('h1')).toContainText('Privacy');
  });

  test('404 page exists', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page.locator('.error-code')).toContainText('404');
  });
});

test.describe('Service hub and detail pages', () => {
  const detailPages = [
    '/services/ai-strategy.html',
    '/services/ai-automation.html',
    '/services/openclaw.html',
    '/services/custom-ai.html',
    '/services/ai-training.html',
    '/services/ai-analytics.html',
  ];

  test('services hub links to every detail page', async ({ page }) => {
    await page.goto('/services.html');
    for (const path of detailPages) {
      await expect(page.locator(`a[href="${path.replace(/^\//, '')}"]`).first()).toBeVisible();
    }
  });

  for (const path of detailPages) {
    test(`detail page ${path} renders and keeps services nav active`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('.status-bar__tab.active')).toContainText('1:services');
      await expect(page.locator('.service-offer h1')).toBeVisible();
      await expect(page.getByRole('link', { name: '[Contact]' })).toBeVisible();
    });
  }
});
