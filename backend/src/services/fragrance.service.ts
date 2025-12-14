import { Fragrance } from '../entities/Fragrance.entity';
import { FragranceRepository, IFragranceRepository } from '../repositories/fragrance.repository';
import { CreateFragranceSchema, UpdateFragranceSchema } from '../validation/fragrance.validation';

export interface IFragranceService {
  createFragrance(data: unknown): Promise<Fragrance>;
  getFragranceById(id: string): Promise<Fragrance>;
  getAllFragrances(
    page?: number,
    limit?: number,
    activeOnly?: boolean
  ): Promise<{
    data: Fragrance[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  getActiveFragrances(): Promise<Fragrance[]>;
  updateFragrance(id: string, data: unknown): Promise<Fragrance>;
  toggleActive(id: string): Promise<Fragrance>;
  deleteFragrance(id: string): Promise<void>;
  deleteMany(ids: string[]): Promise<number>;
  createMany(dataArray: unknown[]): Promise<Fragrance[]>;
}

export class FragranceService implements IFragranceService {
  constructor(private readonly fragranceRepository: IFragranceRepository) { }

  async createFragrance(data: unknown): Promise<Fragrance> {
    const validated = CreateFragranceSchema.parse(data);

    const existing = await this.fragranceRepository.findByName(validated.name);
    if (existing) {
      throw new Error('Já existe uma fragrância com este nome');
    }

    const fragrance = await this.fragranceRepository.create(validated);
    return fragrance;
  }

  async getFragranceById(id: string): Promise<Fragrance> {
    const fragrance = await this.fragranceRepository.findById(id);

    if (!fragrance) {
      throw new Error('Fragrância não encontrada');
    }

    return fragrance;
  }

  async getAllFragrances(
    page: number = 1,
    limit: number = 10,
    activeOnly: boolean = false
  ): Promise<{
    data: Fragrance[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [fragrances, total] = await this.fragranceRepository.findAll(
      skip,
      limit,
      activeOnly
    );

    return {
      data: fragrances,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getActiveFragrances(): Promise<Fragrance[]> {
    return await this.fragranceRepository.findActive();
  }

  async updateFragrance(id: string, data: unknown): Promise<Fragrance> {
    const validated = UpdateFragranceSchema.parse(data);

    await this.getFragranceById(id);

    if (validated.name) {
      const existing = await this.fragranceRepository.findByName(validated.name);
      if (existing && existing.id !== id) {
        throw new Error('Já existe uma fragrância com este nome');
      }
    }

    const updated = await this.fragranceRepository.update(id, validated);

    if (!updated) {
      throw new Error('Falha ao atualizar fragrância');
    }

    return updated;
  }

  async toggleActive(id: string): Promise<Fragrance> {
    await this.getFragranceById(id);

    const updated = await this.fragranceRepository.toggleActive(id);

    if (!updated) {
      throw new Error('Falha ao alterar status da fragrância');
    }

    return updated;
  }

  async deleteFragrance(id: string): Promise<void> {
    await this.getFragranceById(id);

    const deleted = await this.fragranceRepository.delete(id);

    if (!deleted) {
      throw new Error('Falha ao deletar fragrância');
    }
  }

  async deleteMany(ids: string[]): Promise<number> {
    return await this.fragranceRepository.deleteMany(ids);
  }

  async createMany(dataArray: unknown[]): Promise<Fragrance[]> {
    const fragrances: Fragrance[] = [];

    for (const data of dataArray) {
      const fragrance = await this.createFragrance(data);
      fragrances.push(fragrance);
    }

    return fragrances;
  }
}
