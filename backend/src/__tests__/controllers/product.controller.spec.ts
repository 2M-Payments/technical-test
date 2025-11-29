import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { ProductController } from "@/controllers/product.controller";
import { ProductService } from "@/services/product.service";

jest.mock("@/services/product.service");

describe("ProductController", () => {
  const controller = new ProductController();

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = () => jest.fn() as NextFunction;

  const mockRequest = (overrides: Partial<Request> = {}): Request => ({
    body: {},
    params: {},
    query: {},
    headers: {},
    ...overrides,
  } as Request);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar um produto", async () => {
    const validatedBody = {
      name: "Produto",
      description: "Desc",
      quantity: 1,
      price: 100,
      category: "Tech",
    };
    const req = mockRequest({
      validated: { body: validatedBody },
      userId: "user-123",
    });
    const res = mockResponse();
    const next = mockNext();

    const mockResult = { id: "1" };
    const mockService = { create: jest.fn().mockResolvedValue(mockResult) };
    jest.spyOn(container, "resolve").mockReturnValue(mockService);

    await controller.create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockResult);
    expect(mockService.create).toHaveBeenCalledWith(validatedBody, "user-123");
  });

  it("deve criar múltiplos produtos enviando um array", async () => {
    const validatedBody = [
      {
        name: "Produto",
        description: "Desc",
        quantity: 1,
        price: 100,
        category: "Tech",
      },
    ];
    const req = mockRequest({
      validated: { body: validatedBody },
      userId: "user-123",
    });
    const res = mockResponse();
    const next = mockNext();

    const mockResult = [{ id: "1" }];
    const mockService = { create: jest.fn().mockResolvedValue(mockResult) };
    jest.spyOn(container, "resolve").mockReturnValue(mockService);

    await controller.create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockResult);
    expect(mockService.create).toHaveBeenCalledWith(validatedBody, "user-123");
  });

  it("deve listar produtos com sucesso", async () => {
    const validated = { query: { page: 1, limit: 10 } };
    const req = mockRequest({ validated, userId: "user-123" });
    const res = mockResponse();
    const next = mockNext();

    const mockResult = { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    const mockService = { list: jest.fn().mockResolvedValue(mockResult) };
    jest.spyOn(container, "resolve").mockReturnValue(mockService);

    await controller.list(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockResult);
    expect(mockService.list).toHaveBeenCalledWith(validated.query, "user-123");
  });

  it("deve atualizar um produto", async () => {
    const validatedBody = { name: "Atualizado" };
    const req = mockRequest({
      params: { id: "1" },
      validated: { body: validatedBody },
      userId: "user-123",
    });
    const res = mockResponse();
    const next = mockNext();

    const mockResult = { id: "1", name: "Atualizado" };
    const mockService = { update: jest.fn().mockResolvedValue(mockResult) };
    jest.spyOn(container, "resolve").mockReturnValue(mockService);

    await controller.update(req, res, next);

    expect(res.json).toHaveBeenCalledWith(mockResult);
    expect(mockService.update).toHaveBeenCalledWith("1", validatedBody, "user-123");
  });

  it("deve remover um produto", async () => {
    const req = mockRequest({ params: { id: "1" }, userId: "user-123" });
    const res = mockResponse();
    const next = mockNext();

    const mockService = { delete: jest.fn().mockResolvedValue(undefined) };
    jest.spyOn(container, "resolve").mockReturnValue(mockService);

    await controller.delete(req, res, next);

    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("deve remover produtos em lote", async () => {
    const validatedBody = { ids: ["1", "2"] };
    const req = mockRequest({ validated: { body: validatedBody }, userId: "user-123" });
    const res = mockResponse();
    const next = mockNext();

    const mockResult = { deleted: 2 };
    const mockService = { deleteMany: jest.fn().mockResolvedValue(mockResult) };
    jest.spyOn(container, "resolve").mockReturnValue(mockService);

    await controller.deleteMany(req, res, next);

    expect(res.json).toHaveBeenCalledWith(mockResult);
    expect(mockService.deleteMany).toHaveBeenCalledWith(validatedBody, "user-123");
  });

  it("deve remover todos os produtos", async () => {
    const req = mockRequest({ userId: "user-123" });
    const res = mockResponse();
    const next = mockNext();

    const mockResult = { deleted: 10 };
    const mockService = { deleteAll: jest.fn().mockResolvedValue(mockResult) };
    jest.spyOn(container, "resolve").mockReturnValue(mockService);

    await controller.deleteAll(req, res, next);

    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it("deve encaminhar erros ao next", async () => {
    const validatedBody = { name: "Atualizado" };
    const req = mockRequest({ params: { id: "1" }, validated: { body: validatedBody }, userId: "user-123" });
    const res = mockResponse();
    const next = mockNext();

    const error = new Error("Erro");
    const mockService = { update: jest.fn().mockRejectedValue(error) };
    jest.spyOn(container, "resolve").mockReturnValue(mockService);

    await controller.update(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

