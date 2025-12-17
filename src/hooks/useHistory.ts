import { get, set } from 'idb-keyval';
import { useCallback, useEffect, useState } from 'react';
import type { HistoryItem } from '../types';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    get('revest_history').then((val) => val && setHistory(val));
  }, []);

  const saveToHistory = useCallback((newItem: HistoryItem) => {
    setHistory((prev) => {
      const newHistory = [newItem, ...prev].slice(0, 20);
      set('revest_history', newHistory).catch(console.error);
      return newHistory;
    });
  }, []);

  const deleteHistoryItem = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => {
      const newHistory = prev.filter((item) => item.id !== id);
      set('revest_history', newHistory).catch(console.error);
      return newHistory;
    });
  }, []);

  return {
    history,
    isHistoryOpen,
    setIsHistoryOpen,
    saveToHistory,
    deleteHistoryItem,
  };
}
