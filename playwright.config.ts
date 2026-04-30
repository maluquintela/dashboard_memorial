import { defineConfig, devices } from '@playwright/test';
import process from 'node:process';

const dashboardUrl = 'http://127.0.0.1:5173';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'list' : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: dashboardUrl,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'VITE_API_URL=http://127.0.0.1:8000 npm run dev -- --host 127.0.0.1 --port 5173',
    url: dashboardUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
