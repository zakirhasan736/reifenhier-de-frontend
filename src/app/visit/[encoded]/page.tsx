import { redirect, notFound } from 'next/navigation';

export default function Visit({ params }: { params: { encoded: string } }) {
  const { encoded } = params;
  if (!encoded) return notFound();

  let originalUrl: string;
  try {
    const base64 = decodeURIComponent(encoded);
    originalUrl = Buffer.from(base64, 'base64').toString('utf-8');
  } catch (err) {
    console.error('[Visit] Decoding failed:', err);
    return notFound();
  }

  redirect(`/api/exit?to=${encodeURIComponent(originalUrl)}`);
}
