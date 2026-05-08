import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '.env')
});

const shard = process.env.PW_TEST_SHARD_INDEX || 'local';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 4 : undefined,

  timeout: 30000,

  reporter: [
    ['list'],

    // ✅ REQUIRED for merge-reports
    [
      'blob',
      {
        outputDir: `blob-report-${shard}`
      }
    ],

    [
      'html',
      {
        outputFolder: `playwright-report-${shard}`,
        open: 'never'
      }
    ]
  ],

  use: {
    baseURL: process.env.BASE_URL,

    trace: 'retain-on-failure',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',

      use: {
        ...devices['Desktop Chrome']
      }
    }
  ]
});