'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Bell, CloudSun, LogOut, Snowflake, Sun } from 'lucide-react';
import { AreaChart, HBars, type Point } from './charts';

const API = (process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de').replace(/\/$/, '');
const TOKEN_KEY = 'rx_ops_token';

type Preset = 'today' | 'yesterday' | 'last7' | 'last28' | 'custom';
type Tab = 'overview' | 'transactions' | 'homepage' | 'jobs';
type Totals = { views: number; clicks: number; sales: number; amount: number; profit: number };
type Series = {
  grain: 'hour' | 'day';
  totals: Totals;
  previous: Totals;
  points: (Point & { date: string })[];
  vendors: { vendor: string; sales: number; saleAmount: number; commission: number }[];
  statuses: { status: string; count: number; amount: number }[];
  topClicks: { name: string; clicks: number }[];
  topPages: { page: string; views: number }[];
};
type Tx = {
  transactionId: string;
  merchantName?: string;
  saleAmount?: number;
  commission?: number;
  status?: string;
  transactionDate?: string;
};
type Job = { alive: boolean; lastSuccess?: string | null; lastError?: string; progress?: number };
type Jobs = { import: Job; feedPrices: Job; shopPrices: Job };
type HomeProduct = {
  _id: string;
  slug?: string;
  product_name?: string;
  brand_name?: string;
  product_image?: string | string[];
  awin_image_url?: string;
  merchant_thumb_url?: string;
  search_price?: number;
  cheapest_offer?: number;
};
type Homepage = { title: string; category: string; seasons: string[]; products: HomeProduct[] };
type TodayTx = { transactionId: string; merchantName?: string; saleAmount?: number; commission?: number; status?: string; transactionDate?: string | null };
type Overview = {
  products: number;
  sales: { total: number; amount: number; profit: number };
  today?: Totals & { transactions?: TodayTx[] };
};

const RANGES: { id: Preset; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'last7', label: 'Last 7 days' },
  { id: 'last28', label: 'Last 28 days' },
  { id: 'custom', label: 'Custom' },
];

const SEASON_META: Record<string, { icon: typeof Sun; blurb: string }> = {
  Sommerreifen: { icon: Sun, blurb: 'Summer tyres on the homepage hero and the featured list.' },
  Winterreifen: { icon: Snowflake, blurb: 'Winter tyres on the homepage hero and the featured list.' },
  Ganzjahresreifen: { icon: CloudSun, blurb: 'All-season tyres on the homepage hero and the featured list.' },
};

const eur = (n?: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Number(n) || 0);
const num = (n?: number) => new Intl.NumberFormat('de-DE').format(Number(n) || 0);
const when = (d?: string | null) => (d ? new Date(d).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) : '–');

function b64ToUint8(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = window.atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

function picture(product: HomeProduct) {
  const raw = Array.isArray(product.product_image) ? product.product_image.find(Boolean) : product.product_image;
  return raw || product.awin_image_url || product.merchant_thumb_url || '';
}

let saleAudio: AudioContext | null = null;

function unlockAudio() {
  const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  if (!saleAudio) saleAudio = new Ctx();
  if (saleAudio.state === 'suspended') saleAudio.resume().catch(() => undefined);
}

function playChime() {
  unlockAudio();
  if (!saleAudio) return;
  const now = saleAudio.currentTime;
  [880, 1318].forEach((freq, index) => {
    const osc = saleAudio!.createOscillator();
    const gain = saleAudio!.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const start = now + index * 0.11;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.2, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.42);
    osc.connect(gain).connect(saleAudio!.destination);
    osc.start(start);
    osc.stop(start + 0.46);
  });
}

export default function OpsDesk() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [preset, setPreset] = useState<Preset>('last7');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [series, setSeries] = useState<Series | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [jobs, setJobs] = useState<Jobs | null>(null);
  const [home, setHome] = useState<Homepage | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftSeason, setDraftSeason] = useState('Winterreifen');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState('');
  const [pushOn, setPushOn] = useState(false);
  const [devices, setDevices] = useState(0);
  const [live, setLive] = useState(false);
  const homeHydrated = useRef(false);
  const loadRef = useRef<() => Promise<void>>(async () => undefined);
  const heardRef = useRef(new Set<string>());

  useEffect(() => {
    try { setToken(localStorage.getItem(TOKEN_KEY) || ''); } catch { /* private mode */ }
  }, []);

  useEffect(() => {
    if (!token || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.getRegistration('/').then(async (reg) => {
      const sub = await reg?.pushManager.getSubscription();
      setPushOn(Boolean(sub) && Notification.permission === 'granted');
    }).catch(() => undefined);
  }, [token]);

  const call = useCallback(async (path: string, init?: RequestInit) => {
    const res = await fetch(`${API}/api/ops${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(init?.headers || {}),
      },
    });
    if (res.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      setToken('');
      throw new Error('Session expired. Sign in again.');
    }
    return res;
  }, [token]);

  const rangeQuery = useCallback(() => {
    const q = new URLSearchParams({ preset });
    if (preset === 'custom') {
      q.set('from', from);
      q.set('to', to);
    }
    return q.toString();
  }, [preset, from, to]);

  const load = useCallback(async () => {
    if (!token) return;
    if (preset === 'custom' && (!from || !to)) return;
    const qs = rangeQuery();
    const [o, s, t, j, h, p] = await Promise.all([
      call('/overview'),
      call(`/series?${qs}`),
      call(`/transactions?${qs}&limit=100`),
      call('/jobs'),
      call('/homepage'),
      call('/push/status'),
    ]);
    if (o.ok) setOverview(await o.json());
    if (s.ok) setSeries(await s.json());
    else setNote((await s.json().catch(() => ({}))).error || 'Could not load this range.');
    if (t.ok) setTxs((await t.json()).transactions || []);
    if (j.ok) setJobs(await j.json());
    if (h.ok) {
      const body: Homepage = await h.json();
      setHome(body);
      if (!homeHydrated.current) {
        homeHydrated.current = true;
        setDraftTitle(body.title || '');
        setDraftSeason(body.category || 'Winterreifen');
      }
    }
    if (p.ok) setDevices((await p.json()).devices || 0);
  }, [token, call, preset, from, to, rangeQuery]);

  useEffect(() => {
    loadRef.current = () => load();
  }, [load]);

  useEffect(() => {
    load().catch((e) => setNote(e.message));
    const id = setInterval(() => { load().catch(() => undefined); }, 30000);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => {
    if (!token) return;
    let stop = false;
    const controller = new AbortController();
    const announce = (event: { transactionId?: string; vendor?: string; commission?: string; amount?: string; body?: string; title?: string }) => {
      const id = event.transactionId || '';
      if (id) {
        if (heardRef.current.has(id)) return;
        heardRef.current.add(id);
      }
      playChime();
      const vendor = event.vendor || 'Shop';
      setNote(event.commission
        ? `${vendor} · commission ${event.commission}${event.amount ? ` · sale ${event.amount}` : ''}`
        : (event.body || event.title || 'New sale'));
      loadRef.current().catch(() => undefined);
    };
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.type !== 'rx-push') return;
      if (data.kind && !String(data.kind).startsWith('admin_')) return;
      announce(data);
    };
    navigator.serviceWorker?.addEventListener('message', onMessage);
    const connect = async () => {
      while (!stop) {
        try {
          const res = await fetch(`${API}/api/ops/stream`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          });
          if (res.status === 401 || !res.ok || !res.body) {
            setLive(false);
            if (res.status === 401) return;
            throw new Error('stream');
          }
          setLive(true);
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buf = '';
          while (!stop) {
            const chunk = await reader.read();
            if (chunk.done) break;
            buf += decoder.decode(chunk.value, { stream: true });
            const parts = buf.split('\n\n');
            buf = parts.pop() || '';
            for (const part of parts) {
              const line = part.split('\n').find((row) => row.startsWith('data:'));
              if (!line) continue;
              const event = JSON.parse(line.slice(5).trim());
              if (event.type === 'sale' || event.type === 'status') announce(event);
            }
          }
        } catch {
          if (stop) return;
        }
        setLive(false);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    };
    connect();
    return () => {
      stop = true;
      controller.abort();
      navigator.serviceWorker?.removeEventListener('message', onMessage);
    };
  }, [token]);

  async function login(e: FormEvent) {
    e.preventDefault();
    setNote('');
    const res = await fetch(`${API}/api/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.token) {
      setNote(body.error || 'Login failed');
      return;
    }
    localStorage.setItem(TOKEN_KEY, body.token);
    setToken(body.token);
    setPassword('');
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setOverview(null);
    setSeries(null);
  }

  async function run(path: string, label: string) {
    setBusy(label);
    setNote('');
    try {
      const res = await call(path, { method: 'POST' });
      const body = await res.json().catch(() => ({}));
      if (res.status === 409) setNote('That job is already running.');
      else if (!res.ok) setNote(body.error || 'Could not start the job.');
      else setNote(`${label} started. It keeps running on the server.`);
      await load();
    } catch (err) {
      setNote(err instanceof Error ? err.message : 'Could not start the job.');
    } finally {
      setBusy('');
    }
  }

  async function enablePush() {
    unlockAudio();
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setNote('This browser cannot receive push notifications.');
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      setNote('Notifications are blocked. Allow them for this site in the browser settings, then try again.');
      return;
    }
    const keyRes = await fetch(`${API}/api/admin-alerts/vapid-public-key`, { cache: 'no-store' });
    if (!keyRes.ok) {
      setNote('Push is not configured on the server. VAPID keys are missing.');
      return;
    }
    const { publicKey } = await keyRes.json();
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    await navigator.serviceWorker.ready;
    const appKey = b64ToUint8(publicKey);
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      try {
        sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: appKey });
      } catch {
        const old = await reg.pushManager.getSubscription();
        if (old) await old.unsubscribe();
        sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: appKey });
      }
    }
    const saved = await call('/push/subscribe', {
      method: 'POST',
      body: JSON.stringify({ subscription: sub.toJSON(), label: 'temp admin' }),
    });
    if (!saved.ok) {
      setNote('Could not save this device for notifications.');
      return;
    }
    const test = await call('/push/test', { method: 'POST' });
    const body = await test.json().catch(() => ({}));
    setPushOn(true);
    setDevices(body.total || devices);
    if (body.reason === 'no_vapid') setNote('This browser is saved, but the server has no VAPID keys, so nothing can be delivered.');
    else if (!body.sent) setNote('This browser is saved, but the test notification was not delivered. Allow notifications for reifexa.de and send the test again.');
    else setNote(`Test notification sent to ${body.sent} device${body.sent === 1 ? '' : 's'}. New sales use the same path.`);
  }

  async function sendTest() {
    unlockAudio();
    setNote('');
    const test = await call('/push/test', { method: 'POST' });
    const body = await test.json().catch(() => ({}));
    if (body.reason === 'no_vapid') setNote('The server has no VAPID keys, so push cannot be delivered.');
    else if (!body.sent) setNote(body.total ? 'The test was not delivered. Allow notifications and try again.' : 'No device is subscribed yet. Allow notifications first.');
    else setNote(`Test notification sent to ${body.sent} device${body.sent === 1 ? '' : 's'}.`);
  }

  async function saveHomepage(e: FormEvent) {
    e.preventDefault();
    setBusy('Homepage');
    setNote('');
    try {
      const res = await call('/homepage', {
        method: 'PUT',
        body: JSON.stringify({ category: draftSeason, section_title: draftTitle }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setNote(body.error || 'Could not update the homepage.');
        return;
      }
      setHome(body);
      setNote(`${body.category} is now the homepage season. The public homepage picks it up within a minute.`);
    } catch (err) {
      setNote(err instanceof Error ? err.message : 'Could not update the homepage.');
    } finally {
      setBusy('');
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-[#0E1118] px-4 py-16 text-[#16171A]">
        <form onSubmit={login} className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,.7)]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3A64F6]">Reifexa</p>
          <h1 className="mt-2 text-3xl font-semibold">Ops desk</h1>
          <p className="mt-2 text-sm text-[#5C6370]">Temporary sign-in until the full admin is deployed.</p>
          <div className="mt-6 flex flex-col gap-3">
            <input className="rounded-xl bg-[#F4F6FB] px-3 py-3 text-sm outline-none ring-1 ring-[#E4E8F0] focus:ring-[#3A64F6]" type="email" autoComplete="username" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="rounded-xl bg-[#F4F6FB] px-3 py-3 text-sm outline-none ring-1 ring-[#E4E8F0] focus:ring-[#3A64F6]" type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="rounded-xl bg-[#3A64F6] py-3 font-semibold text-white" type="submit">Sign in</button>
            {note ? <p className="text-sm text-[#B42318]">{note}</p> : null}
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F5FA] px-4 py-6 text-[#16171A] md:px-8" onPointerDown={unlockAudio}>
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[#12141C] px-5 py-4 text-white">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9AA6FF]">Reifexa ops</p>
            <h1 className="text-xl font-semibold">Desk <span className={`ml-2 text-xs font-semibold ${live ? 'text-[#3DDC97]' : 'text-white/40'}`}>{live ? 'Live' : 'Connecting'}</span></h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={enablePush} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold">
              <Bell size={16} />
              {pushOn ? `Notifications on · ${devices}` : 'Allow notifications'}
            </button>
            {pushOn ? (
              <button type="button" onClick={sendTest} className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#12141C]">Send test</button>
            ) : null}
            <button type="button" onClick={logout} className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-white/70">
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </header>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm">
            {(['overview', 'transactions', 'homepage', 'jobs'] as const).map((id) => (
              <button key={id} type="button" onClick={() => setTab(id)} className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${tab === id ? 'bg-[#12141C] text-white' : 'text-[#3A4050]'}`}>
                {id}
              </button>
            ))}
          </div>
          {tab !== 'homepage' && tab !== 'jobs' ? (
            <RangeBar preset={preset} from={from} to={to} onPreset={setPreset} onFrom={setFrom} onTo={setTo} />
          ) : null}
        </div>
        {note ? <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">{note}</p> : null}

        {(tab === 'overview' || tab === 'transactions') && overview?.today ? <TodayStrip today={overview.today} /> : null}

        {tab === 'overview' && series && (
          <section className="mt-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Kpi label="Views" value={num(series.totals.views)} current={series.totals.views} previous={series.previous.views} />
              <Kpi label="Clicks" value={num(series.totals.clicks)} current={series.totals.clicks} previous={series.previous.clicks} />
              <Kpi label="Sales" value={num(series.totals.sales)} current={series.totals.sales} previous={series.previous.sales} hint={eur(series.totals.amount)} />
              <Kpi label="Turnover" value={eur(series.totals.amount)} current={series.totals.amount} previous={series.previous.amount} />
              <Kpi label="Commission" value={eur(series.totals.profit)} current={series.totals.profit} previous={series.previous.profit} />
              <Kpi label="Catalog" value={num(overview?.products)} hint={`${num(overview?.sales.total)} sales stored · ${eur(overview?.sales.profit)} commission`} />
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Card title="Views and clicks" text={series.grain === 'hour' ? 'Each point is one hour, Europe/Berlin.' : 'Each point is one day, Europe/Berlin.'}>
                <AreaChart
                  points={series.points}
                  format={num}
                  series={[
                    { key: 'views', label: 'Views', color: '#3A64F6' },
                    { key: 'clicks', label: 'Clicks', color: '#12B981' },
                  ]}
                />
              </Card>
              <Card title="Turnover and commission" text="Counted sales only. Declined and deleted transactions stay out.">
                <AreaChart
                  points={series.points}
                  format={eur}
                  series={[
                    { key: 'amount', label: 'Turnover', color: '#3A64F6' },
                    { key: 'profit', label: 'Commission', color: '#F5A524' },
                  ]}
                />
              </Card>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <Card title="Commission by vendor">
                <HBars rows={series.vendors.map((v) => ({ label: v.vendor, value: v.commission, hint: `${num(v.sales)} · ${eur(v.commission)}` }))} />
              </Card>
              <Card title="Most clicked products">
                <HBars rows={series.topClicks.map((row) => ({ label: row.name, value: row.clicks, hint: num(row.clicks) }))} />
              </Card>
              <Card title="Most viewed pages">
                <HBars rows={series.topPages.map((row) => ({ label: row.page, value: row.views, hint: num(row.views) }))} />
              </Card>
            </div>
          </section>
        )}

        {tab === 'transactions' && series && (
          <section className="mt-5">
            <div className="grid gap-4 lg:grid-cols-[1.4fr_.8fr]">
              <Card title="Sales over time" text="Sale count and commission for the selected range.">
                <AreaChart
                  points={series.points}
                  format={num}
                  series={[
                    { key: 'sales', label: 'Sales', color: '#3A64F6', format: num },
                    { key: 'profit', label: 'Commission', color: '#F5A524', format: eur },
                  ]}
                />
              </Card>
              <Card title="Status">
                <HBars rows={series.statuses.map((row) => ({ label: row.status, value: row.count, hint: `${num(row.count)} · ${eur(row.amount)}` }))} />
              </Card>
            </div>
            <div className="mt-4 overflow-x-auto rounded-3xl bg-white p-4 shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="text-[#6B7080]">
                  <tr><th className="py-2 font-medium">When</th><th className="font-medium">Vendor</th><th className="font-medium">Status</th><th className="font-medium">Sale</th><th className="font-medium">Commission</th></tr>
                </thead>
                <tbody>
                  {txs.map((t) => (
                    <tr key={t.transactionId} className="border-t border-[#EEF1F6]">
                      <td className="py-2.5 whitespace-nowrap">{when(t.transactionDate)}</td>
                      <td>{t.merchantName || '–'}</td>
                      <td className="capitalize">{t.status || '–'}</td>
                      <td>{eur(t.saleAmount)}</td>
                      <td>{eur(t.commission)}</td>
                    </tr>
                  ))}
                  {!txs.length ? <tr><td className="py-4 text-[#6B7080]" colSpan={5}>No transactions in this range.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === 'homepage' && home && (
          <section className="mt-5">
            <form onSubmit={saveHomepage} className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Homepage season</h2>
              <p className="mt-1 max-w-2xl text-sm text-[#5C6370]">
                This is the same setting as the admin feature-product screen. The hero background and the featured product list both follow the season you save.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {(home.seasons || Object.keys(SEASON_META)).map((season) => {
                  const meta = SEASON_META[season];
                  const Icon = meta?.icon || Sun;
                  const on = draftSeason === season;
                  return (
                    <button
                      key={season}
                      type="button"
                      onClick={() => setDraftSeason(season)}
                      className={`rounded-2xl p-4 text-left ring-1 ${on ? 'bg-[#EEF2FF] ring-[#3A64F6]' : 'bg-[#F7F8FB] ring-transparent'}`}
                    >
                      <Icon size={18} className={on ? 'text-[#3A64F6]' : 'text-[#5C6370]'} />
                      <p className="mt-2 font-semibold">{season}</p>
                      <p className="mt-1 text-xs leading-5 text-[#5C6370]">{meta?.blurb}</p>
                    </button>
                  );
                })}
              </div>
              <label className="mt-5 block text-sm font-semibold">Section title</label>
              <input
                className="mt-2 w-full rounded-xl bg-[#F4F6FB] px-3 py-3 text-sm outline-none ring-1 ring-[#E4E8F0] focus:ring-[#3A64F6]"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                required
              />
              <button type="submit" disabled={busy === 'Homepage'} className="mt-4 rounded-xl bg-[#3A64F6] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                {busy === 'Homepage' ? 'Saving…' : 'Save and update homepage'}
              </button>
            </form>
            <h2 className="mt-6 text-lg font-semibold">Products on the homepage now</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {home.products.map((product) => {
                const src = picture(product);
                const price = product.search_price || product.cheapest_offer;
                return (
                  <a key={product._id} href={product.slug ? `/produkte/${product.slug}` : '/produkte'} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="flex h-28 items-center justify-center bg-[#F4F6FB]">
                      {src ? (
                        // Merchant images come from many hosts, so this preview is not run through the image optimizer.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt="" className="h-24 w-auto object-contain" />
                      ) : null}
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-2 text-sm font-medium">{product.product_name}</p>
                      <p className="mt-1 text-xs text-[#5C6370]">{product.brand_name}</p>
                      <p className="mt-2 text-sm font-semibold">{price ? eur(price) : '–'}</p>
                    </div>
                  </a>
                );
              })}
              {!home.products.length ? <p className="text-sm text-[#6B7080]">No products in this season yet.</p> : null}
            </div>
          </section>
        )}

        {tab === 'jobs' && (
          <section className="mt-5 grid gap-4">
            <JobCard title="Product import" text="Download the AWIN feed again and rewrite the catalog." job={jobs?.import} busy={busy === 'Import'} onRun={() => run('/jobs/import', 'Import')} label="Rerun import" />
            <JobCard title="Feed price update" text="Apply the latest AWIN selling prices onto existing products." job={jobs?.feedPrices} busy={busy === 'Feed prices'} onRun={() => run('/jobs/feed-prices', 'Feed prices')} label="Run price update" />
            <JobCard title="Shop price refresh" text="Open every vendor page and replace the shown price with the live shop price." job={jobs?.shopPrices} busy={busy === 'Shop prices'} onRun={() => run('/jobs/shop-prices', 'Shop prices')} label="Refresh shop prices" />
          </section>
        )}
      </div>
    </main>
  );
}

function TodayStrip({ today }: { today: Totals & { transactions?: TodayTx[] } }) {
  const rows = today.transactions || [];
  return (
    <section className="mt-5 rounded-3xl bg-[#12141C] p-5 text-white">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9AA6FF]">Today</p>
          <h2 className="text-lg font-semibold">Since midnight, Europe/Berlin</h2>
        </div>
        <p className="text-xs text-white/60">Stays here no matter which range is selected below.</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ['Views', num(today.views)],
          ['Clicks', num(today.clicks)],
          ['Sales', num(today.sales)],
          ['Turnover', eur(today.amount)],
          ['Commission', eur(today.profit)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white/10 px-3 py-3 ring-1 ring-white/10">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/55">{label}</p>
            <p className="mt-1 text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      {rows.length ? (
        <ul className="mt-4 divide-y divide-white/10">
          {rows.map((row) => (
            <li key={row.transactionId} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
              <span className="text-white/70">{when(row.transactionDate)}</span>
              <span className="font-medium">{row.merchantName || '–'}</span>
              <span className="capitalize text-white/70">{row.status || '–'}</span>
              <span>{eur(row.saleAmount)}</span>
              <span className="text-[#F5C16C]">{eur(row.commission)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-white/55">No sales recorded today yet.</p>
      )}
    </section>
  );
}

function RangeBar({
  preset, from, to, onPreset, onFrom, onTo,
}: {
  preset: Preset;
  from: string;
  to: string;
  onPreset: (preset: Preset) => void;
  onFrom: (value: string) => void;
  onTo: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-1 rounded-full bg-white p-1 shadow-sm">
        {RANGES.map((range) => (
          <button key={range.id} type="button" onClick={() => onPreset(range.id)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${preset === range.id ? 'bg-[#3A64F6] text-white' : 'text-[#3A4050]'}`}>
            {range.label}
          </button>
        ))}
      </div>
      {preset === 'custom' ? (
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs shadow-sm">
          <input type="date" value={from} onChange={(e) => onFrom(e.target.value)} className="bg-transparent text-[#16171A]" aria-label="From" />
          <span className="text-[#8B90A0]">to</span>
          <input type="date" value={to} onChange={(e) => onTo(e.target.value)} className="bg-transparent text-[#16171A]" aria-label="To" />
          {!from || !to ? <span className="text-[#8B90A0]">Choose both dates</span> : null}
        </div>
      ) : null}
    </div>
  );
}

function Kpi({ label, value, hint, current, previous }: { label: string; value: string; hint?: string; current?: number; previous?: number }) {
  return (
    <article className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7080]">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      {current != null && previous != null ? <Delta current={current} previous={previous} /> : null}
      {hint ? <p className="mt-1 text-sm text-[#6B7080]">{hint}</p> : null}
    </article>
  );
}

function Delta({ current, previous }: { current: number; previous: number }) {
  if (!previous && !current) return <p className="text-xs text-[#8B90A0]">Same as the previous period</p>;
  const pct = previous ? Math.round(((current - previous) / previous) * 100) : 100;
  const up = pct >= 0;
  return <p className={`text-xs font-semibold ${up ? 'text-[#0E9F6E]' : 'text-[#D92D20]'}`}>{up ? '↑' : '↓'} {Math.abs(pct)}% vs the previous period</p>;
}

function Card({ title, text, children }: { title: string; text?: string; children: ReactNode }) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      {text ? <p className="mt-1 text-xs text-[#6B7080]">{text}</p> : null}
      <div className="mt-4">{children}</div>
    </article>
  );
}

function JobCard({ title, text, job, busy, onRun, label }: {
  title: string; text: string; job?: Job; busy: boolean; onRun: () => void; label: string;
}) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 max-w-xl text-sm text-[#5C6370]">{text}</p>
          <p className="mt-2 text-xs text-[#6B7080]">
            {job?.alive ? `Running${job.progress ? ` · ${job.progress}%` : ''}` : 'Idle'}
            {' · last success '}{when(job?.lastSuccess)}
            {job?.lastError ? ` · last error ${job.lastError}` : ''}
          </p>
        </div>
        <button type="button" disabled={busy || job?.alive} onClick={onRun} className="rounded-xl bg-[#12141C] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? 'Starting…' : label}
        </button>
      </div>
    </article>
  );
}
