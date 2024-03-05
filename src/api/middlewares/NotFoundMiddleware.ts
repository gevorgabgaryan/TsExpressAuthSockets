import * as express from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Service } from 'typedi';
import { NotFoundError } from '../errors/NotFoundError';


@Service()
@Middleware({ type: 'after', priority: 100 })
export class NotFoundMiddleware implements ExpressMiddlewareInterface {
  public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
    if (!res.headersSent) {
      next(new NotFoundError());
    } else {
      next();
    }
  }
}