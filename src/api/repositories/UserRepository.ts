import { Mapper } from '@nartc/automapper';
import { BadRequestError } from 'routing-controllers';
import appDataSource from '../../db/appDataSource';
import { User } from '../services/models/User';
import { UserEntity } from './entities/UserEntitty';

export const UserRepository = appDataSource.getRepository(UserEntity).extend({
  async saveUser(user: User): Promise<User> {
    const userEntity = Mapper.map(user, UserEntity);
    const savedUser = await this.save(userEntity);
    return Mapper.map(savedUser, User);
  },
});
