import { inject, injectable } from "tsyringe";
import { ProductRepository } from "@/repositories/product.repository";
import { AppError } from "@/errors/app-error";
import {
  CreateProductPayload,
  DeleteManyProductsInput,
  ListProductsQueryInput,
  UpdateProductInput,
} from "@/schemas/product.schema";
import { buildPaginatedResponse } from "@/utils/pagination.util";

@injectable()
export class ProductService {
  constructor(
    @inject("ProductRepository")
    private readonly productRepository: ProductRepository,
  ) {}

  create(data: CreateProductPayload, userId: string) {
    if (Array.isArray(data)) {
      const payload = data.map((product) => ({ ...product, userId }));
      return this.productRepository.createMany(payload);
    }

    return this.productRepository.create({ ...data, userId });
  }

  async list(query: ListProductsQueryInput, userId: string) {
    const { products, total } = await this.productRepository.findAll({
      ...query,
      userId,
    });

    return buildPaginatedResponse(products, total, query);
  }

  async findById(id: string, userId: string) {
    const product = await this.productRepository.findById(id, userId);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    return product;
  }

  async update(id: string, data: UpdateProductInput, userId: string) {
    const product = await this.productRepository.findById(id, userId);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    Object.assign(product, data);
    return this.productRepository.save(product);
  }

  async delete(id: string, userId: string) {
    const product = await this.productRepository.findById(id, userId);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    await this.productRepository.delete(id, userId);
  }

  async deleteMany(data: DeleteManyProductsInput, userId: string) {
    const deleted = await this.productRepository.deleteMany(data.ids, userId);

    if (deleted === 0) {
      throw new AppError("Nenhum produto encontrado", 404);
    }

    return { deleted };
  }

  async deleteAll(userId: string) {
    const deleted = await this.productRepository.deleteAll(userId);
    return { deleted };
  }
}

