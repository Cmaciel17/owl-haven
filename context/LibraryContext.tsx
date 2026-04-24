import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '@editorial-nook/library';

export type LibraryStatus = 'reading' | 'want' | 'read';

export type LibraryBook = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  status: LibraryStatus;
};

type LibraryContextValue = {
  books: LibraryBook[];
  isReady: boolean;
  addBook: (b: Omit<LibraryBook, 'id'>) => Promise<void>;
  removeBook: (id: string) => Promise<void>;
  setStatus: (id: string, status: LibraryStatus) => Promise<void>;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

async function saveBooks(next: LibraryBook[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && raw) {
          const parsed = JSON.parse(raw) as LibraryBook[];
          if (Array.isArray(parsed)) setBooks(parsed);
        }
      } catch {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } finally {
        if (!cancelled) setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addBook = useCallback(async (b: Omit<LibraryBook, 'id'>) => {
    const id = `lib-${Date.now()}`;
    setBooks((prev) => {
      const next = [...prev, { ...b, id }];
      saveBooks(next).catch(() => {});
      return next;
    });
  }, []);

  const removeBook = useCallback(async (id: string) => {
    setBooks((prev) => {
      const next = prev.filter((x) => x.id !== id);
      saveBooks(next).catch(() => {});
      return next;
    });
  }, []);

  const setStatus = useCallback(async (id: string, status: LibraryStatus) => {
    setBooks((prev) => {
      const next = prev.map((x) => (x.id === id ? { ...x, status } : x));
      saveBooks(next).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ books, isReady, addBook, removeBook, setStatus }),
    [books, isReady, addBook, removeBook, setStatus],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary dentro de LibraryProvider');
  return ctx;
}
