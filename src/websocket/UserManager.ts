import { Service } from 'typedi';
import { WebSocket } from 'ws';

@Service()
export class UserManager {
    private sockets: Set<WebSocket> = new Set();
    private authorizedUsersSockets: Record<string, WebSocket[]> = {};
    private subscribedRateSockets: Set<WebSocket> = new Set();

    add(socket: WebSocket): void {
        this.sockets.add(socket);
    }

    remove(socket: WebSocket): void {
        this.sockets.delete(socket);
        Object.entries(this.authorizedUsersSockets).forEach(([userId, sockets]) => {
            this.authorizedUsersSockets[userId] = sockets.filter(s => s !== socket);
        });
    }

    addAuthorized(userId: string, socket: WebSocket): void {
        if (!this.authorizedUsersSockets[userId]) {
            this.authorizedUsersSockets[userId] = [];
        }
        this.authorizedUsersSockets[userId].push(socket);
    }

    sendToAll(message: object): void {
        const data = JSON.stringify(message);
        this.sockets.forEach(socket => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(data);
            }
        });
    }

    subscribeToRates(socket: WebSocket): void {
        this.subscribedRateSockets.add(socket);
    }

    unsubscribeFromRates(socket: WebSocket): void {
        this.subscribedRateSockets.delete(socket);
    }

    sendRates(): void {
        const message = JSON.stringify({
            event: 'rateUpdate',
            data: { rate: Math.floor(Math.random() * (550 - 450 + 1)) + 450 },
        });

        this.subscribedRateSockets.forEach(socket => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(message);
            }
        });
    }

    public getAuthorizedSockets(userId: string): WebSocket[] {
        return this.authorizedUsersSockets[userId] || [];
    }
}