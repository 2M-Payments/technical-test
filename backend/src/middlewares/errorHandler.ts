import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import jwt, { JwtPayload } from "jsonwebtoken";
import { productCreateSchema, productUpdateSchema, authUserSchema, createUserSchema } from '../middlewares/Schema';


export const validateUserAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    authUserSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Erro de validação',
        errors: error.errors,
      });
    } else {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}

export const validateUserCreate = (req: Request, res: Response, next: NextFunction) => {
   console.log(req.body);
  try {
    createUserSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Erro de validação',
        errors: error.errors,
      });
    } else {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}

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

  if (!authHeader || !authHeader?.startsWith("Bearer ")) {
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


