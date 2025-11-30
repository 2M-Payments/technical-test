import {
  createProductSchema,
  deleteManyProductsSchema,
  listProductsQuerySchema,
  updateProductSchema,
} from "@/schemas/product.schema";

describe("product.schema", () => {
  const validProduct = {
    name: "Notebook Gamer",
    description: "Equipamento completo",
    quantity: 5,
    price: 4999.9,
  };

  it("deve validar criação de produto", () => {
    const result = createProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("deve rejeitar produto com nome curto", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      name: "No",
    });
    expect(result.success).toBe(false);
  });

  it("deve validar criação em lote enviando array diretamente", () => {
    const result = createProductSchema.safeParse([validProduct]);
    expect(result.success).toBe(true);
  });

  it("deve exigir ao menos um campo no update", () => {
    const result = updateProductSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("deve validar exclusão em lote", () => {
    const result = deleteManyProductsSchema.safeParse({ ids: ["11111111-1111-4111-8111-111111111111"] });
    expect(result.success).toBe(true);
  });

  it("deve validar query de listagem", () => {
    const result = listProductsQuerySchema.safeParse({ page: "1", limit: "10" });
    expect(result.success).toBe(true);
  });
});

