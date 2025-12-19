'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
const API = process.env.NEXT_PUBLIC_API_URL;
const uuidCookie = Cookies.get('uuid') || 'guest';
export function usePageView(source = 'web') {
  const pathname = usePathname();

  useEffect(() => {
    navigator.sendBeacon(
      `${API}/api/v1/pv`,
      JSON.stringify({
        uuid: uuidCookie,
        path: pathname,
        source,
      })
    );
  }, [pathname, source]);
}
