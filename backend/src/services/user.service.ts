import { User } from '../entities/User.entity';
import bcrypt from 'bcrypt';
import { CreateUserSchema, UpdateUserSchema } from '../validation/user.validation';
import { UserRepository } from '../repositories/user.repository';

export class UserService {
  constructor(private userRepository: UserRepository) { }

  async createUser(data: unknown): Promise<User> {
    const validated = CreateUserSchema.parse(data);

    const existingUser = await this.userRepository.findByEmail(validated.email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const user = await this.userRepository.create({
      ...validated,
      password: hashedPassword
    });

    // Não retornar senha
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await this.userRepository.findAll(skip, limit);

    return {
      data: users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async updateUser(id: string, data: unknown): Promise<User> {
    const validated = UpdateUserSchema.parse(data);

    await this.getUserById(id);

    if (validated.password) {
      validated.password = await bcrypt.hash(validated.password, 10);
    }

    const updated = await this.userRepository.update(id, validated);
    if (!updated) {
      throw new Error('Falha ao atualizar usuário');
    }

    const { password, ...userWithoutPassword } = updated;
    return userWithoutPassword as User;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new Error('Usuário não encontrado');
    }
  }

  async deleteMany(ids: string[]): Promise<number> {
    return await this.userRepository.deleteMany(ids);
  }

  async createMany(dataArray: unknown[]): Promise<User[]> {
    const users: User[] = [];

    for (const data of dataArray) {
      const user = await this.createUser(data);
      users.push(user);
    }

    return users;
  }
}
