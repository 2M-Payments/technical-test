import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Dashboard } from "@/pages/private/dashboard";
import authReducer from "@/features/auth/auth-slice";
import { api } from "@/services/api";

const mockListProducts = vi.fn();
const mockDeleteMany = vi.fn();
const mockDeleteAll = vi.fn();

vi.mock("@/features/products/products-api", async () => {
  const actual = await vi.importActual("@/features/products/products-api");
  return {
    ...actual,
    useListProductsQuery: () => mockListProducts(),
    useDeleteManyProductsMutation: () => [mockDeleteMany],
    useDeleteAllProductsMutation: () => [mockDeleteAll],
  };
});

vi.mock("@/contexts/modal-context", () => ({
  useModal: () => ({ openModal: vi.fn() }),
}));

const createStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

const renderDashboard = () => {
  const store = createStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </Provider>
  );
};

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve mostrar loader enquanto carrega", () => {
    mockListProducts.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    renderDashboard();

    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("deve mostrar estado vazio quando não há produtos", () => {
    mockListProducts.mockReturnValue({
      data: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
      isLoading: false,
    });

    renderDashboard();

    expect(screen.getByText("Nenhum produto cadastrado")).toBeInTheDocument();
  });

  it("deve renderizar tabela com produtos", () => {
    mockListProducts.mockReturnValue({
      data: {
        data: [
          {
            id: "1",
            name: "Produto Teste",
            category: "Eletrônicos",
            quantity: 10,
            price: 99.9,
          },
        ],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
      isLoading: false,
    });

    renderDashboard();

    expect(screen.getByText("Produto Teste")).toBeInTheDocument();
    expect(screen.getByText("Eletrônicos")).toBeInTheDocument();
  });

  it("deve renderizar botão de cadastrar produto", () => {
    mockListProducts.mockReturnValue({
      data: {
        data: [
          {
            id: "1",
            name: "Produto Teste",
            category: "Categoria",
            quantity: 10,
            price: 99.9,
          },
        ],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
      isLoading: false,
    });

    renderDashboard();

    expect(screen.getByRole("button", { name: "Cadastrar produto" })).toBeInTheDocument();
  });

  it("deve renderizar checkboxes para seleção de produtos", () => {
    mockListProducts.mockReturnValue({
      data: {
        data: [
          { id: "1", name: "Produto 1", category: "Cat 1", quantity: 5, price: 50 },
          { id: "2", name: "Produto 2", category: "Cat 2", quantity: 10, price: 100 },
        ],
        meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
      },
      isLoading: false,
    });

    renderDashboard();

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
  });

  it("deve renderizar botão de excluir todos", () => {
    mockListProducts.mockReturnValue({
      data: {
        data: [
          { id: "1", name: "Produto 1", category: "Cat 1", quantity: 5, price: 50 },
        ],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
      isLoading: false,
    });

    renderDashboard();

    expect(screen.getByRole("button", { name: "Excluir todos" })).toBeInTheDocument();
  });

  it("deve renderizar paginação", () => {
    mockListProducts.mockReturnValue({
      data: {
        data: [
          { id: "1", name: "Produto 1", category: "Cat 1", quantity: 5, price: 50 },
        ],
        meta: { total: 25, page: 1, limit: 10, totalPages: 3 },
      },
      isLoading: false,
    });

    renderDashboard();

    expect(screen.getByText("Página 1 de 3")).toBeInTheDocument();
    expect(screen.getByText(/de 25 itens/)).toBeInTheDocument();
  });
});
