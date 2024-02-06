import { Action } from 'routing-controllers';
import passport from 'passport';
import { User } from '../services/models/User';

const authorizationChecker = async (action: Action, roles: string[]): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, (err: Error, user: User) => {
      if (err) {
        return reject(err);
      }
      if (!user) {
        return resolve(false);
      }
      if (roles.length > 0 && !roles.includes(user.role)) {
        return resolve(false);
      }
      action.request.user = user;
      return resolve(true);
    })(action.request, action.response, action.next);
  });
};

export default authorizationChecker;
