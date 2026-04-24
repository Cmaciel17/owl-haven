import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { MOCK_CLUBS, MOCK_RECENT_CLUBS, type ClubDef } from '@/data/mockData';

const STORAGE_KEY = '@owl-haven/user-clubs';

type Ctx = {
  userClubs: ClubDef[];
  isReady: boolean;
  addClub: (name: string, bookId: string) => Promise<void>;
  /** Todos los clubes conocidos (mock + recientes + creados). */
  allClubs: ClubDef[];
  getClubById: (id: string) => ClubDef | undefined;
};

const UserCreatedClubsContext = createContext<Ctx | null>(null);

export function UserCreatedClubsProvider({ children }: { children: React.ReactNode }) {
  const [userClubs, setUserClubs] = useState<ClubDef[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && raw) {
          const parsed = JSON.parse(raw) as ClubDef[];
          if (Array.isArray(parsed)) setUserClubs(parsed);
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

  const addClub = useCallback(async (name: string, bookId: string) => {
    const trimmed = name.trim();
    if (!trimmed || !bookId) return;
    const c: ClubDef = {
      id: `u-${Date.now()}`,
      name: trimmed,
      active: true,
      bookId,
      memberCount: 1,
    };
    setUserClubs((prev) => {
      const next = [...prev, c];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const { allClubs, getClubById } = useMemo(() => {
    const byId = new Map<string, ClubDef>();
    for (const c of MOCK_CLUBS) byId.set(c.id, c);
    for (const c of MOCK_RECENT_CLUBS) byId.set(c.id, c);
    for (const c of userClubs) byId.set(c.id, c);
    const allClubs = [...byId.values()];
    return {
      allClubs,
      getClubById: (id: string) => byId.get(id),
    };
  }, [userClubs]);

  const value = useMemo(
    () => ({ userClubs, isReady, addClub, allClubs, getClubById }),
    [userClubs, isReady, addClub, allClubs, getClubById],
  );

  return (
    <UserCreatedClubsContext.Provider value={value}>{children}</UserCreatedClubsContext.Provider>
  );
}

export function useUserCreatedClubs() {
  const ctx = useContext(UserCreatedClubsContext);
  if (!ctx) throw new Error('useUserCreatedClubs dentro de UserCreatedClubsProvider');
  return ctx;
}
