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
    <section id="upload-section" className="flex-1 flex flex-col gap-4">
      {showError && errorMessage && (
        <div className="shrink-0 w-full rounded-xl border border-red-500/20 bg-red-500/5 text-red-200 p-3 flex gap-2 animate-fade-in" role="alert">
          <AlertCircle size={16} className="shrink-0 text-red-400" />
          <div>
            <p className="font-semibold text-red-100 text-xs">Falha na geração</p>
            <p className="text-[10px] text-red-300/80 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((section) => (
          <article
            key={section.id}
            className="bg-slate-900/40 rounded-2xl p-3 border border-white/5 hover:border-white/10 flex flex-col h-full"
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

      <div className="hidden sm:flex justify-end">
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