import { IsJWT } from 'class-validator';
import { AutoMap } from '@nartc/automapper';

export class AuthResponse {
  @AutoMap()
  @IsJWT()
  public token: string;
}
