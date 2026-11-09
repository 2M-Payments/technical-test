import 'reflect-metadata';
import path from 'node:path';
import { DataSource } from 'typeorm';

import { env } from './env';
import { Region } from '../entities/region.entity';
import { User } from '../entities/user.entity';

/**
 * Configuração única do TypeORM. Substitui o antigo `ormconfig.json`,
 * que deixou de ser suportado a partir do TypeORM 0.3.
 */
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [User, Region],
  migrations: [path.join(__dirname, '..', 'database', 'migrations', '*.{ts,js}')],
  synchronize: false,
  logging: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  timezone: 'Z',
});
