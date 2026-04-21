# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: data\data_validation.spec.ts >> API data validation with Pandas
- Location: tests\data\data_validation.spec.ts:5:5

# Error details

```
Error: Command failed: python data-validation/data_validator.py data-validation/api_response.json data-validation/datasets/expected_users.csv
```

# Test source

```ts
  1  | import { test } from '@playwright/test';
  2  | import { execSync } from 'child_process';
  3  | import fs from 'fs';
  4  | 
  5  | test('API data validation with Pandas', async ({ request }) => {
  6  | 
  7  |   // 1. Fetch API data
  8  |   const res = await request.get('https://dotesthere.com/api/users');
  9  |   const body = await res.json();
  10 | 
  11 |   // 2. Save to temp file
  12 |   fs.writeFileSync('data-validation/api_response.json', JSON.stringify(body));
  13 | 
  14 |   // 3. Run Python validator
> 15 |   execSync(
     |           ^ Error: Command failed: python data-validation/data_validator.py data-validation/api_response.json data-validation/datasets/expected_users.csv
  16 |     'python data-validation/data_validator.py data-validation/api_response.json data-validation/datasets/expected_users.csv',
  17 |     { stdio: 'inherit' }
  18 |   );
  19 | });
```