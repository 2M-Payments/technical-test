import { Request, Response, NextFunction } from "express";
import { authenticate } from "@/middlewares/authenticate.middleware";
import * as jwtUtil from "@/utils/jwt.util";

jest.mock("@/utils/jwt.util");

describe("authenticate middleware", () => {
  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 401 sem cookie token", () => {
    const req = { cookies: {} } as unknown as Request;
    const res = mockResponse();
    const next = jest.fn() as NextFunction;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 com token inválido", () => {
    const req = { cookies: { token: "invalid" } } as unknown as Request;
    const res = mockResponse();
    const next = jest.fn() as NextFunction;

    (jwtUtil.verifyAccessToken as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("deve chamar next com token válido", () => {
    const req = { cookies: { token: "valid-token" } } as unknown as Request;
    const res = mockResponse();
    const next = jest.fn() as NextFunction;

    (jwtUtil.verifyAccessToken as jest.Mock).mockReturnValue({ sub: "user-123" });

    authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe("user-123");
  });
});
