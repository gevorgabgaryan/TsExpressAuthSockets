import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterBody {
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(25)
  @IsNotEmpty()
  public lastName: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @IsNotEmpty()
  public password: string;
}
