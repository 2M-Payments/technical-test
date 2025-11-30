import { describe, it, expect } from "vitest";
import authReducer, { setUser, clearUser } from "@/features/auth/auth-slice";

describe("authSlice", () => {
  const initialState = { user: null };

  const mockUser = {
    id: "123",
    name: "Daniel Felizardo",
    email: "daniel@email.com",
  };

  describe("setUser", () => {
    it("deve definir o usuário no estado", () => {
      const state = authReducer(initialState, setUser(mockUser));

      expect(state.user).toEqual(mockUser);
    });
  });

  describe("clearUser", () => {
    it("deve limpar o usuário do estado", () => {
      const stateWithUser = { user: mockUser };
      const state = authReducer(stateWithUser, clearUser());

      expect(state.user).toBeNull();
    });
  });
});
