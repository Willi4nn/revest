import { AlertCircle, ArrowRight, Key } from 'lucide-react';
import { useState } from 'react';

interface ApiKeyGateProps {
  errorMessage?: string | null;
  onConnect: (key: string) => void;
}

export function ApiKeyGate({ errorMessage, onConnect }: ApiKeyGateProps) {
  const [inputKey, setInputKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputKey.trim();
    if (cleanKey.length > 10) onConnect(cleanKey);
  };

  return (
    <main className="grid min-h-svh place-items-center bg-slate-950 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">

        <div className="text-center">
          <div className="mx-auto mb-4 grid size-10 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <Key size={20} />
          </div>
          <h1 className="text-lg font-medium text-slate-100">Acesso ao Gemini</h1>
          <p className="mt-1 text-sm text-slate-400">Insira sua chave de API para continuar.</p>
        </div>

        {errorMessage && (
          <div role="alert" className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            name="apiKey"
            autoComplete="current-password"
            placeholder="Cole sua API Key (AIza...)"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
            minLength={10}
          />

          <button
            type="submit"
            disabled={inputKey.length <= 10}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-medium text-slate-950 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Acessar
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </main>
  );
}