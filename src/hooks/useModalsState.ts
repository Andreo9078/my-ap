import { useState } from "react";

export const useModalState = <T extends { type: string; data: any }>() => {
  const [modalState, setModalState] = useState<T | null>(null);

  const openModal = <K extends T["type"]>(
    type: K,
    data: Extract<T, { type: K }>["data"]
  ) => {
    setModalState({ type, data } as unknown as T);
  };
  const closeModal = () => {
    setModalState(null);
  };

  return { modalState, openModal, closeModal };
};
