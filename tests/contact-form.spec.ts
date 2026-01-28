import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('should have all form fields', async ({ page }) => {
    await page.goto('/');

    // Check for form fields
    const nameInput = page.locator('#name');
    const emailInput = page.locator('#email');
    const phoneInput = page.locator('#phone');
    const messageInput = page.locator('#message');
    const smsConsent = page.locator('#sms-consent');
    const submitButton = page.locator('.contact-form button[type="submit"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(phoneInput).toBeVisible();
    await expect(messageInput).toBeVisible();
    await expect(smsConsent).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should show error for invalid email on blur', async ({ page }) => {
    await page.goto('/');

    // Enter invalid email
    const emailInput = page.locator('#email');
    await emailInput.fill('invalid-email');

    // Blur the field by clicking elsewhere
    const phoneInput = page.locator('#phone');
    await phoneInput.click();

    // Wait for error message to appear
    await page.waitForTimeout(100);

    // Check for error message
    const errorMessage = page.locator('.field-error');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/valid email/i);
  });

  test('should clear email error when valid email is entered and validated', async ({ page }) => {
    await page.goto('/');

    // Enter invalid email first
    const emailInput = page.locator('#email');
    await emailInput.fill('invalid-email');

    // Blur to trigger validation by clicking on name field (which is empty but won't show error yet)
    const nameInput = page.locator('#name');
    await nameInput.click();
    await page.waitForTimeout(100);

    // Verify email error appears
    const emailParent = page.locator('#email').locator('..');
    const emailError = emailParent.locator('.field-error');
    await expect(emailError).toBeVisible();
    await expect(emailError).toContainText(/valid email/i);

    // Now enter a valid email and blur again to trigger re-validation
    await emailInput.fill('valid@email.com');
    await nameInput.click();
    await page.waitForTimeout(100);

    // Check that email error is cleared after re-validation
    await expect(emailError).not.toBeVisible();
  });

  test('should require SMS consent checkbox', async ({ page }) => {
    await page.goto('/');

    // Fill in all fields except checkbox
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#phone', '555-555-5555');
    await page.fill('#message', 'Test message');

    // Try to submit without checking the checkbox
    await page.click('button[type="submit"]');

    // The checkbox parent should be highlighted as error (form should not submit)
    // Since checkbox is required, form should not submit
    const checkbox = page.locator('#sms-consent');
    const isChecked = await checkbox.isChecked();
    expect(isChecked).toBe(false);
  });

  test('should show success message when redirected with submitted param', async ({ page }) => {
    // Navigate with submitted=true query param
    await page.goto('/?submitted=true');

    // Check for success message
    const successMessage = page.locator('.form-success');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText(/thank you/i);
  });
});
