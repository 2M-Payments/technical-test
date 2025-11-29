import "reflect-metadata";
import { ProductService } from "@/services/product.service";
import { ProductRepository } from "@/repositories/product.repository";
import { AppError } from "@/errors/app-error";
import {
  CreateProductInput,
  DeleteManyProductsInput,
  ListProductsQueryInput,
  UpdateProductInput,
} from "@/schemas/product.schema";
import { Product } from "@/entities/product.entity";
import { User } from "@/entities/user.entity";

const makeRepositoryMock = () => {
  const repository = {
    create: jest.fn(),
    createMany: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    deleteAll: jest.fn(),
  };

  return {
    repository,
    instance: repository as Partial<ProductRepository> as ProductRepository,
  };
};

const USER_ID = "user-123";

const makeProduct = (): Product => ({
  id: "product-id",
  name: "Produto teste",
  description: "Descrição",
  quantity: 10,
  price: 100,
  category: "Tecnologia",
  userId: USER_ID,
  user: { id: USER_ID } as User,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe("ProductService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar um produto", async () => {
    const { repository, instance } = makeRepositoryMock();
    const service = new ProductService(instance);
    const payload: CreateProductInput = {
      name: "Produto teste",
      description: "Descrição",
      quantity: 10,
      price: 100,
      category: "Tecnologia",
    };

    repository.create.mockResolvedValue(makeProduct());

    const result = await service.create(payload, USER_ID);

    expect(repository.create).toHaveBeenCalledWith({ ...payload, userId: USER_ID });
    expect(result).toHaveProperty("id");
  });

  it("deve criar produtos em lote com array no payload", async () => {
    const { repository, instance } = makeRepositoryMock();
    const service = new ProductService(instance);
    const payload = [
      {
        name: "Produto A",
        description: "Desc",
        quantity: 5,
        price: 50,
        category: "Tech",
      },
    ];

    repository.createMany.mockResolvedValue([makeProduct()]);

    const result = await service.create(payload, USER_ID);

    expect(repository.createMany).toHaveBeenCalledWith([
      { ...payload[0], userId: USER_ID },
    ]);
    expect(result).toHaveLength(1);
  });

  it("deve listar produtos com paginação", async () => {
    const { repository, instance } = makeRepositoryMock();
    const service = new ProductService(instance);
    const query: ListProductsQueryInput = { page: 1, limit: 10 };

    repository.findAll.mockResolvedValue({ products: [makeProduct()], total: 1 });

    const result = await service.list(query, USER_ID);

    expect(repository.findAll).toHaveBeenCalledWith({ ...query, userId: USER_ID });
    expect(result.meta.totalPages).toBe(1);
    expect(result.data).toHaveLength(1);
  });

  it("deve buscar produto por id", async () => {
    const { repository, instance } = makeRepositoryMock();
    const service = new ProductService(instance);

    repository.findById.mockResolvedValue(makeProduct());

    const result = await service.findById("product-id", USER_ID);

    expect(repository.findById).toHaveBeenCalledWith("product-id", USER_ID);
    expect(result.id).toBe("product-id");
  });

  it("deve lançar erro ao buscar produto inexistente", async () => {
    const { repository, instance } = makeRepositoryMock();
    const service = new ProductService(instance);

    repository.findById.mockResolvedValue(null);

    await expect(service.findById("missing", USER_ID)).rejects.toBeInstanceOf(AppError);
  });

  it("deve atualizar um produto", async () => {
    const { repository, instance } = makeRepositoryMock();
    const service = new ProductService(instance);
    const existingProduct = makeProduct();
    const payload: UpdateProductInput = { name: "Atualizado" };

    repository.findById.mockResolvedValue(existingProduct);
    repository.save.mockImplementation(async (product: Product) => product);

    const result = await service.update("product-id", payload, USER_ID);

    expect(repository.save).toHaveBeenCalled();
    expect(result.name).toBe("Atualizado");
  });

  it("deve excluir um produto", async () => {
    const { repository, instance } = makeRepositoryMock();
    const service = new ProductService(instance);

    repository.findById.mockResolvedValue(makeProduct());

    await service.delete("product-id", USER_ID);

    expect(repository.delete).toHaveBeenCalledWith("product-id", USER_ID);
  });

  it("deve excluir vários produtos", async () => {
    const { repository, instance } = makeRepositoryMock();
    const service = new ProductService(instance);
    const payload: DeleteManyProductsInput = { ids: ["a", "b"] };

    repository.deleteMany.mockResolvedValue(2);

    const result = await service.deleteMany(payload, USER_ID);

    expect(repository.deleteMany).toHaveBeenCalledWith(payload.ids, USER_ID);
    expect(result.deleted).toBe(2);
  });

  it("deve lançar erro ao excluir produtos inexistentes em lote", async () => {
    const { repository, instance } = makeRepositoryMock();
    const service = new ProductService(instance);
    const payload: DeleteManyProductsInput = { ids: ["a"] };

    repository.deleteMany.mockResolvedValue(0);

    await expect(service.deleteMany(payload, USER_ID)).rejects.toBeInstanceOf(AppError);
  });

  it("deve excluir todos os produtos", async () => {
    const { repository, instance } = makeRepositoryMock();
    const service = new ProductService(instance);

    repository.deleteAll.mockResolvedValue(5);

    const result = await service.deleteAll(USER_ID);

    expect(repository.deleteAll).toHaveBeenCalledWith(USER_ID);
    expect(result.deleted).toBe(5);
  });
});

