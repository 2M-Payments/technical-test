import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Dependency Injection
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Rotas públicas
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Rota protegida
router.get('/session', authMiddleware, authController.checkSession);

export default router;
