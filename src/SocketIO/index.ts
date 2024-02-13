import { Server, Socket  } from 'socket.io';
import { Server as HttpServer } from 'http';
import { pingHandler } from './eventHandler';
import { AuthService } from '../api/services/AuthService';
import { AuthenticatedSocket } from './interface/AuthenticatedSocket';
import Container from 'typedi';
import userNamespaceHandler from './userNameSpaceHandler';

class SocketIO {
  static async init(httpServer: HttpServer): Promise<void> {
    const io = new Server(httpServer, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
          credentials: true
        }
    });
    io.on('connection', (socket: Socket ) => {
      socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
            socket.emit('message', 'hello world')
      });
      console.log('A client connected');

      socket.on('ping', (callback) => pingHandler(socket, callback))
    });

    const userNamespace = io.of('/users');
    userNamespace.use(async (socket: Socket, next: (err?: any) => void) => {
      try {
        const token = socket.handshake.auth.token;
        if (token) {
          const authService = Container.get<AuthService>(AuthService);
          const userId = await authService.checkToken(token, ['user']);

            if (userId) {
                (socket as AuthenticatedSocket).userId = userId;
                return next();
            }
            return next();

        }
        throw new Error('Auth token required');
      } catch (e) {
        next(e);
      }
    });
    userNamespace.on('connection', (socket: Socket) => {
        console.info(`new socket: ${socket.id}`);
        const authenticatedSocket = socket as AuthenticatedSocket;
        console.info(`userId socket: ${authenticatedSocket.userId}`);
        userNamespaceHandler(io, authenticatedSocket, userNamespace);
    });
    console.log('Socket init')
  }
}

export default SocketIO;