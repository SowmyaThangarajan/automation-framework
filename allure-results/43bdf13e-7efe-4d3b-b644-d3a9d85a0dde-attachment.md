# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: data\data_validation.spec.ts >> API data validation with Pandas
- Location: tests\data\data_validation.spec.ts:8:5

# Error details

```
Error: Data validation failed:
Traceback (most recent call last):
  File "C:\Users\sowmy\VSProjects\automation-framework\data-validation\data_validator.py", line 57, in <module>
    run(sys.argv[1], sys.argv[2])
    ~~~^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\sowmy\VSProjects\automation-framework\data-validation\data_validator.py", line 50, in run
    validate_row_level(api_df, expected_df)
    ~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\sowmy\VSProjects\automation-framework\data-validation\data_validator.py", line 24, in validate_row_level
    raise Exception(f"Row-level mismatch:\n{diff}")
Exception: Row-level mismatch:
  first_name           last_name       
        self   other        self  other
0      Ankur  George  Autoamtion  Bluth

```

# Test source

```ts
  1  | import { test } from '@playwright/test';
  2  | import fs from 'fs';
  3  | import { exec } from 'child_process';
  4  | import util from 'util';
  5  | 
  6  | const execAsync = util.promisify(exec);
  7  | 
  8  | test('API data validation with Pandas', async ({ request }) => {
  9  | 
  10 |   const res = await request.get('https://dotesthere.com/api/users');
  11 |   const body = await res.json();
  12 | 
  13 |   fs.writeFileSync('data-validation/api_response.json', JSON.stringify(body));
  14 | 
  15 |   try {
  16 |     await execAsync(
  17 |       'python data-validation/data_validator.py data-validation/api_response.json data-validation/datasets/expected_users.csv'
  18 |     );
  19 |   } catch (err: any) {
> 20 |     throw new Error(`Data validation failed:\n${err.stderr}`);
     |           ^ Error: Data validation failed:
  21 |   }
  22 | });
```