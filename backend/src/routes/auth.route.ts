import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { validateRequest } from "@/middlewares/validate-request.middleware";
import { registerUserSchema, loginSchema } from "@/schemas/auth.schema";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/register", validateRequest(registerUserSchema), authController.register.bind(authController));
authRoutes.post("/login", validateRequest(loginSchema), authController.login.bind(authController));

export { authRoutes };


