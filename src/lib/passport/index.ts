import passport from 'passport';
import passportJWT from 'passport-jwt';
import Container from 'typedi';
import { UserService } from '../../api/services/UserService';
import { Profile, Strategy as GitHubStrategy } from 'passport-github2';
import config from '../../config';
import { User } from '../../api/services/models/User';
import { AuthService } from '../../api/services/AuthService';
import { AuthProvider } from '../../api/services/models/AuthProvider';
import { Provider } from '../../api/enums/Provider';
import { UnAuthorizedError } from '../../api/errors/UnAuthorizedError';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const SetupPassport = () => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.JWTSecret,
      },
      async (jwtPayload, done) => {
        try {
          if (!jwtPayload.id) {
            done(null, false);
          }
          const userService = Container.get<UserService>(UserService);
          const user = await userService.getUser(jwtPayload.id);
          if (!user) {
            throw new UnAuthorizedError();
          }

          done(null, user);
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: config.githubClientId,
        clientSecret: config.githubClientSecret,
        scope: ['user:email', 'read:user'],
        callbackURL: 'http://localhost:3115/api/auth/github/callback',
      },
      async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
        try {
          const email = profile.emails && profile.emails[0].value;
          if (!email) {
            return done(new Error('GitHub account has no public email.'));
          }
          const newUser = new User();
          newUser.email = email;
          if (profile.displayName && profile.displayName.split(' ').length === 2) {
            newUser.firstName = profile.displayName.split(' ')[0];
            newUser.lastName = profile.displayName.split(' ')[1];
          }
          const authProvider = new AuthProvider();
          authProvider.providerId = profile.id;
          authProvider.provider = Provider.GITHUB;

          const authService = Container.get<AuthService>(AuthService);
          let user = await authService.findOrCreateUserWithProvider(newUser, authProvider);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  return passport;
};

export default SetupPassport;
