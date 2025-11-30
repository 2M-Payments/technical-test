import { describe, it, expect } from "vitest";
import { formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("deve formatar preço em reais", () => {
    expect(formatPrice(99.9)).toContain("99,90");
  });

  it("deve formatar preço zero", () => {
    expect(formatPrice(0)).toContain("0,00");
  });

  it("deve formatar preço com centavos", () => {
    expect(formatPrice(1234.56)).toContain("1.234,56");
  });

  it("deve formatar preço grande", () => {
    expect(formatPrice(1000000)).toContain("1.000.000,00");
  });
});
