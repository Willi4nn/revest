import { Download, Maximize2, RefreshCcw } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { FullscreenImageModal } from '../ui/FullscreenImageModal';

interface ResultViewProps {
  originalImage: string;
  resultImage: string;
  onReset: () => void;
}

export function ResultView({ originalImage, resultImage, onReset }: ResultViewProps) {
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const openZoom = useCallback((src: string) => setZoomImage(src), []);
  const closeZoom = useCallback(() => setZoomImage(null), []);

  return (
    <div className="w-full h-full animate-fade-in flex flex-col pb-2">
      <article className="mx-auto max-w-7xl flex flex-col w-full h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-2xl backdrop-blur-sm">

        <header className="shrink-0 relative z-20 flex flex-col gap-4 border-b border-white/5 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Sucesso</span>
            </div>
            <h2 className="text-lg font-semibold text-white">Reestofado com sucesso!</h2>
          </div>

          <a
            href={resultImage}
            download="revest-result.png"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <Download size={16} />
            Baixar Imagem
          </a>
        </header>

        <div className="group relative z-10 flex-1 min-h-0 w-full bg-black overflow-hidden flex items-center justify-center">

          <div
            aria-hidden="true"
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-30 blur-3xl saturate-150 transition-opacity duration-700"
            style={{ backgroundImage: `url(${originalImage})` }}
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative w-full h-full shadow-2xl">
            <ReactCompareSlider
              itemOne={<ReactCompareSliderImage src={originalImage} alt="Original" style={{ objectFit: 'cover', height: '100%', width: '100%' }} />}
              itemTwo={<ReactCompareSliderImage src={resultImage} alt="Resultado" style={{ objectFit: 'cover', height: '100%', width: '100%' }} />}
              className="h-full w-full"
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          <div className="pointer-events-none absolute left-4 top-4 z-20">
            <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-bold tracking-wide text-white backdrop-blur-md">
              ANTES
            </span>
          </div>
          <div className="pointer-events-none absolute right-4 top-4 z-20">
            <span className="rounded-full border border-white/10 bg-emerald-500/90 px-3 py-1 text-xs font-bold tracking-wide text-white backdrop-blur-md shadow-lg">
              DEPOIS
            </span>
          </div>

          <div className="absolute bottom-4 right-4 z-20 transition-all">
            <button
              onClick={() => openZoom(resultImage)}
              className="rounded-full border border-white/20 bg-black/50 p-3 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-white hover:text-slate-900 active:scale-95 cursor-pointer"
              aria-label="Expandir imagem"
              title="Ver em tela cheia"
            >
              <Maximize2 size={20} />
            </button>
          </div>
        </div>

        <footer className="shrink-0 relative z-20 flex justify-center border-t border-white/5 bg-white/5 p-4">
          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-lg border border-transparent px-5 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-white/10 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 cursor-pointer"
          >
            <RefreshCcw size={16} />
            Gerar Nova Simulação
          </button>
        </footer>
      </article>

      <FullscreenImageModal
        isOpen={Boolean(zoomImage)}
        onClose={closeZoom}
        imageSrc={zoomImage ?? ''}
      />
    </div>
  );
}