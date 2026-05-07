import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Load environment variables
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

// ✅ Define ONCE outside config
const shardIndex = process.env.PW_TEST_SHARD_INDEX || 'local';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 4 : undefined,

  retries: process.env.CI ? 2 : 1,

  reporter: [
    ['list'],

    ['html', {
      outputFolder: `playwright-report-${shardIndex}`,
      open: 'never'
    }],

    ['json', {
      outputFile: `results/results-${shardIndex}.json`
    }]
  ],

  timeout: process.env.CI ? 15000 : 30000,

  use: {
    baseURL: process.env.BASE_URL,

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',

    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});