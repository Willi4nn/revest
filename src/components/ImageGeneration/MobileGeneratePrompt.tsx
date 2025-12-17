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
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none sm:hidden">
      <div className="bg-linear-to-t from-slate-950 via-slate-950/95 to-transparent px-4 pb-6 pt-8">
        <div className="pointer-events-auto shadow-2xl shadow-slate-950/50">
          <GenerateButton
            onClick={onGenerate}
            disabled={!canGenerate || isGenerating}
            isGenerating={isGenerating}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}