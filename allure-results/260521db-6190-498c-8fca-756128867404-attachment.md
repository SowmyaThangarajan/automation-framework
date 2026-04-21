# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\users-negative.spec.ts >> User API - Negative Scenarios >> Unauthorized request
- Location: tests\api\users-negative.spec.ts:5:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 401
Received: 200
```

# Test source

```ts
  1  | import { test, expect } from '../../fixtures/apiFixture';
  2  | 
  3  | test.describe('User API - Negative Scenarios', () => {
  4  | 
  5  |   test('Unauthorized request', async ({ request }) => {
  6  |     const res = await request.get('https://dotesthere.com/api/users');
  7  | 
> 8  |     expect(res.status()).toBe(401); // or 403 depending on API
     |                          ^ Error: expect(received).toBe(expected) // Object.is equality
  9  |   });
  10 | 
  11 |   test('Invalid payload', async ({ userService }) => {
  12 |     const badPayload = { name: '' };
  13 | 
  14 |     await expect(async () => {
  15 |       await userService.createUser(badPayload);
  16 |     }).rejects.toThrow();
  17 |   });
  18 | 
  19 | });
```