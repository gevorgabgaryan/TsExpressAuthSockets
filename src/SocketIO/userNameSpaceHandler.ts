import { Server, Socket } from 'socket.io';
import { onlineHandler, offlineHandler, privateMessageHandler } from './eventHandler';
import { AuthenticatedSocket } from './interface/AuthenticatedSocket';

const userNamespaceHandler = async (
  io: Server,
  socket: AuthenticatedSocket,
  userNamespace: typeof Socket.prototype.nsp,
): Promise<void> => {
  try {
    socket.on('online', (callback) => onlineHandler(socket, callback, userNamespace));

    socket.on('private-message', (userId, message, callback) =>
      privateMessageHandler(userNamespace, userId, message, callback),
    );

    socket.on('disconnect', (reason) => {
      console.log(`disconnect ${socket.userId}`);
      console.log(`disconnect reason ${reason}`);
      offlineHandler(socket, userNamespace);
    });

    socket.join(socket.id); // Joining a room named after the socket's ID
  } catch (e) {
    console.error(e);
    socket.emit('error', 'Unexpected error');
  }
};

export default userNamespaceHandler;
