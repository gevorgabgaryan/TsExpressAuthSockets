import { AutoMap } from '@nartc/automapper';

export class Auth {
  @AutoMap()
  public token: string;
}
