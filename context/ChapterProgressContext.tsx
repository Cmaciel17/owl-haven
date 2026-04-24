import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '@owl-haven/chapter-reads';

/** clubId -> chapterNumber string -> leído */
type Store = Record<string, Record<string, boolean>>;

const ChapterProgressContext = createContext<{
  isRead: (clubId: string, chapterNum: number) => boolean;
  toggleRead: (clubId: string, chapterNum: number) => void;
  isReady: boolean;
} | null>(null);

function loadStore(raw: string | null): Store {
  if (!raw) return {};
  try {
    const p = JSON.parse(raw) as Store;
    return typeof p === 'object' && p !== null ? p : {};
  } catch {
    return {};
  }
}

export function ChapterProgressProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Store>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled) setData(loadStore(raw));
      } finally {
        if (!cancelled) setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: Store) => {
    setData(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const isRead = useCallback(
    (clubId: string, chapterNum: number) => {
      return data[clubId]?.[String(chapterNum)] === true;
    },
    [data],
  );

  const toggleRead = useCallback(
    (clubId: string, chapterNum: number) => {
      const key = String(chapterNum);
      setData((prev) => {
        const club = { ...(prev[clubId] ?? {}) };
        club[key] = !club[key];
        const next = { ...prev, [clubId]: club };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({ isRead, toggleRead, isReady }),
    [isRead, toggleRead, isReady],
  );

  return (
    <ChapterProgressContext.Provider value={value}>{children}</ChapterProgressContext.Provider>
  );
}

export function useChapterProgress() {
  const ctx = useContext(ChapterProgressContext);
  if (!ctx) throw new Error('useChapterProgress dentro de ChapterProgressProvider');
  return ctx;
}
