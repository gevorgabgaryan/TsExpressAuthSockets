import { BadRequestError, CurrentUser, Get, JsonController, Req, Res, UseBefore } from 'routing-controllers';
import { Response, Request } from 'express';
import passport from 'passport';
import { Service } from 'typedi';
import { Mapper } from '@nartc/automapper';
import { AuthService } from '../services/AuthService';
import { AuthResponse } from './responses/auth/AuthResponse';
import { User } from '../services/models/User';

@JsonController('/auth/github')
@Service()
export class GithubController {
  constructor(private authService: AuthService) {}

  // Trigger GitHub authentication
  @Get('/')
  @UseBefore(passport.authenticate('github', { session: false }))
  login(@Req() req: Request, @Res() res: Response) {}

  @Get('/callback')
  @UseBefore(passport.authenticate('github', { failureRedirect: '/api/auth/login', session: false }))
  public async githubCallback(@CurrentUser() user: User) {
    const authResponse = await this.authService.socialLogin(user.id);
    return Mapper.map(authResponse, AuthResponse);
  }
}