// import { test, expect } from '../../fixtures/apiFixture';

// test('API + UI consistency', async ({ page, userService }) => {

//   const apiBody = await userService.getUsers(); // already JSON

//   await page.goto('/inventory.html');

//   const uiItems = await page.locator('.inventory_item').count();

//   expect(uiItems).toBeGreaterThan(0);
//   expect(apiBody.data.length).toBeGreaterThan(0);
// });