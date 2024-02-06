import { Mapper } from '@nartc/automapper';
import appDataSource from '../../db/appDataSource';
import { AuthProvider } from '../services/models/AuthProvider';

import { User } from '../services/models/User';
import { AuthProviderEntity } from './entities/AuthProviderEntity';

export const AuthProviderRepository = appDataSource.getRepository(AuthProviderEntity).extend({
  async saveAuthProvider(authProvider: User): Promise<User> {
    const authProviderEntity = Mapper.map(authProvider, AuthProviderEntity);
    const savedUser = await this.save(authProviderEntity);
    return Mapper.map(savedUser, User);
  },
  async findByProviderId(providerId: string): Promise<AuthProvider | null> {
    const authProviderEntity = await this.findOneBy({ providerId });
    return authProviderEntity ? Mapper.map(authProviderEntity, AuthProvider) : null;
  },
});
