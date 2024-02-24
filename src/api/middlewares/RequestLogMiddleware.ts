import * as express from 'express';
import morgan from 'morgan';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import logger from '../../lib/logger';
import config from '../../config';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'before' })
export class RequestLogMiddleware implements ExpressMiddlewareInterface {
  public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
    return morgan(config.logOutput, {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })(req, res, next);
  }
}
