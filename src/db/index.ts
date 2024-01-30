import appDataSource from './appDataSource';

export class TypeORM {
  static async init() {
    try {
      await appDataSource.initialize();
      console.log('db connection has been initialized!');
    } catch (err) {
      console.log('Error during db connection initialization:', err);
      throw err;
    }
  }
}
