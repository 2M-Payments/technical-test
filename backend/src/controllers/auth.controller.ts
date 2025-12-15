import { Request, Response } from 'express';
import { IAuthService } from '../services/auth.service';
import { IUserService } from '../services/user.service';

export interface IAuthController {
  login(req: Request, res: Response): Promise<void>;
  verifyToken(req: Request, res: Response): Promise<void>;
  me(req: Request, res: Response): Promise<void>;
  register(req: Request, res: Response): Promise<void>;
}

export class AuthController implements IAuthController {
  constructor(
    private readonly authService: IAuthService,
    private readonly userService: IUserService
  ) { }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.createUser(req.body);

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Falha ao registrar'
      });
    }
  };
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);

      res.json({
        message: 'Login realizado com sucesso',
        ...result
      });
    } catch (error) {
      res.status(401).json({
        error: error instanceof Error ? error.message : 'Falha no login'
      });
    }
  };

  verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.body.token;

      if (!authHeader) {
        res.status(401).json({ error: 'Token não fornecido' });
        return;
      }

      const token = authHeader.split(' ')[1];
      const user = await this.authService.verifyToken(token);

      res.json({
        valid: true,
        user
      });
    } catch (error) {
      res.status(401).json({
        valid: false,
        error: error instanceof Error ? error.message : 'Token inválido'
      });
    }
  };

  me = async (req: Request, res: Response): Promise<void> => {
    try {
      // req.user é preenchido pelo authMiddleware
      if (!req.user) {
        res.status(401).json({ error: 'Não autenticado' });
        return;
      }

      res.json({
        user: req.user
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };
}
