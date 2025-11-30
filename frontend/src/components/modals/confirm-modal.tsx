import { useModal } from "@/contexts/modal-context";
import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";

type ConfirmData = {
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmModal() {
  const { modal, data, closeModal } = useModal();

  const confirmData = data as ConfirmData | null;
  const isOpen = modal === "confirm";

  if (!isOpen || !confirmData) return null;

  async function handleConfirm() {
    await confirmData?.onConfirm();
    closeModal();
  }

  return (
    <Modal
      name="confirm"
      title={confirmData.title}
      description={confirmData.description || "Esta ação não pode ser desfeita."}
    >
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={closeModal}
          className="border-zinc-700"
        >
          Cancelar
        </Button>
        <Button variant="destructive" onClick={handleConfirm}>
          {confirmData.confirmLabel ?? "Confirmar"}
        </Button>
      </div>
    </Modal>
  );
}

