import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { AuthService } from "@/services/auth.service";
import { COOKIE_OPTIONS } from "@/config/cookie";

export class AuthController {
  async register(request: Request, response: Response, next: NextFunction) {
    try {
      const authService = container.resolve(AuthService);
      const { user, token } = await authService.register(request.validated!.body);

      response.cookie("token", token, COOKIE_OPTIONS);
      return response.status(201).json({ user });
    } catch (error) {
      return next(error);
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const authService = container.resolve(AuthService);
      const { user, token } = await authService.login(request.validated!.body);

      response.cookie("token", token, COOKIE_OPTIONS);
      return response.json({ user });
    } catch (error) {
      return next(error);
    }
  }

  async logout(_request: Request, response: Response) {
    response.clearCookie("token", COOKIE_OPTIONS);
    return response.json({ message: "Logout realizado com sucesso" });
  }

  async me(request: Request, response: Response, next: NextFunction) {
    try {
      const authService = container.resolve(AuthService);
      const result = await authService.me(request.userId!);

      return response.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
