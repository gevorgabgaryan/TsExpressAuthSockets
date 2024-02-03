import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailBody {
  @IsString()
  @IsNotEmpty()
  public token: string;
}
