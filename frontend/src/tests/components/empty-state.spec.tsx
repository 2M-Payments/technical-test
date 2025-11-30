import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/shared/empty-state";

describe("EmptyState", () => {
  it("deve renderizar título padrão", () => {
    render(<EmptyState />);

    expect(screen.getByText("Nenhum item encontrado")).toBeInTheDocument();
  });

  it("deve renderizar título customizado", () => {
    render(<EmptyState title="Nenhum produto" />);

    expect(screen.getByText("Nenhum produto")).toBeInTheDocument();
  });

  it("deve renderizar descrição quando fornecida", () => {
    render(<EmptyState description="Adicione um novo item" />);

    expect(screen.getByText("Adicione um novo item")).toBeInTheDocument();
  });

  it("deve aplicar className customizado", () => {
    const { container } = render(<EmptyState className="custom-class" />);

    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });
});

