import Ajv from 'ajv';
import schema from '../api/schemas/user.schema.json';

const ajv = new Ajv();

export function validateUserSchema(data: any) {
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    throw new Error(JSON.stringify(validate.errors));
  }
}