import { useModal } from "@/contexts/modal-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { ReactNode } from "react";

type ModalProps = {
  name: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function Modal({ name, title, description, children }: ModalProps) {
  const { modal, closeModal } = useModal();

  const isOpen = modal === name;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()} >
      <DialogContent className="border-zinc-800 bg-zinc-900 max-w-3xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-zinc-400">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

