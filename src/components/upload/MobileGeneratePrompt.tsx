import { GenerateButton } from '../ui/GenerateButton';

interface MobileGeneratePromptProps {
  canGenerate: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
  visible: boolean;
}

export function MobileGeneratePrompt({
  canGenerate,
  isGenerating,
  onGenerate,
  visible
}: MobileGeneratePromptProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-4 sm:hidden pointer-events-none">
      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/90 to-transparent" />

      <div className="relative pointer-events-auto">
        <GenerateButton
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          isGenerating={isGenerating}
          className="w-full rounded-xl text-sm font-bold shadow-lg"
        />
      </div>
    </div>
  );
}