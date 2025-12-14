
import bcrypt from 'bcrypt';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';

jest.mock('bcrypt');

describe('UserService', () => {
    let userService: UserService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepository = {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
        } as any;

        userService = new UserService(userRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('deve criar usuário com sucesso', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123',
                name: 'Test User',
            };

            const mockUser = {
                id: '1',
                ...userData,
                password: 'hashedPassword',
            };

            userRepository.findByEmail.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            userRepository.create.mockResolvedValue(mockUser as any);

            const result = await userService.createUser(userData);

            expect(userRepository.findByEmail).toHaveBeenCalledWith('test@test.com');
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(userRepository.create).toHaveBeenCalledWith({
                ...userData,
                password: 'hashedPassword',
            });
            expect(result).not.toHaveProperty('password');
            expect(result.email).toBe('test@test.com');
        });

        it('deve lançar erro se email já existir', async () => {
            userRepository.findByEmail.mockResolvedValue({ id: '1' } as any);

            await expect(
                userService.createUser({
                    email: 'test@test.com',
                    password: 'password123',
                    name: 'Test'
                })
            ).rejects.toThrow('Email já cadastrado');
        });

    });

    describe('getUserById', () => {
        it('deve retornar usuário sem senha', async () => {
            const mockUser = {
                id: '1',
                email: 'test@test.com',
                name: 'Test',
                password: 'hashedPassword',
            };

            userRepository.findById.mockResolvedValue(mockUser as any);

            const result = await userService.getUserById('1');

            expect(result).not.toHaveProperty('password');
            expect(result.id).toBe('1');
        });

        it('deve lançar erro se usuário não existir', async () => {
            userRepository.findById.mockResolvedValue(null);

            await expect(userService.getUserById('999')).rejects.toThrow(
                'Usuário não encontrado'
            );
        });
    });

    describe('getAllUsers', () => {
        it('deve retornar usuários paginados', async () => {
            const mockUsers = [
                { id: '1', email: 'user1@test.com', name: 'User 1' },
                { id: '2', email: 'user2@test.com', name: 'User 2' },
            ];

            userRepository.findAll.mockResolvedValue([mockUsers as any, 2]);

            const result = await userService.getAllUsers(1, 10);

            expect(userRepository.findAll).toHaveBeenCalledWith(0, 10);
            expect(result).toEqual({
                data: mockUsers,
                total: 2,
                page: 1,
                totalPages: 1,
            });
        });
    });

    describe('updateUser', () => {
        it('deve atualizar usuário com hash de senha', async () => {
            const mockUser = {
                id: '1',
                email: 'test@test.com',
                name: 'Test',
                password: 'oldHash',
            };

            const updateData = {
                name: 'Updated Name',
                password: 'newPassword',
            };

            userRepository.findById.mockResolvedValue(mockUser as any);
            (bcrypt.hash as jest.Mock).mockResolvedValue('newHash');
            userRepository.update.mockResolvedValue({
                ...mockUser,
                ...updateData,
                password: 'newHash',
            } as any);

            const result = await userService.updateUser('1', updateData);

            expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
            expect(result).not.toHaveProperty('password');
        });
    });

    describe('deleteUser', () => {
        it('deve deletar usuário', async () => {
            userRepository.delete.mockResolvedValue(true);

            await userService.deleteUser('1');

            expect(userRepository.delete).toHaveBeenCalledWith('1');
        });

        it('deve lançar erro se usuário não existir', async () => {
            userRepository.delete.mockResolvedValue(false);

            await expect(userService.deleteUser('999')).rejects.toThrow(
                'Usuário não encontrado'
            );
        });
    });
});
