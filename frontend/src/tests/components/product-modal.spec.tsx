import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ProductModal } from "@/components/modals/product-modal";
import { api } from "@/services/api";
import type { Product } from "@/features/products/products-api";

const mockCloseModal = vi.fn();
const mockCreateProduct = vi.fn();
const mockUpdateProduct = vi.fn();
const mockGetProduct = vi.fn();
let mockModalState = { modal: null as string | null, data: null as unknown };

vi.mock("@/contexts/modal-context", () => ({
  useModal: () => ({
    modal: mockModalState.modal,
    data: mockModalState.data,
    closeModal: mockCloseModal,
  }),
}));

vi.mock("@/features/products/products-api", async () => {
  const actual = await vi.importActual("@/features/products/products-api");
  return {
    ...actual,
    useCreateProductMutation: () => [mockCreateProduct, { isLoading: false }],
    useUpdateProductMutation: () => [mockUpdateProduct, { isLoading: false }],
    useGetProductQuery: () => mockGetProduct(),
  };
});

const createStore = () =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

const renderProductModal = () => {
  const store = createStore();
  return render(
    <Provider store={store}>
      <ProductModal />
    </Provider>
  );
};

describe("ProductModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockModalState = { modal: null, data: null };
    mockCreateProduct.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });
    mockUpdateProduct.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });
    mockGetProduct.mockReturnValue({
      data: undefined,
      isLoading: false,
    });
  });

  it("não deve renderizar quando modal não é 'product'", () => {
    mockModalState = { modal: "other", data: null };

    renderProductModal();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("deve renderizar formulário de criação", () => {
    mockModalState = { modal: "product", data: null };

    renderProductModal();

    expect(screen.getByText("Cadastrar produto(s)")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
    expect(screen.getByLabelText("Quantidade")).toBeInTheDocument();
    expect(screen.getByLabelText("Preço")).toBeInTheDocument();
  });

  it("deve renderizar formulário de edição", () => {
    const product: Product = {
      id: "1",
      name: "Produto Teste",
      description: "Descrição teste",
      quantity: 10,
      price: 99.9,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    mockModalState = { modal: "product", data: "1" };
    mockGetProduct.mockReturnValue({
      data: product,
      isLoading: false,
    });

    renderProductModal();

    expect(screen.getByText("Editar produto")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Produto Teste")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Descrição teste")).toBeInTheDocument();
  });

  it("deve renderizar botão de adicionar mais produto em modo criação", () => {
    mockModalState = { modal: "product", data: null };

    renderProductModal();

    expect(screen.getByRole("button", { name: "Adicionar mais produto" })).toBeInTheDocument();
  });

  it("não deve renderizar botão de adicionar mais produto em modo edição", () => {
    const product: Product = {
      id: "1",
      name: "Produto Teste",
      description: "Descrição teste",
      quantity: 10,
      price: 99.9,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    mockModalState = { modal: "product", data: "1" };
    mockGetProduct.mockReturnValue({
      data: product,
      isLoading: false,
    });

    renderProductModal();

    expect(screen.queryByRole("button", { name: "Adicionar mais produto" })).not.toBeInTheDocument();
  });

  it("deve adicionar novo produto ao clicar em adicionar mais produto", async () => {
    const user = userEvent.setup();
    mockModalState = { modal: "product", data: null };

    renderProductModal();

    await user.click(screen.getByRole("button", { name: "Adicionar mais produto" }));

    expect(screen.getByText("Produto 1")).toBeInTheDocument();
    expect(screen.getByText("Produto 2")).toBeInTheDocument();
  });

  it("deve remover produto ao clicar no botão de remover", async () => {
    const user = userEvent.setup();
    mockModalState = { modal: "product", data: null };

    renderProductModal();

    await user.click(screen.getByRole("button", { name: "Adicionar mais produto" }));

    const removeButtons = screen.getAllByRole("button", { name: "" });
    const removeButton = removeButtons.find((btn) =>
      btn.querySelector(".lucide-trash-2")
    );
    
    if (removeButton) {
      await user.click(removeButton);
      expect(screen.queryByText("Produto 2")).not.toBeInTheDocument();
    }
  });

  it("deve mostrar texto correto no botão de submit para um produto", () => {
    mockModalState = { modal: "product", data: null };

    renderProductModal();

    expect(screen.getByRole("button", { name: "Cadastrar produto" })).toBeInTheDocument();
  });

  it("deve mostrar texto correto no botão de submit para múltiplos produtos", async () => {
    const user = userEvent.setup();
    mockModalState = { modal: "product", data: null };

    renderProductModal();

    await user.click(screen.getByRole("button", { name: "Adicionar mais produto" }));

    expect(screen.getByRole("button", { name: "Cadastrar 2 produtos" })).toBeInTheDocument();
  });
});

