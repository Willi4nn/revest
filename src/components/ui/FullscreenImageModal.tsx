import { RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import ModalButton from './ModalButton';

interface FullscreenImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  alt?: string;
}

export function FullscreenImageModal({
  isOpen,
  onClose,
  imageSrc,
  alt = 'Imagem ampliada',
}: FullscreenImageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute right-0 top-0 z-50 p-6">
        <ModalButton
          onClick={onClose}
          className="rounded-full border border-white/10 bg-white/5 shadow-lg backdrop-blur-md hover:bg-red-500 hover:border-red-500 hover:rotate-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Fechar visualização"
        >
          <X size={24} />
        </ModalButton>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={8}
          centerOnInit
          wheel={{ step: 0.1 }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="absolute bottom-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/90 p-2 shadow-2xl backdrop-blur-md">
                <ModalButton onClick={() => zoomOut()} aria-label="Diminuir Zoom">
                  <ZoomOut size={20} />
                </ModalButton>
                <div className="h-6 w-px bg-white/20" />
                <ModalButton onClick={() => resetTransform()} aria-label="Resetar Zoom">
                  <RotateCcw size={20} />
                </ModalButton>
                <div className="h-6 w-px bg-white/20" />
                <ModalButton onClick={() => zoomIn()} aria-label="Aumentar Zoom">
                  <ZoomIn size={20} />
                </ModalButton>
              </div>

              <TransformComponent
                wrapperClass="!size-full flex items-center justify-center"
                contentClass="!size-full flex items-center justify-center"
              >
                <img
                  src={imageSrc}
                  alt={alt}
                  className="max-h-[85vh] max-w-[95vw] rounded-sm object-contain shadow-2xl"
                  style={{ willChange: 'transform' }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-0 right-0 text-center opacity-50">
        <p className="text-xs font-medium uppercase tracking-widest text-white">
          Role para zoom • Arraste para mover
        </p>
      </div>
    </div>
  );
}