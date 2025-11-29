import { generateAccessToken, verifyAccessToken } from "@/utils/jwt.util";

describe("jwt.util", () => {
  it("deve gerar um token válido", () => {
    const token = generateAccessToken("user-123");

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });

  it("deve verificar e retornar payload do token", () => {
    const token = generateAccessToken("user-123");
    const payload = verifyAccessToken(token);

    expect(payload.sub).toBe("user-123");
  });

  it("deve lançar erro para token inválido", () => {
    expect(() => verifyAccessToken("token-invalido")).toThrow();
  });
});

