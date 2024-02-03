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
  async findByVerificationToken(verificationToken: string): Promise<User> {
    const userEntity = await this.findOneBy({ verificationToken });
    if (!userEntity) {
      throw new BadRequestError('user not found');
    }
    return Mapper.map(userEntity, User);
  },
  async findByEmail(email: string): Promise<User | null> {
    const userEntity =  await this.findOneBy({email});
    return userEntity ? Mapper.map(userEntity , User) : null;
 },
 async findByResetPasswordToken(resetPasswordToken: string): Promise<User> {
  const userEntity = await this.findOneBy({ resetPasswordToken });
  if (!userEntity) {
    throw new BadRequestError('invalid token');
  }
  return Mapper.map(userEntity, User);
},
});
