import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { MOCK_PRIVATE_THREADS } from '@/data/mockData';

type InboxContextValue = {
  hasUnread: boolean;
  openInbox: () => void;
  /** Solo demo: volver a simular notificación */
  simulateNotification: () => void;
};

const InboxContext = createContext<InboxContextValue | null>(null);

export function InboxProvider({ children }: { children: React.ReactNode }) {
  const [hasUnread, setHasUnread] = useState(() =>
    MOCK_PRIVATE_THREADS.some((t) => t.unread),
  );

  const openInbox = useCallback(() => {
    setHasUnread(false);
  }, []);

  const simulateNotification = useCallback(() => {
    setHasUnread(true);
  }, []);

  const value = useMemo(
    () => ({ hasUnread, openInbox, simulateNotification }),
    [hasUnread, openInbox, simulateNotification],
  );

  return <InboxContext.Provider value={value}>{children}</InboxContext.Provider>;
}

export function useInbox() {
  const ctx = useContext(InboxContext);
  if (!ctx) throw new Error('useInbox dentro de InboxProvider');
  return ctx;
}
