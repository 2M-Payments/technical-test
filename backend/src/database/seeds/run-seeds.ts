import 'reflect-metadata';

import { AppDataSource } from '../../config/data-source';
import { seedAdminUser } from './admin-user.seed';

async function run(): Promise<void> {
  await AppDataSource.initialize();
  try {
    await seedAdminUser(AppDataSource);
  } finally {
    await AppDataSource.destroy();
  }
}

run().catch((error: unknown) => {
  console.error('Falha ao executar seeds', error);
  process.exit(1);
});
