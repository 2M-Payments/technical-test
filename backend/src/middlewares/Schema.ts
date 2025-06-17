import { z } from 'zod';


export const productCreateSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    quantity: z.number().int().min(0, 'Quantidade não pode ser negativa'),
    price: z.number().min(0.01, 'Preço deve ser maior que 0'),
});

export const productUpdateSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório').optional(),
    quantity: z.number().int().min(0, 'Quantidade não pode ser negativa').optional(),
    price: z.number().min(0.01, 'Preço deve ser maior que 0').optional(),
});

export const authUserSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const createUserSchema = z.object({
    email: z.string().email('Email inválido'),
    userName: z.string().min(1, 'Nome de usuário é obrigatório'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});
