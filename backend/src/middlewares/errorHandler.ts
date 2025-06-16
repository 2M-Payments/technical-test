import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import jwt, { JwtPayload } from "jsonwebtoken";
import "../types/express/index";


const productCreateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  quantity: z.number().int().min(0, 'Quantidade não pode ser negativa'),
  price: z.number().min(0.01, 'Preço deve ser maior que 0'),
});

const productUpdateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  quantity: z.number().int().min(0, 'Quantidade não pode ser negativa').optional(),
  price: z.number().min(0.01, 'Preço deve ser maior que 0').optional(),
});

export const validateProductCreate = (req: Request, res: Response, next: NextFunction) => {
  try {
    productCreateSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
       res.status(400).json({
        message: 'Erro de validação',
        errors: error.errors,
      });
    }
     res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const validateProductUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    productUpdateSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
       res.status(400).json({
        message: 'Erro de validação',
        errors: error.errors,
      });
    }
     res.status(500).json({ message: 'Erro interno do servidor' });
  }
};


export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido" });
    return
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded; 
    next();
  } catch (err) {
     res.status(401).json({ error: "Token inválido" });
  }
}
