import { PhotoEntity } from './entities/PhotoEntity';

import { Mapper } from '@nartc/automapper';
import { Photo } from '../services/models/Photo';
import appDataSource from '../../db/appDataSource';

export const PhotoRepository = appDataSource.getRepository(PhotoEntity).extend({
  async savePhoto(photo: Photo): Promise<Photo> {
    const photoEntity = Mapper.map(photo, PhotoEntity);
    const savedPhoto = await this.save(photoEntity);
    return Mapper.map(savedPhoto, Photo);
  },
});
