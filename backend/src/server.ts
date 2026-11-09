import 'reflect-metadata';

import { createApp } from './app';
import { AppDataSource } from './config/data-source';
import { env } from './config/env';
import { configurePassport } from './config/passport';
import { registerDependencies } from './config/container';

async function bootstrap(): Promise<void> {
  await AppDataSource.initialize();
  registerDependencies(AppDataSource);
  configurePassport();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.info(`🚀 API rodando em http://localhost:${env.PORT}`);
  });

  const shutdown = (signal: string) => {
    console.info(`${signal} recebido, encerrando...`);
    server.close(() => {
      void AppDataSource.destroy().finally(() => process.exit(0));
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((error: unknown) => {
  console.error('Falha ao iniciar a aplicação', error);
  process.exit(1);
});
