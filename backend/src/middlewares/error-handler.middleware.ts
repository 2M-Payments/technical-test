import { NextFunction, Request, Response } from "express";
import { AppError } from "@/errors/app-error";

export function errorHandler(error: Error, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  console.error("Erro não esperado:", {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  return response.status(500).json({
    message: "Erro interno no servidor",
  });
}


