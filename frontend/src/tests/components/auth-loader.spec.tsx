import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { AuthLoader } from "@/components/shared/auth-loader";
import authReducer from "@/features/auth/auth-slice";
import { api } from "@/services/api";

const mockUser = {
  id: "123",
  name: "Daniel Felizardo",
  email: "daniel@email.com",
};

const createStore = (user: typeof mockUser | null) =>
  configureStore({
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

describe("AuthLoader", () => {
  it("deve renderizar filhos quando usuário existe", () => {
    const store = createStore(mockUser);

    render(
      <Provider store={store}>
        <AuthLoader>
          <div>Conteúdo</div>
        </AuthLoader>
      </Provider>
    );

    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });

  it("deve renderizar filhos quando não está carregando e sem usuário", async () => {
    const store = createStore(null);

    render(
      <Provider store={store}>
        <AuthLoader>
          <div>Conteúdo</div>
        </AuthLoader>
      </Provider>
    );

    const content = await screen.findByText("Conteúdo");
    expect(content).toBeInTheDocument();
  });
});
