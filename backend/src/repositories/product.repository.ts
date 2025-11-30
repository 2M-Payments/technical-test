import { Repository, In } from "typeorm";
import { AppDataSource } from "@/config/ormconfig";
import { Product } from "@/entities/product.entity";
import { CreateProductInput, ListProductsQueryInput } from "@/schemas/product.schema";

type CreateProductDTO = CreateProductInput & { userId: string };
type FindAllParams = ListProductsQueryInput & { userId: string };

export class ProductRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Product);
  }

  async create(data: CreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create(data);
    return this.ormRepository.save(product);
  }

  async createMany(data: CreateProductDTO[]): Promise<Product[]> {
    const products = this.ormRepository.create(data);
    return this.ormRepository.save(products);
  }

  async findAll({ page, limit, userId }: FindAllParams): Promise<{ products: Product[]; total: number }> {
    const [products, total] = await this.ormRepository.findAndCount({
      where: { userId },
      select: ["id", "name", "quantity", "price", "category", "userId", "createdAt", "updatedAt"],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    });

    return { products, total };
  }

  async findById(id: string, userId: string): Promise<Product | null> {
    return this.ormRepository.findOne({ where: { id, userId } });
  }

  async save(product: Product): Promise<Product> {
    return this.ormRepository.save(product);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.ormRepository.delete({ id, userId });
  }

  async deleteMany(ids: string[], userId: string): Promise<number> {
    const result = await this.ormRepository.delete({ id: In(ids), userId });
    return result.affected ?? 0;
  }

  async deleteAll(userId: string): Promise<number> {
    const result = await this.ormRepository.delete({ userId });
    return result.affected ?? 0;
  }
}

