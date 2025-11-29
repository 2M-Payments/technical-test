import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { AuthService } from "@/services/auth.service";

export class AuthController {
  async register(request: Request, response: Response, next: NextFunction) {
    try {
      const authService = container.resolve(AuthService);
      const result = await authService.register(request.validated!.body);

      return response.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const authService = container.resolve(AuthService);
      const result = await authService.login(request.validated!.body);

      return response.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
