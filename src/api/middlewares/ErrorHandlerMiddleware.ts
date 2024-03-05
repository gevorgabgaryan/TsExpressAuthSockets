import { Request, Response } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { Service } from 'typedi';
import { ValidationError } from 'class-validator';
import { BaseError } from '../errors/BaseError';
import { AppError } from '../errors/AppError';
import { AppBadRequestError } from '../errors/AppBadRequestError';
import { ErrorField } from '../types/ErrorField';
import { AppAccessDeniedError } from '../errors/AppAccessDeniedError';
import { UnAuthorizedError } from '../errors/UnAuthorizedError';
import { NotFoundError } from '../errors/NotFoundError';
import { UserExistsError } from '../errors/UserExistsError';

@Service()
@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: any, req: Request, res: Response) {
    console.dir(error, { depth: 7 });
    let baseError: any;
    switch (true) {
      case 'errors' in error &&
        Array.isArray(error.errors) &&
        error.errors.every((e: any) => e instanceof ValidationError):
        baseError = new AppBadRequestError(
          'Bad request schema',
          this.mapValidationErrors(error.errors as ValidationError[]),
        );
        break;
      case error instanceof BaseError:
        baseError = error;
        break;
      case error instanceof UnAuthorizedError:
        baseError = new UnAuthorizedError();
        break;
      case error instanceof AppAccessDeniedError:
        baseError = new AppAccessDeniedError();
        break;
      case error instanceof NotFoundError:
            baseError = new NotFoundError();
          break;
          case error instanceof UserExistsError:
            baseError = new UserExistsError();
          break;

      default:
        baseError = new AppError(error.message);
        break;
    }

    res.status(baseError.status ? baseError.status : 500);
    res.json(baseError);
  }

  private mapValidationErrors(errors: ValidationError[]): ErrorField[] {
    const result: ErrorField[] = [];

    errors.forEach((error) => {
      const property = error.property;
      const constraints = Object.values(error.constraints || []);
      let childConstraints: string[] = [];

      if (error.children && error.children.length > 0) {
        const childErrors = this.mapValidationErrors(error.children);
        childConstraints = childErrors.reduce<string[]>((acc, childError) => {
          return acc.concat(childError.constraints);
        }, []);
        childConstraints = Array.from(new Set(childConstraints));
      }

      const uniqueConstraints = Array.from(new Set(constraints));

      const combinedConstraints = [...uniqueConstraints, ...childConstraints];

      result.push({ field: property, constraints: combinedConstraints });
    });

    return result;
  }
}
