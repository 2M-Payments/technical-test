import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AuthService } from '../services/AuthService';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

export class AuthController {
  register = async (req: Request, res: Response) => {
    try {
      const data = registerSchema.parse(req.body);
      const service = container.resolve(AuthService);
      const user = await service.register(data);
      return res.status(201).json(user);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const data = loginSchema.parse(req.body);
      const service = container.resolve(AuthService);
      const result = await service.login(data);
      return res.json(result);
    } catch (err: any) {
      return res.status(401).json({ message: err.message });
    }
  };
}
