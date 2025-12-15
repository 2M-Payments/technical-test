import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { UserService } from '../services/user.service';

const router = Router();

// Dependency Injection
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const userService = new UserService(userRepository)
const authController = new AuthController(authService, userService);

// Rotas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);

// Rota protegida
router.get('/me', authMiddleware, authController.me);
router.post('/verify-token', authController.verifyToken);

export default router;
