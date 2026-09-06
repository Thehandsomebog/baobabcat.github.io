import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  '/',
  '/services.html',
  '/services/ai-automation.html',
  '/services/ai-strategy.html',
  '/services/ai-training.html',
  '/services/ai-analytics.html',
  '/services/custom-ai.html',
  '/services/openclaw.html',
  '/blog.html',
  '/blog/why-ai-pilots-stall/',
  '/blog/what-to-clean-up-before-ai-touches-your-customer-requested-technician-rules/',
  '/blog/response-time/',
  '/case-studies.html',
  '/contact.html',
  '/privacy.html',
  '/manifesto.html',
  '/404.html',
];

test.describe('Automated accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('baobabcat_analytics_consent', 'denied'));
  });

  for (const path of pages) {
    test(`${path} has no serious or critical axe violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test('desktop reader state remains accessible', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Reader behavior is covered once; page-level axe runs cross-browser.');
    await page.goto('/blog.html');
    await page.locator('.blog-entry').first().click();
    await expect(page.locator('.blog-reader')).toHaveClass(/open/);
    await expect(page.locator('.blog-reader')).not.toHaveAttribute('aria-busy', 'true');
    const results = await new AxeBuilder({ page }).include('.blog-container').analyze();
    expect(results.violations).toEqual([]);
  });

  test('consent controls and contact success/error states remain accessible', async ({ page }) => {
    await page.goto('/contact.html');
    await page.getByRole('button', { name: 'Change analytics privacy choice' }).click();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.getByRole('button', { name: 'Not now' }).click();
    await page.getByRole('button', { name: '[Send message]' }).click();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('Mocked accessibility check');
    await page.route('https://api.web3forms.com/submit', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }));
    await page.getByRole('button', { name: '[Send message]' }).click();
    await expect(page.locator('#form-success')).toHaveClass(/is-visible/);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });
});
