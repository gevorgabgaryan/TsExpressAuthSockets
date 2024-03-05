import { BaseError } from './BaseError';

export class UnAuthorizedError extends BaseError {
  constructor() {
    super(401, 'invalid_credentials', 'Invalid credentials.');
  }
}
