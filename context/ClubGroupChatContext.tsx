import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { MOCK_GROUP_CHAT_SEED, type GroupChatMessage } from '@/data/mockData';

const STORAGE_KEY = '@owl-haven/group-chat-extra';

type Threads = Record<string, GroupChatMessage[]>;

function cloneSeed(): Threads {
  const out: Threads = {};
  for (const k of Object.keys(MOCK_GROUP_CHAT_SEED)) {
    out[k] = MOCK_GROUP_CHAT_SEED[k].map((m) => ({ ...m }));
  }
  return out;
}

function seedIdsForClub(clubId: string) {
  return new Set((MOCK_GROUP_CHAT_SEED[clubId] ?? []).map((m) => m.id));
}

const ClubGroupChatContext = createContext<{
  getMessages: (clubId: string) => GroupChatMessage[];
  sendMessage: (clubId: string, author: string, text: string) => void;
  isReady: boolean;
} | null>(null);

export function ClubGroupChatProvider({ children }: { children: React.ReactNode }) {
  const [threads, setThreads] = useState<Threads>(cloneSeed);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (raw) {
          const extra = JSON.parse(raw) as Threads;
          if (extra && typeof extra === 'object') {
            setThreads((prev) => {
              const next = { ...prev };
              for (const cid of Object.keys(extra)) {
                const add = extra[cid];
                if (Array.isArray(add) && add.length) {
                  next[cid] = [...(next[cid] ?? []), ...add];
                }
              }
              return next;
            });
          }
        }
      } catch {
        /* keep seed */
      } finally {
        if (!cancelled) setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const getMessages = useCallback(
    (clubId: string) => threads[clubId] ?? [],
    [threads],
  );

  const sendMessage = useCallback((clubId: string, author: string, text: string) => {
    const t = text.trim();
    if (!t) return;
    const msg: GroupChatMessage = {
      id: `live-${Date.now()}`,
      author,
      text: t,
      at: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };
    setThreads((prev) => {
      const list = [...(prev[clubId] ?? []), msg];
      const next = { ...prev, [clubId]: list };
      const seedIds = seedIdsForClub(clubId);
      const extraOnly = list.filter((m) => !seedIds.has(m.id));
      AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
        try {
          const all: Threads = raw ? (JSON.parse(raw) as Threads) : {};
          all[clubId] = extraOnly;
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all)).catch(() => {});
        } catch {
          /* noop */
        }
      });
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ getMessages, sendMessage, isReady }),
    [getMessages, sendMessage, isReady],
  );

  return <ClubGroupChatContext.Provider value={value}>{children}</ClubGroupChatContext.Provider>;
}

export function useClubGroupChat() {
  const ctx = useContext(ClubGroupChatContext);
  if (!ctx) throw new Error('useClubGroupChat dentro de ClubGroupChatProvider');
  return ctx;
}
