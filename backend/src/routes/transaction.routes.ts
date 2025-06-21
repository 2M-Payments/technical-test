import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { authGuard } from '../middlewares/auth.middleware';

const router = Router();
const controller = new TransactionController();

router.use(authGuard);

router.delete('/all', controller.deleteAll); 

router.post('/batch', controller.createMany);
router.delete('/batch', controller.deleteMany);

router.get('/summary', controller.getSummary);

router.post('/', controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
