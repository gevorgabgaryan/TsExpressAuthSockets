import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from '../config';

const appDataSource = new DataSource({
  type: config.db.type as any,
  host: config.db.host,
  port: config.db.port,
  username: config.db.userName,
  password: config.db.password,
  database: config.db.dbName,
  synchronize: config.db.synchronize,
  logging: config.db.logging,
  entities: config.db.entities,
  migrations: config.db.migrations,
});

export default appDataSource;
