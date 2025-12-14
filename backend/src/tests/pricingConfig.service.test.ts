import { PricingConfigRepository } from "../repositories/pricingConfig.repository";
import { PricingConfigService } from "../services/pricingConfig.service";


describe('PricingConfigService', () => {
  let service: PricingConfigService;
  let repository: jest.Mocked<PricingConfigRepository>;

  beforeEach(() => {
    repository = {
      checkOverlap: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findActive: jest.fn(),
      findByQuantity: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      toggleActive: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    } as any;

    service = new PricingConfigService(repository);
  });

  describe('createPricingConfig', () => {
    it('deve criar configuração válida', async () => {
      const configData = {
        minQuantity: 100,
        maxQuantity: 500,
        unitPrice: 10.5,
        discountPercentage: 5,
      };

      const mockConfig = { id: '1', ...configData, active: true };

      repository.checkOverlap.mockResolvedValue(false);
      repository.create.mockResolvedValue(mockConfig as any);

      const result = await service.createPricingConfig(configData);

      expect(repository.checkOverlap).toHaveBeenCalledWith(100, 500);
      expect(result).toEqual(mockConfig);
    });

    it('deve lançar erro se houver sobreposição', async () => {
      repository.checkOverlap.mockResolvedValue(true);

      await expect(
        service.createPricingConfig({
          minQuantity: 100,
          maxQuantity: 500,
          unitPrice: 10,
          discountPercentage: 5,
        })
      ).rejects.toThrow('Faixa de quantidade sobrepõe uma configuração existente');
    });

    it('deve lançar erro se minQuantity >= maxQuantity', async () => {
      repository.checkOverlap.mockResolvedValue(false);

      await expect(
        service.createPricingConfig({
          minQuantity: 500,
          maxQuantity: 100,
          unitPrice: 10,
          discountPercentage: 5,
        })
      ).rejects.toThrow('Quantidade mínima deve ser menor que quantidade máxima');
    });
  });

  describe('calculatePrice', () => {
    it('deve calcular preço corretamente', async () => {
      const mockConfig = {
        id: '1',
        minQuantity: 100,
        maxQuantity: 500,
        unitPrice: 10,
        discountPercentage: 10,
        active: true,
      };

      repository.findByQuantity.mockResolvedValue(mockConfig as any);

      const result = await service.calculatePrice(200);

      expect(repository.findByQuantity).toHaveBeenCalledWith(200);
      expect(result).toEqual({
        unitPrice: 10,
        subtotal: 2000,
        discountPercentage: 10,
        discountAmount: 200,
        total: 1800,
        finalUnitPrice: 9,
        appliedConfig: {
          minQuantity: 100,
          maxQuantity: 500,
        },
      });
    });

    it('deve lançar erro se não encontrar configuração', async () => {
      repository.findByQuantity.mockResolvedValue(null);

      await expect(service.calculatePrice(50)).rejects.toThrow(
        'Configuração de preço não encontrada para esta quantidade'
      );
    });
  });
});