import { Body, JsonController, Post } from 'routing-controllers';
import { RegisterBody } from './requests/auth/RegisterBody';
import { Service } from 'typedi';
import { AuthService } from '../services/AuthService';
import { UserResponse } from './responses/user/UserResponse';
import { Mapper } from '@nartc/automapper';

@JsonController('/auth')
@Service()
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  async register(@Body() body: RegisterBody) {
    const newUser = await this.authService.register(body);
    return Mapper.map(newUser, UserResponse);
  }
}
