import { z } from "zod";

const productBaseSchema = z.object({
  name: z.string().trim().min(3).max(120),
  description: z.string().trim().min(5).max(500),
  quantity: z.coerce.number().int().nonnegative(),
  price: z.coerce.number().nonnegative(),
});

export const multipleProductsSchema = z.array(productBaseSchema).min(1).max(100);

export const createProductSchema = z.union([productBaseSchema, multipleProductsSchema]);

export type CreateProductPayload = z.infer<typeof createProductSchema>;
export type CreateProductInput = z.infer<typeof productBaseSchema>;

export const updateProductSchema = productBaseSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Ao menos um campo deve ser informado",
  });

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const deleteManyProductsSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
});

export type DeleteManyProductsInput = z.infer<typeof deleteManyProductsSchema>;

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type ListProductsQueryInput = z.infer<typeof listProductsQuerySchema>;

