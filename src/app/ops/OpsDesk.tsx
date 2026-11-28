'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';

const API = (process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de').replace(/\/$/, '');
const TOKEN_KEY = 'rx_ops_token';

type Weekday = { label: string; date: string; clicks: number };
type Vendor = { vendor: string; sales: number; saleAmount: number; commission: number };
type Money = { sales: number; amount: number; profit: number };
type Overview = {
  generatedAt: string;
  products: number;
  lastMonth: string;
  clicks: { yesterday: number; last7: number; last28: number; lastMonth: number; weekdays: Weekday[] };
  views: { yesterday: number; last7: number; last28: number; lastMonth: number };
  sales: { total: number; amount: number; profit: number; yesterday: Money; last7: Money; last28: Money; lastMonth: Money };
  vendors: Vendor[];
};
type Tx = {
  transactionId: string;
  merchantName?: string;
  saleAmount?: number;
  commission?: number;
  currency?: string;
  status?: string;
  transactionDate?: string;
  clickRef?: string;
};
type Job = {
  running: boolean;
  alive: boolean;
  lastStarted?: string | null;
  lastSuccess?: string | null;
  lastError?: string;
  progress?: number;
};
type Jobs = { import: Job; feedPrices: Job; shopPrices: Job };

const eur = (n?: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Number(n) || 0);
const num = (n?: number) => new Intl.NumberFormat('de-DE').format(Number(n) || 0);
const when = (d?: string | null) => (d ? new Date(d).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) : '–');

function b64ToUint8(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = window.atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export default function OpsDesk() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'overview' | 'transactions' | 'jobs'>('overview');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [jobs, setJobs] = useState<Jobs | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState('');
  const [pushOn, setPushOn] = useState(false);

  useEffect(() => {
    try { setToken(localStorage.getItem(TOKEN_KEY) || ''); } catch { /* private mode */ }
  }, []);

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

  const load = useCallback(async () => {
    if (!token) return;
    const [o, t, j] = await Promise.all([
      call('/overview'),
      call('/transactions?limit=80'),
      call('/jobs'),
    ]);
    if (o.ok) setOverview(await o.json());
    if (t.ok) setTxs((await t.json()).transactions || []);
    if (j.ok) setJobs(await j.json());
  }, [token, call]);

  useEffect(() => {
    load().catch((e) => setNote(e.message));
    const id = setInterval(() => { load().catch(() => undefined); }, 30000);
    return () => clearInterval(id);
  }, [load]);

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
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setNote('This browser cannot receive push notifications.');
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      setNote('Notifications were blocked. Allow them in the browser settings.');
      return;
    }
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    await navigator.serviceWorker.ready;
    const keyRes = await fetch(`${API}/api/admin-alerts/vapid-public-key`, { cache: 'no-store' });
    if (!keyRes.ok) {
      setNote('Push is not configured on the server (VAPID keys).');
      return;
    }
    const { publicKey } = await keyRes.json();
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToUint8(publicKey) });
    }
    const res = await call('/push/subscribe', {
      method: 'POST',
      body: JSON.stringify({ subscription: sub.toJSON(), label: 'temp admin' }),
    });
    if (!res.ok) {
      setNote('Could not save this device for notifications.');
      return;
    }
    setPushOn(true);
    setNote('Notifications are on for this browser. New sales and status changes will ping you.');
  }

  if (!token) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-semibold text-[#16171A]">Ops desk</h1>
        <p className="mt-2 text-sm text-[#5B5D63]">Temporary sign-in until the full admin is deployed.</p>
        <form onSubmit={login} className="mt-6 flex flex-col gap-3">
          <input className="rounded-lg border border-[#E9ECF3] px-3 py-2" type="email" autoComplete="username" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="rounded-lg border border-[#E9ECF3] px-3 py-2" type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="rounded-lg bg-primary-100 py-2 font-semibold text-white" type="submit">Sign in</button>
          {note ? <p className="text-sm text-[#B42318]">{note}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[#16171A]">Ops desk</h1>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={enablePush} className="rounded-lg border border-[#DCE3FB] px-3 py-2 text-sm font-semibold text-primary-100">
            {pushOn ? 'Notifications on' : 'Allow sale notifications'}
          </button>
          <button type="button" onClick={logout} className="rounded-lg px-3 py-2 text-sm text-[#5B5D63]">Sign out</button>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {(['overview', 'transactions', 'jobs'] as const).map((id) => (
          <button key={id} type="button" onClick={() => setTab(id)} className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${tab === id ? 'bg-primary-100 text-white' : 'bg-[#F2F4F8] text-[#16171A]'}`}>
            {id}
          </button>
        ))}
      </div>
      {note ? <p className="mt-4 text-sm text-[#16171A]">{note}</p> : null}

      {tab === 'overview' && overview && (
        <section className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Products" value={num(overview.products)} />
            <Stat label="Sales" value={num(overview.sales.total)} hint={eur(overview.sales.amount)} />
            <Stat label="Profit (commission)" value={eur(overview.sales.profit)} />
            <Stat label="Views, last 28 days" value={num(overview.views.last28)} />
          </div>
          <h2 className="mt-8 text-lg font-semibold">Clicks</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Yesterday" value={num(overview.clicks.yesterday)} hint={`${num(overview.views.yesterday)} views`} />
            <Stat label="Last 7 days" value={num(overview.clicks.last7)} hint={`${num(overview.views.last7)} views`} />
            <Stat label="Last 28 days" value={num(overview.clicks.last28)} hint={`${num(overview.views.last28)} views`} />
            <Stat label={`Last month ${overview.lastMonth}`} value={num(overview.clicks.lastMonth)} hint={`${num(overview.views.lastMonth)} views`} />
          </div>
          <ul className="mt-4 grid grid-cols-7 gap-2">
            {overview.clicks.weekdays.map((d) => (
              <li key={d.date} className="rounded-xl bg-[#F7F8FB] px-2 py-3 text-center">
                <p className="text-xs text-[#6B6E76]">{d.label}</p>
                <p className="mt-1 text-lg font-semibold">{num(d.clicks)}</p>
                <p className="text-[11px] text-[#6B6E76]">{d.date.slice(5)}</p>
              </li>
            ))}
          </ul>
          <h2 className="mt-8 text-lg font-semibold">Sales and profit</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[#6B6E76]">
                <tr><th className="py-2">Period</th><th>Sales</th><th>Turnover</th><th>Commission</th></tr>
              </thead>
              <tbody>
                <MoneyRow label="Yesterday" row={overview.sales.yesterday} />
                <MoneyRow label="Last 7 days" row={overview.sales.last7} />
                <MoneyRow label="Last 28 days" row={overview.sales.last28} />
                <MoneyRow label={`Last month ${overview.lastMonth}`} row={overview.sales.lastMonth} />
                <MoneyRow label="All stored" row={{ sales: overview.sales.total, amount: overview.sales.amount, profit: overview.sales.profit }} />
              </tbody>
            </table>
          </div>
          <h2 className="mt-8 text-lg font-semibold">Commission and sales by vendor</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[#6B6E76]"><tr><th className="py-2">Vendor</th><th>Sales</th><th>Turnover</th><th>Commission</th></tr></thead>
              <tbody>
                {overview.vendors.map((v) => (
                  <tr key={v.vendor} className="border-t border-[#E9ECF3]">
                    <td className="py-2">{v.vendor}</td>
                    <td>{num(v.sales)}</td>
                    <td>{eur(v.saleAmount)}</td>
                    <td>{eur(v.commission)}</td>
                  </tr>
                ))}
                {!overview.vendors.length ? <tr><td className="py-3 text-[#6B6E76]" colSpan={4}>No sales stored yet.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'transactions' && (
        <section className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[#6B6E76]">
              <tr><th className="py-2">When</th><th>Vendor</th><th>Status</th><th>Sale</th><th>Commission</th><th>Id</th></tr>
            </thead>
            <tbody>
              {txs.map((t) => (
                <tr key={t.transactionId} className="border-t border-[#E9ECF3]">
                  <td className="py-2 whitespace-nowrap">{when(t.transactionDate)}</td>
                  <td>{t.merchantName || '–'}</td>
                  <td className="capitalize">{t.status || '–'}</td>
                  <td>{eur(t.saleAmount)}</td>
                  <td>{eur(t.commission)}</td>
                  <td className="text-[#6B6E76]">{t.transactionId}</td>
                </tr>
              ))}
              {!txs.length ? <tr><td className="py-3 text-[#6B6E76]" colSpan={6}>No transactions stored yet.</td></tr> : null}
            </tbody>
          </table>
        </section>
      )}

      {tab === 'jobs' && (
        <section className="mt-6 grid gap-4">
          <JobCard
            title="Product import"
            text="Download the AWIN feed again and rewrite the catalog."
            job={jobs?.import}
            busy={busy === 'Import'}
            onRun={() => run('/jobs/import', 'Import')}
            label="Rerun import"
          />
          <JobCard
            title="Feed price update"
            text="Apply the latest AWIN selling prices onto existing products."
            job={jobs?.feedPrices}
            busy={busy === 'Feed prices'}
            onRun={() => run('/jobs/feed-prices', 'Feed prices')}
            label="Run price update"
          />
          <JobCard
            title="Shop price refresh"
            text="Open every vendor page and replace the shown price with the live shop price."
            job={jobs?.shopPrices}
            busy={busy === 'Shop prices'}
            onRun={() => run('/jobs/shop-prices', 'Shop prices')}
            label="Refresh shop prices"
          />
        </section>
      )}
    </main>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-[#E9ECF3] bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6B6E76]">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-[#16171A]">{value}</p>
      {hint ? <p className="text-sm text-[#6B6E76]">{hint}</p> : null}
    </div>
  );
}

function MoneyRow({ label, row }: { label: string; row: Money }) {
  return (
    <tr className="border-t border-[#E9ECF3]">
      <td className="py-2">{label}</td>
      <td>{num(row.sales)}</td>
      <td>{eur(row.amount)}</td>
      <td>{eur(row.profit)}</td>
    </tr>
  );
}

function JobCard({ title, text, job, busy, onRun, label }: {
  title: string; text: string; job?: Job; busy: boolean; onRun: () => void; label: string;
}) {
  return (
    <article className="rounded-2xl border border-[#E9ECF3] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-[#5B5D63]">{text}</p>
          <p className="mt-2 text-xs text-[#6B6E76]">
            {job?.alive ? `Running${job.progress ? ` · ${job.progress}%` : ''}` : 'Idle'}
            {' · last success '}{when(job?.lastSuccess)}
            {job?.lastError ? ` · last error ${job.lastError}` : ''}
          </p>
        </div>
        <button type="button" disabled={busy || job?.alive} onClick={onRun} className="rounded-lg bg-primary-100 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? 'Starting…' : label}
        </button>
      </div>
    </article>
  );
}
