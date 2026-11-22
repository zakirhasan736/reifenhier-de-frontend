import Link from 'next/link';
import AccessForm from './AccessForm';

export const metadata = { title: 'API-Zugang anfragen | Reifexa' };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  const api = process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de';
  const catalog = await fetch(`${api}/api/fitment/plans`, {
    cache: 'no-store', signal: AbortSignal.timeout(4000),
  }).then(response => response.ok ? response.json() : null).catch(() => null);
  const selected = plan && catalog && Object.hasOwn(catalog.plans, plan) ? catalog.plans[plan] : null;
  return <main className="mx-auto max-w-xl px-6 py-16">
    <h1 className="text-3xl font-bold">API-Zugang anfragen</h1>
    {selected ? <>
      <p className="my-4"><strong className="capitalize">{plan}</strong> · {selected.price} € netto pro Monat · bis zu {selected.models} Modellfamilien</p>
      <p className="mb-6">Für Unternehmen. Wir prüfen Ihre Server-IP-Adressen und melden uns zur Freischaltung. Die Anfrage löst keine Zahlung aus.</p>
      <AccessForm api={api} plan={plan!} maxIps={selected.ips} termsVersion={catalog.termsVersion} />
    </> : <Link href="/auto-api" className="mt-5 inline-block underline">Tarif auswählen</Link>}
  </main>;
}
