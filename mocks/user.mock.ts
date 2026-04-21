import { Page } from '@playwright/test';

export async function mockUserApi(page: Page) {
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [{ id: 999, email: 'mock@test.com' }]
      })
    });
  });
}