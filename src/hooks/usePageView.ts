'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

const API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

export function usePageView(source = 'web') {
  const pathname = usePathname();

  useEffect(() => {
    if (!API || !pathname) return;
    const uuid = Cookies.get('uuid') || 'guest';
    const body = JSON.stringify({
      uuid,
      page: pathname,
      path: pathname,
      source,
    });
    try {
      const blob = new Blob([body], { type: 'text/plain' });
      navigator.sendBeacon(`${API}/api/v1/pv`, blob);
      // also record as behavior visit
      navigator.sendBeacon(
        `${API}/api/v1/e`,
        new Blob(
          [
            JSON.stringify({
              uuid,
              type: 'visit',
              action: 'page_view',
              page: pathname,
              instruction: source,
            }),
          ],
          { type: 'text/plain' }
        )
      );
    } catch {
      // ignore
    }
  }, [pathname, source]);
}
