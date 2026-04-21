import { test } from '@playwright/test';
import fs from 'fs';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

test('API data validation with Pandas', async ({ request }) => {

  const res = await request.get('https://dotesthere.com/api/users');
  const body = await res.json();

  fs.writeFileSync('data-validation/api_response.json', JSON.stringify(body));

  try {
    await execAsync(
      'python data-validation/data_validator.py data-validation/api_response.json data-validation/datasets/expected_users.csv'
    );
  } catch (err: any) {
    throw new Error(`Data validation failed:\n${err.stderr}`);
  }
});