import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// Dependency Injection
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Rotas públicas
router.post('/login', authController.login);

// Rota protegida
router.get('/me', authMiddleware, authController.me);
router.post('/verify-token', authController.verifyToken);

export default router;
