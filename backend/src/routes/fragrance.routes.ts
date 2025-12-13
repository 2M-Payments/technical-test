

import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { FragranceRepository } from '../repositories/fragrance.repository';
import { FragranceService } from '../services/fragrance.service';
import { FragranceController } from '../controllers/fragrance.controller';

const router = Router();

const fragranceRepository = new FragranceRepository();
const fragranceService = new FragranceService(fragranceRepository);
const fragranceController = new FragranceController(fragranceService);

router.post('/', authMiddleware, fragranceController.create);
router.post('/batch', authMiddleware, fragranceController.createMany);
router.get('/', fragranceController.getAll);
router.get('/active', fragranceController.getActive);
router.get('/:id', fragranceController.getById);
router.put('/:id', authMiddleware, fragranceController.update);
router.patch('/:id/toggle', authMiddleware, fragranceController.toggleActive);
router.delete('/:id', authMiddleware, fragranceController.delete);
router.post('/delete-many', authMiddleware, fragranceController.deleteMany);

export default router;