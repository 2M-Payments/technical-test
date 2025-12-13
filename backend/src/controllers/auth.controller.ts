import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private authService: AuthService) { }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.authService.login(req.body);

      // Armazena dados na sessão
      req.session.userId = user.id;
      req.session.email = user.email;

      res.json({
        message: 'Login realizado com sucesso',
        user
      });
    } catch (error) {
      res.status(401).json({
        error: error instanceof Error ? error.message : 'Falha no login'
      });
    }
  };

  logout = (req: Request, res: Response): void => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: 'Falha ao fazer logout' });
        return;
      }
      res.json({ message: 'Logout realizado com sucesso' });
    });
  };

  checkSession = (req: Request, res: Response): void => {
    if (req.session.userId) {
      res.json({
        authenticated: true,
        userId: req.session.userId,
        email: req.session.email
      });
    } else {
      res.status(401).json({ authenticated: false });
    }
  };
}
