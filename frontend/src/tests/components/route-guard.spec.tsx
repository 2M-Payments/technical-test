import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { RouteGuard } from "@/components/shared/route-guard";
import authReducer from "@/features/auth/auth-slice";

const createMockStore = (user: { id: string; name: string; email: string } | null) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user } },
  });

const mockUser = {
  id: "123",
  name: "Daniel Felizardo",
  email: "daniel@email.com",
};

describe("RouteGuard", () => {
  describe("requireAuth=true", () => {
    it("deve renderizar filhos quando usuário está autenticado", () => {
      const store = createMockStore(mockUser);

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/dashboard"]}>
            <Routes>
              <Route element={<RouteGuard requireAuth={true} redirectTo="/login" />}>
                <Route path="/dashboard" element={<div>Dashboard</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    it("deve redirecionar para login quando usuário não está autenticado", () => {
      const store = createMockStore(null);

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/dashboard"]}>
            <Routes>
              <Route element={<RouteGuard requireAuth={true} redirectTo="/login" />}>
                <Route path="/dashboard" element={<div>Dashboard</div>} />
              </Route>
              <Route path="/login" element={<div>Página de Login</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText("Página de Login")).toBeInTheDocument();
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    });
  });

  describe("requireAuth=false", () => {
    it("deve renderizar filhos quando usuário não está autenticado", () => {
      const store = createMockStore(null);

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/login"]}>
            <Routes>
              <Route element={<RouteGuard requireAuth={false} redirectTo="/dashboard" />}>
                <Route path="/login" element={<div>Página de Login</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText("Página de Login")).toBeInTheDocument();
    });

    it("deve redirecionar para dashboard quando usuário está autenticado", () => {
      const store = createMockStore(mockUser);

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/login"]}>
            <Routes>
              <Route element={<RouteGuard requireAuth={false} redirectTo="/dashboard" />}>
                <Route path="/login" element={<div>Página de Login</div>} />
              </Route>
              <Route path="/dashboard" element={<div>Dashboard</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.queryByText("Página de Login")).not.toBeInTheDocument();
    });
  });
});
