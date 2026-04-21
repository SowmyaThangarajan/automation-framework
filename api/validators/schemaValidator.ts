import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

// Import schemas
import userSchema from '../schemas/user.schema.json';

// Initialize Ajv once
const ajv = new Ajv({
  allErrors: true,
  strict: false
});

addFormats(ajv);

// Compile schemas once (IMPORTANT)
const validators: Record<string, ValidateFunction> = {
  user: ajv.compile(userSchema)
};

// Generic validator function
function validate(schemaKey: keyof typeof validators, data: any) {
  const validateFn = validators[schemaKey];

  const valid = validateFn(data);

  if (!valid) {
    const errors = ajv.errorsText(validateFn.errors, {
      separator: '\n'
    });

    throw new Error(`Schema validation failed:\n${errors}`);
  }
}

// Specific helpers (clean usage in services)
export function validateUserSchema(data: any) {
  validate('user', data);
}