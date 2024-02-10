import { Service, Container } from 'typedi';
import { WebSocket } from 'ws'; // Ensure WebSocket is correctly typed to include userId
import { AuthService } from '../api/services/AuthService';
import { UserService } from '../api/services/UserService';
import { WsValidator } from './WsValidator';
import { AuthorizeRequest } from './requests/AuthorizeRequest';
import { UserManager } from './UserManager';
import { BadRequestError } from 'routing-controllers';
import { AuthenticatedWebSocket } from './interface/AuthenticatedWebSocket';

@Service()
export class RequestsManager {
  private callsList: { [key: string]: any } = {};

  constructor(
    private authService: AuthService = Container.get(AuthService),
    private wsValidator: WsValidator = Container.get(WsValidator),
    private userManager: UserManager = Container.get(UserManager)
  ) {
    this.initCalls();
  }

  initCalls() {
    this.registerCall('authorize', AuthorizeRequest, ['user'], async (socket: AuthenticatedWebSocket, params: any, roles: string[]) => {
      try {
        const tokenRequest = new AuthorizeRequest();
        tokenRequest.token = params.token;
        const validationErrors = await this.wsValidator.validate(tokenRequest);
        if (validationErrors.length > 0) {
          throw new BadRequestError('Validation failed');
        }

        const  userId = await this.authService.checkToken(params.token, roles);

        this.userManager.addAuthorized(userId, socket);
        socket.userId = userId;
        this.send(socket, { message: 'Successfully authorized' });
      } catch (e) {
        console.error(e);
        this.send(socket, { error: true, message: 'Unauthorized' });
      }
    });

    this.registerCall('subscribeRates', null, ['user'], async (socket: AuthenticatedWebSocket, params: any) => {
        this.userManager.subscribeToRates(socket);
        this.send(socket, { message: 'Subscribed to rate updates' });
    });

    this.registerCall('unsubscribeRates', null, ['user'], async (socket: AuthenticatedWebSocket, params: any) => {
        this.userManager.unsubscribeFromRates(socket);
        this.send(socket, { message: 'Unsubscribed from rate updates' });
    });

  }

  registerCall(callName: string, schema: Function | null, roles: string[] | null, callback: Function) {
    this.callsList[callName] = { schema, callback, roles };
  }

  async handleRequests(socket: WebSocket, data: string) {
    try {
      const dataObj = JSON.parse(data);
      const { event, params } = dataObj;
      if (!event) {
        throw new Error('Event name required');
      }

      const callObj = this.callsList[event];
      if (!callObj) {
        throw new Error('Unexpected event');
      }

      await callObj.callback(socket, params, callObj.roles);
    } catch (e: any) {
      console.error(e);
      this.send(socket, { error: true, message: e.message || 'An error occurred' });
    }
  }

  send(socket: WebSocket, message: object) {
    const data = JSON.stringify(message);
    socket.send(data);
  }
}