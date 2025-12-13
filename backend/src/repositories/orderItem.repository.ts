import { Repository } from 'typeorm';
import { OrderItem } from '../entities/OrderItem.entity';
import { AppDataSource } from '../config/datasource';

export class OrderItemRepository {
  private repository: Repository<OrderItem>;

  constructor() {
    this.repository = AppDataSource.getRepository(OrderItem);
  }

  async create(data: Partial<OrderItem>): Promise<OrderItem> {
    const item = this.repository.create(data);
    return await this.repository.save(item);
  }

  async findById(id: string): Promise<OrderItem | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['fragrance', 'order']
    });
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    return await this.repository.find({
      where: { orderId },
      relations: ['fragrance']
    });
  }

  async update(id: string, data: Partial<OrderItem>): Promise<OrderItem | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async deleteByOrderId(orderId: string): Promise<number> {
    const result = await this.repository.delete({ orderId });
    return result.affected ?? 0;
  }

  async getTotalQuantityByOrder(orderId: string): Promise<number> {
    const items = await this.repository.find({ where: { orderId } });
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  async getTotalByOrder(orderId: string): Promise<number> {
    const items = await this.repository.find({ where: { orderId } });
    return items.reduce((sum, item) => sum + Number(item.subtotal), 0);
  }
}
