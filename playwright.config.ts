import { defineConfig, devices } from '@playwright/test';

const testPort = 4173;
const testBaseUrl = `http://127.0.0.1:${testPort}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: testBaseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
    {
      name: 'mobile-chrome',
      testMatch: /responsive\.spec\.ts/,
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      testMatch: /responsive\.spec\.ts/,
      use: {
        ...devices['iPhone 13'],
      },
    },
    {
      name: 'tablet-webkit',
      testMatch: /responsive\.spec\.ts/,
      use: {
        ...devices['iPad Pro 11'],
      },
    },
  ],
  webServer: {
    command: `npm run prepare:deploy && node scripts/serve-site.js ${testPort}`,
    url: testBaseUrl,
    reuseExistingServer: false,
  },
});
