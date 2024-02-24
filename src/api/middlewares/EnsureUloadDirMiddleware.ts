import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { PhotoService } from '../services/PhotoService'; // Adjust path as needed
import config from '../../config'; // Adjust path as needed

@Service()
@Middleware({ type: 'before' })
export class EnsureUploadDirMiddleware implements ExpressMiddlewareInterface {
  constructor(private photoService: PhotoService) {}

  public async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.photoService.ensureDirExists(config.userPhotosDir);
      next();
    } catch (error) {
      next(error);
    }
  }
}