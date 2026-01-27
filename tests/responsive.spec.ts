import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design', () => {
  test.describe('Mobile viewport', () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

    test('should show mobile navigation toggle', async ({ page }) => {
      await page.goto('/');

      // Mobile nav toggle should be visible
      const navToggle = page.locator('.nav-toggle');
      await expect(navToggle).toBeVisible();

      // Desktop nav menu should be hidden
      const navMenu = page.locator('.nav-menu');
      await expect(navMenu).not.toBeVisible();
    });

    test('should open mobile menu on toggle click', async ({ page }) => {
      await page.goto('/');

      // Click the nav toggle
      await page.click('.nav-toggle');

      // Nav menu should now be visible
      const navMenu = page.locator('.nav-menu');
      await expect(navMenu).toBeVisible();
    });

    test('should close mobile menu when clicking a link', async ({ page }) => {
      await page.goto('/');

      // Open mobile menu
      await page.click('.nav-toggle');

      // Click a navigation link
      await page.click('.nav-menu a[href="#about"]');

      // Give time for menu to close
      await page.waitForTimeout(300);

      // Nav menu should be hidden again
      const navMenu = page.locator('.nav-menu');
      await expect(navMenu).not.toBeVisible();
    });

    test('should have readable text on mobile', async ({ page }) => {
      await page.goto('/');

      // Hero title should be visible
      const heroTitle = page.locator('.hero-title');
      await expect(heroTitle).toBeVisible();

      // Contact form should be accessible
      const contactForm = page.locator('.contact-form');
      await expect(contactForm).toBeVisible();
    });
  });

  test.describe('Tablet viewport', () => {
    test.use({ viewport: { width: 768, height: 1024 } }); // iPad

    test('should have navigation visible', async ({ page }) => {
      await page.goto('/');

      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should display content sections properly', async ({ page }) => {
      await page.goto('/');

      // Check key sections are visible
      const hero = page.locator('.hero');
      const about = page.locator('.about-section');
      const services = page.locator('.services-section');

      await expect(hero).toBeVisible();
      await expect(about).toBeVisible();
      await expect(services).toBeVisible();
    });
  });

  test.describe('Desktop viewport', () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test('should have horizontal navigation', async ({ page }) => {
      await page.goto('/');

      // Nav menu should be visible (not hidden mobile menu)
      const navMenu = page.locator('.nav-menu');
      await expect(navMenu).toBeVisible();

      // Mobile toggle should not be visible
      const navToggle = page.locator('.nav-toggle');
      await expect(navToggle).not.toBeVisible();
    });

    test('should display services in grid layout', async ({ page }) => {
      await page.goto('/');

      // Service cards should be visible
      const serviceCards = page.locator('.service-card');
      const count = await serviceCards.count();
      expect(count).toBeGreaterThanOrEqual(3);

      // First card should be visible
      await expect(serviceCards.first()).toBeVisible();
    });

    test('should display testimonials in grid layout', async ({ page }) => {
      await page.goto('/');

      // Testimonial cards should be visible
      const testimonialCards = page.locator('.testimonial-card');
      const count = await testimonialCards.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });
  });
});
