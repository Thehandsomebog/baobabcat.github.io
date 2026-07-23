import { defineConfig, devices } from '@playwright/test';

const testPort = 4173;
const testBaseUrl = `http://localhost:${testPort}`;

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
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  webServer: {
    command: `npx serve -l ${testPort}`,
    url: testBaseUrl,
    reuseExistingServer: !process.env.CI,
  },
});
