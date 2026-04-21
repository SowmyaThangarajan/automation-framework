# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\users.spec.ts >> User API - Complete Coverage >> POST user - creation flow
- Location: tests\api\users.spec.ts:11:7

# Error details

```
Error: Schema validation failed:
data must have required property 'page'
data/data must be array
```

# Test source

```ts
  1  | import Ajv, { ValidateFunction } from 'ajv';
  2  | import addFormats from 'ajv-formats';
  3  | 
  4  | // Import schemas
  5  | import userSchema from '../schemas/user.schema.json';
  6  | 
  7  | // Initialize Ajv once
  8  | const ajv = new Ajv({
  9  |   allErrors: true,
  10 |   strict: false
  11 | });
  12 | 
  13 | addFormats(ajv);
  14 | 
  15 | // Compile schemas once (IMPORTANT)
  16 | const validators: Record<string, ValidateFunction> = {
  17 |   user: ajv.compile(userSchema)
  18 | };
  19 | 
  20 | // Generic validator function
  21 | function validate(schemaKey: keyof typeof validators, data: any) {
  22 |   const validateFn = validators[schemaKey];
  23 | 
  24 |   const valid = validateFn(data);
  25 | 
  26 |   if (!valid) {
  27 |     const errors = ajv.errorsText(validateFn.errors, {
  28 |       separator: '\n'
  29 |     });
  30 | 
> 31 |     throw new Error(`Schema validation failed:\n${errors}`);
     |           ^ Error: Schema validation failed:
  32 |   }
  33 | }
  34 | 
  35 | // Specific helpers (clean usage in services)
  36 | export function validateUserSchema(data: any) {
  37 |   validate('user', data);
  38 | }
```