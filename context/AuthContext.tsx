import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '@editorial-nook/mock-session';

type AuthContextValue = {
  email: string | null;
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (raw) {
          const parsed = JSON.parse(raw) as { email?: string };
          if (typeof parsed?.email === 'string' && parsed.email.length > 0) {
            setEmail(parsed.email);
          }
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

  const signIn = useCallback(async (rawEmail: string, password: string) => {
    const em = rawEmail.trim();
    const pw = password.trim();
    if (!em || !pw) {
      throw new Error('Escribe correo y contraseña.');
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ email: em }));
    setEmail(em);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setEmail(null);
  }, []);

  const value = useMemo(
    () => ({ email, isReady, signIn, signOut }),
    [email, isReady, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}
