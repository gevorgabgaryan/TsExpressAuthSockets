import { Service } from 'typedi';

import { Photo } from './models/Photo';
import { User } from './models/User';
import { BaseService } from './BaseService';
import * as fs from 'fs/promises';
import { UnitOfWork } from '../repositories/UnitOfWork/UnitOfWork';

@Service()
export class PhotoService extends BaseService {
  constructor() {
    super();
  }

  public async savePhoto(file: Express.Multer.File, user: User, unitOfWork: UnitOfWork): Promise<Photo> {
      const photo = new Photo();
      this.addIdAndTimestamps(photo);
      photo.name = file.filename;
      photo.url = file.path;
      photo.user = user;
      const savedPhoto = await unitOfWork.photoRepository.savePhoto(photo);
      return savedPhoto;
  }

  public async ensureDirExists(dirPath: string) {
    try {
      await fs.access(dirPath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(dirPath, { recursive: true });
      } else {
        throw error;
      }
    }
  }

}
