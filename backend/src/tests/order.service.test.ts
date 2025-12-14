import { uuid } from "zod";
import { OrderStatus } from "../entities/Order.entity";
import { FragranceRepository } from "../repositories/fragrance.repository";
import { OrderRepository } from "../repositories/order.repository";
import { OrderItemRepository } from "../repositories/orderItem.repository";
import { PricingConfigRepository } from "../repositories/pricingConfig.repository";
import { OrderService } from "../services/order.service";
import { randomUUID } from "crypto";

const F1 = randomUUID();
const F2 = randomUUID();
const F3 = randomUUID();



describe('OrderService', () => {
  let service: OrderService;
  let orderRepo: jest.Mocked<OrderRepository>;
  let orderItemRepo: jest.Mocked<OrderItemRepository>;
  let fragranceRepo: jest.Mocked<FragranceRepository>;
  let pricingRepo: jest.Mocked<PricingConfigRepository>;

  beforeEach(() => {
    orderRepo = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      getStats: jest.fn(),
    } as any;

    orderItemRepo = {
      create: jest.fn(),
    } as any;

    fragranceRepo = {
      findById: jest.fn(),
    } as any;

    pricingRepo = {
      findByQuantity: jest.fn(),
    } as any;

    service = new OrderService(orderRepo, orderItemRepo, fragranceRepo, pricingRepo);
  });

  describe('createOrder', () => {
    it('deve criar pedido válido', async () => {
      const orderData = {
        items: [
          { fragranceId: F1, quantity: 200 },
          { fragranceId: F2, quantity: 300 },
        ],
      };

      const mockFragrance1 = { id: F1, name: 'Lavanda', active: true };
      const mockFragrance2 = { id: F2, name: 'Rosa', active: true };

      const mockPricing = {
        unitPrice: 10,
        discountPercentage: 10,
      };

      const mockOrder = {
        id: 'order1',
        userId: 'user1',
        totalQuantity: 500,
        total: 4500,
        status: OrderStatus.PENDING,
      };

      fragranceRepo.findById
        .mockResolvedValueOnce(mockFragrance1 as any)
        .mockResolvedValueOnce(mockFragrance2 as any);
      pricingRepo.findByQuantity.mockResolvedValue(mockPricing as any);
      orderRepo.create.mockResolvedValue(mockOrder as any);
      orderRepo.findById.mockResolvedValue(mockOrder as any);

      const result = await service.createOrder('user1', orderData);

      expect(result.totalQuantity).toBe(500);
      expect(orderItemRepo.create).toHaveBeenCalledTimes(2);
    });

    it('deve lançar erro se quantidade não for múltiplo de 100', async () => {
      const orderData = {
        items: [{ fragranceId: F1, quantity: 150 }],
      };

      const mockFragrance = { id: F1, name: 'Lavanda', active: true };
      fragranceRepo.findById.mockResolvedValue(mockFragrance as any);

      await expect(service.createOrder('user1', orderData)).rejects.toThrow(
        'deve ser múltiplo de 100'
      );
    });

    it('deve lançar erro se fragrância estiver inativa', async () => {
      const orderData = {
        items: [{ fragranceId: F1, quantity: 100 }],
      };

      const mockFragrance = { id: F1, name: 'Lavanda', active: false };
      const mockPricing = { unitPrice: 10, discountPercentage: 0 };

      fragranceRepo.findById.mockResolvedValue(mockFragrance as any);
      pricingRepo.findByQuantity.mockResolvedValue(mockPricing as any);

      await expect(service.createOrder('user1', orderData)).rejects.toThrow(
        'Fragrância inativa'
      );
    });

    it('deve lançar erro se quantidade mínima não for atingida', async () => {
      const orderData = {
        items: [{ fragranceId: F1, quantity: 50 }],
      };

      await expect(service.createOrder('user1', orderData)).rejects.toThrow(
        'Quantidade mínima é 100 unidades'
      );
    });

    
  });

  describe('updateOrder', () => {
    it('deve lançar erro ao tentar atualizar pedido cancelado', async () => {
      const mockOrder = {
        id: '1',
        userId: 'user1',
        status: OrderStatus.CANCELLED,
      };

      orderRepo.findById.mockResolvedValue(mockOrder as any);

      await expect(
        service.updateOrder('1', { notes: 'test' }, 'user1')
      ).rejects.toThrow('Não é possível atualizar pedido cancelado ou completado');
    });
  });

  describe('deleteOrder', () => {
    it('deve lançar erro ao tentar deletar pedido em produção', async () => {
      const mockOrder = {
        id: '1',
        userId: 'user1',
        status: OrderStatus.IN_PRODUCTION,
      };

      orderRepo.findById.mockResolvedValue(mockOrder as any);

      await expect(service.deleteOrder('1', 'user1')).rejects.toThrow(
        'Não é possível deletar pedido em produção ou completado'
      );
    });
  });

  describe('calculatePrice', () => {
    it('deve calcular preço sem criar pedido', async () => {
      const orderData = {
        items: [{ fragranceId: F1, quantity: 200 }],
      };

      const mockFragrance = { id: F1, name: 'Lavanda', active: true };
      const mockPricing = { unitPrice: 10, discountPercentage: 10 };

      fragranceRepo.findById.mockResolvedValue(mockFragrance as any);
      pricingRepo.findByQuantity.mockResolvedValue(mockPricing as any);

      const result = await service.calculatePrice(orderData);

      expect(result.subtotal).toBe(2000);
      expect(result.total).toBe(1800);
      expect(orderRepo.create).not.toHaveBeenCalled();
    });
  });
});