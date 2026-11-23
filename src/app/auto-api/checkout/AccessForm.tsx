'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

export default function AccessForm({ api, plan, maxIps, termsVersion }: {
  api: string; plan: string; maxIps: number; termsVersion: string;
}) {
  const [status, setStatus] = useState('');
  const [problem, setProblem] = useState('');
  const problems: Record<string, string> = {
    email: 'Bitte eine gültige geschäftliche E-Mail-Adresse eintragen.',
    ips: 'Bitte mindestens eine öffentliche Server-IP eintragen, zum Beispiel 203.0.113.10.',
    private_ip: 'Private Adressen wie 192.168.x.x, 10.x.x.x oder 127.0.0.1 gelten nicht. Die öffentliche IP des Servers, der die API aufruft, muss eingetragen werden.',
    too_many_ips: `Dieser Tarif erlaubt höchstens ${maxIps} Server-IP-Adresse${maxIps === 1 ? '' : 'n'}.`,
    terms: 'Bitte die API-Bedingungen akzeptieren und das Formular erneut senden.',
    plan: 'Der Tarif ist ungültig. Bitte auf der API-Seite einen Tarif wählen.',
  };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim();
    const ips = String(form.get('ips') || '')
      .split(/[\s,;]+/)
      .map(value => value.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, ''))
      .map(value => value.replace(/^(\d{1,3}(?:\.\d{1,3}){3}):\d{1,5}$/, '$1'))
      .filter(Boolean);
    setStatus('sending');
    setProblem('');
    try {
      const response = await fetch(`${api}/api/fitment/access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan, email, ips,
          acceptedTerms: form.get('terms') ? termsVersion : undefined,
        }),
      });
      if (response.ok) {
        setStatus('done');
        return;
      }
      const body = await response.json().catch(() => ({}));
      setProblem(typeof body.field === 'string' ? body.field : '');
      setStatus('error');
    } catch {
      setProblem('');
      setStatus('error');
    }
  }
  if (status === 'done') return <p role="status">Anfrage erhalten. Wir melden uns per E-Mail.</p>;
  return <form onSubmit={submit} className="grid gap-5">
    <label>Geschäftliche E-Mail<input className="block w-full rounded border p-2" type="email" name="email" maxLength={254} required /></label>
    <label>Server-IP-Adressen (max. {maxIps}, je Zeile eine)<textarea className="block w-full rounded border p-2" name="ips" maxLength={300} required /></label>
    <label><input type="checkbox" name="terms" required /> Ich akzeptiere die <Link href="/auto-api/bedingungen" className="underline">API-Bedingungen</Link> und habe die <Link href="/impressum-datenschutz" className="underline">Datenschutzhinweise</Link> gelesen.</label>
    <button className="rounded bg-slate-900 p-3 text-white disabled:opacity-50" disabled={status === 'sending'}>Unverbindlich anfragen</button>
    {status === 'error' && <p role="alert">{problems[problem] || 'Anfrage fehlgeschlagen. Bitte prüfen Sie E-Mail, Anzahl und Format der IP-Adressen und versuchen Sie es erneut.'}</p>}
  </form>;
}
