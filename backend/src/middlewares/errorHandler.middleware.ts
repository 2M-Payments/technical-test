import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,

  next: NextFunction 
) => {
  console.error(error); 

 
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Erro de validação nos dados enviados.',
      errors: error.flatten().fieldErrors, 
    });
  }
  
  return res.status(500).json({ 
    message: error.message || 'Ocorreu um erro interno no servidor.' 
  });
};