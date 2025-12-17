import { AlertCircle } from 'lucide-react';
import { ProcessingState, type UploadSectionItem } from '../../types';
import { GenerateButton } from '../ui/GenerateButton';
import { UploadBox } from './UploadBox';

interface UploadSectionProps {
  sections: UploadSectionItem[];
  canGenerate: boolean;
  isGenerating: boolean;
  status: ProcessingState;
  errorMessage?: string | null;
  onGenerate: () => void;
}

export function UploadSection({
  sections,
  canGenerate,
  isGenerating,
  status,
  errorMessage,
  onGenerate,
}: UploadSectionProps) {
  const showError = status === ProcessingState.ERROR && Boolean(errorMessage);

  return (
    <section id="upload-section" className="flex flex-col gap-4 lg:flex-1 lg:min-h-0 lg:overflow-hidden">

      {showError && errorMessage && (
        <div className="alert-error" role="alert">
          <AlertCircle className="shrink-0 text-red-400 mt-0.5" size={18} />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-red-100 text-sm">Falha na geração</p>
            <p className="text-xs text-red-200/90 leading-relaxed mt-1 wrap-break-word">
              {errorMessage}
            </p>
            <button
              onClick={onGenerate}
              className="mt-2 text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              Tentar novamente agora
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:flex-1 lg:min-h-0">
        {sections.map((section) => (
          <article
            key={section.id}
            className="card hover:border-white/10 flex flex-col min-h-0 overflow-hidden"
          >
            <UploadBox
              id={section.id}
              label={section.title}
              subLabel={section.subLabel}
              image={section.image}
              onImageSelect={section.onImageSelect}
              onClear={section.onClear}
            />
          </article>
        ))}
      </div>

      <div className="h-20 sm:hidden" aria-hidden="true" />

      <div className="shrink-0 hidden sm:flex justify-end pt-2">
        <GenerateButton
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          isGenerating={isGenerating}
          className="rounded-xl py-2.5 px-6 text-sm"
          fullWidth={false}
        />
      </div>
    </section>
  );
}