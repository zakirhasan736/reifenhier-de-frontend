import Link from 'next/link';

export const metadata = { title: 'Auto-API für Reifenvergleiche | Reifexa' };
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de';
type Plan = { price: number; models: number; ips: number; daily: number };

export default async function AutoApiPage() {
  const catalog = await fetch(`${apiBase}/api/fitment/plans`, {
    next: { revalidate: 300 }, signal: AbortSignal.timeout(4000),
  }).then(response => response.ok ? response.json() : null).catch(() => null) as { plans: Record<string, Plan> } | null;

  return <main className="mx-auto max-w-6xl px-6 py-16">
    <h1 className="text-4xl font-bold">Reifexa Auto-API</h1>
    <p className="mt-4 max-w-2xl">Finde Reifengrößen zu Fahrzeugmodellen oder passende Modellvarianten zu einer Reifengröße. Für Reifenshops, Vergleichsportale und eigene Fahrzeugfilter.</p>
    <div className="mt-6 flex gap-5">
      <Link className="underline" href="/auto-api/dokumentation">API-Dokumentation</Link>
      <Link className="underline" href="/auto-api/bedingungen">API-Bedingungen</Link>
    </div>
    <h2 className="mt-12 text-2xl font-bold">Tarife und Zugriff</h2>
    <p className="mt-2">Die Tarifgrenzen geben die Anzahl verfügbarer Modellfamilien an. Die tatsächliche Anzahl richtet sich nach dem freigegebenen Datenbestand. Der Zugriff erfolgt mit einem API-Schlüssel und über freigegebene Server-IP-Adressen.</p>
    {catalog ? <div className="mt-6 grid gap-5 md:grid-cols-3">
      {Object.entries(catalog.plans).map(([id, plan]) => <article key={id} className="rounded-2xl border p-6">
        <h3 className="text-xl font-bold capitalize">{id}</h3>
        <p className="my-4 text-2xl font-bold">{plan.price} € <span className="text-sm font-normal">pro Monat, netto</span></p>
        <ul className="space-y-2">
          <li>Bis zu {plan.models} Modellfamilien</li>
          <li>{plan.daily.toLocaleString('de-DE')} Anfragen pro Tag</li>
          <li>{plan.ips} freigegebene IP-Adresse(n)</li>
          <li>Suche nach Modell oder Reifengröße</li>
        </ul>
        <Link className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2 text-white" href={`/auto-api/checkout?plan=${id}`}>Zugang anfragen</Link>
      </article>)}
    </div> : <p className="mt-4">Tarife sind derzeit nicht verfügbar.</p>}
  </main>;
}
