import { PricingConfig } from '../entities/PricingConfig.entity';
import { IPricingConfigRepository, PricingConfigRepository } from '../repositories/pricingConfig.repository';
import { CreatePricingConfigSchema, UpdatePricingConfigSchema } from '../validation/pricingConfig.validation';

type PriceCalculation = {
  unitPrice: number;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  finalUnitPrice: number;
  appliedConfig: {
    minQuantity: number;
    maxQuantity: number | null;
  };
}

export interface IPricingConfigService {
  createPricingConfig(data: unknown): Promise<PricingConfig>;
  getPricingConfigById(id: string): Promise<PricingConfig>;
  getAllPricingConfigs(
    page?: number,
    limit?: number,
    activeOnly?: boolean
  ): Promise<{
    data: PricingConfig[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  getActivePricingConfigs(): Promise<PricingConfig[]>;
  updatePricingConfig(id: string, data: unknown): Promise<PricingConfig>;
  toggleActive(id: string): Promise<PricingConfig>;
  deletePricingConfig(id: string): Promise<void>;
  deleteMany(ids: string[]): Promise<number>;
  calculatePrice(quantity: number): Promise<PriceCalculation>;
  getPricingTable(): Promise<PricingConfig[]>;
}

export class PricingConfigService implements IPricingConfigService {
  constructor(private readonly pricingConfigRepository: IPricingConfigRepository) { }

  async createPricingConfig(data: unknown): Promise<PricingConfig> {
    const validated = CreatePricingConfigSchema.parse(data);

    // Verificar se não há sobreposição de faixas
    const hasOverlap = await this.pricingConfigRepository.checkOverlap(
      validated.minQuantity,
      validated.maxQuantity || null
    );

    if (hasOverlap) {
      throw new Error('Faixa de quantidade sobrepõe uma configuração existente');
    }

    // Validar que minQuantity < maxQuantity (se maxQuantity existir)
    if (validated.maxQuantity && validated.minQuantity >= validated.maxQuantity) {
      throw new Error('Quantidade mínima deve ser menor que quantidade máxima');
    }

    const config = await this.pricingConfigRepository.create(validated);
    return config;
  }

  async getPricingConfigById(id: string): Promise<PricingConfig> {
    const config = await this.pricingConfigRepository.findById(id);

    if (!config) {
      throw new Error('Configuração de preço não encontrada');
    }

    return config;
  }

  async getAllPricingConfigs(
    page: number = 1,
    limit: number = 10,
    activeOnly: boolean = false
  ): Promise<{
    data: PricingConfig[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [configs, total] = await this.pricingConfigRepository.findAll(
      skip,
      limit,
      activeOnly
    );

    return {
      data: configs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getActivePricingConfigs(): Promise<PricingConfig[]> {
    return await this.pricingConfigRepository.findActive();
  }

  async updatePricingConfig(id: string, data: unknown): Promise<PricingConfig> {
    const validated = UpdatePricingConfigSchema.parse(data);

    await this.getPricingConfigById(id);

    // Se está alterando as faixas de quantidade, verificar sobreposição
    if (validated.minQuantity !== undefined || validated.maxQuantity !== undefined) {
      const current = await this.getPricingConfigById(id);

      const newMin = validated.minQuantity ?? current.minQuantity;
      const newMax = validated.maxQuantity !== undefined
        ? validated.maxQuantity
        : current.maxQuantity;

      const hasOverlap = await this.pricingConfigRepository.checkOverlap(
        newMin,
        newMax,
        id
      );

      if (hasOverlap) {
        throw new Error('Faixa de quantidade sobrepõe uma configuração existente');
      }

      // Validar que minQuantity < maxQuantity
      if (newMax && newMin >= newMax) {
        throw new Error('Quantidade mínima deve ser menor que quantidade máxima');
      }
    }

    const updated = await this.pricingConfigRepository.update(id, validated);

    if (!updated) {
      throw new Error('Falha ao atualizar configuração de preço');
    }

    return updated;
  }

  async toggleActive(id: string): Promise<PricingConfig> {
    await this.getPricingConfigById(id);

    const updated = await this.pricingConfigRepository.toggleActive(id);

    if (!updated) {
      throw new Error('Falha ao alterar status da configuração');
    }

    return updated;
  }

  async deletePricingConfig(id: string): Promise<void> {
    await this.getPricingConfigById(id);

    const deleted = await this.pricingConfigRepository.delete(id);

    if (!deleted) {
      throw new Error('Falha ao deletar configuração de preço');
    }
  }

  async deleteMany(ids: string[]): Promise<number> {
    return await this.pricingConfigRepository.deleteMany(ids);
  }

  async calculatePrice(quantity: number): Promise<PriceCalculation> {
    const config = await this.pricingConfigRepository.findByQuantity(quantity);

    if (!config) {
      throw new Error('Configuração de preço não encontrada para esta quantidade');
    }

    const unitPrice = Number(config.unitPrice);
    const subtotal = quantity * unitPrice;
    const discountPercentage = Number(config.discountPercentage);
    const discountAmount = subtotal * (discountPercentage / 100);
    const total = subtotal - discountAmount;
    const finalUnitPrice = total / quantity;

    return {
      unitPrice,
      subtotal,
      discountPercentage,
      discountAmount,
      total,
      finalUnitPrice,
      appliedConfig: {
        minQuantity: config.minQuantity,
        maxQuantity: config.maxQuantity
      }
    };
  }

  async getPricingTable(): Promise<PricingConfig[]> {
    return await this.pricingConfigRepository.findActive();
  }
}
