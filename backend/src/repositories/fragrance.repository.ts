import { Repository } from 'typeorm';
import { Fragrance } from '../entities/Fragrance.entity';
import { AppDataSource } from '../config/datasource';

export interface IFragranceRepository {
  create(data: Partial<Fragrance>): Promise<Fragrance>;
  findById(id: string): Promise<Fragrance | null>;
  findByName(name: string): Promise<Fragrance | null>;
  findAll(skip: number, take: number, activeOnly?: boolean): Promise<[Fragrance[], number]>;
  findActive(): Promise<Fragrance[]>;
  update(id: string, data: Partial<Fragrance>): Promise<Fragrance | null>;
  delete(id: string): Promise<boolean>;
  deleteMany(ids: string[]): Promise<number>;
  toggleActive(id: string): Promise<Fragrance | null>;
}

export class FragranceRepository implements IFragranceRepository {
  private repository: Repository<Fragrance>;

  constructor() {
    this.repository = AppDataSource.getRepository(Fragrance);
  }

  async create(data: Partial<Fragrance>): Promise<Fragrance> {
    const fragrance = this.repository.create(data);
    return await this.repository.save(fragrance);
  }

  async findById(id: string): Promise<Fragrance | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Fragrance | null> {
    return await this.repository.findOne({ where: { name } });
  }

  async findAll(skip: number, take: number, activeOnly: boolean = false): Promise<[Fragrance[], number]> {
    const where: any = {};

    if (activeOnly) {
      where.active = true;
    }

    return await this.repository.findAndCount({
      where,
      skip,
      take,
      order: { name: 'ASC' }
    });
  }

  async findActive(): Promise<Fragrance[]> {
    return await this.repository.find({
      where: { active: true },
      order: { name: 'ASC' }
    });
  }

  async update(id: string, data: Partial<Fragrance>): Promise<Fragrance | null> {
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

  async toggleActive(id: string): Promise<Fragrance | null> {
    const fragrance = await this.findById(id);
    if (!fragrance) return null;

    return await this.update(id, { active: !fragrance.active });
  }
}
