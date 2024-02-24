import logger from '../lib/logger';
import appDataSource from './appDataSource';

export class TypeORM {
  static async init() {
    try {
      await appDataSource.initialize();
      logger.info('db connection has been initialized!');
    } catch (err) {
      logger.error('Error during db connection initialization:', err);
      throw err;
    }
  }
}
