import { createContext, useContext, useState, type ReactNode } from "react";

type ModalType = string | null;

type ModalContextType = {
  modal: ModalType;
  data: unknown;
  openModal: (modal: string, data?: unknown) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

type ModalProviderProps = {
  children: ReactNode;
};

export function ModalProvider({ children }: ModalProviderProps) {
  const [modal, setModal] = useState<ModalType>(null);
  const [data, setData] = useState<unknown>(null);

  const openModal = (modalName: string, modalData?: unknown) => {
    setModal(modalName);
    setData(modalData ?? null);
  };

  const closeModal = () => {
    setModal(null);
    setData(null);
  };

  return (
    <ModalContext.Provider value={{ modal, data, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal deve ser usado dentro de ModalProvider");
  }

  return context;
}

