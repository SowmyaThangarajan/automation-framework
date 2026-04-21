# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: integration\ui-api.spec.ts >> API + UI consistency
- Location: tests\integration\ui-api.spec.ts:3:5

# Error details

```
TypeError: apiRes.json is not a function
```

# Test source

```ts
  1  | import { test, expect } from '../../fixtures/apiFixture';
  2  | 
  3  | test('API + UI consistency', async ({ page, userService }) => {
  4  |   const apiRes = await userService.getUsers();
> 5  |   const apiBody = await apiRes.json();
     |                                ^ TypeError: apiRes.json is not a function
  6  | 
  7  |   await page.goto('/inventory.html');
  8  | 
  9  |   const uiItems = await page.locator('.inventory_item').count();
  10 | 
  11 |   expect(uiItems).toBeGreaterThan(0);
  12 |   expect(apiBody.data.length).toBeGreaterThan(0);
  13 | });
```