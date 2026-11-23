'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { Activity, Traffic } from './types';

const WorldMap = dynamic(() => import('./WorldMap'), { ssr: false, loading: () => <div className="h-80 rounded-xl bg-slate-100" /> });

function Ranking({ title, rows }: { title: string; rows: Activity[] | null }) {
  return <div><h3 className="mb-2 font-semibold">{title}</h3>
    {rows?.length ? <ul>{rows.map(row => <li key={row.label} className="flex justify-between gap-3 border-b py-1.5 text-sm">
      <span className="break-words">{row.label}</span><strong>{row.count}</strong>
    </li>)}</ul> : <p className="text-sm">{rows ? 'Keine Aktivität im Zeitraum.' : 'Daten derzeit nicht verfügbar.'}</p>}
  </div>;
}

export default function LiveTraffic() {
  const section = useRef<HTMLElement>(null);
  const [data, setData] = useState<Traffic | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    let visible = false;
    let busy = false;
    async function refresh() {
      if (!visible || busy || document.hidden) return;
      busy = true;
      try {
        const response = await fetch('/api/live-traffic', { signal: controller.signal });
        if (!response.ok) throw Error();
        const result = await response.json() as Traffic;
        if (!controller.signal.aborted) { setData(result); setFailed(false); }
      } catch {
        if (!controller.signal.aborted) { setFailed(true); setData(null); }
      } finally { busy = false; }
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) void refresh(); }, { rootMargin: '200px' });
    if (section.current) observer.observe(section.current);
    const timer = window.setInterval(refresh, 30000);
    document.addEventListener('visibilitychange', refresh);
    return () => { controller.abort(); observer.disconnect(); clearInterval(timer); document.removeEventListener('visibilitychange', refresh); };
  }, []);
  return <section ref={section} className="custom-container pb-12" aria-labelledby="traffic-heading">
    <div className="rounded-2xl border border-[#dae4e6] p-4 md:p-7">
      <h2 id="traffic-heading" className="text-2xl font-semibold">Reifexa weltweit</h2>
      {!data ? <p role="status" className="mt-2">{failed ? 'Die Live-Statistik ist derzeit nicht verfügbar.' : 'Live-Statistik wird geladen …'}</p> : <>
        <p className="my-3 text-sm">Aktive Nutzer · letzte 30 Minuten: <strong>{data.last30}</strong> · letzte 5 Minuten: <strong>{data.last5}</strong></p>
        <WorldMap cities={data.cities} />
        <p className="mt-2 text-xs">Ungefähre Stadtpositionen · Stand {new Date(data.updatedAt).toLocaleTimeString('de-DE')} · Google Analytics</p>
        <h3 className="mb-1 mt-5 text-sm font-semibold">Aktive Nutzer pro Minute</h3>
        <div className="flex h-12 items-end gap-[2px]" aria-label="Aktivität der letzten 30 Minuten">
          {data.minutes.map((count, i) => <div key={i} title={`Vor ${29-i} Minuten: ${count}`} className="flex-1 rounded-t bg-teal-600" style={{height: `${100*count/Math.max(1,...data.minutes)}%`}} />)}
        </div>
        <div className="mt-5 grid gap-6 md:grid-cols-3">
          <Ranking title="Städte · aktive Nutzer" rows={data.cities.slice(0,5).map(c => ({label: [c.label,c.country].join(', '), count:c.count}))} />
          <Ranking title="Seiten · Aufrufe in 30 Minuten" rows={data.pages} />
          <Ranking title="Erstzugriffe · neue Nutzer in 7 Tagen" rows={data.acquisition} />
        </div>
      </>}
    </div>
  </section>;
}
