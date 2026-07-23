import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  '/',
  '/services.html',
  '/services/ai-automation.html',
  '/blog.html',
  '/blog/why-ai-pilots-stall/',
  '/case-studies.html',
  '/contact.html',
  '/privacy.html',
  '/manifesto.html',
];

test.describe('Automated accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('baobabcat_analytics_consent', 'denied'));
  });

  for (const path of pages) {
    test(`${path} has no serious or critical axe violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      const blockers = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''));
      expect(blockers).toEqual([]);
    });
  }

  test('desktop reader state remains accessible', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Reader behavior is covered once; page-level axe runs cross-browser.');
    await page.goto('/blog.html');
    await page.locator('.blog-entry').first().click();
    await expect(page.locator('.blog-reader')).toHaveClass(/open/);
    const results = await new AxeBuilder({ page }).include('.blog-container').analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
  });
});
