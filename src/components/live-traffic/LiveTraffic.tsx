'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { Activity, Traffic } from './types';
import { placeLabel } from './countryCenters';

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de').replace(/\/$/, '');

function Bone({ className }: { className: string }) {
  return <span className={`block animate-pulse rounded-md bg-[#E7ECF4] ${className}`} />;
}

function MapSkeleton() {
  return (
    <div className="absolute inset-0 bg-[#eef2f6]" aria-hidden>
      <span className="absolute left-[12%] top-[28%] h-20 w-36 animate-pulse rounded-[40%] bg-[#E4E9F2]" />
      <span className="absolute left-[34%] top-[22%] h-28 w-52 animate-pulse rounded-[46%] bg-[#E4E9F2]" />
      <span className="absolute right-[16%] top-[36%] h-16 w-28 animate-pulse rounded-[40%] bg-[#E4E9F2]" />
      <span className="absolute left-[46%] top-[46%] h-8 w-8 animate-ping rounded-full bg-[#3A64F6]/30" />
      <span className="absolute left-[47.2%] top-[48%] h-4 w-4 rounded-full bg-[#3A64F6]/70" />
      <span className="absolute left-[58%] top-[40%] h-6 w-6 animate-ping rounded-full bg-[#3A64F6]/25" />
      <span className="absolute left-[59%] top-[41.5%] h-3 w-3 rounded-full bg-[#3A64F6]/60" />
    </div>
  );
}

function LiveSkeleton() {
  return (
    <div role="status" aria-label="Loading live map">
      <div className="relative mx-3 mt-4 h-[480px] overflow-hidden rounded-[20px] border border-[#E7EAF2] md:mx-5 md:h-[600px]">
        <MapSkeleton />
      </div>
      <div className="mt-4 grid border-t border-[#EEF0F4] md:grid-cols-3 md:divide-x md:divide-[#EEF0F4]">
        {Array.from({ length: 3 }, (_, column) => (
          <div key={column} className="space-y-3 bg-white p-4 md:p-5">
            <Bone className="h-4 w-28" />
            {Array.from({ length: 4 }, (_, row) => (
              <div key={row}>
                <Bone className="h-3 w-full" />
                <Bone className="mt-1 h-1 w-2/3" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const WorldMap = dynamic(() => import('./WorldMap'), { ssr: false, loading: () => <MapSkeleton /> });

const regionNames = (() => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' });
  } catch {
    return null;
  }
})();

function Ranking({ title, rows }: { title: string; rows: Activity[] | null }) {
  const top = Math.max(1, ...(rows || []).map((row) => row.count));
  return (
    <div className="bg-white p-4 md:p-5">
      <h3 className="text-[13px] font-semibold text-[#16171A]">{title}</h3>
      {rows?.length ? (
        <ul className="mt-3 flex flex-col gap-2.5">
          {rows.map((row) => (
            <li key={row.label}>
              <div className="flex items-start justify-between gap-3 text-[13px]">
                <span className="line-clamp-2 text-[#404042]">{row.label}</span>
                <strong className="tabular-nums text-[#16171A]">{row.count}</strong>
              </div>
              <span className="mt-1 block h-1 overflow-hidden rounded-full bg-[#EEF2FF]">
                <span className="block h-full rounded-full bg-[#3A64F6]" style={{ width: `${Math.max(8, (100 * row.count) / top)}%` }} />
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-[13px] text-[#6B6E76]">{rows ? 'No activity in this period.' : 'Data currently unavailable.'}</p>
      )}
    </div>
  );
}

export default function LiveTraffic() {
  const section = useRef<HTMLElement>(null);
  const [data, setData] = useState<Traffic | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    let stopped = false;
    let visible = false;
    let busy = false;
    let delay = 30000;
    let timer = 0;
    async function refresh() {
      if (!visible || busy || document.hidden) return;
      busy = true;
      try {
        const response = await fetch(`${apiOrigin}/api/live-traffic`, { signal: controller.signal });
        const result = await response.json() as Traffic & { available?: boolean };
        if (!response.ok || result.available === false) {
          delay = 300000;
          if (!controller.signal.aborted) { setFailed(true); setData(null); }
          return;
        }
        delay = 30000;
        if (!controller.signal.aborted) { setData(result); setFailed(false); }
      } catch {
        delay = 300000;
        if (!controller.signal.aborted) { setFailed(true); setData(null); }
      } finally { busy = false; }
    }
    const schedule = () => {
      if (stopped) return;
      timer = window.setTimeout(() => { void refresh().finally(schedule); }, delay);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) void refresh(); }, { rootMargin: '200px' });
    if (section.current) observer.observe(section.current);
    schedule();
    document.addEventListener('visibilitychange', refresh);
    return () => { stopped = true; controller.abort(); observer.disconnect(); clearTimeout(timer); document.removeEventListener('visibilitychange', refresh); };
  }, []);

  const cities = data?.cities.slice(0, 6).map((city) => {
    const name = placeLabel(city.country, city.label, city.point);
    let country = city.country;
    try {
      country = regionNames?.of(city.country) || city.country;
    } catch {
      /* unknown code */
    }
    const sub = [city.region, name === country ? '' : country].filter(Boolean).join(', ');
    return { label: sub ? `${name} · ${sub}` : name, count: city.count };
  }) ?? null;

  return (
    <section ref={section} className="custom-container pb-12" aria-labelledby="traffic-heading">
      <div className="overflow-hidden rounded-[28px] border border-[#E4E7EE] bg-white shadow-[0_24px_60px_-36px_rgba(22,23,26,0.55)]">
        <div className="flex flex-col gap-3 px-4 pt-5 md:flex-row md:items-end md:justify-between md:px-6 md:pt-6">
          <div>
            <p className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#3A64F6]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22C55E]" />
              </span>
              Real time
            </p>
            <h2 id="traffic-heading" className="mt-1 text-[24px] font-bold text-[#16171A] md:text-[30px]">Reifexa live visitors</h2>
            <p className="mt-1 text-[14px] text-[#5A6072]">Where people are comparing tyres right now – updated every 30 seconds.</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-[#F1F4FF] px-3 py-1.5 text-[12px] font-semibold text-[#3A64F6] md:self-auto">
            {data ? `Updated ${new Date(data.updatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : 'Live'}
          </span>
        </div>

        {!data ? (
          failed ? (
            <p role="status" className="px-4 py-10 text-[14px] text-[#6B6E76] md:px-6">The live map is currently unavailable.</p>
          ) : (
            <LiveSkeleton />
          )
        ) : (
          <>
            <div className="relative mx-3 mt-4 h-[480px] overflow-hidden rounded-[20px] border border-[#E7EAF2] md:mx-5 md:h-[600px]">
              <WorldMap cities={data.cities} last30={data.last30} last5={data.last5} minutes={data.minutes} />
            </div>
            <p className="px-4 pt-2 text-[11px] text-[#8B909A] md:px-6">Approximate city positions · Google Analytics · no personal data</p>
            <div className="mt-4 grid border-t border-[#EEF0F4] md:grid-cols-3 md:divide-x md:divide-[#EEF0F4]">
              <Ranking title="Cities" rows={cities} />
              <Ranking title="Pages in the last 30 minutes" rows={data.pages} />
              <Ranking title="New users in the last 7 days" rows={data.acquisition} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
