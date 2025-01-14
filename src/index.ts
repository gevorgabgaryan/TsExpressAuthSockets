import Container from 'typedi';
import { API } from './api';
import { TypeORM } from './db';
import logger from './lib/logger';
import SocketIO from './SocketIO';
import { WebSocketService } from './websocket';

(async () => {
  try {
    await TypeORM.init();
    const httpServer = await API.init();
    const webSocketService = Container.get(WebSocketService);
    await webSocketService.init();
    await SocketIO.init(httpServer);
  } catch (e) {
    logger.error(e);
  }
})();
