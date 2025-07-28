// src/app/visit/[encoded]/page.tsx
import { redirect, notFound } from 'next/navigation';

export default async function Visit({
  params,
}: {
  params: { encoded: string };
}) {
  const encoded = params.encoded;
  if (!encoded) return notFound();

  try {
    const base64 = decodeURIComponent(encoded);
    const originalUrl = Buffer.from(base64, 'base64').toString('utf-8');
    const proxyUrl = `/api/exit?to=${encodeURIComponent(originalUrl)}`;
    redirect(proxyUrl);
  } catch (err: unknown) {
    // Narrow the error and check for digest (used by Next.js redirect)
    if (
      typeof err === 'object' &&
      err !== null &&
      'digest' in err &&
      (err as { digest?: string }).digest !== 'NEXT_REDIRECT'
    ) {
      console.error('[Visit] Decoding failed:', err);
    }
    return notFound();
  }
}

