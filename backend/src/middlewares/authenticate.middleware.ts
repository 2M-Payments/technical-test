import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "@/utils/jwt.util";

export function authenticate(request: Request, response: Response, next: NextFunction) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    const userId = payload.sub as string;

    if (!userId) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    request.userId = userId;
    return next();
  } catch {
    return response.status(401).json({ message: "Unauthorized" });
  }
}
