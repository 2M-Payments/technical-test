import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { validateRequest } from "@/middlewares/validate-request.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { registerUserSchema, loginSchema } from "@/schemas/auth.schema";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/register", validateRequest(registerUserSchema), authController.register);
authRoutes.post("/login", validateRequest(loginSchema), authController.login);
authRoutes.get("/me", authenticate, authController.me);

export { authRoutes };


