import { UserRepository } from '../../../src/api/repositories/UserRepository';

const mockUserRepository = {
  saveUser: jest.fn(),
  update: jest.fn(),
  findByEmail: jest.fn()
};

const mockAuthProviderRepository = {};

const mockPhotoRepository = {
  savePhoto: jest.fn(),
};

export const UnitOfWorkMock = jest.fn().mockImplementation(() => ({
  userRepository: mockUserRepository,
  authProviderRepository: mockAuthProviderRepository,
  photoRepository: mockPhotoRepository,
  create: jest.fn().mockReturnValue({
    userRepository: mockUserRepository,
    authProviderRepository: mockAuthProviderRepository,
    photoRepository: mockPhotoRepository,
  }),
}));