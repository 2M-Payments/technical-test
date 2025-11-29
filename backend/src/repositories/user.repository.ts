import { Repository } from "typeorm";
import { AppDataSource } from "@/config/ormconfig";
import { User } from "@/entities/user.entity";

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export class UserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(User);
  }

  async create(data: CreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(data);
    return this.ormRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.ormRepository.findOne({
      where: { email },
      withDeleted: false,
      select: ["id", "name", "email", "password", "createdAt", "updatedAt"],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.ormRepository.findOne({ where: { id } });
  }
}


