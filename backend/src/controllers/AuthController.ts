import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AuthService } from '../services/authService';
import { registerSchema, loginSchema } from '../schemas/authSchema';

export class AuthController {
  register = async (req: Request, res: Response) => {
      const data = registerSchema.parse(req.body);
      const service = container.resolve(AuthService);
      const user = await service.register(data);
      return res.status(201).json(user);
 
  };

  login = async (req: Request, res: Response) => {
      const data = loginSchema.parse(req.body);
      const service = container.resolve(AuthService);
      const result = await service.login(data);
      return res.json(result);

  };
}
