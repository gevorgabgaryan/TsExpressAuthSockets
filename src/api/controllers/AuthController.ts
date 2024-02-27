import { Authorized, Body, CurrentUser, Get, JsonController, OnUndefined, Post } from 'routing-controllers';
import { RegisterBody } from './requests/auth/RegisterBody';
import { Service } from 'typedi';
import { AuthService } from '../services/AuthService';
import { UserResponse } from './responses/user/UserResponse';
import { Mapper } from '@nartc/automapper';
import { ConfirmEmailBody } from './requests/auth/ConfirmEmailBody';
import { LoginBody } from './requests/auth/LoginBody';
import { AuthResponse } from './responses/auth/AuthResponse';
import { ResetPasswordBody } from './requests/auth/ResetPasswordBody';
import { NewPasswordBody } from './requests/auth/NewPasswordBody';
import { User } from '../services/models/User';

@JsonController('/auth')
@Service()
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  async register(@Body() body: RegisterBody) {
    const newUser = await this.authService.register(body);
    return Mapper.map(newUser, UserResponse);
  }

  @OnUndefined(204)
  @Post('/confirm-email')
  public confirmEmail(@Body({ required: true }) body: ConfirmEmailBody): Promise<void> {
    return this.authService.confirmEmail(body.token);
  }

  @Post('/login')
  public async login(@Body({ required: true }) body: LoginBody): Promise<AuthResponse> {
    const auth = await this.authService.login(body);
    return Mapper.map(auth, AuthResponse);
  }
  @OnUndefined(204)
  @Post('/reset-password')
  public async resetPassword(@Body({ required: true }) body: ResetPasswordBody): Promise<void> {
    return this.authService.resetPassword(body.email);
  }
  @OnUndefined(204)
  @Post('/new-password')
  public async newPassword(@Body({ required: true }) body: NewPasswordBody): Promise<void> {
    return this.authService.newPassword(body.token, body.password);
  }

  @OnUndefined(204)
  @Get('/logout')
  @Authorized()
  public async logout(@CurrentUser() user: User): Promise<void> {
    await this.authService.logout(user.id);
  }
}
