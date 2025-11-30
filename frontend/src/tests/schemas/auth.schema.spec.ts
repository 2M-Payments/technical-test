import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";

describe("loginSchema", () => {
  it("deve validar dados corretos", () => {
    const data = {
      email: "daniel@email.com",
      password: "12345678",
    };

    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("deve rejeitar e-mail inválido", () => {
    const data = {
      email: "email-invalido",
      password: "12345678",
    };

    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("deve rejeitar senha curta", () => {
    const data = {
      email: "daniel@email.com",
      password: "123",
    };

    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("deve validar dados corretos", () => {
    const data = {
      name: "Daniel Felizardo",
      email: "daniel@email.com",
      password: "12345678",
      confirmPassword: "12345678",
    };

    const result = registerSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("deve rejeitar nome curto", () => {
    const data = {
      name: "Da",
      email: "daniel@email.com",
      password: "12345678",
      confirmPassword: "12345678",
    };

    const result = registerSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("deve rejeitar senhas diferentes", () => {
    const data = {
      name: "Daniel Felizardo",
      email: "daniel@email.com",
      password: "12345678",
      confirmPassword: "87654321",
    };

    const result = registerSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
