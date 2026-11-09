import { Router } from 'express';
import { container } from 'tsyringe';

import { AuthController } from '../controllers/auth.controller';
import { ensureAuthenticated } from '../middlewares/ensure-authenticated.middleware';

export function createAuthRoutes(): Router {
  const router = Router();
  const controller = container.resolve(AuthController);

  router.post('/login', controller.login);
  router.get('/me', ensureAuthenticated, controller.me);
  router.post('/logout', ensureAuthenticated, controller.logout);

  return router;
}
