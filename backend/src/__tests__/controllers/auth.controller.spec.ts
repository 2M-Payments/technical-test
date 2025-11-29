import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { AuthController } from "@/controllers/auth.controller";
import { AuthService } from "@/services/auth.service";

jest.mock("@/services/auth.service");

describe("AuthController", () => {
  const controller = new AuthController();

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("deve retornar 201 ao registrar", async () => {
      const validatedBody = { name: "Daniel Felizardo", email: "daniel@email.com", password: "12345678" };
      const req = { validated: { body: validatedBody } } as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      const mockResult = { user: { id: "1", name: "Daniel Felizardo", email: "daniel@email.com" }, token: "token" };
      const mockService = { register: jest.fn().mockResolvedValue(mockResult) };
      jest.spyOn(container, "resolve").mockReturnValue(mockService);

      await controller.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
      expect(mockService.register).toHaveBeenCalledWith(validatedBody);
    });

    it("deve chamar next em caso de erro", async () => {
      const validatedBody = { name: "Daniel", email: "daniel@email.com", password: "12345678" };
      const req = { validated: { body: validatedBody } } as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      const error = new Error("Erro");
      const mockService = { register: jest.fn().mockRejectedValue(error) };
      jest.spyOn(container, "resolve").mockReturnValue(mockService);

      await controller.register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("login", () => {
    it("deve retornar 200 ao logar", async () => {
      const validatedBody = { email: "daniel@email.com", password: "12345678" };
      const req = { validated: { body: validatedBody } } as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      const mockResult = { user: { id: "1", name: "Daniel Felizardo", email: "daniel@email.com" }, token: "token" };
      const mockService = { login: jest.fn().mockResolvedValue(mockResult) };
      jest.spyOn(container, "resolve").mockReturnValue(mockService);

      await controller.login(req, res, next);

      expect(res.json).toHaveBeenCalledWith(mockResult);
      expect(mockService.login).toHaveBeenCalledWith(validatedBody);
    });

    it("deve chamar next em caso de erro", async () => {
      const validatedBody = { email: "daniel@email.com", password: "12345678" };
      const req = { validated: { body: validatedBody } } as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      const error = new Error("Erro");
      const mockService = { login: jest.fn().mockRejectedValue(error) };
      jest.spyOn(container, "resolve").mockReturnValue(mockService);

      await controller.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

