import { IsString, IsNotEmpty, IsJWT } from 'class-validator';

export class AuthorizeRequest {
  @IsString()
  @IsJWT()
  @IsNotEmpty()
  token: string;
}
