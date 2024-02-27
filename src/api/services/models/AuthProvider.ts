import { AutoMap } from '@nartc/automapper';
import { Provider } from '../../enums/Provider';

export class AuthProvider {
  @AutoMap()
  public id: string;

  @AutoMap()
  public userId: string;

  @AutoMap()
  public provider: Provider;

  @AutoMap()
  public providerId: string;
  @AutoMap()
  public createdAt: Date;

  @AutoMap()
  public updatedAt: Date;
}
