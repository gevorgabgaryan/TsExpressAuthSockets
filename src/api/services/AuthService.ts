import { Service } from 'typedi';
import { RegisterBody } from '../controllers/requests/auth/RegisterBody';
import { User } from './models/User';
import * as argon from 'argon2';
import  * as jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../repositories/UserRepository';
import { MailService } from './MailService';
import { UserStatus } from '../enums/UserStatuses';
import { LoginBody } from '../controllers/requests/auth/LoginBody';
import { BadRequestError } from 'routing-controllers';
import { Auth } from './models/Auth';
import config from '../../config';

@Service()
export class AuthService {
  constructor(private mailService: MailService) {}

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

      const emailSent = await this.mailService.sendMail(
        user.email,
        verificationToken,
        'Verify your email',
        savedUser.id,
      );

      if (emailSent) {
        savedUser.isEmailSent = true;
        await UserRepository.update({ id: savedUser.id }, { isEmailSent: true });
      }

      return savedUser;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new Error('User exist');
      }
      throw error;
    }
  }

  public async confirmEmail(verificationToken: string): Promise<void> {
    const user = await UserRepository.findByVerificationToken(verificationToken);
    user.status = UserStatus.ACTIVE;
    await UserRepository.save(user);
  }

  async login(loginData: LoginBody): Promise<Auth> {

    const user = await UserRepository.findByEmail(loginData.email);
    if (!user) throw new BadRequestError('invalid credential')

    if (user.status !== UserStatus.ACTIVE) {
      throw new BadRequestError('please confirm email')
    }

    const psMatches = await argon.verify(user.passwordHash, loginData.password);
    if (!psMatches)  throw new BadRequestError('invalid credential');

    return await this.signToken(user.id, loginData.rememberMe);
}
async signToken(userId: string, rememberMe?: boolean): Promise<Auth> {
  const payload = {
    id: userId,
  };
  const secret = config.JWTSecret;
  const expiresIn = config.JWTExpireIn;
  const expiresInLong = config.JWTExpireInLong;

  const token = jwt.sign(payload, secret, { expiresIn: rememberMe ? expiresInLong : expiresInLong });
  const result = new Auth();
  result.token = token;
  return result;
}

public async resetPassword(email: string): Promise<void> {
  const user = await UserRepository.findByEmail(email);
  if (!user) throw new BadRequestError('invalid credential');
  const emailSent = await this.mailService.sendMail(email, user.resetPasswordToken, 'Reset password', user.id);
  if (!emailSent) {
    throw new BadRequestError('unexpectedly error');
  }
}

public async newPassword(token: string, password: string): Promise<void> {
  const user = await UserRepository.findByResetPasswordToken(token);
  user.passwordHash = await argon.hash(password);
  await UserRepository.save(user);
}

  public generateVerificationToken(): string {
    return uuidv4();
  }
}
