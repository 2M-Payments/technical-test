import { Order, OrderStatus } from '../entities/Order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { OrderItemRepository } from '../repositories/orderItem.repository';
import { FragranceRepository } from '../repositories/fragrance.repository';
import { PricingConfigRepository } from '../repositories/pricingConfig.repository';
import { CreateOrderSchema, UpdateOrderSchema } from '../validation/order.validation';

interface FragranceSelection {
  fragranceId: string;
  quantity: number;
}

interface PriceCalculation {
  unitPrice: number;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
}

export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private orderItemRepository: OrderItemRepository,
    private fragranceRepository: FragranceRepository,
    private pricingConfigRepository: PricingConfigRepository
  ) { }

  async createOrder(userId: string, data: unknown): Promise<Order> {
    const validated = CreateOrderSchema.parse(data);

    // Calcular quantidade total
    const totalQuantity = validated.items.reduce((sum, item) => sum + item.quantity, 0);

    // Validar regras de fragrâncias
    await this.validateFragranceRules(totalQuantity, validated.items);

    // Calcular preços
    const pricing = await this.calculatePricing(totalQuantity);

    // Criar o pedido
    const order = await this.orderRepository.create({
      userId,
      totalQuantity,
      subtotal: pricing.subtotal,
      discount: pricing.discountAmount,
      total: pricing.total,
      status: OrderStatus.PENDING,
      logoUrl: validated.logoUrl,
      customDescription: validated.customDescription,
      notes: validated.notes
    });

    // Criar os items do pedido
    for (const item of validated.items) {
      const fragrance = await this.fragranceRepository.findById(item.fragranceId);
      if (!fragrance) {
        throw new Error(`Fragrância não encontrada: ${item.fragranceId}`);
      }

      if (!fragrance.active) {
        throw new Error(`Fragrância inativa: ${fragrance.name}`);
      }

      const itemSubtotal = item.quantity * pricing.unitPrice;

      await this.orderItemRepository.create({
        orderId: order.id,
        fragranceId: item.fragranceId,
        quantity: item.quantity,
        unitPrice: pricing.unitPrice,
        subtotal: itemSubtotal
      });
    }

    // Retornar pedido completo com items
    const fullOrder = await this.orderRepository.findById(order.id);
    if (!fullOrder) {
      throw new Error('Erro ao recuperar pedido criado');
    }

    return fullOrder;
  }

  private async validateFragranceRules(
    totalQuantity: number,
    items: FragranceSelection[]
  ): Promise<void> {
    // Validar: quantidade total das fragrâncias = quantidade do pedido
    const totalFragranceQty = items.reduce((sum, f) => sum + f.quantity, 0);
    if (totalFragranceQty !== totalQuantity) {
      throw new Error(
        `Soma das quantidades de fragrâncias (${totalFragranceQty}) deve ser igual à quantidade total (${totalQuantity})`
      );
    }

    // Validar: número de fragrâncias únicas <= quantidade / 100
    const maxFragrances = Math.floor(totalQuantity / 100);
    const uniqueFragrances = new Set(items.map(f => f.fragranceId)).size;

    if (uniqueFragrances > maxFragrances) {
      throw new Error(
        `Máximo de ${maxFragrances} fragrância(s) diferentes para ${totalQuantity} unidades. Você selecionou ${uniqueFragrances}`
      );
    }

    // Validar: cada fragrância deve ser múltiplo de 100
    for (const item of items) {
      if (item.quantity % 100 !== 0) {
        const fragrance = await this.fragranceRepository.findById(item.fragranceId);
        const name = fragrance?.name || item.fragranceId;
        throw new Error(`Quantidade de ${name} deve ser múltiplo de 100`);
      }
    }

    // Validar quantidade mínima
    if (totalQuantity < 100) {
      throw new Error('Quantidade mínima é 100 unidades');
    }
  }

  private async calculatePricing(quantity: number): Promise<PriceCalculation> {
    const pricingConfig = await this.pricingConfigRepository.findByQuantity(quantity);

    if (!pricingConfig) {
      throw new Error('Configuração de preço não encontrada para esta quantidade');
    }

    const unitPrice = Number(pricingConfig.unitPrice);
    const subtotal = quantity * unitPrice;
    const discountPercentage = Number(pricingConfig.discountPercentage);
    const discountAmount = subtotal * (discountPercentage / 100);
    const total = subtotal - discountAmount;

    return {
      unitPrice,
      subtotal,
      discountPercentage,
      discountAmount,
      total
    };
  }

  async getOrderById(id: string, userId?: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    // Se userId fornecido, validar ownership
    if (userId && order.userId !== userId) {
      throw new Error('Acesso negado');
    }

    return order;
  }

  async getAllOrders(
    page: number = 1,
    limit: number = 10,
    userId?: string,
    status?: OrderStatus
  ): Promise<{
    data: Order[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [orders, total] = await this.orderRepository.findAll(
      skip,
      limit,
      userId,
      status
    );

    return {
      data: orders,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async updateOrder(id: string, data: unknown, userId?: string): Promise<Order> {
    const validated = UpdateOrderSchema.parse(data);

    const existing = await this.getOrderById(id, userId);

    if (existing.status === OrderStatus.CANCELLED || existing.status === OrderStatus.COMPLETED) {
      throw new Error('Não é possível atualizar pedido cancelado ou completado');
    }

    const updated = await this.orderRepository.update(id, validated);

    if (!updated) {
      throw new Error('Falha ao atualizar pedido');
    }

    return updated;
  }

  async deleteOrder(id: string, userId?: string): Promise<void> {
    const order = await this.getOrderById(id, userId);

    // Só pode deletar se ainda não estiver em produção/completado
    if (order.status === OrderStatus.IN_PRODUCTION || order.status === OrderStatus.COMPLETED) {
      throw new Error('Não é possível deletar pedido em produção ou completado');
    }

    const deleted = await this.orderRepository.delete(id);
    if (!deleted) {
      throw new Error('Falha ao deletar pedido');
    }
  }

  async deleteMany(ids: string[], userId?: string): Promise<number> {
    if (userId) {
      for (const id of ids) {
        await this.getOrderById(id, userId); // Throws se não for dono
      }
    }

    return await this.orderRepository.deleteMany(ids);
  }

  async createMany(userId: string, dataArray: unknown[]): Promise<Order[]> {
    const orders: Order[] = [];

    for (const data of dataArray) {
      const order = await this.createOrder(userId, data);
      orders.push(order);
    }

    return orders;
  }

  async calculatePrice(data: unknown): Promise<PriceCalculation> {
    const validated = CreateOrderSchema.parse(data);
    const totalQuantity = validated.items.reduce((sum, item) => sum + item.quantity, 0);

    await this.validateFragranceRules(totalQuantity, validated.items);

    return await this.calculatePricing(totalQuantity);
  }

  async getOrderStats(userId?: string) {
    return await this.orderRepository.getStats(userId);
  }
}
