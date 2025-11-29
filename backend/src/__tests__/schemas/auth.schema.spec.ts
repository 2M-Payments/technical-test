import { registerUserSchema, loginSchema } from "@/schemas/auth.schema";

describe("auth.schema", () => {
  describe("registerUserSchema", () => {
    it("deve validar dados corretos", () => {
      const result = registerUserSchema.safeParse({
        name: "Daniel Felizardo",
        email: "daniel@email.com",
        password: "12345678",
      });

      expect(result.success).toBe(true);
    });

    it("deve rejeitar nome curto", () => {
      const result = registerUserSchema.safeParse({
        name: "Lu",
        email: "lucas@email.com",
        password: "12345678",
      });

      expect(result.success).toBe(false);
    });

    it("deve rejeitar email inválido", () => {
      const result = registerUserSchema.safeParse({
        name: "Daniel Felizardo",
        email: "email-invalido",
        password: "12345678",
      });

      expect(result.success).toBe(false);
    });

    it("deve rejeitar senha curta", () => {
      const result = registerUserSchema.safeParse({
        name: "Daniel Felizardo",
        email: "pedro@email.com",
        password: "123",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("deve validar dados corretos", () => {
      const result = loginSchema.safeParse({
        email: "ana@email.com",
        password: "12345678",
      });

      expect(result.success).toBe(true);
    });

    it("deve rejeitar email inválido", () => {
      const result = loginSchema.safeParse({
        email: "invalid",
        password: "12345678",
      });

      expect(result.success).toBe(false);
    });
  });
});

