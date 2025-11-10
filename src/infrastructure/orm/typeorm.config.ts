import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '../../config/env.js';
import { UserOrm } from './entities/user.orm.js';
import { UserProfileOrm } from './entities/user-profile.orm.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  synchronize: env.TYPEORM_SYNCHRONIZE,
  logging: false,
  entities: [UserOrm, UserProfileOrm],
  migrations: [new URL('./migrations/1710000000000_init.ts', import.meta.url).pathname],
});

export default AppDataSource;
