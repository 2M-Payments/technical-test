import { Router } from 'express';
import { container } from 'tsyringe';

import { RegionsController } from '../controllers/regions.controller';

export function createRegionsRoutes(): Router {
  const router = Router();
  const controller = container.resolve(RegionsController);

  router.get('/', controller.list);

  return router;
}
