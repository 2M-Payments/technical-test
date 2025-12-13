import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.session.userId) {
    res.status(401).json({ error: 'Não autorizado. Faça login.' });
    return;
  }

  next();
};
