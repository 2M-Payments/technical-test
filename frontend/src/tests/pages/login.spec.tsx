import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Login } from "@/pages/public/login";
import authReducer from "@/features/auth/auth-slice";
import { api } from "@/services/api";

const mockNavigate = vi.fn();
const mockUnwrap = vi.fn();
const mockLogin = vi.fn(() => ({ unwrap: mockUnwrap }));

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
    useLoginMutation: () => [mockLogin, { isLoading: false }],
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

const renderLogin = () => {
  const store = createStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );
};

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar o formulário de login", async () => {
    renderLogin();

    expect(await screen.findByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
  });

  it("deve mostrar erros de validação para campos vazios", async () => {
    const user = userEvent.setup();
    renderLogin();

    const submitButton = screen.getByRole("button", { name: "Entrar" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument();
    });
  });

  it("deve ter link para página de cadastro", () => {
    renderLogin();

    const registerLink = screen.getByRole("link", { name: "Cadastre-se" });
    expect(registerLink).toHaveAttribute("href", "/register");
  });

  it("deve chamar login ao submeter dados válidos", async () => {
    const user = userEvent.setup();
    mockUnwrap.mockResolvedValue({ user: { id: "1", name: "Test", email: "test@email.com" } });

    renderLogin();

    await user.type(screen.getByLabelText("E-mail"), "daniel@email.com");
    await user.type(screen.getByLabelText("Senha"), "12345678");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "daniel@email.com",
        password: "12345678",
      });
    });
  });
});
