'use client';

import Link from 'next/link';
import { useMemo, useState, type FormEvent } from 'react';
import { CheckCircle2, Info, Loader2, Lock, Server } from 'lucide-react';
import { eur, modelsLabel, PLAN_IDS, type PlanCatalog, type PlanId } from '@/libs/autoApi';

const PROBLEMS: Record<string, string> = {
  email: 'Bitte eine gültige geschäftliche E-Mail-Adresse eintragen.',
  name: 'Bitte Ihren Namen eintragen.',
  company: 'Für Bezahltarife benötigen wir den Firmennamen (Rechnungsempfänger).',
  address: 'Bitte die vollständige Rechnungsadresse eintragen (Straße, PLZ, Ort).',
  ips: 'Bitte mindestens eine öffentliche Server-IP eintragen, zum Beispiel 203.0.113.10.',
  private_ip: 'Private Adressen wie 192.168.x.x, 10.x.x.x oder 127.0.0.1 gelten nicht. Bitte die öffentliche IP des Servers eintragen, der die API aufruft.',
  terms: 'Bitte die Bedingungen akzeptieren und das Formular erneut senden.',
  plan: 'Der Tarif ist ungültig. Bitte einen Tarif wählen.',
};

const input =
  '!border-0 mt-1.5 block w-full rounded-[12px] bg-white px-3.5 py-2.5 text-[15px] text-[#16171A] ring-1 ring-[#DDE2EE] placeholder:text-[#9AA1B2] focus:outline-none focus:ring-2 focus:ring-[#3A64F6]';
const label = 'block text-[13.5px] font-medium text-[#2B3040]';

export default function AccessForm({
  api,
  catalog,
  initialPlan,
  initialBilling,
}: {
  api: string;
  catalog: PlanCatalog;
  initialPlan: PlanId;
  initialBilling: 'monthly' | 'yearly';
}) {
  const [plan, setPlan] = useState<PlanId>(initialPlan);
  const [billing, setBilling] = useState(initialBilling);
  const [status, setStatus] = useState<'' | 'sending' | 'done' | 'error'>('');
  const [problem, setProblem] = useState('');
  const [ipText, setIpText] = useState('');
  const p = catalog.plans[plan];
  const paid = p.price > 0;
  const ips = useMemo(
    () =>
      ipText
        .split(/[\s,;]+/)
        .map(v => v.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '').replace(/^(\d{1,3}(?:\.\d{1,3}){3}):\d{1,5}$/, '$1'))
        .filter(Boolean),
    [ipText]
  );
  const price = billing === 'yearly' ? p.priceYearly : p.price;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const v = (k: string) => String(f.get(k) || '').trim();
    if (ips.length > p.ips) {
      setProblem('too_many_ips');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setProblem('');
    try {
      const r = await fetch(`${api}/api/fitment/access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan, billing, ips,
          email: v('email'), name: v('name'), company: v('company'), street: v('street'), zip: v('zip'), city: v('city'),
          country: v('country'), vatId: v('vatId'), website: v('website'), useCase: v('useCase'),
          acceptedTerms: f.get('terms') ? catalog.termsVersion : undefined,
        }),
      });
      if (r.ok) {
        setStatus('done');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const body = await r.json().catch(() => ({}));
      setProblem(typeof body.field === 'string' ? body.field : '');
      setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="mx-auto max-w-xl rounded-[24px] bg-white p-8 text-center ring-1 ring-[#E4E7F0] shadow-[0_12px_40px_rgba(16,24,40,0.08)]" role="status">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F7EE]">
          <CheckCircle2 size={34} color="#16A34A" />
        </span>
        <h2 className="mt-4 text-[24px] font-bold text-[#16171A]">Bestellung erhalten</h2>
        <p className="mt-3 text-[15px] leading-[160%] text-[#404042]">
          Vielen Dank! Wir prüfen Ihre Angaben und IP-Adressen und melden uns per E-Mail.{' '}
          {paid ? 'Sie erhalten eine Rechnung; nach Zahlungseingang schalten wir Ihren API-Schlüssel frei.' : 'Danach erhalten Sie Ihren API-Schlüssel.'}
        </p>
        <Link href="/auto-api/dokumentation" className="sl-white mt-6 inline-flex rounded-[12px] bg-[#3A64F6] px-5 py-3 text-[15px] font-semibold">
          Zur Dokumentation
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        {/* plan */}
        <section className="rounded-[20px] bg-white p-6 ring-1 ring-[#E4E7F0]">
          <h2 className="text-[17px] font-semibold text-[#16171A]">1. Tarif</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {PLAN_IDS.map(id => {
              const x = catalog.plans[id];
              const on = id === plan;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPlan(id)}
                  aria-pressed={on}
                  className={`rounded-[16px] p-4 text-left transition-all cursor-pointer ${on ? 'bg-[#F1F4FF] ring-2 ring-[#3A64F6]' : 'bg-white ring-1 ring-[#E4E7F0] hover:ring-[#A5B4FC]'}`}
                >
                  <span className="block text-[15px] font-bold text-[#16171A]">{x.name}</span>
                  <span className="mt-1 block text-[13px] text-[#5A6072]">{modelsLabel(x)} Modelle · {x.daily.toLocaleString('de-DE')}/Tag</span>
                  <span className="mt-2 block text-[17px] font-bold text-[#16171A]">{x.price ? `${eur(x.price)}/Monat` : 'kostenlos'}</span>
                </button>
              );
            })}
          </div>
          {paid ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {(['monthly', 'yearly'] as const).map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBilling(b)}
                  aria-pressed={billing === b}
                  className={`rounded-full px-4 py-2 text-[13.5px] font-semibold cursor-pointer ${billing === b ? 'sl-white bg-[#3A64F6]' : 'bg-[#F4F6FB] text-[#404042]'}`}
                >
                  {b === 'monthly' ? `Monatlich · ${eur(p.price)}` : `Jährlich · ${eur(p.priceYearly)} (2 Monate gratis)`}
                </button>
              ))}
            </div>
          ) : null}
        </section>

        {/* servers */}
        <section className="rounded-[20px] bg-white p-6 ring-1 ring-[#E4E7F0]">
          <h2 className="flex items-center gap-2 text-[17px] font-semibold text-[#16171A]">
            <Server size={18} color="#3A64F6" /> 2. Server-IP-Adressen
          </h2>
          <p className="mt-2 text-[13.5px] leading-[155%] text-[#5A6072]">
            Ihr Schlüssel funktioniert nur von diesen öffentlichen IP-Adressen. Tragen Sie die IP der Server ein, die die API aufrufen (nicht Ihre Büro-IP, außer Sie testen von dort).
            Ihr Tarif erlaubt <strong>{p.ips}</strong> {p.ips === 1 ? 'Adresse' : 'Adressen'}.
          </p>
          <label className={`${label} mt-4`}>
            IP-Adressen (eine pro Zeile)
            <textarea className={`${input} font-mono`} name="ips" rows={3} maxLength={400} required placeholder={'203.0.113.10\n2001:db8::10'} value={ipText} onChange={e => setIpText(e.target.value)} />
          </label>
          <p className={`mt-1.5 text-[12.5px] ${ips.length > p.ips ? 'text-[#DC2626]' : 'text-[#6B7280]'}`}>
            {ips.length} von {p.ips} {ips.length > p.ips ? '– bitte einen größeren Tarif wählen oder IPs entfernen' : ''}
          </p>
          <p className="mt-3 flex gap-2 rounded-[12px] bg-[#F4F6FB] p-3 text-[12.5px] leading-[150%] text-[#404042]">
            <Info size={16} className="shrink-0" color="#3A64F6" /> Die öffentliche IP Ihres Servers sehen Sie z.&nbsp;B. mit <code>curl ifconfig.me</code> auf dem Server.
          </p>
        </section>

        {/* contact + billing */}
        <section className="rounded-[20px] bg-white p-6 ring-1 ring-[#E4E7F0]">
          <h2 className="text-[17px] font-semibold text-[#16171A]">3. {paid ? 'Kontakt & Rechnungsadresse' : 'Kontakt'}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className={label}>Name *<input className={input} name="name" required maxLength={120} autoComplete="name" /></label>
            <label className={label}>Geschäftliche E-Mail *<input className={input} type="email" name="email" required maxLength={254} autoComplete="email" /></label>
            <label className={`${label} sm:col-span-2`}>Firma {paid ? '*' : '(optional)'}<input className={input} name="company" required={paid} maxLength={150} autoComplete="organization" /></label>
            {paid ? (
              <>
                <label className={`${label} sm:col-span-2`}>Straße und Hausnummer *<input className={input} name="street" required maxLength={150} autoComplete="street-address" /></label>
                <label className={label}>PLZ *<input className={input} name="zip" required maxLength={12} autoComplete="postal-code" /></label>
                <label className={label}>Ort *<input className={input} name="city" required maxLength={80} autoComplete="address-level2" /></label>
                <label className={label}>
                  Land
                  <select className={input} name="country" defaultValue="DE">
                    {[['DE', 'Deutschland'], ['AT', 'Österreich'], ['CH', 'Schweiz'], ['NL', 'Niederlande'], ['BE', 'Belgien'], ['LU', 'Luxemburg'], ['PL', 'Polen'], ['FR', 'Frankreich'], ['IT', 'Italien'], ['DK', 'Dänemark']].map(([c, n]) => (
                      <option key={c} value={c}>{n}</option>
                    ))}
                  </select>
                </label>
                <label className={label}>USt-IdNr. (EU, optional)<input className={input} name="vatId" maxLength={20} placeholder="DE123456789" /></label>
              </>
            ) : null}
            <label className={`${label} sm:col-span-2`}>Website / Projekt (optional)<input className={input} name="website" maxLength={200} placeholder="https://" /></label>
            <label className={`${label} sm:col-span-2`}>
              Wofür nutzen Sie die API? (optional)
              <textarea className={input} name="useCase" rows={3} maxLength={1000} placeholder="z. B. Fahrzeugfilter in unserem Reifenshop" />
            </label>
          </div>
        </section>
      </div>

      {/* summary */}
      <aside className="lg:sticky lg:top-24">
        <div className="rounded-[20px] bg-white p-6 ring-1 ring-[#E4E7F0] shadow-[0_12px_40px_rgba(16,24,40,0.08)]">
          <h2 className="text-[17px] font-semibold text-[#16171A]">Ihre Bestellung</h2>
          <div className="mt-4 rounded-[14px] bg-gradient-to-br from-[#1B2A6B] to-[#3A64F6] p-4">
            <p className="sl-white text-[13px] opacity-80">Tarif</p>
            <p className="sl-white text-[22px] font-bold">{p.name}</p>
            <p className="sl-white mt-1 text-[13px] opacity-90">
              {modelsLabel(p)} Modelle · {p.daily.toLocaleString('de-DE')} Anfragen/Tag · {p.ips} IP{p.ips > 1 ? 's' : ''}
            </p>
          </div>
          <dl className="mt-4 space-y-2 text-[14px]">
            <div className="flex justify-between"><dt className="text-[#5A6072]">Preis</dt><dd className="font-semibold text-[#16171A]">{price ? `${eur(price)} / ${billing === 'yearly' ? 'Jahr' : 'Monat'}` : 'kostenlos'}</dd></div>
            {paid ? <div className="flex justify-between"><dt className="text-[#5A6072]">zzgl. USt.</dt><dd className="text-[#5A6072]">gemäß Rechnung</dd></div> : null}
            <div className="flex justify-between"><dt className="text-[#5A6072]">Zahlung</dt><dd className="text-[#16171A]">{paid ? 'per Rechnung' : '–'}</dd></div>
            <div className="flex justify-between"><dt className="text-[#5A6072]">Server-IPs</dt><dd className="text-[#16171A]">{ips.length} / {p.ips}</dd></div>
          </dl>
          <label className="mt-5 flex gap-2.5 text-[13px] leading-[150%] text-[#404042]">
            <input type="checkbox" name="terms" required className="mt-0.5 h-4 w-4 accent-[#3A64F6]" />
            <span>
              Ich bestelle als Unternehmer/Entwickler und akzeptiere die{' '}
              <Link href="/auto-api/bedingungen" target="_blank" className="text-[#3A64F6] underline">API-Nutzungsbedingungen</Link> und die{' '}
              <Link href="/auto-api/preise-und-zahlung" target="_blank" className="text-[#3A64F6] underline">Preis- und Zahlungsbedingungen</Link>. Die{' '}
              <Link href="/impressum-datenschutz" target="_blank" className="text-[#3A64F6] underline">Datenschutzhinweise</Link> habe ich gelesen.
            </span>
          </label>
          <button
            disabled={status === 'sending'}
            className="sl-white mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#4F46E5] to-[#3A64F6] py-3.5 text-[15.5px] font-semibold shadow-[0_10px_24px_rgba(58,100,246,0.35)] disabled:opacity-60 cursor-pointer"
          >
            {status === 'sending' ? <Loader2 size={18} className="animate-spin" /> : <Lock size={17} />}
            {paid ? 'Zahlungspflichtig bestellen' : 'Kostenlos anfragen'}
          </button>
          <p className="mt-3 text-center text-[12px] text-[#6B7280]">{paid ? 'Abrechnung erst nach Freischaltung per Rechnung.' : 'Keine Zahlungsdaten nötig.'}</p>
          {status === 'error' ? (
            <p role="alert" className="mt-4 rounded-[12px] bg-[#FEF2F2] p-3 text-[13px] text-[#B91C1C]">
              {problem === 'too_many_ips'
                ? `Dieser Tarif erlaubt höchstens ${p.ips} Server-IP-Adresse${p.ips === 1 ? '' : 'n'}.`
                : PROBLEMS[problem] || 'Bestellung fehlgeschlagen. Bitte prüfen Sie Ihre Angaben und versuchen Sie es erneut.'}
            </p>
          ) : null}
        </div>
      </aside>
    </form>
  );
}
