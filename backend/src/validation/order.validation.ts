
import { z } from 'zod';
import { OrderStatus } from '../entities/Order.entity';

// Schema para item do pedido
export const OrderItemSchema = z.object({
  fragranceId: z.string().uuid('ID de fragrância inválido'),
  quantity: z.number()
    .int('Quantidade deve ser número inteiro')
    .positive('Quantidade deve ser positiva')
    .multipleOf(100, 'Quantidade deve ser múltiplo de 100')
    .min(100, 'Quantidade mínima é 100 unidades')
});

// Schema para criar pedido
export const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema)
    .min(1, 'Pedido deve ter pelo menos 1 item')
    .refine((items) => {
      // Validar: total de fragrâncias <= total de lotes de 100
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      const maxFragrances = totalQuantity / 100;
      const uniqueFragrances = new Set(items.map(item => item.fragranceId)).size;

      return uniqueFragrances <= maxFragrances;
    }, {
      message: 'Número de fragrâncias excede o permitido (1 fragrância por 100 unidades)'
    }),

  logoUrl: z.string().url('URL da logo inválida').optional(),
  customDescription: z.string()
    .max(500, 'Descrição não pode ter mais de 500 caracteres')
    .optional(),
  notes: z.string()
    .max(1000, 'Observações não podem ter mais de 1000 caracteres')
    .optional()
});

// Schema para atualizar pedido
export const UpdateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  logoUrl: z.string().url('URL da logo inválida').optional(),
  customDescription: z.string()
    .max(500, 'Descrição não pode ter mais de 500 caracteres')
    .optional(),
  notes: z.string()
    .max(1000, 'Observações não podem ter mais de 1000 caracteres')
    .optional()
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
export type OrderItemInput = z.infer<typeof OrderItemSchema>;
