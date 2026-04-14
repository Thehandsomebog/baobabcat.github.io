import { test, expect } from '@playwright/test';

test.describe('Legacy AI Pulse Route', () => {
  test('redirects to the active blog route', async ({ page }) => {
    await page.goto('/ai-pulse.html');
    await expect(page).toHaveURL(/\/blog(?:\.html)?$/);
  });
});
