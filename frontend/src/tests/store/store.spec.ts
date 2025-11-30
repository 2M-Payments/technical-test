import { describe, it, expect } from "vitest";
import { store } from "@/store";

describe("Redux Store", () => {
  it("deve ter o reducer de auth", () => {
    const state = store.getState();
    expect(state).toHaveProperty("auth");
  });

  it("deve ter o reducer de api", () => {
    const state = store.getState();
    expect(state).toHaveProperty("api");
  });

  it("deve ter o estado inicial de auth", () => {
    const state = store.getState();
    expect(state.auth).toEqual({ user: null });
  });
});
