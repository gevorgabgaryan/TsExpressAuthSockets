import { Mapper } from '@nartc/automapper';
import { BadRequestError } from 'routing-controllers';
import appDataSource from '../../db/appDataSource';
import { User } from '../services/models/User';
import { UserEntity } from './entities/UserEntity';

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
    const userEntity = await this.findOneBy({ email });
    return userEntity ? Mapper.map(userEntity, User) : null;
  },
  async findByResetPasswordToken(resetPasswordToken: string): Promise<User> {
    const userEntity = await this.findOneBy({ resetPasswordToken });
    if (!userEntity) {
      throw new BadRequestError('invalid token');
    }
    return Mapper.map(userEntity, User);
  },
  async findById(id: string): Promise<User | null> {
    const userEntity = await this.findOneBy({ id });
    return userEntity ? Mapper.map(userEntity, User) : null;
  },
  async makeOnline(userId: string): Promise<User> {
    await this.update({ id: userId }, { isOnline: true });
    const updatedUser = await this.findOneBy({ id: userId });
    if (!updatedUser) throw new Error('User not found');
    return Mapper.map(updatedUser, User);
  },

  async makeOffline(userId: string): Promise<User> {
    await this.update({ id: userId }, { isOnline: false });
    const updatedUser = await this.findOneBy({ id: userId });
    if (!updatedUser) throw new Error('User not found');
    return Mapper.map(updatedUser, User);
  },

  async findByIdWithPhotos(id: string): Promise<User | null> {
    const userEntity = await this.findOne({ where: { id }, relations: ['photos'] });
    return userEntity ? Mapper.map(userEntity, User) : null;
  },
});
