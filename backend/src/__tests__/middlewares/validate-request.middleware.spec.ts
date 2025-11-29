import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validateRequest } from "@/middlewares/validate-request.middleware";

describe("validateRequest middleware", () => {
  const schema = z.object({
    name: z.string().min(3),
  });

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("deve chamar next quando dados válidos", () => {
    const req = { body: { name: "John" } } as Request;
    const res = mockResponse();
    const next = jest.fn() as NextFunction;

    validateRequest(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.body).toEqual({ name: "John" });
  });

  it("deve retornar 400 quando dados inválidos", () => {
    const req = { body: { name: "Jo" } } as Request;
    const res = mockResponse();
    const next = jest.fn() as NextFunction;

    validateRequest(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});

