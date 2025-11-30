import { describe, it, expect } from "vitest";
import { productSchema } from "@/schemas/product.schema";

describe("productSchema", () => {
  it("deve validar dados corretos com um produto", () => {
    const data = {
      products: [
        {
          name: "Produto Teste",
          description: "Descrição do produto",
          quantity: 10,
          price: 99.9,
          category: "Eletrônicos",
        },
      ],
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("deve validar dados corretos com múltiplos produtos", () => {
    const data = {
      products: [
        {
          name: "Produto 1",
          description: "Descrição do produto 1",
          quantity: 10,
          price: 99.9,
          category: "Eletrônicos",
        },
        {
          name: "Produto 2",
          description: "Descrição do produto 2",
          quantity: 5,
          price: 49.9,
          category: "Roupas",
        },
      ],
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("deve rejeitar array vazio", () => {
    const data = {
      products: [],
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("deve rejeitar nome curto", () => {
    const data = {
      products: [
        {
          name: "AB",
          description: "Descrição do produto",
          quantity: 10,
          price: 99.9,
          category: "Eletrônicos",
        },
      ],
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("deve rejeitar descrição curta", () => {
    const data = {
      products: [
        {
          name: "Produto Teste",
          description: "Desc",
          quantity: 10,
          price: 99.9,
          category: "Eletrônicos",
        },
      ],
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("deve rejeitar quantidade negativa", () => {
    const data = {
      products: [
        {
          name: "Produto Teste",
          description: "Descrição do produto",
          quantity: -1,
          price: 99.9,
          category: "Eletrônicos",
        },
      ],
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("deve rejeitar preço negativo", () => {
    const data = {
      products: [
        {
          name: "Produto Teste",
          description: "Descrição do produto",
          quantity: 10,
          price: -10,
          category: "Eletrônicos",
        },
      ],
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("deve rejeitar categoria curta", () => {
    const data = {
      products: [
        {
          name: "Produto Teste",
          description: "Descrição do produto",
          quantity: 10,
          price: 99.9,
          category: "A",
        },
      ],
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("deve aceitar quantidade zero", () => {
    const data = {
      products: [
        {
          name: "Produto Teste",
          description: "Descrição do produto",
          quantity: 0,
          price: 99.9,
          category: "Eletrônicos",
        },
      ],
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("deve aceitar preço zero", () => {
    const data = {
      products: [
        {
          name: "Produto Teste",
          description: "Descrição do produto",
          quantity: 10,
          price: 0,
          category: "Eletrônicos",
        },
      ],
    };

    const result = productSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
