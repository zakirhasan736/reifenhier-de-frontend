// src/app/visit/[encoded]/page.tsx

import { redirect, notFound } from 'next/navigation';

type Props = {
  params: { encoded?: string };
};

export default function Visit({ params }: Props) {
  const encoded = params.encoded;
  if (!encoded) return notFound();

  let originalUrl: string;
  try {
    const base64 = decodeURIComponent(encoded);
    originalUrl = Buffer.from(base64, 'base64').toString('utf-8');
  } catch (err) {
    console.error('[Visit] Decoding failed:', err);
    return notFound();
  }

  const proxyUrl = `/api/exit?to=${encodeURIComponent(originalUrl)}`;
  redirect(proxyUrl);
}
