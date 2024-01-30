import { AutoMapper, ProfileBase, ignore } from '@nartc/automapper';
import { User } from '../../services/models/User';
import { UserEntity } from '../entities/UserEntitty';

export class RepositoryMapperProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(UserEntity, User);

    mapper
      .createMap(User, UserEntity)
      .forMember((d) => d.id, ignore())
      .forMember((d) => d.createdAt, ignore())
      .forMember((d) => d.updatedAt, ignore());
  }
}
