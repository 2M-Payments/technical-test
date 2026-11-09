import { Router } from 'express';

import { ensureAuthenticated } from '../middlewares/ensure-authenticated.middleware';
import { createAuthRoutes } from './auth.routes';
import { createRegionsRoutes } from './regions.routes';
import { createUsersRoutes } from './users.routes';

export function createRoutes(): Router {
  const router = Router();

  router.use('/auth', createAuthRoutes());
  router.use('/regions', ensureAuthenticated, createRegionsRoutes());
  router.use('/users', ensureAuthenticated, createUsersRoutes());

  return router;
}
