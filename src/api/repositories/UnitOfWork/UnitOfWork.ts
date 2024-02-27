import { Service } from 'typedi';
import { EntityManager } from 'typeorm';
import { AuthProviderRepository } from '../AuthProviderRepository';
import { PhotoRepository } from '../PhotoRepository';
import { UserRepository } from '../UserRepository';

@Service()
export class UnitOfWork {
  constructor(
    public userRepository: typeof UserRepository,
    public authProviderRepository: typeof AuthProviderRepository,
    public photoRepository: typeof PhotoRepository,
  ) {}

  public static create(manager: EntityManager): UnitOfWork {
    return new UnitOfWork(
      manager.withRepository(UserRepository),
      manager.withRepository(AuthProviderRepository),
      manager.withRepository(PhotoRepository),
    );
  }
}
