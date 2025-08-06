import { redirect, notFound } from 'next/navigation';

// This is the correct props shape for a route like /visit/[encoded]
type VisitPageProps = {
  params: { encoded: string };
};

export default function Visit({ params }: VisitPageProps) {
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
  // Not needed, but TS likes return type
  return null;
}
