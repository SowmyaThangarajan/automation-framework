# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\users.spec.ts >> User API Schema validation >> GET users
- Location: tests\api\users.spec.ts:21:7

# Error details

```
TypeError: response.status is not a function
```

# Test source

```ts
  1  | import { test, expect } from '../../fixtures/apiFixture';
  2  | import { validateUserSchema } from '../../utils/schemaValidator';
  3  | 
  4  | test.describe('User API', () => {
  5  | 
  6  |   test('GET users', async ({ userService }) => {
  7  |     const res = await userService.getUsers();
  8  | 
  9  |     expect(res.status()).toBe(200);
  10 | 
  11 |     const body = await res.json();
  12 | 
  13 |     expect(body).toHaveProperty('data');
  14 |     expect(body.data.length).toBeGreaterThan(0);
  15 |   });
  16 | 
  17 | });
  18 | 
  19 | test.describe('User API Schema validation', () => {
  20 | 
  21 |   test('GET users', async ({ userService }) => {
  22 | 
  23 |     const response = await userService.getUsers();
  24 | 
> 25 |     expect(response.status()).toBe(200);
     |                     ^ TypeError: response.status is not a function
  26 | 
  27 |     const body = await response.json();
  28 | 
  29 |     validateUserSchema(body);
  30 |   });
  31 | 
  32 | });
```