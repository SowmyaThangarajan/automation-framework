import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Load environment variables
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Ensure shard index is always defined (fallback to 'local')
const shardIndex = process.env.PW_TEST_SHARD_INDEX || 'local';

export default defineConfig({
  testDir: './tests',

  /* 1. Parallel Execution */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 4 : undefined,

  /* 2. Retry Logic */
  retries: process.env.CI ? 2 : 1,

  /* 3. Reporting */
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: `results/results-${shardIndex}.json` }],
    ['junit', { outputFile: `results/results-${shardIndex}.xml` }],
    ['allure-playwright']
  ],

  timeout: process.env.CI ? 15000 : 30000,

  /* 4. Shared Settings */
  use: {
    baseURL: process.env.BASE_URL,

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',

    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  /* 5. Projects */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Add more browsers if needed
  ],
});