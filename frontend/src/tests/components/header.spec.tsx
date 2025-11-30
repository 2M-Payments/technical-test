import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Header } from "@/components/layout/header";
import authReducer from "@/features/auth/auth-slice";
import { api } from "@/services/api";

const mockNavigate = vi.fn();
const mockLogout = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: {
      id: "123",
      name: "Daniel Felizardo",
      email: "daniel@email.com",
    },
    isAuthenticated: true,
    logout: mockLogout,
  }),
}));

const createStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    preloadedState: {
      auth: {
        user: {
          id: "123",
          name: "Daniel Felizardo",
          email: "daniel@email.com",
        },
      },
    },
  });

const renderHeader = () => {
  const store = createStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </Provider>
  );
};

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar nome do usuário", () => {
    renderHeader();

    expect(screen.getByText("Daniel Felizardo")).toBeInTheDocument();
  });

  it("deve renderizar logo e título", () => {
    renderHeader();

    expect(screen.getByText("Produtos")).toBeInTheDocument();
  });

  it("deve renderizar botão de logout", () => {
    renderHeader();

    expect(screen.getByRole("button", { name: /sair/i })).toBeInTheDocument();
  });

  it("deve chamar logout e navegar ao clicar no botão", async () => {
    const user = userEvent.setup();
    mockLogout.mockResolvedValue(undefined);

    renderHeader();

    await user.click(screen.getByRole("button", { name: /sair/i }));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});

