'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { Activity, Traffic } from './types';

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de').replace(/\/$/, '');
const WorldMap = dynamic(() => import('./WorldMap'), { ssr: false, loading: () => <div className="absolute inset-0 bg-[#eef2f6]" /> });

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
        <p className="mt-3 text-[13px] text-[#6B6E76]">{rows ? 'Keine Aktivität im Zeitraum.' : 'Daten derzeit nicht verfügbar.'}</p>
      )}
    </div>
  );
}

function MinuteBars({ minutes }: { minutes: number[] }) {
  const peak = Math.max(1, ...minutes);
  return (
    <div className="mt-3 flex h-14 items-end gap-[3px]" aria-label="Aktive Nutzer pro Minute">
      {minutes.map((count, index) => (
        <div
          key={index}
          title={`Vor ${29 - index} Min.: ${count}`}
          className="min-w-0 flex-1 rounded-t-[3px]"
          style={{
            height: `${Math.max(count ? 12 : 4, (100 * count) / peak)}%`,
            background: count ? '#3A64F6' : '#E4E9F5',
          }}
        />
      ))}
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

  const cities = data?.cities.slice(0, 5).map((city) => ({
    label: [city.label, city.country].filter(Boolean).join(', '),
    count: city.count,
  })) ?? null;

  return (
    <section ref={section} className="custom-container pb-12" aria-labelledby="traffic-heading">
      <div className="overflow-hidden rounded-[24px] border border-[#E4E7EE] bg-white shadow-[0_16px_40px_-28px_rgba(22,23,26,0.45)]">
        <div className="flex flex-wrap items-end justify-between gap-3 px-4 pt-4 md:px-6 md:pt-5">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#3A64F6]">Echtzeit</p>
            <h2 id="traffic-heading" className="text-[22px] font-semibold text-[#16171A] md:text-[26px]">Reifexa live</h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF8E6] px-3 py-1 text-[12px] font-semibold text-[#8A6500]">
            <span className="h-2 w-2 rounded-full bg-[#f5b602] motion-safe:animate-pulse" />
            {data ? `Stand ${new Date(data.updatedAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}` : 'Live'}
          </span>
        </div>

        {!data ? (
          <p role="status" className="px-4 py-10 text-[14px] text-[#6B6E76] md:px-6">
            {failed ? 'Die Live-Karte ist derzeit nicht verfügbar.' : 'Live-Karte wird geladen …'}
          </p>
        ) : (
          <>
            <div className="relative mx-4 mt-4 h-[460px] overflow-hidden rounded-[18px] border border-[#E7EAF2] md:mx-6 md:h-[540px]">
              <WorldMap cities={data.cities} />
              <aside className="pointer-events-none absolute left-3 top-3 z-[500] w-[min(100%-1.5rem,340px)] rounded-2xl bg-white/95 p-4 shadow-[0_12px_32px_-16px_rgba(22,23,26,0.45)] backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6B6E76]">30 Minuten</p>
                    <p className="mt-1 text-[32px] font-semibold leading-none tabular-nums text-[#3A64F6]">{data.last30}</p>
                    <p className="mt-1 text-[12px] text-[#6B6E76]">aktive Nutzer</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6B6E76]">5 Minuten</p>
                    <p className="mt-1 text-[32px] font-semibold leading-none tabular-nums text-[#C49200]">{data.last5}</p>
                    <p className="mt-1 text-[12px] text-[#6B6E76]">aktive Nutzer</p>
                  </div>
                </div>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-[#6B6E76]">Pro Minute</p>
                <MinuteBars minutes={data.minutes} />
              </aside>
            </div>
            <p className="px-4 pt-2 text-[11px] text-[#8B909A] md:px-6">Ungefähre Stadtpositionen · Google Analytics</p>
            <div className="mt-4 grid border-t border-[#EEF0F4] md:grid-cols-3 md:divide-x md:divide-[#EEF0F4]">
              <Ranking title="Städte" rows={cities} />
              <Ranking title="Seiten in 30 Minuten" rows={data.pages} />
              <Ranking title="Neue Nutzer in 7 Tagen" rows={data.acquisition} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
