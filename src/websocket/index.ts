import { Server as WebSocketServer } from 'ws';
import { Service } from 'typedi';
import config from '../config';


@Service()
export class WebSocketService {
    private wsServer: WebSocketServer | null = null;
    async init(): Promise<void> {
        this.wsServer = new WebSocketServer({ port: config.wsPort });

        this.wsServer.on('connection', (socket, request) => {
            console.log('WebSocket client connected');

            socket.on('message', async (data) => {
                console.log(`Received message: ${data}`);
                socket.send(`Recived ${data}`);
            });

            socket.on('close', () => {
                console.log('WebSocket client disconnected');
            });

            socket.send('Welcome to the WebSocket server!');
        });

        console.log(`WebSocket server is running on port ${config.wsPort}`);
    }
}