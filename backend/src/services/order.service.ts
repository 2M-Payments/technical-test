import { Order, OrderStatus, FragranceSelection } from '../entities/Order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderSchema, UpdateOrderSchema } from '../validation/order.validation';
import { PricingService } from './pricing.service';

export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private pricingService: PricingService
  ) { }

  async createOrder(userId: string, data: unknown): Promise<Order> {
    const validated = CreateOrderSchema.parse(data);

    const quantity = validated.items.reduce((sum, item) => sum + item.quantity, 0);
    const fragrances = validated.items.map(item => ({
      fragranceId: item.fragranceId,
      quantity: item.quantity
    }));

    this.validateFragranceRules(quantity, fragrances);

    const pricing = this.pricingService.calculatePrice(quantity);

    const order = await this.orderRepository.create({
      userId,
      items: fragrances,
      logoUrl: validated.logoUrl,
      customDescription: validated.customDescription,
      notes: validated.notes,
      unitPrice: pricing.unitPrice,
      subtotal: pricing.subtotal,
      discountPercentage: pricing.discountPercentage,
      discountAmount: pricing.discountAmount,
      total: pricing.total,
      status: OrderStatus.PENDING
    });

    return order;
  }

  private validateFragranceRules(quantity: number, fragrances: FragranceSelection[]) {
    // Validar: quantidade total das fragrâncias = quantidade do pedido
    const totalFragranceQty = fragrances.reduce((sum, f) => sum + f.quantity, 0);
    if (totalFragranceQty !== quantity) {
      throw new Error(
        `Soma das quantidades de fragrâncias (${totalFragranceQty}) deve ser igual à quantidade total (${quantity})`
      );
    }

    // Validar: número de fragrâncias únicas <= quantidade / 100
    const maxFragrances = Math.floor(quantity / 100);
    const uniqueFragrances = new Set(fragrances.map(f => f.name)).size;

    if (uniqueFragrances > maxFragrances) {
      throw new Error(
        `Máximo de ${maxFragrances} fragrância(s) diferentes para ${quantity} unidades. Você selecionou ${uniqueFragrances}`
      );
    }

    // Validar: cada fragrância deve ser múltiplo de 100
    for (const fragrance of fragrances) {
      if (fragrance.quantity % 100 !== 0) {
        throw new Error(`Quantidade de ${fragrance.name} deve ser múltiplo de 100`);
      }
    }
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
  async calculatePrice(data: unknown) {
    const validated = CreateOrderSchema.parse(data);
    const quantity = validated.items.reduce((sum, item) => sum + item.quantity, 0);
    const fragrances = validated.items.map(item => ({
      fragranceId: item.fragranceId,
      quantity: item.quantity
    }));
    this.validateFragranceRules(quantity, fragrances);
    return this.pricingService.calculatePrice(quantity);
  }
  
}
