import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Dashboard } from "@/pages/private/dashboard";
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

  it("deve renderizar dados do usuário", () => {
    renderDashboard();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText(/ID: 123/)).toBeInTheDocument();
    expect(screen.getByText(/Nome: Daniel Felizardo/)).toBeInTheDocument();
    expect(screen.getByText(/E-mail: daniel@email.com/)).toBeInTheDocument();
  });

  it("deve renderizar botão de logout", () => {
    renderDashboard();

    expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument();
  });

  it("deve chamar logout ao clicar no botão", async () => {
    const user = userEvent.setup();
    mockLogout.mockResolvedValue(undefined);

    renderDashboard();

    await user.click(screen.getByRole("button", { name: "Sair" }));

    expect(mockLogout).toHaveBeenCalled();
  });
});
