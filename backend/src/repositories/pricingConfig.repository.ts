import { Repository } from 'typeorm';
import { PricingConfig } from '../entities/PricingConfig.entity';
import { AppDataSource } from '../config/datasource';

export interface IPricingConfigRepository {
  create(data: Partial<PricingConfig>): Promise<PricingConfig>;
  findById(id: string): Promise<PricingConfig | null>;
  findAll(skip: number, take: number, activeOnly?: boolean): Promise<[PricingConfig[], number]>;
  findActive(): Promise<PricingConfig[]>;
  findByQuantity(quantity: number): Promise<PricingConfig | null>;
  update(id: string, data: Partial<PricingConfig>): Promise<PricingConfig | null>;
  delete(id: string): Promise<boolean>;
  deleteMany(ids: string[]): Promise<number>;
  toggleActive(id: string): Promise<PricingConfig | null>;
  checkOverlap(minQuantity: number, maxQuantity: number | null, excludeId?: string): Promise<boolean>;
}

export class PricingConfigRepository implements IPricingConfigRepository {
  private repository: Repository<PricingConfig>;

  constructor() {
    this.repository = AppDataSource.getRepository(PricingConfig);
  }

  async create(data: Partial<PricingConfig>): Promise<PricingConfig> {
    const config = this.repository.create(data);
    return await this.repository.save(config);
  }

  async findById(id: string): Promise<PricingConfig | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findAll(skip: number, take: number, activeOnly: boolean = false): Promise<[PricingConfig[], number]> {
    const where: any = {};

    if (activeOnly) {
      where.active = true;
    }

    return await this.repository.findAndCount({
      where,
      skip,
      take,
      order: { minQuantity: 'ASC' }
    });
  }

  async findActive(): Promise<PricingConfig[]> {
    return await this.repository.find({
      where: { active: true },
      order: { minQuantity: 'ASC' }
    });
  }

  async findByQuantity(quantity: number): Promise<PricingConfig | null> {
    // Busca a configuração de preço que se aplica à quantidade informada
    const configs = await this.repository
      .createQueryBuilder('config')
      .where('config.active = :active', { active: true })
      .andWhere('config.minQuantity <= :quantity', { quantity })
      .andWhere('(config.maxQuantity IS NULL OR config.maxQuantity >= :quantity)', { quantity })
      .orderBy('config.minQuantity', 'DESC')
      .getOne();

    return configs;
  }

  async update(id: string, data: Partial<PricingConfig>): Promise<PricingConfig | null> {
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

  async toggleActive(id: string): Promise<PricingConfig | null> {
    const config = await this.findById(id);
    if (!config) return null;

    return await this.update(id, { active: !config.active });
  }

  async checkOverlap(minQuantity: number, maxQuantity: number | null, excludeId?: string): Promise<boolean> {
    // Verifica se existe sobreposição de faixas de quantidade
    const query = this.repository
      .createQueryBuilder('config')
      .where('config.active = :active', { active: true });

    if (excludeId) {
      query.andWhere('config.id != :excludeId', { excludeId });
    }

    // Verifica sobreposição
    query.andWhere(
      '(:minQuantity BETWEEN config.minQuantity AND COALESCE(config.maxQuantity, :minQuantity)) OR ' +
      '(:maxQuantity BETWEEN config.minQuantity AND COALESCE(config.maxQuantity, :maxQuantity)) OR ' +
      '(config.minQuantity BETWEEN :minQuantity AND COALESCE(:maxQuantity, config.minQuantity))',
      { minQuantity, maxQuantity: maxQuantity || 999999 }
    );

    const overlapping = await query.getOne();
    return overlapping !== null;
  }
}
