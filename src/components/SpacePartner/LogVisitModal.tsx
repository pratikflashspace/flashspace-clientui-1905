import React from "react";
import LogClientVisitForm from "./LogClientVisitForm";

interface LogVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LogVisitModal = ({ isOpen, onClose, onSuccess }: LogVisitModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200">
        <LogClientVisitForm
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default LogVisitModal;
