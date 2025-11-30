import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, type Column } from "@/components/shared/data-table";

type TestItem = {
  id: string;
  name: string;
  value: number;
};

const mockData: TestItem[] = [
  { id: "1", name: "Item 1", value: 100 },
  { id: "2", name: "Item 2", value: 200 },
];

const columns: Column<TestItem>[] = [
  { key: "name", header: "Nome" },
  { key: "value", header: "Valor" },
];

describe("DataTable", () => {
  it("deve renderizar dados na tabela", () => {
    render(
      <DataTable
        data={mockData}
        columns={columns}
        keyExtractor={(item) => item.id}
      />
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  it("deve renderizar cabeçalhos das colunas", () => {
    render(
      <DataTable
        data={mockData}
        columns={columns}
        keyExtractor={(item) => item.id}
      />
    );

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();
  });

  it("deve renderizar botão de ação quando actionLabel é passado", () => {
    const onAction = vi.fn();

    render(
      <DataTable
        data={mockData}
        columns={columns}
        keyExtractor={(item) => item.id}
        actionLabel="Adicionar"
        onAction={onAction}
      />
    );

    expect(screen.getByRole("button", { name: "Adicionar" })).toBeInTheDocument();
  });

  it("deve chamar onAction ao clicar no botão", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <DataTable
        data={mockData}
        columns={columns}
        keyExtractor={(item) => item.id}
        actionLabel="Adicionar"
        onAction={onAction}
      />
    );

    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(onAction).toHaveBeenCalled();
  });

  it("deve renderizar paginação quando pagination é passado", () => {
    render(
      <DataTable
        data={mockData}
        columns={columns}
        keyExtractor={(item) => item.id}
        pagination={{ total: 20, page: 1, limit: 10, totalPages: 2 }}
      />
    );

    expect(screen.getByText("Página 1 de 2")).toBeInTheDocument();
    expect(screen.getByText(/de 20 itens/)).toBeInTheDocument();
  });

  it("deve chamar onPageChange ao clicar no botão de próxima página", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <DataTable
        data={mockData}
        columns={columns}
        keyExtractor={(item) => item.id}
        pagination={{ total: 20, page: 1, limit: 10, totalPages: 2 }}
        onPageChange={onPageChange}
      />
    );

    const nextButton = screen.getAllByRole("button").find(
      (btn) => btn.querySelector(".lucide-chevron-right")
    );
    
    if (nextButton) {
      await user.click(nextButton);
      expect(onPageChange).toHaveBeenCalledWith(2);
    }
  });

  it("deve usar render customizado quando fornecido", () => {
    const columnsWithRender: Column<TestItem>[] = [
      { key: "name", header: "Nome" },
      { key: "value", header: "Valor", render: (item) => `R$ ${item.value}` },
    ];

    render(
      <DataTable
        data={mockData}
        columns={columnsWithRender}
        keyExtractor={(item) => item.id}
      />
    );

    expect(screen.getByText("R$ 100")).toBeInTheDocument();
    expect(screen.getByText("R$ 200")).toBeInTheDocument();
  });
});

