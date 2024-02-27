import argon from 'argon2';

import { BaseTransactionable } from '../../../src/api/services/base/BaseTransactionTable';
import { UserService } from '../../../src/api/services/UserService';
import { PhotoService } from '../../../src/api/services/PhotoService';
import { MailService } from '../../../src/api/services/MailService';
import { User } from '../../../src/api/services/models/User';
import argon2 from 'argon2';
import { BadRequestError } from 'routing-controllers';
import { AuthService } from '../../../src/api/services/AuthService';
import { UnitOfWork } from '../../../src/api/repositories/UnitOfWork/UnitOfWork';
import { LoginBody } from '../../../src/api/controllers/requests/auth/LoginBody';
import { UnitOfWorkMock } from '../UnitOfWork/unitOfWorkMock';

describe('AuthService', () => {
  let authService: AuthService;
  let mailService: MailService;
  let userService: UserService;
  let unitOfWork: UnitOfWork;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (BaseTransactionable.prototype.transaction as jest.Mock) = jest.fn((runInTransaction: any) => {
      return runInTransaction(unitOfWork);
    });

    userService = new UserService(
      {} as PhotoService
    );
    mailService = new MailService();

    unitOfWork = UnitOfWorkMock();
    authService = new AuthService(mailService, userService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should add a new user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };
      const expectedUser = new User();
      const saveUserSpy = jest.spyOn(unitOfWork.userRepository, 'saveUser').mockResolvedValueOnce(expectedUser);
      const sendMailSpy = jest.spyOn(mailService, 'sendMail').mockResolvedValueOnce(true);
      const udpateSpy = jest.spyOn(unitOfWork.userRepository, 'update');

      const result = await authService.register(userData);

      expect(saveUserSpy).toHaveBeenCalled();
      expect(sendMailSpy).toHaveBeenCalled();
      expect(udpateSpy).toHaveBeenCalled();
      expect(result).toEqual(expectedUser);
    });
    it('should throw an ExistsError when adding a user with an existing email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing.email@example.com',
        password: 'password123',
        files: [],
      };

      jest.spyOn(unitOfWork.userRepository, 'saveUser').mockRejectedValueOnce(new Error('User exists'));

      await expect(authService.register(userData)).rejects.toThrow('User exists');
    });

  });

  describe('AuthService login', () => {
     it('should authenticate a user with valid credentials', async () => {
      const loginData = { email: 'user@example.com', password: 'validPassword' } as LoginBody;
      const user = {
        id: '1',
        email: 'user@example.com',
        passwordHash: await argon2.hash('validPassword'),
        status: 'active'
      } as User;

      const findByEmailSpy = jest.spyOn(unitOfWork.userRepository, 'findByEmail').mockResolvedValue(user);
      const argonSpy = jest.spyOn(argon2, 'verify').mockResolvedValue(true);

      const auth = await authService.login(loginData);
      expect(findByEmailSpy).toHaveBeenCalled();
      expect(argonSpy).toHaveBeenCalled();
      expect(auth).toBeDefined();
      expect(auth.token).toBeDefined();
    });

    it('should throw an error for invalid credentials', async () => {
      const loginData = { email: 'user@example.com', password: 'invalidPassword' } as LoginBody;
      const user = {
        id: '1',
        email: 'user@example.com',
        passwordHash: await argon2.hash('validPassword'),
      } as User;

      jest.spyOn(unitOfWork.userRepository, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toThrow(BadRequestError);
    });

    it('should throw an error for non-existing user email', async () => {
      const loginData = { email: 'nonexistent@example.com', password: 'password' } as LoginBody;

      jest.spyOn(unitOfWork.userRepository, 'findByEmail').mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow(BadRequestError);
    });
  });
});
