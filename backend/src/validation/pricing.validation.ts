import { z } from 'zod';

export const CreatePricingConfigSchema = z.object({
  minQuantity: z.number()
    .int('Quantidade mínima deve ser número inteiro')
    .positive('Quantidade mínima deve ser positiva')
    .multipleOf(100, 'Quantidade deve ser múltiplo de 100'),

  maxQuantity: z.number()
    .int('Quantidade máxima deve ser número inteiro')
    .positive('Quantidade máxima deve ser positiva')
    .multipleOf(100, 'Quantidade deve ser múltiplo de 100')
    .nullable()
    .optional(),

  unitPrice: z.number()
    .positive('Preço deve ser positivo')
    .max(999999.99, 'Preço muito alto'),

  discountPercentage: z.number()
    .min(0, 'Desconto não pode ser negativo')
    .max(100, 'Desconto não pode ser maior que 100%')
    .default(0),

  active: z.boolean().default(true)
}).refine((data) => {
  // Validar: maxQuantity deve ser maior que minQuantity
  if (data.maxQuantity !== null && data.maxQuantity !== undefined) {
    return data.maxQuantity > data.minQuantity;
  }
  return true;
}, {
  message: 'Quantidade máxima deve ser maior que quantidade mínima'
});

export const UpdatePricingConfigSchema = CreatePricingConfigSchema.partial();

export type CreatePricingConfigInput = z.infer<typeof CreatePricingConfigSchema>;
export type UpdatePricingConfigInput = z.infer<typeof UpdatePricingConfigSchema>;
