import { test, expect } from '@playwright/test';

test.describe('Contact form states', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('baobabcat_analytics_consent', 'denied'));
    await page.goto('/contact.html');
  });

  test('associates validation feedback and focuses the first invalid field', async ({ page }) => {
    await page.getByRole('button', { name: '[Send message]' }).click();
    await expect(page.locator('#form-status')).toContainText('highlighted');
    await expect(page.locator('#name')).toBeFocused();
    await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
  });

  test('submits once, announces progress, and clears only on success', async ({ page }) => {
    let requests = 0;
    await page.route('https://api.web3forms.com/submit', async (route) => {
      requests += 1;
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('Test workflow message');
    const submit = page.getByRole('button', { name: '[Send message]' });
    await submit.dblclick();
    await expect(page.locator('#form-success')).toHaveClass(/is-visible/);
    await expect(page.locator('#name')).toHaveValue('');
    expect(requests).toBe(1);
  });

  test('preserves entries after provider failure', async ({ page }) => {
    await page.route('https://api.web3forms.com/submit', (route) => route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ success: false }),
    }));
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('Keep this message');
    await page.getByRole('button', { name: '[Send message]' }).click();
    await expect(page.locator('#form-status')).toContainText('could not be sent');
    await expect(page.locator('#message')).toHaveValue('Keep this message');
    await expect(page.getByRole('button', { name: '[Send message]' })).toBeEnabled();
  });

  test('reports offline state without attempting a request', async ({ page, context }) => {
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('Offline message');
    await context.setOffline(true);
    await page.getByRole('button', { name: '[Send message]' }).click();
    await expect(page.locator('#form-status')).toContainText('offline');
    await expect(page.locator('#message')).toHaveValue('Offline message');
  });
});
