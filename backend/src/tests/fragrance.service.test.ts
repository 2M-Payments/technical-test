import { FragranceRepository } from "../repositories/fragrance.repository";
import { FragranceService } from "../services/fragrance.service";


describe('FragranceService', () => {
  let fragranceService: FragranceService;
  let fragranceRepository: jest.Mocked<FragranceRepository>;

  beforeEach(() => {
    fragranceRepository = {
      findByName: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findActive: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      toggleActive: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    } as any;

    fragranceService = new FragranceService(fragranceRepository);
  });

  describe('createFragrance', () => {
    it('deve criar fragrância com sucesso', async () => {
      const fragranceData = {
        name: 'Lavanda',
        description: 'Fragrância de lavanda',
        active: true,
      };

      const mockFragrance = { id: '1', ...fragranceData, active: true };

      fragranceRepository.findByName.mockResolvedValue(null);
      fragranceRepository.create.mockResolvedValue(mockFragrance as any);

      const result = await fragranceService.createFragrance(fragranceData);

      expect(fragranceRepository.findByName).toHaveBeenCalledWith('Lavanda');
      expect(fragranceRepository.create).toHaveBeenCalledWith(fragranceData);
      expect(result).toEqual(mockFragrance);
    });

    it('deve lançar erro se nome já existir', async () => {
      fragranceRepository.findByName.mockResolvedValue({ id: '1' } as any);

      await expect(
        fragranceService.createFragrance({ name: 'Lavanda' })
      ).rejects.toThrow('Já existe uma fragrância com este nome');
    });
  });

  describe('getFragranceById', () => {
    it('deve retornar fragrância por id', async () => {
      const mockFragrance = { id: '1', name: 'Lavanda', active: true };
      fragranceRepository.findById.mockResolvedValue(mockFragrance as any);

      const result = await fragranceService.getFragranceById('1');

      expect(result).toEqual(mockFragrance);
    });

    it('deve lançar erro se não encontrar', async () => {
      fragranceRepository.findById.mockResolvedValue(null);

      await expect(fragranceService.getFragranceById('999')).rejects.toThrow(
        'Fragrância não encontrada'
      );
    });
  });

  describe('toggleActive', () => {
    it('deve alternar status ativo', async () => {
      const mockFragrance = { id: '1', name: 'Lavanda', active: true };
      const updatedFragrance = { ...mockFragrance, active: false };

      fragranceRepository.findById.mockResolvedValue(mockFragrance as any);
      fragranceRepository.toggleActive.mockResolvedValue(updatedFragrance as any);

      const result = await fragranceService.toggleActive('1');

      expect(result.active).toBe(false);
    });
  });
});