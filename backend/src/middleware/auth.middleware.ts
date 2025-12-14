import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt.util';

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
  expiresIn: '30m' // 30 minutos
};
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: 'Token não fornecido'
      });
      return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({
        error: 'Formato de token inválido. Use: Bearer <token>'
      });
      return;
    }

    const token = parts[1];

    const decoded = JwtUtil.verifyToken(token);

    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: error instanceof Error ? error.message : 'Token inválido'
    });
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || !req.user.userId) {
    res.status(401).json({
      error: 'Não autorizado. Faça login para continuar.'
    });
    return;
  }


  next();
};