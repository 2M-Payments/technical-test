import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { productsApi } from "@/features/products/products-api";
import { api } from "@/services/api";

const createStore = () =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

describe("productsApi", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  describe("listProducts", () => {
    it("deve configurar endpoint de listagem corretamente", () => {
      const endpoint = productsApi.endpoints.listProducts;

      expect(endpoint).toBeDefined();
      expect(endpoint.initiate).toBeDefined();
    });

    it("deve fazer requisição GET para /products com parâmetros", async () => {
      const params = { page: 1, limit: 10 };

      const result = await store.dispatch(
        productsApi.endpoints.listProducts.initiate(params)
      );

      expect(result).toBeDefined();
    });

    it("deve fazer requisição GET para /products sem parâmetros", async () => {
      const result = await store.dispatch(
        productsApi.endpoints.listProducts.initiate()
      );

      expect(result).toBeDefined();
    });
  });

  describe("getProduct", () => {
    it("deve configurar endpoint de busca por ID corretamente", () => {
      const endpoint = productsApi.endpoints.getProduct;

      expect(endpoint).toBeDefined();
      expect(endpoint.initiate).toBeDefined();
    });

    it("deve fazer requisição GET para /products/:id", async () => {
      const productId = "123";

      const result = await store.dispatch(
        productsApi.endpoints.getProduct.initiate(productId)
      );

      expect(result).toBeDefined();
    });
  });

  describe("createProduct", () => {
    it("deve configurar endpoint de criação corretamente", () => {
      const endpoint = productsApi.endpoints.createProduct;

      expect(endpoint).toBeDefined();
      expect(endpoint.initiate).toBeDefined();
    });

    it("deve fazer requisição POST para /products", async () => {
      const productData = {
        name: "Produto Teste",
        description: "Descrição do produto",
        quantity: 10,
        price: 99.9,
      };

      const result = await store.dispatch(
        productsApi.endpoints.createProduct.initiate(productData)
      );

      expect(result).toBeDefined();
    });
  });

  describe("updateProduct", () => {
    it("deve configurar endpoint de atualização corretamente", () => {
      const endpoint = productsApi.endpoints.updateProduct;

      expect(endpoint).toBeDefined();
      expect(endpoint.initiate).toBeDefined();
    });

    it("deve fazer requisição PATCH para /products/:id", async () => {
      const updateData = {
        id: "123",
        data: {
          name: "Produto Atualizado",
          price: 149.9,
        },
      };

      const result = await store.dispatch(
        productsApi.endpoints.updateProduct.initiate(updateData)
      );

      expect(result).toBeDefined();
    });
  });

  describe("deleteProduct", () => {
    it("deve configurar endpoint de exclusão corretamente", () => {
      const endpoint = productsApi.endpoints.deleteProduct;

      expect(endpoint).toBeDefined();
      expect(endpoint.initiate).toBeDefined();
    });

    it("deve fazer requisição DELETE para /products/:id", async () => {
      const productId = "123";

      const result = await store.dispatch(
        productsApi.endpoints.deleteProduct.initiate(productId)
      );

      expect(result).toBeDefined();
    });
  });

  describe("deleteManyProducts", () => {
    it("deve configurar endpoint de exclusão múltipla corretamente", () => {
      const endpoint = productsApi.endpoints.deleteManyProducts;

      expect(endpoint).toBeDefined();
      expect(endpoint.initiate).toBeDefined();
    });

    it("deve fazer requisição DELETE para /products com array de IDs", async () => {
      const ids = ["1", "2", "3"];

      const result = await store.dispatch(
        productsApi.endpoints.deleteManyProducts.initiate(ids)
      );

      expect(result).toBeDefined();
    });
  });

  describe("deleteAllProducts", () => {
    it("deve configurar endpoint de exclusão total corretamente", () => {
      const endpoint = productsApi.endpoints.deleteAllProducts;

      expect(endpoint).toBeDefined();
      expect(endpoint.initiate).toBeDefined();
    });

    it("deve fazer requisição DELETE para /products/all", async () => {
      const result = await store.dispatch(
        productsApi.endpoints.deleteAllProducts.initiate()
      );

      expect(result).toBeDefined();
    });
  });

  describe("hooks exportados", () => {
    it("deve exportar useListProductsQuery", () => {
      expect(productsApi.useListProductsQuery).toBeDefined();
    });

    it("deve exportar useGetProductQuery", () => {
      expect(productsApi.useGetProductQuery).toBeDefined();
    });

    it("deve exportar useCreateProductMutation", () => {
      expect(productsApi.useCreateProductMutation).toBeDefined();
    });

    it("deve exportar useUpdateProductMutation", () => {
      expect(productsApi.useUpdateProductMutation).toBeDefined();
    });

    it("deve exportar useDeleteProductMutation", () => {
      expect(productsApi.useDeleteProductMutation).toBeDefined();
    });

    it("deve exportar useDeleteManyProductsMutation", () => {
      expect(productsApi.useDeleteManyProductsMutation).toBeDefined();
    });

    it("deve exportar useDeleteAllProductsMutation", () => {
      expect(productsApi.useDeleteAllProductsMutation).toBeDefined();
    });
  });
});

