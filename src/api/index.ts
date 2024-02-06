import 'reflect-metadata';
import { Mapper } from '@nartc/automapper';
import { createExpressServer, useContainer } from 'routing-controllers';
import config from '../config';
import { AuthController } from './controllers/AuthController';
import { Container } from 'typedi';
import { ControllerMapperProfile } from './controllers/mapper/ControllerMapperProfile';
import { RepositoryMapperProfile } from './repositories/mapper/RepositoryMapperProfile';
import authorizationChecker from './auth/authorizationChecker';
import currentUserChecker from './auth/currentUserChecker';
import { UserController } from './controllers/UserController';
import SetupPassport from '../lib/passport';
import { GithubController } from './controllers/GithubController';

export class API {
  static async init() {
    const passport = SetupPassport();

    useContainer(Container);
    const app = createExpressServer({
      cors: true,
      controllers: [AuthController, UserController, GithubController],
      middlewares: [],
      routePrefix: '/api',
      validation: {
        whitelist: true,
        forbidNonWhitelisted: true,
      },
      authorizationChecker: authorizationChecker,
      currentUserChecker: currentUserChecker,
    });

    app.use(passport.initialize());

    API.initAutoMapper();

    app.listen(config.port, () => {
      console.log(`Server start http://localhost:${config.port}`);
    });
  }

  static initAutoMapper() {
    Mapper.withGlobalSettings({
      skipUnmappedAssertion: true,
      useUndefined: true,
    });
    Mapper.addProfile(RepositoryMapperProfile);
    Mapper.addProfile(ControllerMapperProfile);
  }
}
