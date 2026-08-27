'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getOrCreateUuid } from '@/utils/uuid';

const UuidContext = createContext('guest');

export function UuidProvider({ children }: { children: React.ReactNode }) {
  const [uuid, setUuid] = useState('guest');

  useEffect(() => {
    setUuid(getOrCreateUuid());
  }, []);

  return <UuidContext.Provider value={uuid}>{children}</UuidContext.Provider>;
}

export function useVisitorUuid() {
  return useContext(UuidContext);
}
