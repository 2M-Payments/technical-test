import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validateMiddleware(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next(); // ✅ Continua para o próximo middleware/código
    } catch (error) {
      res.status(400).json({ message: "Erro de validação", errors: (error as any).errors });
    }
  };
}
