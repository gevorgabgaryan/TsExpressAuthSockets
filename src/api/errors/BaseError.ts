export class BaseError extends Error {
  public readonly status: number;

  public readonly code: string;

  public readonly userMessage: string;

  public readonly details: BaseError[];

  constructor(status: number, code: string, message?: string, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
