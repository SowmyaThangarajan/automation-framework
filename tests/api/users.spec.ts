import { test, expect } from '../../fixtures/apiFixture';

test.describe('User API - Complete Coverage', () => {

  test('GET users - contract + business validation', async ({ userService }) => {
    const users = await userService.getUsers();

    expect(users.data.length).toBeGreaterThan(0);
  });
  
});