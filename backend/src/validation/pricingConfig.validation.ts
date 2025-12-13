import { z } from 'zod';

export const CreatePricingConfigSchema = z.object({
  minQuantity: z.number()
    .int('Quantidade mínima deve ser um número inteiro')
    .positive('Quantidade mínima deve ser positiva')
    .min(100, 'Quantidade mínima deve ser pelo menos 100'),
  maxQuantity: z.number()
    .int('Quantidade máxima deve ser um número inteiro')
    .positive('Quantidade máxima deve ser positiva')
    .optional()
    .nullable(),
  unitPrice: z.number()
    .positive('Preço unitário deve ser positivo')
    .multipleOf(0.01, 'Preço unitário deve ter no máximo 2 casas decimais'),
  discountPercentage: z.number()
    .min(0, 'Desconto não pode ser negativo')
    .max(100, 'Desconto não pode ser maior que 100%')
    .default(0),
  active: z.boolean()
    .default(true)
}).refine(
  (data) => {
    if (data.maxQuantity && data.minQuantity >= data.maxQuantity) {
      return false;
    }
    return true;
  },
  {
    message: 'Quantidade mínima deve ser menor que quantidade máxima',
    path: ['maxQuantity']
  }
);

export const UpdatePricingConfigSchema = z.object({
  minQuantity: z.number()
    .int('Quantidade mínima deve ser um número inteiro')
    .positive('Quantidade mínima deve ser positiva')
    .min(100, 'Quantidade mínima deve ser pelo menos 100')
    .optional(),
  maxQuantity: z.number()
    .int('Quantidade máxima deve ser um número inteiro')
    .positive('Quantidade máxima deve ser positiva')
    .optional()
    .nullable(),
  unitPrice: z.number()
    .positive('Preço unitário deve ser positivo')
    .multipleOf(0.01, 'Preço unitário deve ter no máximo 2 casas decimais')
    .optional(),
  discountPercentage: z.number()
    .min(0, 'Desconto não pode ser negativo')
    .max(100, 'Desconto não pode ser maior que 100%')
    .optional(),
  active: z.boolean()
    .optional()
});

export type CreatePricingConfigDTO = z.infer<typeof CreatePricingConfigSchema>;
export type UpdatePricingConfigDTO = z.infer<typeof UpdatePricingConfigSchema>;
