import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { ProductFormFields } from "@/components/modals/product-form-fields";
import { productSchema } from "@/schemas/product.schema";

function TestWrapper({ index = 0 }: { index?: number }) {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      products: [
        {
          name: "Produto Teste",
          description: "Descrição do produto",
          quantity: 10,
          price: 99.9,
          category: "Eletrônicos",
        },
      ],
    },
  });

  return (
    <Form {...form}>
      <ProductFormFields control={form.control} index={index} />
    </Form>
  );
}

describe("ProductFormFields", () => {
  it("deve renderizar todos os campos do formulário", () => {
    render(<TestWrapper />);

    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
    expect(screen.getByLabelText("Quantidade")).toBeInTheDocument();
    expect(screen.getByLabelText("Preço")).toBeInTheDocument();
    expect(screen.getByLabelText("Categoria")).toBeInTheDocument();
  });

  it("deve renderizar valores padrão nos campos", () => {
    render(<TestWrapper />);

    expect(screen.getByDisplayValue("Produto Teste")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Descrição do produto")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
    expect(screen.getByDisplayValue("99.9")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Eletrônicos")).toBeInTheDocument();
  });

  it("deve renderizar campos com placeholders corretos", () => {
    render(<TestWrapper />);

    expect(screen.getByPlaceholderText("Nome do produto")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Descrição do produto")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0.00")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Categoria do produto")).toBeInTheDocument();
  });
});

