import { BaseError } from './BaseError';

export class AppAccessDeniedError extends BaseError {
  constructor() {
    super(403, 'access_denied', 'Access Denied.');
  }
}
