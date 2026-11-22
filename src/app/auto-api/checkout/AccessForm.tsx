'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

export default function AccessForm({ api, plan, maxIps, termsVersion }: {
  api: string; plan: string; maxIps: number; termsVersion: string;
}) {
  const [status, setStatus] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus('sending');
    try {
      const response = await fetch(`${api}/api/fitment/access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan, email: form.get('email'),
          ips: String(form.get('ips')).split(/[\s,]+/).filter(Boolean),
          acceptedTerms: form.get('terms') ? termsVersion : undefined,
        }),
      });
      setStatus(response.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }
  if (status === 'done') return <p role="status">Anfrage erhalten. Wir melden uns per E-Mail.</p>;
  return <form onSubmit={submit} className="grid gap-5">
    <label>Geschäftliche E-Mail<input className="block w-full rounded border p-2" type="email" name="email" maxLength={254} required /></label>
    <label>Server-IP-Adressen (max. {maxIps}, je Zeile eine)<textarea className="block w-full rounded border p-2" name="ips" maxLength={300} required /></label>
    <label><input type="checkbox" name="terms" required /> Ich akzeptiere die <Link href="/auto-api/bedingungen" className="underline">API-Bedingungen</Link> und habe die <Link href="/impressum-datenschutz" className="underline">Datenschutzhinweise</Link> gelesen.</label>
    <button className="rounded bg-slate-900 p-3 text-white disabled:opacity-50" disabled={status === 'sending'}>Unverbindlich anfragen</button>
    {status === 'error' && <p role="alert">Anfrage fehlgeschlagen. Bitte prüfen Sie E-Mail, Anzahl und Format der IP-Adressen und versuchen Sie es erneut.</p>}
  </form>;
}
