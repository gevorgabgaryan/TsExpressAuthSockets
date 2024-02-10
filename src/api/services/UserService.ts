import { Service } from 'typedi';
import { UserRepository } from '../repositories/UserRepository';
import { User } from './models/User';

@Service()
export class UserService {
  public getUser(userId: string): Promise<User | null> {
    return UserRepository.findById(userId);
  }

  public async makeUserOnline(userId: string): Promise<User> {
    return await UserRepository.makeOnline(userId);
  }

  public async makeUserOffline(userId: string): Promise<User> {
    return await UserRepository.makeOffline(userId);
  }

}
