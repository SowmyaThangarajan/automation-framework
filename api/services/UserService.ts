import { BaseApiClient } from '../clients/BaseApiClient';
import { validateUserSchema } from '../validators/schemaValidator';
import { createFailure } from '../../utils/failure';

export class UserService {
  constructor(private client: BaseApiClient) {}

  async getUsers() {
    const { res, body } = await this.client.get('/api/users');

    // ✅ REST validation
    if (res.status() !== 200) {
      throw createFailure({
        source: 'api',
        type: 'HTTP_ERROR',
        message: 'GET /users failed',
        status: res.status(),
        endpoint: '/api/users'
      });
    }

    // ❌ REMOVE THIS (already provided by client)
    // const body = await res.json();

    // ✅ Schema validation
    validateUserSchema(body);

    // ✅ Business logic validation
    if (!body.data || body.data.length === 0) {
      throw new Error('No users returned');
    }

    body.data.forEach((user: any) => {
      if (!user.email.includes('@')) {
        throw new Error(`Invalid email: ${user.email}`);
      }
    });

    return body;
  }

  async createUser(payload: any) {
    const { res, body } = await this.client.post('/api/users', payload);

    if (res.status() !== 200 && res.status() !== 201) {
      throw createFailure({
        source: 'api',
        type: 'HTTP_ERROR',
        message: `User creation failed`,
        status: res.status(),
        endpoint: '/api/users'
      });
    }

    validateUserSchema(body);

    return body;
  }
}