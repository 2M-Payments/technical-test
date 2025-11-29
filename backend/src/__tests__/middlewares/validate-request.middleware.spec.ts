import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validateRequest } from "@/middlewares/validate-request.middleware";

describe("validateRequest middleware", () => {
  const schema = z.object({
    name: z.string().min(3),
  });

  const querySchema = z.object({
    page: z.coerce.number().int().min(1),
  });

  const mockRequest = (overrides: Partial<Request> = {}): Request => ({
    body: {},
    params: {},
    query: {},
    headers: {},
    ...overrides,
  } as Request);

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("deve chamar next quando dados válidos", () => {
    const req = mockRequest({ body: { name: "John" } });
    const res = mockResponse();
    const next = jest.fn() as NextFunction;

    validateRequest(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.validated?.body).toEqual({ name: "John" });
  });

  it("deve retornar 400 quando dados inválidos", () => {
    const req = mockRequest({ body: { name: "Jo" } });
    const res = mockResponse();
    const next = jest.fn() as NextFunction;

    validateRequest(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("deve validar query quando configurado para isso", () => {
    const req = mockRequest({ query: { page: "2" } });
    const res = mockResponse();
    const next = jest.fn() as NextFunction;

    validateRequest(querySchema, "query")(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.validated?.query).toEqual({ page: 2 });
  });
});

