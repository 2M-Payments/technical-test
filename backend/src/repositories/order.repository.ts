import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/Order.entity';
import { AppDataSource } from '../config/datasource';

export interface IOrderRepository {
  create(data: Partial<Order>): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAll(
    skip: number,
    take: number,
    userId?: string,
    status?: OrderStatus
  ): Promise<[Order[], number]>;
  update(id: string, data: Partial<Order>): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
  deleteMany(ids: string[]): Promise<number>;
  getStats(userId?: string): Promise<{
    totalOrders: number;
    totalRevenue: number;
    ordersByStatus: Record<OrderStatus, number>;
  }>;
}

export class OrderRepository implements IOrderRepository {
  private repository: Repository<Order>;

  constructor() {
    this.repository = AppDataSource.getRepository(Order);
  }

  async create(data: Partial<Order>): Promise<Order> {
    const order = this.repository.create(data);
    return await this.repository.save(order);
  }

  async findById(id: string): Promise<Order | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.fragrance']
    });
  }

  async findAll(
    skip: number,
    take: number,
    userId?: string,
    status?: OrderStatus
  ): Promise<[Order[], number]> {
    const where: any = {};

    if (userId) where.userId = userId;
    if (status) where.status = status;

    return await this.repository.findAndCount({
      where,
      skip,
      take,
      order: { createdAt: 'DESC' },
      relations: ['user', 'items', 'items.fragrance']
    });
  }

  async update(id: string, data: Partial<Order>): Promise<Order | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async deleteMany(ids: string[]): Promise<number> {
    const result = await this.repository.delete(ids);
    return result.affected ?? 0;
  }

  async getStats(userId?: string): Promise<{
    totalOrders: number;
    totalRevenue: number;
    ordersByStatus: Record<OrderStatus, number>;
  }> {
    const where: any = {};
    if (userId) where.userId = userId;

    const orders = await this.repository.find({ where });

    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + Number(o.total), 0),
      ordersByStatus: {
        [OrderStatus.PENDING]: 0,
        [OrderStatus.CONFIRMED]: 0,
        [OrderStatus.IN_PRODUCTION]: 0,
        [OrderStatus.COMPLETED]: 0,
        [OrderStatus.CANCELLED]: 0
      }
    };

    orders.forEach(order => {
      stats.ordersByStatus[order.status]++;
    });

    return stats;
  }
}
