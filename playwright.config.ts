import { defineConfig, devices } from '@playwright/test'

/**
 * Shop-link tests. Default target is the live site; nothing reaches a shop or
 * AWIN (the /to redirect is answered with a stub page, see tests/e2e/helpers.ts).
 *
 *   npm run test:clicks                         # live site, all devices
 *   BASE_URL=http://localhost:3000 npm run test:clicks
 *   PRODUCT_PATH=/produkte/<slug> npm run test:clicks -- --headed
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.reifexa.de',
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'android-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'iphone-safari', use: { ...devices['iPhone 14'] } },
  ],
})
