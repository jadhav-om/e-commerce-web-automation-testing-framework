const path = require('path');
const { defineConfig } = require('@playwright/test');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

module.exports = defineConfig({
  testDir: path.resolve(__dirname, '..', 'tests'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: path.resolve(__dirname, '..', 'reports', 'html'), open: 'never' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    browserName: 'chromium',
    headless: process.env.HEADLESS !== 'false',
    viewport: { width: 1366, height: 768 },
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  outputDir: path.resolve(__dirname, '..', 'reports', 'test-results'),
});
