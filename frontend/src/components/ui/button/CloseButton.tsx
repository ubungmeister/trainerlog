import { X } from "lucide-react";

interface CloseButtonProps {
    closeModal: () => void;
}

export const CloseButton = ({closeModal}:CloseButtonProps) => {
    return (
         <button
            onClick={() => closeModal()}
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>
    );
};

 