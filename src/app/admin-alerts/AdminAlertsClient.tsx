'use client';

/**
 * Owner-only page: turn on push notifications for AWIN sales + shop click-outs
 * on THIS device, send a test, and compare our clicks against AWIN sales.
 * Protected by ADMIN_ALERT_KEY (entered once, kept in this browser).
 */
import { useCallback, useEffect, useState } from 'react';

const API = (process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de').replace(/\/$/, '');
const KEY_STORAGE = 'rx_admin_alert_key';

type VendorRow = {
  vendor: string;
  merchantId: string;
  clicks: number;
  nonAwinClicks: number;
  sales: number;
  lastClick: string;
};
type Tx = {
  transactionId: string;
  merchantName?: string;
  merchantId?: string;
  saleAmount?: number;
  commission?: number;
  currency?: string;
  status?: string;
  clickRef?: string;
  transactionDate?: string;
  createdAt?: string;
  source?: string;
};
type Summary = {
  days: number;
  devices: number;
  totals: { clicks: number; nonAwinClicks: number; sales: number; commission: number };
  vendors: VendorRow[];
  transactions: Tx[];
  pollerConfigured: boolean;
  webhookConfigured: boolean;
};

function b64ToUint8(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = window.atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, c => c.charCodeAt(0));
}
const eur = (n?: number, c = 'EUR') =>
  Number.isFinite(Number(n))
    ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: c || 'EUR' }).format(Number(n))
    : '–';
const when = (d?: string) => (d ? new Date(d).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) : '–');

function readKey() {
  try {
    return localStorage.getItem(KEY_STORAGE) || '';
  } catch {
    return '';
  }
}
function saveKey(k: string) {
  try {
    localStorage.setItem(KEY_STORAGE, k);
  } catch {
    /* private mode */
  }
}

export default function AdminAlertsClient() {
  const [key, setKey] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [label, setLabel] = useState('');
  const [notifyClicks, setNotifyClicks] = useState(true);
  const [status, setStatus] = useState<string>('');
  const [permission, setPermission] = useState<string>('default');
  const [subscribed, setSubscribed] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [days, setDays] = useState(7);
  const supported =
    typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

  useEffect(() => {
    const k = readKey();
    setKey(k);
    setKeyInput(k);
    if (typeof Notification !== 'undefined') setPermission(Notification.permission);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration('/').then(async reg => {
        const sub = await reg?.pushManager.getSubscription();
        setSubscribed(Boolean(sub));
      });
    }
  }, []);

  const authed = useCallback(
    (path: string, init: RequestInit = {}) =>
      fetch(`${API}/api/admin-alerts${path}`, {
        ...init,
        headers: { 'Content-Type': 'application/json', 'x-admin-alert-key': key, ...(init.headers || {}) },
        cache: 'no-store',
      }),
    [key]
  );

  const loadSummary = useCallback(async () => {
    if (!key) return;
    const res = await authed(`/summary?days=${days}`);
    if (res.status === 401) {
      setStatus('Falscher Schlüssel.');
      setSummary(null);
      return;
    }
    if (res.ok) setSummary(await res.json());
  }, [authed, key, days]);

  useEffect(() => {
    loadSummary();
    const t = setInterval(loadSummary, 60000);
    return () => clearInterval(t);
  }, [loadSummary]);

  async function enable() {
    if (!supported) return setStatus('Dieser Browser unterstützt keine Push-Benachrichtigungen.');
    setStatus('Berechtigung wird angefragt…');
    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm !== 'granted') return setStatus('Benachrichtigungen wurden blockiert – in den Browser-Einstellungen erlauben.');

    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    await navigator.serviceWorker.ready;
    const kRes = await fetch(`${API}/api/admin-alerts/vapid-public-key`, { cache: 'no-store' });
    if (!kRes.ok) return setStatus('Server: VAPID-Schlüssel fehlen.');
    const { publicKey } = await kRes.json();

    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToUint8(publicKey) });
    }
    const res = await authed('/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        subscription: sub.toJSON(),
        label: label || navigator.platform || 'Gerät',
        notifySales: true,
        notifyClicks,
      }),
    });
    if (res.status === 401) return setStatus('Falscher Schlüssel.');
    if (!res.ok) return setStatus('Registrierung fehlgeschlagen.');
    setSubscribed(true);
    setStatus('✅ Aktiv. Dieses Gerät bekommt jetzt Alarme.');
    loadSummary();
  }

  async function disable() {
    const reg = await navigator.serviceWorker.getRegistration('/');
    const sub = await reg?.pushManager.getSubscription();
    if (sub) await authed('/unsubscribe', { method: 'POST', body: JSON.stringify({ endpoint: sub.endpoint }) });
    setSubscribed(false);
    setStatus('Alarme auf diesem Gerät deaktiviert.');
    loadSummary();
  }

  async function test() {
    const res = await authed('/test', { method: 'POST' });
    const r = await res.json().catch(() => ({}));
    setStatus(res.ok ? `Test gesendet an ${r.sent ?? 0} von ${r.total ?? 0} Gerät(en).` : 'Test fehlgeschlagen.');
  }

  if (!key) {
    return (
      <section className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold mb-2">Verkaufs-Alarme</h1>
        <p className="text-sm opacity-70 mb-6">Nur für den Seitenbetreiber. Schlüssel = ADMIN_ALERT_KEY vom Server.</p>
        <form
          onSubmit={e => {
            e.preventDefault();
            saveKey(keyInput.trim());
            setKey(keyInput.trim());
          }}
          className="flex gap-2"
        >
          <input
            type="password"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            placeholder="Admin-Schlüssel"
            className="flex-1 border rounded px-3 py-2"
          />
          <button className="bg-black text-white rounded px-4 py-2">Weiter</button>
        </form>
      </section>
    );
  }

  const t = summary?.totals;
  const ratio = t && t.clicks ? ((t.sales / t.clicks) * 100).toFixed(1) : '0.0';

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Verkaufs-Alarme</h1>
          <p className="text-sm opacity-70">Klicks (unser Server) vs. Verkäufe (AWIN) – aktualisiert jede Minute.</p>
        </div>
        <select value={days} onChange={e => setDays(Number(e.target.value))} className="border rounded px-2 py-1">
          {[1, 7, 30, 90].map(d => (
            <option key={d} value={d}>
              Letzte {d} Tag{d > 1 ? 'e' : ''}
            </option>
          ))}
        </select>
      </header>

      {/* Push setup */}
      <div className="border rounded-lg p-5 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${subscribed && permission === 'granted' ? 'bg-green-500' : 'bg-gray-400'}`}
          />
          <strong>{subscribed && permission === 'granted' ? 'Push aktiv auf diesem Gerät' : 'Push aus auf diesem Gerät'}</strong>
          <span className="text-sm opacity-60">· {summary?.devices ?? 0} Gerät(e) gesamt</span>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <input
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Gerätename (z. B. iPhone)"
            className="border rounded px-3 py-2 text-sm"
          />
          <label className="text-sm flex items-center gap-2">
            <input type="checkbox" checked={notifyClicks} onChange={e => setNotifyClicks(e.target.checked)} />
            Auch bei jedem Shop-Klick benachrichtigen
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={enable} className="bg-black text-white rounded px-4 py-2 text-sm">
            {subscribed ? 'Einstellungen speichern' : 'Benachrichtigungen aktivieren'}
          </button>
          <button onClick={test} className="border rounded px-4 py-2 text-sm">
            Test senden
          </button>
          {subscribed && (
            <button onClick={disable} className="border rounded px-4 py-2 text-sm">
              Deaktivieren
            </button>
          )}
          <button
            onClick={() => {
              saveKey('');
              setKey('');
            }}
            className="text-sm underline opacity-60 ml-auto"
          >
            Abmelden
          </button>
        </div>
        {status && <p className="text-sm">{status}</p>}
        {summary && !summary.webhookConfigured && !summary.pollerConfigured && (
          <p className="text-sm text-red-600">
            Weder AWIN-Webhook noch AWIN-API sind eingerichtet – Verkäufe können noch nicht erkannt werden.
          </p>
        )}
      </div>

      {/* Totals */}
      {t && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ['Shop-Klicks', String(t.clicks)],
            ['AWIN-Verkäufe', String(t.sales)],
            ['Klick → Verkauf', `${ratio} %`],
            ['Provision', eur(t.commission)],
          ].map(([l, v]) => (
            <div key={l} className="border rounded-lg p-4">
              <div className="text-xs uppercase tracking-wide opacity-60">{l}</div>
              <div className="text-2xl font-semibold tabular-nums">{v}</div>
            </div>
          ))}
        </div>
      )}
      {t && t.nonAwinClicks > 0 && (
        <p className="text-sm text-red-600">
          ⚠️ {t.nonAwinClicks} Klick(s) gingen auf Links ohne AWIN-Tracking – dafür kann AWIN nie einen Verkauf zählen.
        </p>
      )}

      {/* Per shop */}
      {summary && (
        <div>
          <h2 className="font-semibold mb-2">Pro Shop</h2>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="text-left opacity-60">
                <tr>
                  <th className="p-2">Shop</th>
                  <th className="p-2">AWIN m=</th>
                  <th className="p-2 text-right">Klicks</th>
                  <th className="p-2 text-right">Verkäufe</th>
                  <th className="p-2">Letzter Klick</th>
                  <th className="p-2">Hinweis</th>
                </tr>
              </thead>
              <tbody>
                {summary.vendors.map(v => (
                  <tr key={`${v.vendor}-${v.merchantId}`} className="border-t">
                    <td className="p-2">{v.vendor}</td>
                    <td className="p-2 tabular-nums">{v.merchantId || '–'}</td>
                    <td className="p-2 text-right tabular-nums">{v.clicks}</td>
                    <td className="p-2 text-right tabular-nums">{v.sales}</td>
                    <td className="p-2">{when(v.lastClick)}</td>
                    <td className="p-2">
                      {v.nonAwinClicks > 0
                        ? '⚠️ Link ohne AWIN'
                        : v.clicks >= 30 && v.sales === 0
                          ? 'Viele Klicks, 0 Sales – Shop-Tracking prüfen'
                          : ''}
                    </td>
                  </tr>
                ))}
                {!summary.vendors.length && (
                  <tr>
                    <td className="p-3 opacity-60" colSpan={6}>
                      Noch keine Klicks in diesem Zeitraum.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transactions */}
      {summary && (
        <div>
          <h2 className="font-semibold mb-2">AWIN-Transaktionen</h2>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="text-left opacity-60">
                <tr>
                  <th className="p-2">Datum</th>
                  <th className="p-2">Shop</th>
                  <th className="p-2 text-right">Umsatz</th>
                  <th className="p-2 text-right">Provision</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">clickref</th>
                </tr>
              </thead>
              <tbody>
                {summary.transactions.map(x => (
                  <tr key={x.transactionId} className="border-t">
                    <td className="p-2">{when(x.transactionDate || x.createdAt)}</td>
                    <td className="p-2">{x.merchantName || x.merchantId}</td>
                    <td className="p-2 text-right tabular-nums">{eur(x.saleAmount, x.currency)}</td>
                    <td className="p-2 text-right tabular-nums">{eur(x.commission, x.currency)}</td>
                    <td className="p-2">{x.status || 'neu'}</td>
                    <td className="p-2 font-mono text-xs">{x.clickRef}</td>
                  </tr>
                ))}
                {!summary.transactions.length && (
                  <tr>
                    <td className="p-3 opacity-60" colSpan={6}>
                      AWIN hat in diesem Zeitraum keinen Verkauf gemeldet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
