import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ForumComment = {
  id: string;
  author: string;
  body: string;
  up: number;
  down: number;
  userVote: 'up' | 'down' | null;
};

export function forumStorageKey(clubId: string, chapterId: string) {
  return `${clubId}:${chapterId}`;
}

const SEED: Record<string, ForumComment[]> = {
  'c1:1': [
    {
      id: 'seed-1',
      author: 'Julian M.',
      body: 'El arranque me recordó a un ensayo sobre el tiempo. ¿Alguien más notó el ritmo pausado?',
      up: 8,
      down: 1,
      userVote: null,
    },
    {
      id: 'seed-2',
      author: 'Marina R.',
      body: 'Sí, casi como diario. Me gustaría hilvanarlo con el capítulo 2.',
      up: 4,
      down: 0,
      userVote: null,
    },
  ],
  'c1:2': [
    {
      id: 'seed-3',
      author: 'Elena P.',
      body: 'Aquí el tono cambia mucho. Cuidado spoilers en respuestas.',
      up: 6,
      down: 2,
      userVote: null,
    },
  ],
  'c2:1': [
    {
      id: 'seed-4',
      author: 'Carlos V.',
      body: 'Primera línea inolvidable. ¿Hacemos un hilo solo de citas?',
      up: 12,
      down: 0,
      userVote: null,
    },
  ],
};

function cloneForum(): Record<string, ForumComment[]> {
  const out: Record<string, ForumComment[]> = {};
  for (const k of Object.keys(SEED)) {
    out[k] = SEED[k].map((c) => ({ ...c }));
  }
  return out;
}

type ForumContextValue = {
  getThread: (clubId: string, chapterId: string) => ForumComment[];
  addComment: (clubId: string, chapterId: string, author: string, body: string) => void;
  vote: (clubId: string, chapterId: string, commentId: string, dir: 'up' | 'down') => void;
};

const ForumContext = createContext<ForumContextValue | null>(null);

export function ForumProvider({ children }: { children: React.ReactNode }) {
  const [threads, setThreads] = useState<Record<string, ForumComment[]>>(() => cloneForum());

  const getThread = useCallback(
    (clubId: string, chapterId: string) => {
      const key = forumStorageKey(clubId, chapterId);
      return threads[key] ?? [];
    },
    [threads],
  );

  const addComment = useCallback((clubId: string, chapterId: string, author: string, body: string) => {
    const text = body.trim();
    if (!text) return;
    const key = forumStorageKey(clubId, chapterId);
    const id = `local-${Date.now()}`;
    setThreads((prev) => {
      const next = { ...prev };
      const list = [...(next[key] ?? [])];
      list.push({ id, author, body: text, up: 0, down: 0, userVote: null });
      next[key] = list;
      return next;
    });
  }, []);

  const vote = useCallback((clubId: string, chapterId: string, commentId: string, dir: 'up' | 'down') => {
    const key = forumStorageKey(clubId, chapterId);
    setThreads((prev) => {
      const list = prev[key];
      if (!list) return prev;
      const nextList = list.map((c) => {
        if (c.id !== commentId) return c;
        let up = c.up;
        let down = c.down;
        let userVote = c.userVote;
        if (userVote === dir) {
          if (dir === 'up') up -= 1;
          else down -= 1;
          userVote = null;
        } else {
          if (userVote === 'up') up -= 1;
          if (userVote === 'down') down -= 1;
          if (dir === 'up') up += 1;
          else down += 1;
          userVote = dir;
        }
        return { ...c, up, down, userVote };
      });
      return { ...prev, [key]: nextList };
    });
  }, []);

  const value = useMemo(
    () => ({ getThread, addComment, vote }),
    [getThread, addComment, vote],
  );

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
}

export function useForum() {
  const ctx = useContext(ForumContext);
  if (!ctx) throw new Error('useForum dentro de ForumProvider');
  return ctx;
}
