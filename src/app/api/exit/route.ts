import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get('to');

  if (!urlParam) {
    return new Response('Missing redirect target.', { status: 400 });
  }

  try {
    const decodedUrl = decodeURIComponent(urlParam);
    console.log('[API EXIT] Redirecting to:', decodedUrl);

    return Response.redirect(decodedUrl, 302);
  } catch (err) {
    console.error('[API EXIT] Failed redirect:', err);
    return new Response('Invalid redirect URL', { status: 400 });
  }
}
