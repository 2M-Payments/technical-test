import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmModal } from "@/components/modals/confirm-modal";

const mockCloseModal = vi.fn();
let mockModalState = { modal: null as string | null, data: null as unknown };

vi.mock("@/contexts/modal-context", () => ({
  useModal: () => ({
    modal: mockModalState.modal,
    data: mockModalState.data,
    closeModal: mockCloseModal,
  }),
}));

describe("ConfirmModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockModalState = { modal: null, data: null };
  });

  it("não deve renderizar quando modal não é 'confirm'", () => {
    mockModalState = { modal: "other", data: null };

    render(<ConfirmModal />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("deve renderizar título e descrição", () => {
    mockModalState = {
      modal: "confirm",
      data: {
        title: "Confirmar exclusão",
        description: "Tem certeza?",
        onConfirm: vi.fn(),
      },
    };

    render(<ConfirmModal />);

    expect(screen.getByText("Confirmar exclusão")).toBeInTheDocument();
    expect(screen.getByText("Tem certeza?")).toBeInTheDocument();
  });

  it("deve renderizar descrição padrão quando não fornecida", () => {
    mockModalState = {
      modal: "confirm",
      data: {
        title: "Confirmar",
        onConfirm: vi.fn(),
      },
    };

    render(<ConfirmModal />);

    expect(screen.getByText("Esta ação não pode ser desfeita.")).toBeInTheDocument();
  });

  it("deve renderizar botão de cancelar", () => {
    mockModalState = {
      modal: "confirm",
      data: {
        title: "Confirmar",
        onConfirm: vi.fn(),
      },
    };

    render(<ConfirmModal />);

    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
  });

  it("deve usar label customizado no botão de confirmar", () => {
    mockModalState = {
      modal: "confirm",
      data: {
        title: "Confirmar",
        confirmLabel: "Excluir tudo",
        onConfirm: vi.fn(),
      },
    };

    render(<ConfirmModal />);

    expect(screen.getByRole("button", { name: "Excluir tudo" })).toBeInTheDocument();
  });

  it("deve chamar onConfirm e closeModal ao confirmar", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    mockModalState = {
      modal: "confirm",
      data: {
        title: "Confirmar",
        onConfirm,
      },
    };

    render(<ConfirmModal />);

    await user.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(onConfirm).toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("deve chamar closeModal ao cancelar", async () => {
    const user = userEvent.setup();

    mockModalState = {
      modal: "confirm",
      data: {
        title: "Confirmar",
        onConfirm: vi.fn(),
      },
    };

    render(<ConfirmModal />);

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(mockCloseModal).toHaveBeenCalled();
  });
});

