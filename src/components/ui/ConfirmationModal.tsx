import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, description }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
      <div className="absolute inset-0 " onClick={onClose} />

      <div className="relative w-full card max-w-md  p-6">
        <div className="flex items-center gap-3 mb-4 text-amber-400">
          <AlertTriangle size={20} />
          <h2 className="font-bold text-white">{title}</h2>
        </div>

        <p className="text-sm mb-6">{description}</p>

        <div className="flex justify-end gap-4 text-sm font-medium">
          <button onClick={onClose} className="btn btn-default">
            Cancelar
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="btn btn-primary "
          >
            Confirmar troca
          </button>
        </div>
      </div>
    </div>
  );
}