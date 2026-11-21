'use client';

/**
 * Owner-only: where visitors come from – AI assistants (ChatGPT, Perplexity, Claude,
 * Gemini, Copilot, Grok …), search engines (Google, Bing …), social, referral, direct –
 * and how many of them click through to a shop. Same key as /admin-alerts.
 */
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const API = (process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de').replace(/\/$/, '');
const KEY_STORAGE = 'rx_admin_alert_key';

type Row = { channel: string; source: string; visits: number; shopClicks: number; clickRatePct: number; last: string };
type Data = {
  days: number;
  totalVisits: number;
  untaggedShopClicks: number;
  channels: { channel: string; visits: number; shopClicks: number }[];
  sources: Row[];
  daily: Record<string, number | string>[];
  ai: {
    visits: number;
    shopClicks: number;
    topLandingPages: { path: string; source: string; visits: number }[];
    topProducts: { slug: string; name: string; visits: number; sources: string[] }[];
    recent: { at: string; source: string; landingPath: string; device: string }[];
  };
};

const CHANNEL: Record<string, { label: string; color: string }> = {
  ai: { label: 'KI-Assistenten', color: '#7C3AED' },
  search: { label: 'Suchmaschinen', color: '#2563EB' },
  social: { label: 'Social Media', color: '#DB2777' },
  referral: { label: 'Andere Websites', color: '#059669' },
  email: { label: 'E-Mail', color: '#D97706' },
  paid: { label: 'Bezahlt', color: '#DC2626' },
  direct: { label: 'Direkt / unbekannt', color: '#6B7280' },
};
const ch = (c: string) => CHANNEL[c] || { label: c, color: '#6B7280' };
const when = (d?: string) => (d ? new Date(d).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) : '–');
const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 1000) / 10} %` : '–');

export default function TrafficClient() {
  const [key, setKey] = useState('');
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      setKey(localStorage.getItem(KEY_STORAGE) || '');
    } catch {
      /* ignore */
    }
  }, []);

  const load = useCallback(async () => {
    if (!key) return;
    const res = await fetch(`${API}/api/traffic/summary?days=${days}`, {
      headers: { 'x-admin-alert-key': key },
      cache: 'no-store',
    });
    if (res.status === 401) return setError('Falscher Schlüssel – bitte auf /admin-alerts neu eingeben.');
    if (!res.ok) return setError(`Fehler ${res.status}`);
    setError('');
    setData(await res.json());
  }, [key, days]);

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [load]);

  if (!key) {
    return (
      <section className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold mb-2">Besucherquellen</h1>
        <p className="text-sm opacity-70">
          Bitte zuerst auf{' '}
          <Link href="/admin-alerts" className="underline">
            /admin-alerts
          </Link>{' '}
          den Admin-Schlüssel eingeben.
        </p>
      </section>
    );
  }

  const maxDay = Math.max(1, ...(data?.daily || []).map(d => Object.entries(d).reduce((a, [k, v]) => (k === 'date' ? a : a + Number(v)), 0)));
  const aiSources = (data?.sources || []).filter(s => s.channel === 'ai');

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Besucherquellen</h1>
          <p className="text-sm opacity-70">
            Woher Besucher kommen – KI-Assistenten, Suchmaschinen, Social Media – und wie viele zum Shop klicken.{' '}
            <Link href="/admin-alerts" className="underline">
              ← Verkaufs-Alarme
            </Link>
          </p>
        </div>
        <select value={days} onChange={e => setDays(Number(e.target.value))} className="border rounded px-2 py-1">
          {[1, 7, 30, 90, 365].map(d => (
            <option key={d} value={d}>
              Letzte {d} Tag{d > 1 ? 'e' : ''}
            </option>
          ))}
        </select>
      </header>

      {error && <p className="text-red-700 text-sm">{error}</p>}

      {data && (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="border rounded-lg p-3">
              <div className="opacity-60">Besuche gesamt</div>
              <div className="text-2xl font-semibold">{data.totalVisits.toLocaleString('de-DE')}</div>
            </div>
            <div className="border rounded-lg p-3" style={{ borderColor: CHANNEL.ai.color }}>
              <div className="opacity-60">Von KI-Assistenten</div>
              <div className="text-2xl font-semibold" style={{ color: CHANNEL.ai.color }}>
                {data.ai.visits.toLocaleString('de-DE')}
              </div>
              <div className="text-xs opacity-60">{pct(data.ai.visits, data.totalVisits)} aller Besuche</div>
            </div>
            <div className="border rounded-lg p-3">
              <div className="opacity-60">Shop-Klicks aus KI-Besuchen</div>
              <div className="text-2xl font-semibold">{data.ai.shopClicks}</div>
              <div className="text-xs opacity-60">Klickrate {pct(data.ai.shopClicks, data.ai.visits)}</div>
            </div>
            <div className="border rounded-lg p-3">
              <div className="opacity-60">Von Suchmaschinen</div>
              <div className="text-2xl font-semibold">
                {(data.channels.find(c => c.channel === 'search')?.visits || 0).toLocaleString('de-DE')}
              </div>
            </div>
          </div>

          {/* Channels */}
          <div>
            <h2 className="font-semibold mb-2 text-lg">Kanäle</h2>
            <div className="space-y-2">
              {data.channels.map(c => (
                <div key={c.channel} className="flex items-center gap-3 text-sm">
                  <span className="w-40 shrink-0">{ch(c.channel).label}</span>
                  <div className="flex-1 bg-black/5 rounded h-5 overflow-hidden">
                    <div
                      className="h-5 rounded"
                      style={{ width: `${(c.visits / Math.max(1, data.totalVisits)) * 100}%`, background: ch(c.channel).color }}
                    />
                  </div>
                  <span className="w-48 shrink-0 text-right tabular-nums whitespace-nowrap">
                    {c.visits} Besuche · {c.shopClicks} Klicks
                  </span>
                </div>
              ))}
              {!data.channels.length && <p className="text-sm opacity-60">Noch keine Besuche erfasst.</p>}
            </div>
          </div>

          {/* Daily */}
          {data.daily.length > 1 && (
            <div>
              <h2 className="font-semibold mb-2 text-lg">Besuche pro Tag</h2>
              <div className="flex items-end gap-1 h-40 border-b">
                {data.daily.map(d => (
                  <div key={String(d.date)} className="flex-1 flex flex-col-reverse" title={String(d.date)}>
                    {Object.keys(CHANNEL).map(k =>
                      d[k] ? (
                        <div
                          key={k}
                          style={{ height: `${(Number(d[k]) / maxDay) * 150}px`, background: ch(k).color }}
                          title={`${d.date}: ${ch(k).label} ${d[k]}`}
                        />
                      ) : null
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-2 text-xs">
                {Object.entries(CHANNEL).map(([k, v]) => (
                  <span key={k} className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-sm" style={{ background: v.color }} /> {v.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI assistants */}
          <div>
            <h2 className="font-semibold mb-2 text-lg">KI-Assistenten</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="text-left opacity-60">
                    <tr>
                      <th className="p-2">KI</th>
                      <th className="p-2 text-right">Besuche</th>
                      <th className="p-2 text-right">Shop-Klicks</th>
                      <th className="p-2 text-right">Klickrate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiSources.map(s => (
                      <tr key={s.source} className="border-t">
                        <td className="p-2 font-medium">{s.source}</td>
                        <td className="p-2 text-right tabular-nums">{s.visits}</td>
                        <td className="p-2 text-right tabular-nums">{s.shopClicks}</td>
                        <td className="p-2 text-right tabular-nums">{s.clickRatePct.toLocaleString('de-DE')} %</td>
                      </tr>
                    ))}
                    {!aiSources.length && (
                      <tr>
                        <td className="p-3 opacity-60" colSpan={4}>
                          Noch keine Besuche von KI-Assistenten in diesem Zeitraum.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="text-left opacity-60">
                    <tr>
                      <th className="p-2">Von KI empfohlene Produkte</th>
                      <th className="p-2 text-right">Besuche</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ai.topProducts.map(p => (
                      <tr key={p.slug} className="border-t">
                        <td className="p-2">
                          <Link href={`/produkte/${p.slug}`} className="underline" target="_blank">
                            {p.name}
                          </Link>
                          <div className="text-xs opacity-60">{p.sources.join(', ')}</div>
                        </td>
                        <td className="p-2 text-right tabular-nums">{p.visits}</td>
                      </tr>
                    ))}
                    {!data.ai.topProducts.length && (
                      <tr>
                        <td className="p-3 opacity-60" colSpan={2}>
                          Noch keine Produktseite über eine KI aufgerufen.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="text-left opacity-60">
                    <tr>
                      <th className="p-2">Einstiegsseite (KI)</th>
                      <th className="p-2">KI</th>
                      <th className="p-2 text-right">Besuche</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ai.topLandingPages.map(l => (
                      <tr key={l.path + l.source} className="border-t">
                        <td className="p-2 font-mono text-xs break-all">{l.path || '/'}</td>
                        <td className="p-2">{l.source}</td>
                        <td className="p-2 text-right tabular-nums">{l.visits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="text-left opacity-60">
                    <tr>
                      <th className="p-2">Letzte KI-Besuche</th>
                      <th className="p-2">KI</th>
                      <th className="p-2">Seite</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ai.recent.map((r, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2 whitespace-nowrap">{when(r.at)}</td>
                        <td className="p-2">
                          {r.source} <span className="opacity-50 text-xs">{r.device}</span>
                        </td>
                        <td className="p-2 font-mono text-xs break-all">{r.landingPath}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* All sources */}
          <div>
            <h2 className="font-semibold mb-2 text-lg">Alle Quellen</h2>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="text-left opacity-60">
                  <tr>
                    <th className="p-2">Quelle</th>
                    <th className="p-2">Kanal</th>
                    <th className="p-2 text-right">Besuche</th>
                    <th className="p-2 text-right">Shop-Klicks</th>
                    <th className="p-2 text-right">Klickrate</th>
                    <th className="p-2">Zuletzt</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sources.map(s => (
                    <tr key={s.channel + s.source} className="border-t">
                      <td className="p-2 font-medium">{s.source}</td>
                      <td className="p-2">
                        <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: ch(s.channel).color }} />
                        {ch(s.channel).label}
                      </td>
                      <td className="p-2 text-right tabular-nums">{s.visits}</td>
                      <td className="p-2 text-right tabular-nums">{s.shopClicks}</td>
                      <td className="p-2 text-right tabular-nums">{s.clickRatePct.toLocaleString('de-DE')} %</td>
                      <td className="p-2">{when(s.last)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs opacity-60 mt-2">
              Ein Besuch = erste Seite einer Browser-Sitzung. Shop-Klicks ohne Quelle (z. B. vor Einführung dieser
              Messung): {data.untaggedShopClicks}. Erfasst ohne Cookies und ohne IP-Adresse.
            </p>
          </div>
        </>
      )}
    </section>
  );
}
