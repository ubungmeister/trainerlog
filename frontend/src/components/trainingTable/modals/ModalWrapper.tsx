import { type ReactNode } from "react";

interface ModalWrapperProps {
  children: ReactNode;
  isOpen: boolean;
}

export const ModalWrapper = ({ children, isOpen }: ModalWrapperProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-modal="true"
      role="dialog"
    >
      <div className=" flex items-center justify-center">{children}</div>
    </div>
  );
};
