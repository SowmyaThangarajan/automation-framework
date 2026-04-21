import { test as base } from '@playwright/test';
import { BaseApiClient } from '../api/clients/BaseApiClient';
import { UserService } from '../api/services/UserService';

type ApiFixtures = {
  userService: UserService;
};

export const test = base.extend<ApiFixtures>({
  userService: async ({ request }, use) => {
    const client = new BaseApiClient(request);
    await use(new UserService(client));
  }
});

export { expect } from '@playwright/test';