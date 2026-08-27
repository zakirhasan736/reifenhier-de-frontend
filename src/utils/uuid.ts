import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

const UUID_COOKIE = 'uuid';

function cookieOptions(): Cookies.CookieAttributes {
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:';
  return {
    expires: 365,
    path: '/',
    sameSite: 'lax',
    secure,
  };
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  return Cookies.get(name) || null;
}

export function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  Cookies.set(name, value, {
    ...cookieOptions(),
    expires: days,
  });
}

/** Create or read the visitor UUID. Safe on the server (returns "guest"). */
export function getOrCreateUuid(): string {
  if (typeof window === 'undefined') return 'guest';
  const existing = Cookies.get(UUID_COOKIE);
  if (existing && existing !== 'guest') return existing;
  const uuid = uuidv4();
  Cookies.set(UUID_COOKIE, uuid, cookieOptions());
  return uuid;
}
