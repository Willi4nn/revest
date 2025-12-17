import { Loader2, Wand2 } from 'lucide-react';
import { cn } from '../../lib/cn';

interface GenerateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isGenerating?: boolean;
  fullWidth?: boolean;
  label?: string;
}

export function GenerateButton({
  isGenerating = false,
  className,
  fullWidth = true,
  label = 'Gerar simulação',
  disabled,
  ...props
}: GenerateButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || isGenerating}
      aria-busy={isGenerating}
      className={cn(
        'flex items-center justify-center gap-3 rounded-2xl py-3 px-4 text-base font-semibold transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 cursor-pointer',
        fullWidth ? 'w-full' : '',
        disabled
          ? 'cursor-not-allowed bg-white/10 text-slate-400 opacity-70'
          : 'bg-linear-to-r from-indigo-500 to-purple-400 text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-[0.98]',
        className
      )}
      {...props}
    >
      {isGenerating ? (
        <>
          <Loader2 className="animate-spin size-5" />
          <span>Aplicando tecido...</span>
        </>
      ) : (
        <>
          <Wand2 className="size-5" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}