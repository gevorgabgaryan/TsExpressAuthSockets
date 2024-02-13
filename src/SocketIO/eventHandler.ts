
import { Socket  } from 'socket.io';
import Container from 'typedi';
import { UserService } from '../api/services/UserService';
import { AuthenticatedSocket } from './interface/AuthenticatedSocket';


type CallbackFunction = (response: { status: string }) => void;
export const pingHandler = (socket: Socket, callback: CallbackFunction): void => {
    if (typeof callback === 'function') {
      callback({
        status: 'pong',
      });
    }
};


type Callback = (response: Record<string, any>) => void;

export const onlineHandler = async (socket: AuthenticatedSocket, callback: Callback, namespace: typeof Socket.prototype.nsp): Promise<void> => {
  try {
    const userService = Container.get<UserService>(UserService);
    const user = await userService.makeUserOnline(socket.userId);
    socket.join('onlinesRoom');
    // namespace.to('onlinesRoom').emit('new-online-user', user.email);
    socket.broadcast.to('onlinesRoom').emit('new-online-user', user.email);
    if (typeof callback === 'function') {
      callback({ status: 'onlinesRoom' });
    }
    socket.join(socket.userId);
  } catch (e) {
    console.log(e);
  }
};

export const offlineHandler = async (socket: AuthenticatedSocket, namespace: typeof Socket.prototype.nsp): Promise<void> => {
  try {
    const userService = Container.get<UserService>(UserService);
    const user = await userService.makeUserOffline(socket.userId as string);
    namespace.to('onlinesRoom').emit('user-leave', user.email);
  } catch (e) {
    console.log(e);
  }
};

export const privateMessageHandler = async (namespace: typeof Socket.prototype.nsp, userId: string, message: string, callback: Callback): Promise<void> => {
  try {
    const room = namespace.adapter.rooms.get(userId);
    if (!room || room.size === 0) {
      if (typeof callback === 'function') {
        callback({ status: 'error', message: 'User is not online or room does not exist' });
      }
      return;
    }

    if (!message.trim()) {
      if (typeof callback === 'function') {
        callback({ status: 'error', message: 'Message cannot be empty' });
      }
      return;
    }

    namespace.to(userId).emit('private-message', message);
    if (typeof callback === 'function') {
      callback({ status: 'sent' });
    }
  } catch (e) {
    console.log(e);
  }
};