import { Clock, Trash2, X } from 'lucide-react';
import { type HistoryItem } from '../../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export function HistoryDrawer({ isOpen, onClose, items, onSelect, onDelete }: HistoryDrawerProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 transform border-l border-white/10 bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex h-full flex-col">

          <div className="flex items-center justify-between border-b border-white/5 p-4">
            <div className="flex items-center gap-2 text-white">
              <Clock size={20} className="text-indigo-400" />
              <h2 className="font-semibold">Histórico</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-sm text-center">
                <Clock size={32} className="mb-2 opacity-20" />
                <p>Nenhuma simulação salva.</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-slate-800 transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10"
                >
                  <img
                    src={item.resultImage}
                    alt="Resultado"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/90 via-black/50 to-transparent" />

                  <button
                    onClick={(e) => onDelete(item.id, e)}
                    className="absolute right-2 top-2 z-20 rounded-full bg-black/40 p-2 text-slate-300 backdrop-blur-md transition-all hover:bg-red-500 hover:text-white active:scale-95 cursor-pointer"
                    title="Excluir do histórico"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5">
                    <Clock size={10} className="text-indigo-400" />
                    <span className="font-mono text-[10px] font-medium text-slate-200">
                      {new Date(item.timestamp).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}