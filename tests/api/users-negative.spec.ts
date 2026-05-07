import { test, expect } from '../../fixtures/apiFixture';

test.describe('User API - Negative Scenarios', () => {

  test('Unauthorized request', async ({ request }) => {
    const res = await request.get('https://dotesthere.com/api/users');

    expect(res.status()).toBe(401); // or 403 depending on API
  });

  test('Invalid payload', async ({ userService }) => {
    const badPayload = { name: '' };

    await expect(async () => {
      await userService.createUser(badPayload);
    }).rejects.toThrow();
  });

});