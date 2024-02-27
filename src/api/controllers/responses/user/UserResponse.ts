import { AutoMap } from '@nartc/automapper';
import { PhotoResponse } from './PhotoResponse';

export class UserResponse {
  @AutoMap()
  public id: string;

  @AutoMap()
  public firstName: string;

  @AutoMap()
  public lastName: string;

  @AutoMap()
  public fullName: string;

  @AutoMap()
  public email: string;

  @AutoMap()
  public status: string;

  @AutoMap()
  public role: string;

  @AutoMap(() => PhotoResponse)
  public photos: PhotoResponse[];
}
