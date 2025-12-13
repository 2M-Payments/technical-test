
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { PricingConfigController } from '../controllers/pricingConfig.controller';
import { PricingConfigRepository } from '../repositories/pricingConfig.repository';
import { PricingConfigService } from '../services/pricingConfig.service';

const router = Router();

const pricingConfigRepository= new PricingConfigRepository();
const pricingConfigService = new PricingConfigService(pricingConfigRepository);
const pricingConfigController = new PricingConfigController(pricingConfigService);

router.post('/', authMiddleware, pricingConfigController.create);
router.get('/', pricingConfigController.getAll);
router.get('/active', pricingConfigController.getActive);
router.get('/table', pricingConfigController.getPricingTable);
router.get('/calculate', pricingConfigController.calculatePrice);
router.get('/:id', pricingConfigController.getById);
router.put('/:id', authMiddleware, pricingConfigController.update);
router.patch('/:id/toggle', authMiddleware, pricingConfigController.toggleActive);
router.delete('/:id', authMiddleware, pricingConfigController.delete);
router.post('/delete-many', authMiddleware, pricingConfigController.deleteMany);

export default router;