import { test, expect } from '@playwright/test';

test.describe('Consent-aware analytics contract', () => {
  test('does not request GA4 before consent', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));
    await page.goto('/');
    await page.waitForTimeout(200);
    expect(requests.some((url) => url.includes('googletagmanager.com/gtag'))).toBe(false);
  });

  test('loads after consent and strips unapproved parameters', async ({ page }) => {
    await page.route('https://www.googletagmanager.com/**', (route) => route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: '',
    }));
    await page.goto('/');
    await page.getByRole('button', { name: 'Allow analytics' }).click();
    await expect(page.locator('#baobabcat-ga4')).toHaveCount(1);
    await page.evaluate(() => {
      window.BaobabAnalytics.track('contact_form_error', {
        page: '/contact.html',
        error_type: 'network',
        email: 'must-not-leak@example.com',
      });
    });
    const dataLayer = await page.evaluate(() => (window.dataLayer || []).map((entry) => Array.from(entry)));
    const event = dataLayer.find((entry) => entry[0] === 'event' && entry[1] === 'contact_form_error');
    expect(event?.[2]).toEqual({ page: '/contact.html', error_type: 'network' });
  });

  test('persists decline and provides a preferences launcher', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Not now' }).click();
    await expect(page.getByRole('button', { name: 'Change analytics privacy choice' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('region', { name: 'Analytics preference' })).not.toBeVisible();
  });

  test('keeps optional analytics non-modal and does not steal initial focus', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('region', { name: 'Analytics preference' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Allow analytics' })).not.toBeFocused();
  });
});
