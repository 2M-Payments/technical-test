import { Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import { AppDataSource } from '../config/datasource';

export interface IUserRepository {
  create(data: Partial<User>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(skip: number, take: number): Promise<[User[], number]>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  deleteMany(ids: string[]): Promise<number>;
}

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return await this.repository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async findAll(skip: number, take: number): Promise<[User[], number]> {
    return await this.repository.findAndCount({
      skip,
      take,
      order: { createdAt: 'DESC' },
      select: ['id', 'email', 'name', 'company', 'createdAt', 'updatedAt']
    });
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
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

}
