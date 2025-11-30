import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "@/utils/jwt.util";

export function authenticate(request: Request, response: Response, next: NextFunction) {
  try {
    const token = request.cookies?.token;

    if (!token) {
      return response.status(401).json({ message: "Unauthorized" });
    }

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
