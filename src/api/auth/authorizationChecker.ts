import { Action } from 'routing-controllers';
import passport from 'passport';
import { User } from '../services/models/User';
import { AppAccessDeniedError } from '../errors/AppAccessDeniedError';

const authorizationChecker = async (action: Action, roles: string[]): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, (err: Error, user: User) => {
      if (err) {
        return reject(err);
      }

      if (roles.length > 0 && !roles.includes(user.role)) {
        throw new AppAccessDeniedError();
      }
      action.request.user = user;
      return resolve(true);
    })(action.request, action.response, action.next);
  });
};

export default authorizationChecker;
