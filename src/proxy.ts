import { NextResponse, type NextRequest } from 'next/server';
import { SITE_URL } from '@/libs/seo/site';

/** www.reifexa.de — the one host Google should index. */
const CANONICAL = new URL(SITE_URL);
/** reifexa.de — the bare-domain twin that must never answer with a page. */
const BARE_HOST = CANONICAL.host.replace(/^www\./, '');

function requestHost(req: NextRequest): string {
  return (req.headers.get('x-forwarded-host') || req.headers.get('host') || '')
    .split(',')[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, '');
}

/**
 * 1. reifexa.de/… → 308 https://www.reifexa.de/… (path + query kept).
 *    Search Console showed both hosts serving the same pages ("Duplicate
 *    without user-selected canonical", "Alternate page with proper canonical
 *    tag"). 308 keeps the method, so POST /to clickouts still work.
 *    Only the exact bare host is redirected; localhost and preview hosts pass.
 *
 * 2. One URL per landing page: /reifen/205-55-R16 → 308 /reifen/205-55-r16,
 *    /marken/Continental → /marken/continental.
 */
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (BARE_HOST !== CANONICAL.host && requestHost(req) === BARE_HOST) {
    return NextResponse.redirect(
      `${CANONICAL.protocol}//${CANONICAL.host}${pathname}${search}`,
      308
    );
  }

  if (pathname.startsWith('/reifen/') || pathname.startsWith('/marken/')) {
    const lower = pathname.toLowerCase();
    if (lower !== pathname) {
      const url = req.nextUrl.clone();
      url.pathname = lower;
      url.search = search;
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Everything except build assets (they are fine on either host).
  matcher: ['/((?!_next/static|_next/image|favicon\\.png).*)'],
};
