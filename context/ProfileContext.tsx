import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '@editorial-nook/profile';

export type UserProfile = {
  displayName: string;
  birthDate: string;
  bio: string;
  genres: string[];
  avatarUri: string;
};

const defaultProfile: UserProfile = {
  displayName: '',
  birthDate: '',
  bio: '',
  genres: [],
  avatarUri: '',
};

type ProfileContextValue = {
  profile: UserProfile;
  isReady: boolean;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && raw) {
          const parsed = JSON.parse(raw) as Partial<UserProfile>;
          setProfile({
            ...defaultProfile,
            ...parsed,
            genres: Array.isArray(parsed.genres) ? parsed.genres : [],
          });
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

  const updateProfile = useCallback(async (patch: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next: UserProfile = {
        ...prev,
        ...patch,
        genres: patch.genres !== undefined ? patch.genres : prev.genres,
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ profile, isReady, updateProfile }),
    [profile, isReady, updateProfile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile dentro de ProfileProvider');
  return ctx;
}
