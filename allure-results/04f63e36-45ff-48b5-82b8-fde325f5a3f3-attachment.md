# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: integration\ui-api.spec.js >> API + UI consistency
- Location: tests\integration\ui-api.spec.js:4:22

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: Swag Labs
  - generic [ref=e5]:
    - generic [ref=e9]:
      - generic [ref=e10]:
        - textbox "Username" [ref=e11]
        - img [ref=e12]
      - generic [ref=e14]:
        - textbox "Password" [ref=e15]
        - img [ref=e16]
      - 'heading "Epic sadface: You can only access ''/inventory.html'' when you are logged in." [level=3] [ref=e19]':
        - button [ref=e20] [cursor=pointer]:
          - img [ref=e21]
        - text: "Epic sadface: You can only access '/inventory.html' when you are logged in."
      - button "Login" [ref=e23] [cursor=pointer]
    - generic [ref=e25]:
      - generic [ref=e26]:
        - heading "Accepted usernames are:" [level=4] [ref=e27]
        - text: standard_user
        - text: locked_out_user
        - text: problem_user
        - text: performance_glitch_user
        - text: error_user
        - text: visual_user
      - generic [ref=e28]:
        - heading "Password for all users:" [level=4] [ref=e29]
        - text: secret_sauce
```

# Test source

```ts
  1  | "use strict";
  2  | Object.defineProperty(exports, "__esModule", { value: true });
  3  | const apiFixture_1 = require("../../fixtures/apiFixture");
  4  | (0, apiFixture_1.test)('API + UI consistency', async ({ page, userService }) => {
  5  |     const apiBody = await userService.getUsers(); // already JSON
  6  |     await page.goto('/inventory.html');
  7  |     const uiItems = await page.locator('.inventory_item').count();
> 8  |     (0, apiFixture_1.expect)(uiItems).toBeGreaterThan(0);
     |                                       ^ Error: expect(received).toBeGreaterThan(expected)
  9  |     (0, apiFixture_1.expect)(apiBody.data.length).toBeGreaterThan(0);
  10 | });
  11 | 
```