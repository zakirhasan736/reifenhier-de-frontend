'use client';

import { useState, type FormEvent } from 'react';

type Vehicle = {
  _id: string; make: string; model: string; candidates: string[]; reviewed: boolean; fitments: object[];
};
type Access = { _id: string; email: string; plan: string; status: string; requestedIps: string[] };

export default function FitmentAdmin({ api }: { api: string }) {
  const [token, setToken] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [applications, setApplications] = useState<Access[]>([]);
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [json, setJson] = useState('');
  const [notice, setNotice] = useState('');
  const [issuedKey, setIssuedKey] = useState('');

  async function request(path: string, method = 'GET', body?: unknown) {
    const response = await fetch(`${api}/api/admin/fitment${path}`, {
      method,
      headers: { Authorization: `Bearer ${token.trim()}`, 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Anfrage fehlgeschlagen (HTTP ${response.status})`);
    return response.json();
  }
  async function run(work: () => Promise<void>) {
    setNotice('');
    setIssuedKey('');
    try {
      await work();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Anfrage fehlgeschlagen');
    }
  }
  async function list(page: number) {
    setVehicles(await request(`/vehicles?offset=${page}`));
    setOffset(page);
    setSelected(null);
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    await run(async () => {
      const row = await request(`/vehicles/${selected._id}`, 'PUT', { fitments: JSON.parse(json) });
      setSelected(row);
      setVehicles(current => current.map(vehicle => vehicle._id === row._id ? row : vehicle));
      setNotice('Prüfung gespeichert.');
    });
  }

  return <main className="mx-auto max-w-5xl space-y-5 px-6 py-16">
    <h1 className="text-3xl font-bold">Auto-API Verwaltung</h1>
    <form className="flex flex-wrap items-end gap-4" onSubmit={event => {
      event.preventDefault();
      void run(async () => {
        await list(0);
        setApplications(await request('/access'));
      });
    }}>
      <label>Admin-Token<input className="block rounded border p-2" type="password" autoComplete="off" required value={token} onChange={event => setToken(event.target.value)} /></label>
      <button className="rounded bg-slate-900 px-4 py-2 text-white">Daten laden</button>
    </form>
    {notice && <p role="status">{notice}</p>}
    <h2 className="text-xl font-bold">Fahrzeugdaten prüfen</h2>
    <ul className="grid gap-2 md:grid-cols-3">
      {vehicles.map(vehicle => <li key={vehicle._id}><button className="text-left underline" onClick={() => {
        setSelected(vehicle);
        setJson(JSON.stringify(vehicle.fitments, null, 2));
      }}>{vehicle.make} {vehicle.model} · {vehicle.reviewed ? 'geprüft' : 'offen'}</button></li>)}
    </ul>
    <div className="flex gap-4">
      {offset > 0 && <button onClick={() => void run(() => list(offset - 25))}>Zurück</button>}
      {vehicles.length === 25 && <button onClick={() => void run(() => list(offset + 25))}>Weiter</button>}
    </div>
    {selected && <form onSubmit={save} className="space-y-3 rounded border p-4">
      <h3 className="font-bold">{selected.make} {selected.model}</h3>
      <p>KI-Vorschläge für die Prüfung · {selected.candidates.join(', ') || 'Keine'}</p>
      <label className="block">Belegte Zuordnungen als JSON
        <textarea className="block w-full rounded border p-2 font-mono" rows={10} value={json} onChange={event => setJson(event.target.value)} />
      </label>
      <p>Pro Eintrag size, variant, yearFrom, yearTo, axle (front, rear, both) und source (CoC oder Herstellerquelle mit Nutzungsrecht). Eine leere Liste entfernt die öffentlichen Zuordnungen.</p>
      <button className="rounded bg-slate-900 px-4 py-2 text-white">Prüfung speichern</button>
    </form>}
    <h2 className="text-xl font-bold">Zugangsanfragen</h2>
    {issuedKey && <p className="break-all rounded border p-3" role="status">Neuer Schlüssel, einmalig angezeigt · <code>{issuedKey}</code></p>}
    <ul className="space-y-3">
      {applications.map(application => <li className="rounded border p-3" key={application._id}>
        <p>{application.email} · {application.plan} · {application.status}</p>
        <p>{application.requestedIps.join(', ')}</p>
        {application.status !== 'revoked' && <div className="mt-2 flex gap-4">
          {application.status === 'pending' && <button className="underline" onClick={() => void run(async () => {
            const result = await request(`/access/${application._id}/activate`, 'POST');
            setIssuedKey(result.key);
            setApplications(await request('/access'));
          })}>Nach Prüfung aktivieren</button>}
          <button className="underline" onClick={() => void run(async () => {
            await request(`/access/${application._id}/revoke`, 'POST');
            setApplications(await request('/access'));
          })}>Zugang widerrufen</button>
        </div>}
      </li>)}
    </ul>
  </main>;
}
