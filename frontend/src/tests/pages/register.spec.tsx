import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Register } from "@/pages/public/register";
import authReducer from "@/features/auth/auth-slice";
import { api } from "@/services/api";

const mockNavigate = vi.fn();
const mockUnwrap = vi.fn();
const mockRegister = vi.fn(() => ({ unwrap: mockUnwrap }));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/features/auth/auth-api", async () => {
  const actual = await vi.importActual("@/features/auth/auth-api");
  return {
    ...actual,
    useRegisterMutation: () => [mockRegister, { isLoading: false }],
  };
});

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
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

const renderRegister = () => {
  const store = createStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    </Provider>
  );
};

describe("Register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar o formulário de cadastro", () => {
    renderRegister();

    expect(screen.getByText("Criar conta")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar senha")).toBeInTheDocument();
  });

  it("deve mostrar erro de validação para nome curto", async () => {
    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByLabelText("Nome"), "Da");
    await user.type(screen.getByLabelText("E-mail"), "daniel@email.com");
    await user.type(screen.getByLabelText("Senha"), "12345678");
    await user.type(screen.getByLabelText("Confirmar senha"), "12345678");
    await user.click(screen.getByRole("button", { name: "Cadastrar" }));

    await waitFor(() => {
      expect(screen.getByText(/mínimo 3 caracteres/i)).toBeInTheDocument();
    });
  });

  it("deve mostrar erro de validação para senhas diferentes", async () => {
    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByLabelText("Nome"), "Daniel Felizardo");
    await user.type(screen.getByLabelText("E-mail"), "daniel@email.com");
    await user.type(screen.getByLabelText("Senha"), "12345678");
    await user.type(screen.getByLabelText("Confirmar senha"), "87654321");
    await user.click(screen.getByRole("button", { name: "Cadastrar" }));

    await waitFor(() => {
      expect(screen.getByText(/senhas não coincidem/i)).toBeInTheDocument();
    });
  });

  it("deve ter link para página de login", () => {
    renderRegister();

    const loginLink = screen.getByRole("link", { name: "Entrar" });
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  it("deve chamar register ao submeter dados válidos", async () => {
    const user = userEvent.setup();
    mockUnwrap.mockResolvedValue({ user: { id: "1", name: "Daniel", email: "daniel@email.com" } });

    renderRegister();

    await user.type(screen.getByLabelText("Nome"), "Daniel Felizardo");
    await user.type(screen.getByLabelText("E-mail"), "daniel@email.com");
    await user.type(screen.getByLabelText("Senha"), "12345678");
    await user.type(screen.getByLabelText("Confirmar senha"), "12345678");
    await user.click(screen.getByRole("button", { name: "Cadastrar" }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: "Daniel Felizardo",
        email: "daniel@email.com",
        password: "12345678",
        confirmPassword: "12345678",
      });
    });
  });
});
