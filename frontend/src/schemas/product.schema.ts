import { z } from "zod";

const productBaseSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(120, "Nome deve ter no máximo 120 caracteres"),
  description: z
    .string()
    .min(5, "Descrição deve ter no mínimo 5 caracteres")
    .max(500, "Descrição deve ter no máximo 500 caracteres"),
  quantity: z.coerce
    .number()
    .int("Quantidade deve ser um número inteiro")
    .nonnegative("Quantidade não pode ser negativa"),
  price: z.coerce
    .number()
    .nonnegative("Preço não pode ser negativo"),
  category: z
    .string()
    .min(2, "Categoria deve ter no mínimo 2 caracteres")
    .max(80, "Categoria deve ter no máximo 80 caracteres"),
});

export const productSchema = z.object({
  products: z.array(productBaseSchema).min(1, "Adicione pelo menos um produto"),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type SingleProductData = z.infer<typeof productBaseSchema>;
