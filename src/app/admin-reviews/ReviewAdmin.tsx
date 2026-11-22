'use client';

import { useState, type FormEvent } from 'react';

const api = process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de';
type Review = { _id: string; kind: 'bug' | 'satisfaction'; rating: number; message: string; createdAt: string; published: boolean };

export default function ReviewAdmin() {
  const [items, setItems] = useState<Review[]>([]);
  const [token, setToken] = useState('');
  const [offset, setOffset] = useState(0);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function request(path: string, options?: RequestInit) {
    const response = await fetch(`${api}/api/admin/reviews${path}`, {
      ...options, headers: { Authorization: `Bearer ${token.trim()}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setNotice('');
    try { await action(); }
    catch { setNotice('Aktion fehlgeschlagen. Bitte prüfen Sie den Admin-Token und versuchen Sie es erneut.'); }
    finally { setBusy(false); }
  }

  function load(page: number) {
    return run(async () => {
      setItems(await request(`?offset=${page}`));
      setOffset(page);
    });
  }

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void load(0);
  }

  return <main className="mx-auto max-w-4xl space-y-5 px-6 py-16">
    <h1 className="text-3xl font-bold">Feedback verwalten</h1>
    <form className="flex flex-wrap items-end gap-3" onSubmit={login}>
      <label>Admin-Token<input className="block rounded border p-2" type="password" required autoComplete="off" value={token} onChange={event => setToken(event.target.value)} /></label>
      <button disabled={busy} className="rounded bg-primary-100 px-4 py-2 text-white">Feedback laden</button>
    </form>
    {notice && <p role="alert">{notice}</p>}
    <ul className="space-y-3">
      {items.map(item => <li key={item._id} className="space-y-2 rounded-xl border p-4">
        <p className="font-semibold">{item.kind === 'bug' ? 'Fehler' : 'Zufriedenheit'} · {item.rating}/5 · {new Date(item.createdAt).toLocaleDateString('de-DE')}</p>
        <p className="whitespace-pre-wrap break-words">{item.message}</p>
        {item.kind === 'satisfaction' && <button disabled={busy} className="text-primary-100 underline" type="button" onClick={() => void run(async () => {
          const updated = await request(`/${item._id}`, { method: 'PATCH', body: JSON.stringify({ published: !item.published }) });
          setItems(rows => rows.map(row => row._id === item._id ? updated : row));
        })}>{item.published ? 'Aus Gesamtwertung entfernen' : 'Für Gesamtwertung freigeben'}</button>}
      </li>)}
    </ul>
    <div className="flex gap-4">
      {offset > 0 && <button disabled={busy} onClick={() => void load(offset - 50)}>Zurück</button>}
      {items.length === 50 && <button disabled={busy} onClick={() => void load(offset + 50)}>Weiter</button>}
    </div>
  </main>;
}
