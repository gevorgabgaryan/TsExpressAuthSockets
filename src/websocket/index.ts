import { Server as WebSocketServer, WebSocket, RawData } from 'ws'; // Correct import for WebSocket type
import { Service } from 'typedi';
import config from '../config'; // Ensure this path is correct
import { UserManager } from './UserManager'; // Ensure this path is correct and the class name matches the file name
import { RequestsManager } from './RequestsManager';
import logger from '../lib/logger';

@Service()
export class WebSocketService {
  private wsServer: WebSocketServer | null = null;

  constructor(
    private userManager: UserManager,
    private requestsManager: RequestsManager,
  ) {}

  async init(): Promise<void> {
    this.wsServer = new WebSocketServer({ port: config.wsPort });

    this.wsServer.on('connection', this.onSocketConnection);

    setInterval(() => this.userManager.sendRates(), 10000);

    logger.info(`WebSocket server is running on port ${config.wsPort}`);
  }

  private onSocketConnection = (socket: WebSocket): void => {
    console.log('New websocket connection');
    this.userManager.add(socket);

    socket.on('message', (data) => this.onSocketMessage(socket, data));
    socket.on('close', (code, reason) => this.onSocketClose(socket, code, reason));

    socket.send('Welcome to the WebSocket server!');
  };

  private async onSocketMessage(socket: WebSocket, data: RawData): Promise<void> {
    const payload = JSON.parse(data.toString());
    await this.requestsManager.handleRequests(socket, data.toString());
    console.log('Received:', payload);
    socket.send(`Received ${data}`);
  }

  private onSocketClose(socket: WebSocket, code: number, reason: Buffer): void {
    const reasonString = reason.toString();
    console.log(`Client has disconnected; code ${code}, reason: ${reasonString}`);
    this.userManager.remove(socket);
  }

  public notifyLogout(userId: string): void {
    const sockets = this.userManager.getAuthorizedSockets(userId);
    const logoutMessage = JSON.stringify({ event: 'logout', message: 'Logged out successfully' });
    sockets.forEach((socket: WebSocket) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(logoutMessage);
      }
    });
  }
}
