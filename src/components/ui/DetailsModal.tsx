import { X } from 'lucide-react';
import revestIcon from '../../assets/revest-icon.png';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DetailsModal({ isOpen, onClose }: DetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl ring-1 ring-white/5"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/5 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
          aria-label="Fechar modal"
        >
          <X size={18} />
        </button>

        <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-white">
          <img src={revestIcon} alt="" aria-hidden="true" className="size-6" />
          Como funciona
        </h2>

        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <p>
            O Revest aplica inteligência artificial para trocar o tecido dos seus móveis com realismo absoluto, respeitando fielmente cada curva, sombra e detalhe da iluminação original.
          </p>
          <ul className="space-y-2">
            {[
              "Preservação total de luz e sombras",
              "Adaptação inteligente a dobras e curvas",
              "Sem necessidade de recortes manuais"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}