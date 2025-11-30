import { describe, it, expect } from "vitest";
import { productSchema } from "@/schemas/product.schema";

describe("productSchema", () => {
  it("deve validar dados corretos", () => {
    const data = {
      name: "Produto Teste",
      description: "Descrição do produto",
      quantity: 10,
      price: 99.9,
      category: "Eletrônicos",
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("deve rejeitar nome curto", () => {
    const data = {
      name: "AB",
      description: "Descrição do produto",
      quantity: 10,
      price: 99.9,
      category: "Eletrônicos",
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("deve rejeitar descrição curta", () => {
    const data = {
      name: "Produto Teste",
      description: "Desc",
      quantity: 10,
      price: 99.9,
      category: "Eletrônicos",
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("deve rejeitar quantidade negativa", () => {
    const data = {
      name: "Produto Teste",
      description: "Descrição do produto",
      quantity: -1,
      price: 99.9,
      category: "Eletrônicos",
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("deve rejeitar preço negativo", () => {
    const data = {
      name: "Produto Teste",
      description: "Descrição do produto",
      quantity: 10,
      price: -10,
      category: "Eletrônicos",
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("deve rejeitar categoria curta", () => {
    const data = {
      name: "Produto Teste",
      description: "Descrição do produto",
      quantity: 10,
      price: 99.9,
      category: "A",
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("deve aceitar quantidade zero", () => {
    const data = {
      name: "Produto Teste",
      description: "Descrição do produto",
      quantity: 0,
      price: 99.9,
      category: "Eletrônicos",
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("deve aceitar preço zero", () => {
    const data = {
      name: "Produto Teste",
      description: "Descrição do produto",
      quantity: 10,
      price: 0,
      category: "Eletrônicos",
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

