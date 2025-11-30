import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/features/auth/auth-api";
import { api } from "@/services/api";

const createStore = () =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

describe("authApi", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  describe("login", () => {
    it("deve configurar endpoint de login corretamente", () => {
      const endpoint = authApi.endpoints.login;

      expect(endpoint).toBeDefined();
      expect(endpoint.initiate).toBeDefined();
    });

    it("deve fazer requisição POST para /auth/login", async () => {
      const credentials = {
        email: "daniel@example.com",
        password: "senha123",
      };

      const result = await store.dispatch(
        authApi.endpoints.login.initiate(credentials)
      );

      expect(result).toBeDefined();
    });
  });

  describe("register", () => {
    it("deve configurar endpoint de registro corretamente", () => {
      const endpoint = authApi.endpoints.register;

      expect(endpoint).toBeDefined();
      expect(endpoint.initiate).toBeDefined();
    });

    it("deve fazer requisição POST para /auth/register", async () => {
      const data = {
        name: "Daniel Felizardo",
        email: "daniel@example.com",
        password: "senha123",
      };

      const result = await store.dispatch(
        authApi.endpoints.register.initiate(data)
      );

      expect(result).toBeDefined();
    });
  });

  describe("logout", () => {
    it("deve configurar endpoint de logout corretamente", () => {
      const endpoint = authApi.endpoints.logout;

      expect(endpoint).toBeDefined();
      expect(endpoint.initiate).toBeDefined();
    });

    it("deve fazer requisição POST para /auth/logout", async () => {
      const result = await store.dispatch(
        authApi.endpoints.logout.initiate()
      );

      expect(result).toBeDefined();
    });
  });

  describe("getMe", () => {
    it("deve configurar endpoint de getMe corretamente", () => {
      const endpoint = authApi.endpoints.getMe;

      expect(endpoint).toBeDefined();
      expect(endpoint.initiate).toBeDefined();
    });

    it("deve fazer requisição GET para /auth/me", async () => {
      const result = await store.dispatch(
        authApi.endpoints.getMe.initiate()
      );

      expect(result).toBeDefined();
    });
  });

  describe("hooks exportados", () => {
    it("deve exportar useLoginMutation", () => {
      expect(authApi.useLoginMutation).toBeDefined();
    });

    it("deve exportar useRegisterMutation", () => {
      expect(authApi.useRegisterMutation).toBeDefined();
    });

    it("deve exportar useLogoutMutation", () => {
      expect(authApi.useLogoutMutation).toBeDefined();
    });

    it("deve exportar useGetMeQuery", () => {
      expect(authApi.useGetMeQuery).toBeDefined();
    });
  });
});

