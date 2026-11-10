import { Router } from 'express';
import { container } from 'tsyringe';

import { UsersController } from '../controllers/users.controller';

export function createUsersRoutes(): Router {
  const router = Router();
  const controller = container.resolve(UsersController);

  // Rotas de lote vêm antes de `/:id` para não serem capturadas como ID.
  router.post('/bulk', controller.createMany);
  router.delete('/bulk', controller.deleteMany);

  router.get('/', controller.list);
  router.post('/', controller.create);
  router.delete('/', controller.deleteAll);

  router.get('/:id', controller.findById);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
}
