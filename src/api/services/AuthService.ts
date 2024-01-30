import { Service } from 'typedi';
import { RegisterBody } from '../controllers/requests/auth/RegisterBody';
import { User } from './models/User';
import * as argon from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../repositories/UserRepository';

@Service()
export class AuthService {
  public async register(userData: RegisterBody): Promise<User> {
    try {
      const passwordHash = await argon.hash(userData.password);
      const verificationToken = this.generateVerificationToken();
      const resetPasswordToken = this.generateVerificationToken();
      const user = new User();
      user.firstName = userData.firstName;
      user.lastName = userData.lastName;
      user.email = userData.email;
      user.passwordHash = passwordHash;
      user.role = 'user';
      user.status = 'new';
      user.verificationToken = verificationToken;
      user.resetPasswordToken = resetPasswordToken;
      user.isEmailSent = false;
      const savedUser = await UserRepository.saveUser(user);

      return savedUser;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new Error('User exist');
      }
      throw error;
    }
  }

  public generateVerificationToken(): string {
    return uuidv4();
  }
}
