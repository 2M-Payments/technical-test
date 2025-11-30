import { describe, it, expect, vi, beforeEach } from "vitest";
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

const mockOpenModal = vi.fn();
vi.mock("@/contexts/modal-context", () => ({
  useModal: () => ({ openModal: mockOpenModal }),
}));

describe("DataTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it("deve renderizar botão de cadastrar quando resource é passado", () => {
    render(
      <DataTable
        data={mockData}
        columns={columns}
        keyExtractor={(item) => item.id}
        resource={{
          name: "item",
          modal: "item",
        }}
      />
    );

    expect(screen.getByRole("button", { name: "Cadastrar item" })).toBeInTheDocument();
  });

  it("deve chamar openModal ao clicar no botão de cadastrar", async () => {
    const user = userEvent.setup();

    render(
      <DataTable
        data={mockData}
        columns={columns}
        keyExtractor={(item) => item.id}
        resource={{
          name: "item",
          modal: "item",
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Cadastrar item" }));

    expect(mockOpenModal).toHaveBeenCalledWith("item");
  });

  it("deve abrir modal com dados ao clicar na linha", async () => {
    const user = userEvent.setup();

    render(
      <DataTable
        data={mockData}
        columns={columns}
        keyExtractor={(item) => item.id}
        resource={{
          name: "item",
          modal: "item",
        }}
      />
    );

    await user.click(screen.getByText("Item 1"));

    expect(mockOpenModal).toHaveBeenCalledWith("item", mockData[0]);
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

  it("deve renderizar checkboxes quando deleteMany é passado", () => {
    const deleteMany = vi.fn();

    render(
      <DataTable
        data={mockData}
        columns={columns}
        keyExtractor={(item) => item.id}
        resource={{
          name: "item",
          modal: "item",
          deleteMany,
        }}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
  });

  it("deve selecionar item ao clicar no checkbox", async () => {
    const user = userEvent.setup();
    const deleteMany = vi.fn();

    render(
      <DataTable
        data={mockData}
        columns={columns}
        keyExtractor={(item) => item.id}
        resource={{
          name: "item",
          modal: "item",
          deleteMany,
        }}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[1]);

    expect(screen.getByRole("button", { name: /Excluir \(1\)/ })).toBeInTheDocument();
  });

  it("deve selecionar todos ao clicar no checkbox do header", async () => {
    const user = userEvent.setup();
    const deleteMany = vi.fn();

    render(
      <DataTable
        data={mockData}
        columns={columns}
        keyExtractor={(item) => item.id}
        resource={{
          name: "item",
          modal: "item",
          deleteMany,
        }}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    expect(screen.getByRole("button", { name: /Excluir \(2\)/ })).toBeInTheDocument();
  });

  it("deve renderizar botão de excluir todos quando deleteAll é passado", () => {
    const deleteAll = vi.fn();

    render(
      <DataTable
        data={mockData}
        columns={columns}
        keyExtractor={(item) => item.id}
        pagination={{ total: 2, page: 1, limit: 10, totalPages: 1 }}
        resource={{
          name: "item",
          modal: "item",
          deleteAll,
        }}
      />
    );

    expect(screen.getByRole("button", { name: "Excluir todos" })).toBeInTheDocument();
  });

  it("deve abrir modal de confirmação ao clicar em excluir selecionados", async () => {
    const user = userEvent.setup();
    const deleteMany = vi.fn();

    render(
      <DataTable
        data={mockData}
        columns={columns}
        keyExtractor={(item) => item.id}
        resource={{
          name: "item",
          modal: "item",
          deleteMany,
        }}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[1]);

    await user.click(screen.getByRole("button", { name: /Excluir \(1\)/ }));

    expect(mockOpenModal).toHaveBeenCalledWith("confirm", expect.objectContaining({
      title: "Excluir items selecionados",
    }));
  });

  it("deve abrir modal de confirmação ao clicar em excluir todos", async () => {
    const user = userEvent.setup();
    const deleteAll = vi.fn();

    render(
      <DataTable
        data={mockData}
        columns={columns}
        keyExtractor={(item) => item.id}
        pagination={{ total: 2, page: 1, limit: 10, totalPages: 1 }}
        resource={{
          name: "item",
          modal: "item",
          deleteAll,
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Excluir todos" }));

    expect(mockOpenModal).toHaveBeenCalledWith("confirm", expect.objectContaining({
      title: "Excluir todos os items",
    }));
  });
});
