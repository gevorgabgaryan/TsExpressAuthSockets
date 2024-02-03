import { IsNotEmpty, IsString } from "class-validator";

export class NewPasswordBody {
    @IsString()
    @IsNotEmpty()
    public token: string;

    @IsString()
    @IsNotEmpty()
    public password: string;
  }
