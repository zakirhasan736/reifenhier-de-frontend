import { NextResponse, type NextRequest } from 'next/server';

/**
 * One URL per landing page: /reifen/205-55-R16 → 308 /reifen/205-55-r16,
 * /marken/Continental → /marken/continental. A real 308 (not a meta refresh)
 * so Google consolidates signals on the lowercase URL.
 */
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const lower = pathname.toLowerCase();
  if (lower !== pathname) {
    const url = req.nextUrl.clone();
    url.pathname = lower;
    url.search = search;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/reifen/:path*', '/marken/:path*'],
};
