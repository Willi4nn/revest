import { useState } from 'react';
import { DetailsModal } from '../ui/DetailsModal';

interface HeroSectionProps {
  onPrimaryAction: () => void;
  isResultView: boolean;
}

const FEATURE_HIGHLIGHTS = [
  'Luz e câmera originais preservadas.',
  'Textura encaixada com escala real.',
  'Sem interface complexa.'
];

export function HeroSection({ isResultView }: HeroSectionProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <section className={`relative shrink-0 transition-all duration-500 ${isResultView ? 'py-1' : 'space-y-6 py-6 sm:py-10'}`}>
        <div className="flex justify-center sm:hidden">
          <button
            type="button"
            onClick={() => setShowDetails(true)}
            className="group flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 transition-colors hover:bg-indigo-500/20 active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-indigo-500"></span>
            </span>
            <span className="text-xs font-medium text-indigo-200">Simule com IA</span>
            <span className="ml-1 rounded bg-indigo-500/20 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-indigo-300">Info</span>
          </button>
        </div>

        <div className={`mx-auto text-center sm:text-left ${isResultView ? 'text-center mb-8' : ''}`}>
          <h1 className={`font-bold tracking-tight text-white transition-all ${isResultView ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-5xl'}`}>
            Visualize o móvel reestofado{' '}
            <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent tracking-tight">
              sem ajustes manuais
            </span>
          </h1>

          {!isResultView && (
            <div className="mt-4 space-y-6 animate-fade-in">
              <p className="mx-auto text-base leading-relaxed text-slate-400 sm:mx-0">
                Suba a foto do móvel e a textura. O Revest faz o resto: mantém iluminação, escala e fundo originais.
              </p>

              <div className="hidden gap-3 sm:grid sm:grid-cols-3">
                {FEATURE_HIGHLIGHTS.map((item, i) => (
                  <div key={i} className="rounded-xl border border-white/5 bg-white/5 p-4 text-md text-slate-300 transition-colors hover:bg-white/10">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <DetailsModal isOpen={showDetails} onClose={() => setShowDetails(false)} />
    </>
  );
}