import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Loader } from "@/components/shared/loader";

describe("Loader", () => {
  it("deve renderizar spinner", () => {
    const { container } = render(<Loader />);

    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("deve aplicar tamanho sm", () => {
    const { container } = render(<Loader size="sm" />);

    expect(container.querySelector(".size-4")).toBeInTheDocument();
  });

  it("deve aplicar tamanho md por padrão", () => {
    const { container } = render(<Loader />);

    expect(container.querySelector(".size-8")).toBeInTheDocument();
  });

  it("deve aplicar tamanho lg", () => {
    const { container } = render(<Loader size="lg" />);

    expect(container.querySelector(".size-12")).toBeInTheDocument();
  });

  it("deve aplicar className customizado", () => {
    const { container } = render(<Loader className="custom-class" />);

    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });
});

