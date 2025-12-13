import { Router } from 'express';
import { OrderRepository } from '../repositories/order.repository';
import { PricingService } from '../services/pricing.service';
import { OrderService } from '../services/order.service';
import { OrderController } from '../controllers/order.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const router = Router();

const orderRepository = new OrderRepository();
const pricingService = new PricingService();
const orderService = new OrderService(orderRepository, pricingService);
const orderController = new OrderController(orderService);

router.use(authMiddleware);

router.post('/calculate', orderController.calculatePrice);
router.get('/stats', orderController.getStats);
router.post('/', orderController.create);
router.post('/batch', orderController.createMany);
router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.delete);
router.delete('/batch/many', orderController.deleteMany);

export default router;
