import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = 'Carregando' }: SpinnerProps) {
  return (
    <div className="fixed inset-0 grid place-items-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <Loader2 className="size-10 text-indigo-500/20" />
          <Loader2 className="absolute size-10 animate-spin text-indigo-500" />
        </div>
        <p className="animate-pulse text-xs font-medium text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}