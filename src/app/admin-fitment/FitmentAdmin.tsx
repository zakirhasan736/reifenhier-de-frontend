'use client';

/**
 * Admin: review the vehicle → tyre-size database (AI suggestions → checked data)
 * and manage Auto-API customers (approve, IPs, plan, paid-until, revoke).
 * Uses the existing admin JWT (Authorization: Bearer …).
 */
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  BadgeCheck, Bot, Check, ChevronLeft, ChevronRight, Copy, KeyRound, Loader2, Plus, RefreshCw, Save, Search, Trash2, Users, X,
} from 'lucide-react';

type Fitment = { size: string; variant: string; yearFrom: number | string; yearTo: number | string; axle: string; source: string; loadIndex?: string; speedIndex?: string };
type Vehicle = {
  _id: string; key: string; make: string; model: string; reviewed: boolean; rank?: number; fitments: Fitment[];
  ai?: { status?: string; origin?: string; error?: string; model?: string };
};
type Access = {
  _id: string; email: string; plan: string; status: string; requestedIps: string[]; createdAt: string; billing?: string; company?: string; name?: string;
  street?: string; zip?: string; city?: string; country?: string; vatId?: string; website?: string; useCase?: string; paidUntil?: string; adminNote?: string;
  lastUsedAt?: string; usageDate?: string; requests?: number; requestIp?: string;
};
type Stats = { models: number; withSizes: number; reviewed: number; unreviewed: number; failed: number; visitors: number; pending: number; active: number };

const TOKEN_KEY = 'rx_admin_fitment_token';
const FILTERS = [
  ['ai', 'KI – zu prüfen'],
  ['reviewed', 'Geprüft'],
  ['empty', 'Ohne Größen'],
  ['failed', 'KI ohne Ergebnis'],
  ['visitor', 'Von Besuchern'],
  ['', 'Alle'],
] as const;
const input = '!border-0 rounded-[10px] bg-white px-3 py-2 text-[14px] ring-1 ring-[#DDE2EE] focus:outline-none focus:ring-2 focus:ring-[#3A64F6]';
const btn = 'inline-flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[13.5px] font-semibold cursor-pointer disabled:opacity-50';
const primary = `${btn} sl-white bg-[#3A64F6] hover:bg-[#2F55E0]`;
const ghost = `${btn} bg-white text-[#2B3040] ring-1 ring-[#DDE2EE] hover:bg-[#F4F6FB]`;

function Badge({ v }: { v: Vehicle }) {
  if (v.reviewed) return <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F7EE] px-2.5 py-0.5 text-[12px] font-semibold text-[#15803D]"><BadgeCheck size={13} /> geprüft</span>;
  if (v.fitments?.length) return <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[12px] font-semibold text-[#4F46E5]"><Bot size={13} /> KI</span>;
  if (v.ai?.status === 'failed') return <span className="rounded-full bg-[#FEF2F2] px-2.5 py-0.5 text-[12px] font-semibold text-[#B91C1C]">KI ohne Ergebnis</span>;
  return <span className="rounded-full bg-[#F2F3F5] px-2.5 py-0.5 text-[12px] font-semibold text-[#5A6072]">leer</span>;
}

export default function FitmentAdmin({ api }: { api: string }) {
  const [token, setToken] = useState('');
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<'vehicles' | 'access'>('vehicles');
  const [stats, setStats] = useState<Stats | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState('ai');
  const [q, setQ] = useState('');
  const [size, setSize] = useState('');
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [rows, setRows] = useState<Fitment[]>([]);
  const [access, setAccess] = useState<Access[]>([]);
  const [accessFilter, setAccessFilter] = useState('pending');
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [issuedKey, setIssuedKey] = useState('');
  const [newModel, setNewModel] = useState({ make: '', model: '' });

  useEffect(() => {
    try {
      const t = sessionStorage.getItem(TOKEN_KEY);
      if (t) setToken(t);
    } catch { /* storage blocked */ }
  }, []);

  const request = useCallback(
    async (path: string, method = 'GET', body?: unknown) => {
      const r = await fetch(`${api}/api/admin/fitment${path}`, {
        method,
        headers: { Authorization: `Bearer ${token.trim()}`, 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.error ? `${j.error} (HTTP ${r.status})` : `HTTP ${r.status}`);
      return j;
    },
    [api, token]
  );

  const run = async (label: string, work: () => Promise<void>, ok?: string) => {
    setBusy(label);
    setNotice(null);
    try {
      await work();
      if (ok) setNotice({ ok: true, text: ok });
    } catch (e) {
      setNotice({ ok: false, text: e instanceof Error ? e.message : 'Fehler' });
    } finally {
      setBusy('');
    }
  };

  const loadStats = useCallback(async () => setStats(await request('/stats')), [request]);
  const loadVehicles = useCallback(
    async (off = 0) => {
      const p = new URLSearchParams({ offset: String(off), ...(filter ? { status: filter } : {}), ...(q ? { q } : {}), ...(size ? { size } : {}) });
      const j = await request(`/vehicles?${p}`);
      setVehicles(j.items || []);
      setTotal(j.total || 0);
      setOffset(off);
    },
    [request, filter, q, size]
  );
  const loadAccess = useCallback(async () => setAccess(await request('/access')), [request]);

  const login = () =>
    run('login', async () => {
      await loadStats();
      await loadVehicles(0);
      await loadAccess();
      try { sessionStorage.setItem(TOKEN_KEY, token.trim()); } catch { /* ignore */ }
      setReady(true);
    });

  useEffect(() => {
    if (ready) run('list', () => loadVehicles(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const open = (v: Vehicle) => {
    setSelected(v);
    setRows((v.fitments || []).map(f => ({ ...f, loadIndex: f.loadIndex || '', speedIndex: f.speedIndex || '' })));
    setIssuedKey('');
  };
  const replaceVehicle = (v: Vehicle) => {
    setSelected(v);
    setRows(v.fitments.map(f => ({ ...f, loadIndex: f.loadIndex || '', speedIndex: f.speedIndex || '' })));
    setVehicles(list => list.map(x => (x._id === v._id ? v : x)));
  };
  const setRow = (i: number, k: keyof Fitment, val: string) => setRows(r => r.map((x, j) => (j === i ? { ...x, [k]: val } : x)));

  const save = () =>
    run('save', async () => {
      if (!selected) return;
      const fitments = rows.map(r => ({
        size: r.size.trim(), variant: r.variant.trim(), yearFrom: Number(r.yearFrom), yearTo: Number(r.yearTo), axle: r.axle,
        source: r.source.startsWith('KI-Vorschlag') || !r.source.trim() ? `Geprüft von Reifexa (${new Date().toISOString().slice(0, 10)})` : r.source.trim(),
        ...(r.loadIndex ? { loadIndex: String(r.loadIndex).trim() } : {}),
        ...(r.speedIndex ? { speedIndex: String(r.speedIndex).trim().toUpperCase() } : {}),
      }));
      replaceVehicle(await request(`/vehicles/${selected._id}`, 'PUT', { fitments }));
      loadStats();
    }, 'Gespeichert und als geprüft markiert.');

  if (!ready) {
    return (
      <main className="mx-auto max-w-md px-6 py-20">
        <h1 className="text-[26px] font-bold text-[#16171A]">Fahrzeugdaten & Auto-API</h1>
        <p className="mt-2 text-[14px] text-[#5A6072]">Mit dem Admin-Token anmelden (wie im Admin-Bereich).</p>
        <form className="mt-6 space-y-3" onSubmit={e => { e.preventDefault(); login(); }}>
          <input className={`${input} w-full`} type="password" autoComplete="off" placeholder="Admin-Token (JWT)" value={token} onChange={e => setToken(e.target.value)} required />
          <button className={`${primary} w-full justify-center py-3`} disabled={busy === 'login'}>{busy === 'login' ? <Loader2 size={16} className="animate-spin" /> : null} Anmelden</button>
          {notice ? <p className="text-[13px] text-[#B91C1C]">{notice.text}</p> : null}
        </form>
      </main>
    );
  }

  const shown = access.filter(a => !accessFilter || a.status === accessFilter);

  return (
    <main className="min-h-screen bg-[#F6F8FC] pb-20">
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[26px] font-bold text-[#16171A]">Fahrzeugdaten & Auto-API</h1>
          <div className="flex gap-2">
            <Link href="/admin-reviews" className={ghost}>Feedback</Link>
            <button className={ghost} onClick={() => run('rank', async () => { const j = await request('/vehicles/rank', 'POST'); await loadVehicles(offset); setNotice({ ok: true, text: `${j.ranked} Modelle neu sortiert.` }); })}>
              <RefreshCw size={15} /> Ranking neu berechnen
            </button>
          </div>
        </div>

        {stats ? (
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
            {[
              ['Modelle', stats.models],
              ['mit Größen', stats.withSizes],
              ['geprüft', stats.reviewed],
              ['KI – zu prüfen', stats.unreviewed],
              ['KI ohne Ergebnis', stats.failed],
              ['Anfragen offen', stats.pending],
              ['Kunden aktiv', stats.active],
            ].map(([l, n]) => (
              <div key={String(l)} className="rounded-[14px] bg-white p-3.5 ring-1 ring-[#E4E7F0]">
                <p className="text-[22px] font-bold text-[#16171A]">{Number(n).toLocaleString('de-DE')}</p>
                <p className="text-[12.5px] text-[#5A6072]">{l}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex gap-2 border-b border-[#E4E7F0]">
          {[['vehicles', 'Fahrzeugdaten'], ['access', `Kunden & Anfragen${stats?.pending ? ` (${stats.pending})` : ''}`]].map(([id, l]) => (
            <button key={id} onClick={() => setTab(id as 'vehicles' | 'access')} className={`-mb-px border-b-2 px-4 py-2.5 text-[14.5px] font-semibold cursor-pointer ${tab === id ? 'border-[#3A64F6] text-[#3A64F6]' : 'border-transparent text-[#5A6072]'}`}>
              {l}
            </button>
          ))}
        </div>

        {notice ? (
          <p role="status" className={`mt-4 rounded-[12px] px-4 py-2.5 text-[14px] ${notice.ok ? 'bg-[#E8F7EE] text-[#15803D]' : 'bg-[#FEF2F2] text-[#B91C1C]'}`}>{notice.text}</p>
        ) : null}

        {tab === 'vehicles' ? (
          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)]">
            {/* list */}
            <section className="rounded-[18px] bg-white p-4 ring-1 ring-[#E4E7F0]">
              <form className="flex flex-wrap gap-2" onSubmit={e => { e.preventDefault(); run('list', () => loadVehicles(0)); }}>
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" color="#8A90A2" />
                  <input className={`${input} w-full pl-9`} placeholder="Suche: golf, bmw 3er …" value={q} onChange={e => setQ(e.target.value)} />
                </div>
                <input className={`${input} w-32`} placeholder="205/55 R16" value={size} onChange={e => setSize(e.target.value)} />
                <button className={primary}>Suchen</button>
              </form>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {FILTERS.map(([id, l]) => (
                  <button key={id} onClick={() => setFilter(id)} className={`rounded-full px-3 py-1 text-[12.5px] font-semibold cursor-pointer ${filter === id ? 'sl-white bg-[#3A64F6]' : 'bg-[#F4F6FB] text-[#404042]'}`}>{l}</button>
                ))}
              </div>
              <ul className="mt-3 divide-y divide-[#F0F2F6]">
                {vehicles.map(v => (
                  <li key={v._id}>
                    <button onClick={() => open(v)} className={`flex w-full items-center gap-3 px-2 py-2.5 text-left cursor-pointer hover:bg-[#F8F9FC] ${selected?._id === v._id ? 'bg-[#F1F4FF]' : ''}`}>
                      <span className="w-10 text-right text-[12px] text-[#8A90A2]">{v.rank ? `#${v.rank}` : '–'}</span>
                      <span className="flex-1">
                        <span className="block text-[14.5px] font-semibold text-[#16171A]">{v.make} {v.model}</span>
                        <span className="text-[12px] text-[#6B7280]">
                          {(() => { const g = new Set(v.fitments?.map(f => f.variant)).size; const n = v.fitments?.length || 0; return `${g} ${g === 1 ? 'Generation' : 'Generationen'} · ${n} ${n === 1 ? 'Größe' : 'Größen'}`; })()}{v.ai?.origin === 'visitor' ? ' · von Besuchern' : ''}
                        </span>
                      </span>
                      <Badge v={v} />
                    </button>
                  </li>
                ))}
                {!vehicles.length ? <li className="p-6 text-center text-[14px] text-[#6B7280]">Keine Einträge.</li> : null}
              </ul>
              <div className="mt-3 flex items-center justify-between text-[13px] text-[#5A6072]">
                <span>{total ? `${offset + 1}–${Math.min(offset + 25, total)} von ${total.toLocaleString('de-DE')}` : ''}</span>
                <span className="flex gap-2">
                  <button className={ghost} disabled={!offset} onClick={() => run('list', () => loadVehicles(Math.max(0, offset - 25)))}><ChevronLeft size={15} /></button>
                  <button className={ghost} disabled={offset + 25 >= total} onClick={() => run('list', () => loadVehicles(offset + 25))}><ChevronRight size={15} /></button>
                </span>
              </div>
              <form className="mt-4 flex flex-wrap gap-2 border-t border-[#F0F2F6] pt-4" onSubmit={e => { e.preventDefault(); run('add', async () => { const v = await request('/vehicles', 'POST', newModel); setNewModel({ make: '', model: '' }); open(v); }, 'Modell angelegt.'); }}>
                <input className={`${input} w-28`} placeholder="Marke" value={newModel.make} onChange={e => setNewModel({ ...newModel, make: e.target.value })} required />
                <input className={`${input} flex-1`} placeholder="Modell (z. B. Golf)" value={newModel.model} onChange={e => setNewModel({ ...newModel, model: e.target.value })} required />
                <button className={ghost}><Plus size={15} /> Modell</button>
              </form>
            </section>

            {/* editor */}
            <section className="rounded-[18px] bg-white p-5 ring-1 ring-[#E4E7F0]">
              {!selected ? (
                <p className="py-16 text-center text-[14px] text-[#6B7280]">Links ein Modell wählen, um die Größen zu prüfen.</p>
              ) : (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-[20px] font-bold text-[#16171A]">{selected.make} {selected.model}</h2>
                      <p className="mt-0.5 flex items-center gap-2 text-[12.5px] text-[#6B7280]"><Badge v={selected} /> {selected.key}{selected.ai?.model ? ` · ${selected.ai.model}` : ''}</p>
                    </div>
                    <button className={ghost} onClick={() => setSelected(null)} aria-label="Schließen"><X size={15} /></button>
                  </div>
                  <p className="mt-3 rounded-[12px] bg-[#FFFBEB] p-3 text-[12.5px] leading-[150%] text-[#78350F] ring-1 ring-[#FDE68A]">
                    Bitte mit CoC-Daten oder Herstellerangaben vergleichen. „Prüfen & speichern“ markiert das Modell als geprüft; die KI ändert es danach nicht mehr.
                  </p>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[680px] text-[13px]">
                      <thead className="text-left text-[12px] text-[#6B7280]">
                        <tr><th className="p-1.5">Generation / Variante</th><th className="p-1.5">von</th><th className="p-1.5">bis</th><th className="p-1.5">Größe</th><th className="p-1.5">Achse</th><th className="p-1.5">LI</th><th className="p-1.5">SI</th><th /></tr>
                      </thead>
                      <tbody>
                        {rows.map((r, i) => (
                          <tr key={i} className={r.source?.startsWith('KI-Vorschlag') ? 'bg-[#F8F9FF]' : ''}>
                            <td className="p-1"><input className={`${input} w-full py-1.5`} value={r.variant} onChange={e => setRow(i, 'variant', e.target.value)} /></td>
                            <td className="p-1"><input className={`${input} w-[72px] py-1.5`} value={r.yearFrom} onChange={e => setRow(i, 'yearFrom', e.target.value)} /></td>
                            <td className="p-1"><input className={`${input} w-[72px] py-1.5`} value={r.yearTo} onChange={e => setRow(i, 'yearTo', e.target.value)} /></td>
                            <td className="p-1"><input className={`${input} w-[108px] py-1.5 font-mono`} value={r.size} onChange={e => setRow(i, 'size', e.target.value)} /></td>
                            <td className="p-1">
                              <select className={`${input} py-1.5`} value={r.axle} onChange={e => setRow(i, 'axle', e.target.value)}>
                                <option value="both">beide</option><option value="front">vorne</option><option value="rear">hinten</option>
                              </select>
                            </td>
                            <td className="p-1"><input className={`${input} w-14 py-1.5`} value={r.loadIndex} onChange={e => setRow(i, 'loadIndex', e.target.value)} /></td>
                            <td className="p-1"><input className={`${input} w-11 py-1.5`} value={r.speedIndex} onChange={e => setRow(i, 'speedIndex', e.target.value)} /></td>
                            <td className="p-1"><button className="rounded p-1.5 hover:bg-[#FEF2F2] cursor-pointer" onClick={() => setRows(x => x.filter((_, j) => j !== i))} aria-label="Zeile löschen"><Trash2 size={15} color="#DC2626" /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    className={`${ghost} mt-2`}
                    onClick={() => setRows(x => [...x, { variant: x[x.length - 1]?.variant || '', yearFrom: x[x.length - 1]?.yearFrom || '', yearTo: x[x.length - 1]?.yearTo || '', size: '', axle: 'both', source: '', loadIndex: '', speedIndex: '' }])}
                  >
                    <Plus size={15} /> Zeile
                  </button>
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-[#F0F2F6] pt-4">
                    <button className={primary} disabled={!!busy} onClick={save}>{busy === 'save' ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Prüfen & speichern</button>
                    {!selected.reviewed && selected.fitments?.length ? (
                      <button className={ghost} disabled={!!busy} onClick={() => run('approve', async () => { replaceVehicle(await request(`/vehicles/${selected._id}/approve`, 'POST')); loadStats(); }, 'Unverändert als geprüft übernommen.')}>
                        <Check size={15} /> So übernehmen
                      </button>
                    ) : null}
                    {!selected.reviewed ? (
                      <button className={ghost} disabled={!!busy} onClick={() => run('ai', async () => { const j = await request(`/vehicles/${selected._id}/ai`, 'POST'); replaceVehicle(j.vehicle); }, 'KI-Vorschlag aktualisiert.')}>
                        {busy === 'ai' ? <Loader2 size={15} className="animate-spin" /> : <Bot size={15} />} KI neu fragen
                      </button>
                    ) : null}
                  </div>
                </>
              )}
            </section>
          </div>
        ) : (
          <section className="mt-5">
            <div className="flex flex-wrap items-center gap-1.5">
              {[['pending', 'Offen'], ['active', 'Aktiv'], ['revoked', 'Widerrufen'], ['', 'Alle']].map(([id, l]) => (
                <button key={id} onClick={() => setAccessFilter(id)} className={`rounded-full px-3 py-1 text-[12.5px] font-semibold cursor-pointer ${accessFilter === id ? 'sl-white bg-[#3A64F6]' : 'bg-white text-[#404042] ring-1 ring-[#E4E7F0]'}`}>{l}</button>
              ))}
              <button className={`${ghost} ml-auto`} onClick={() => run('access', loadAccess)}><RefreshCw size={15} /> Aktualisieren</button>
            </div>
            {issuedKey ? (
              <div className="mt-4 rounded-[14px] bg-[#0B1020] p-4" role="status">
                <p className="sl-white flex items-center gap-2 text-[13px] font-semibold"><KeyRound size={16} /> Neuer API-Schlüssel – wird nur jetzt angezeigt. Sicher an den Kunden übermitteln.</p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="flex-1 break-all font-mono text-[13px] text-[#C7D2FE]">{issuedKey}</code>
                  <button className={ghost} onClick={() => navigator.clipboard?.writeText(issuedKey)}><Copy size={15} /> Kopieren</button>
                </div>
              </div>
            ) : null}
            <ul className="mt-4 grid gap-4 lg:grid-cols-2">
              {shown.map(a => <AccessCard key={a._id} a={a} busy={busy} onAction={(label, work, ok) => run(label, work, ok)} request={request} reload={loadAccess} setKey={setIssuedKey} reloadStats={loadStats} />)}
              {!shown.length ? <li className="rounded-[16px] bg-white p-8 text-center text-[14px] text-[#6B7280] ring-1 ring-[#E4E7F0] lg:col-span-2">Keine Einträge.</li> : null}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}

function AccessCard({ a, busy, onAction, request, reload, setKey, reloadStats }: {
  a: Access;
  busy: string;
  onAction: (label: string, work: () => Promise<void>, ok?: string) => void;
  request: (path: string, method?: string, body?: unknown) => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  reload: () => Promise<void>;
  setKey: (k: string) => void;
  reloadStats: () => Promise<void>;
}) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ plan: a.plan, ips: a.requestedIps.join('\n'), paidUntil: a.paidUntil ? a.paidUntil.slice(0, 10) : '', adminNote: a.adminNote || '' });
  const color = a.status === 'active' ? 'bg-[#E8F7EE] text-[#15803D]' : a.status === 'pending' ? 'bg-[#FFF7ED] text-[#C2410C]' : 'bg-[#F2F3F5] text-[#5A6072]';
  const today = new Date().toISOString().slice(0, 10);
  return (
    <li className="rounded-[16px] bg-white p-5 ring-1 ring-[#E4E7F0]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[16px] font-semibold text-[#16171A]"><Users size={16} color="#3A64F6" /> {a.company || a.name || a.email}</p>
          <p className="text-[13px] text-[#5A6072]">{a.name ? `${a.name} · ` : ''}<a className="underline" href={`mailto:${a.email}`}>{a.email}</a></p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${color}`}>{({ pending: 'offen', active: 'aktiv', revoked: 'widerrufen' } as Record<string, string>)[a.status] || a.status}</span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[13px]">
        <dt className="text-[#6B7280]">Tarif</dt><dd className="font-semibold capitalize">{a.plan} {a.billing === 'yearly' ? '· jährlich' : '· monatlich'}</dd>
        <dt className="text-[#6B7280]">Server-IPs</dt><dd className="font-mono">{a.requestedIps.join(', ')}</dd>
        {a.street ? <><dt className="text-[#6B7280]">Adresse</dt><dd>{a.street}, {a.zip} {a.city} {a.country}</dd></> : null}
        {a.vatId ? <><dt className="text-[#6B7280]">USt-IdNr.</dt><dd>{a.vatId}</dd></> : null}
        {a.website ? <><dt className="text-[#6B7280]">Website</dt><dd className="truncate">{a.website}</dd></> : null}
        <dt className="text-[#6B7280]">Bestellt</dt><dd>{new Date(a.createdAt).toLocaleDateString('de-DE')}{a.requestIp ? ` · von ${a.requestIp}` : ''}</dd>
        {a.paidUntil ? <><dt className="text-[#6B7280]">Bezahlt bis</dt><dd>{new Date(a.paidUntil).toLocaleDateString('de-DE')}</dd></> : null}
        {a.status === 'active' ? <><dt className="text-[#6B7280]">Anfragen heute</dt><dd>{a.usageDate === today ? a.requests || 0 : 0}{a.lastUsedAt ? ` · zuletzt ${new Date(a.lastUsedAt).toLocaleString('de-DE')}` : ''}</dd></> : null}
      </dl>
      {a.useCase ? <p className="mt-2 rounded-[10px] bg-[#F8F9FC] p-2.5 text-[13px] text-[#404042]">{a.useCase}</p> : null}
      {a.adminNote && !edit ? <p className="mt-2 text-[12.5px] italic text-[#6B7280]">Notiz: {a.adminNote}</p> : null}

      {edit ? (
        <div className="mt-3 grid gap-2 rounded-[12px] bg-[#F8F9FC] p-3">
          <label className="text-[12.5px] font-medium">Tarif
            <select className={`${input} mt-1 w-full`} value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })}>
              <option value="free">free</option><option value="pro">pro</option><option value="advanced">advanced</option>
            </select>
          </label>
          <label className="text-[12.5px] font-medium">Server-IPs (eine pro Zeile)
            <textarea className={`${input} mt-1 w-full font-mono`} rows={3} value={form.ips} onChange={e => setForm({ ...form, ips: e.target.value })} />
          </label>
          <label className="text-[12.5px] font-medium">Bezahlt bis
            <input type="date" className={`${input} mt-1 w-full`} value={form.paidUntil} onChange={e => setForm({ ...form, paidUntil: e.target.value })} />
          </label>
          <label className="text-[12.5px] font-medium">Notiz
            <input className={`${input} mt-1 w-full`} value={form.adminNote} onChange={e => setForm({ ...form, adminNote: e.target.value })} />
          </label>
          <div className="flex gap-2">
            <button className={primary} disabled={!!busy} onClick={() => onAction('patch', async () => { await request(`/access/${a._id}`, 'PATCH', { ...form, paidUntil: form.paidUntil || null }); setEdit(false); await reload(); }, 'Gespeichert.')}><Save size={15} /> Speichern</button>
            <button className={ghost} onClick={() => setEdit(false)}>Abbrechen</button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {a.status === 'pending' ? (
            <button className={primary} disabled={!!busy} onClick={() => onAction('activate', async () => { const j = await request(`/access/${a._id}/activate`, 'POST'); setKey(j.key); await reload(); await reloadStats(); }, 'Freigeschaltet. Schlüssel unten kopieren.')}>
              <KeyRound size={15} /> Prüfen & freischalten
            </button>
          ) : null}
          {a.status !== 'revoked' ? <button className={ghost} onClick={() => setEdit(true)}>Bearbeiten</button> : null}
          {a.status !== 'revoked' ? (
            <button className={`${ghost} text-[#B91C1C]`} disabled={!!busy} onClick={() => { if (window.confirm('Zugang wirklich widerrufen? Der Schlüssel funktioniert danach nicht mehr.')) onAction('revoke', async () => { await request(`/access/${a._id}/revoke`, 'POST'); await reload(); await reloadStats(); }, 'Widerrufen.'); }}>
              Widerrufen
            </button>
          ) : null}
        </div>
      )}
    </li>
  );
}
