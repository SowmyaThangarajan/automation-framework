import { Page } from '@playwright/test';

export async function mockServerError(page: Page) {
  await page.route('**/api/users', route => {
    route.fulfill({ status: 500 });
  });
}

export async function mockInvalidSchema(page: Page) {
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ broken: true })
    });
  });
}