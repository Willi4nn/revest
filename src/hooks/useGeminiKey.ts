import { useCallback, useEffect, useState } from 'react';

export function useGeminiKey() {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const verifyKey = async () => {
      try {
        const envKey =
          import.meta.env.VITE_GEMINI_API_KEY ||
          localStorage.getItem('gemini_api_key');

        if (envKey) {
          if (isMounted) setHasApiKey(true);
        } else if (window.aistudio) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (isMounted) setHasApiKey(hasKey);
        }
      } catch (error) {
        console.error('API key check failed', error);
        if (isMounted) setHasApiKey(false);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    verifyKey();
    return () => {
      isMounted = false;
    };
  }, []);

  const connectKey = useCallback(async (manualKey?: string) => {
    setErrorMsg(null);

    if (manualKey) {
      localStorage.setItem('gemini_api_key', manualKey);
      setHasApiKey(true);
      return;
    }

    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setHasApiKey(true);
      } catch (error) {
        console.error(error);
        setErrorMsg('Falha ao selecionar a chave API.');
      }
    } else {
      setErrorMsg('Por favor, cole sua chave API manualmente abaixo.');
    }
  }, []);

  const removeKey = useCallback(() => {
    localStorage.removeItem('gemini_api_key');
    setHasApiKey(false);
    setErrorMsg(null);
    setIsChecking(false);
  }, []);

  return {
    hasApiKey,
    isChecking,
    errorMsg,
    setErrorMsg,
    connectKey,
    removeKey,
  };
}
