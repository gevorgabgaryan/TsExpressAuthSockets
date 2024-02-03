import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordBody {
    @IsEmail()
    @IsNotEmpty()
    public email: string;
}