import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const to = req.nextUrl.searchParams.get('to');
  if (!to) return new Response('Missing redirect target.', { status: 400 });

  try {
    const decoded = decodeURIComponent(to);
    return Response.redirect(decoded, 302);
  } catch (err) {
    console.error('[API EXIT] Invalid redirect target:', err);
    return new Response('Invalid redirect URL', { status: 400 });
  }
}
