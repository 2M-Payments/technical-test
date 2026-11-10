import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import passport from 'passport';

import { env } from './config/env';
import { createSessionMiddleware } from './config/session';
import { SESSION_EXPIRES_HEADER } from './middlewares/ensure-authenticated.middleware';
import { createRoutes } from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.middleware';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
      credentials: true,
      exposedHeaders: [SESSION_EXPIRES_HEADER],
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(createSessionMiddleware());
  app.use(passport.session());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', createRoutes());

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
