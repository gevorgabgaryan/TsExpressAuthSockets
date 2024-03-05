import { BaseError } from './BaseError';

export class AppError extends BaseError {
  constructor(stack?: string) {
    super(500, 'error', 'Something went wrong.');

    if (stack) {
      this.stack = stack;
    }
  }
}
