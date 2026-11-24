'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

type Summary = { count: number; average: number | null };
const api = process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de';

export default function ReviewSummary() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${api}/api/reviews/summary`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) return;
        const body = await response.json();
        // only show a well-formed summary (a broken API response must not crash the page)
        if (body && typeof body.count === 'number' && (body.average === null || typeof body.average === 'number')) setSummary(body);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (!summary) return null;
  return <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#404042]">
    <strong>Reifexa-Bewertungen</strong>
    {summary.average === null ? <span>Noch keine Bewertungen</span> : <>
      <span className="flex gap-0.5 text-amber-600" aria-hidden="true">
        {[1, 2, 3, 4, 5].map(value => <Star key={value} size={16} fill={value <= Math.round(summary.average ?? 0) ? 'currentColor' : 'none'} />)}
      </span>
      <span>{summary.average.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} / 5 · {summary.count.toLocaleString('de-DE')} {summary.count === 1 ? 'Bewertung' : 'Bewertungen'}</span>
    </>}
  </div>;
}
