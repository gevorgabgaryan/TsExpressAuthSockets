import { BaseError } from './BaseError';

export class UserExistsError extends BaseError {
  constructor() {
    super(401, 'user_exists', 'User exists.');
  }
}
