import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useAuth } from "@/hooks/use-auth";
import authReducer from "@/features/auth/auth-slice";
import { api } from "@/services/api";
import type { ReactNode } from "react";

const mockUser = {
  id: "123",
  name: "Daniel Felizardo",
  email: "daniel@email.com",
};

const createWrapper = (user: typeof mockUser | null) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    preloadedState: {
      auth: { user },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
};

describe("useAuth", () => {
  it("deve retornar usuário quando autenticado", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(mockUser),
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("deve retornar usuário nulo quando não autenticado", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(null),
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("deve fornecer função de logout", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(mockUser),
    });

    expect(typeof result.current.logout).toBe("function");
  });
});
