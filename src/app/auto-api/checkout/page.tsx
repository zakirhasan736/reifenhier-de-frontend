import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import AccessForm from './AccessForm';
import { API_BASE, fetchPlanCatalog, PLAN_IDS, type PlanId } from '@/libs/autoApi';

export const metadata: Metadata = {
  title: { absolute: 'Auto-API bestellen | Reifexa' },
  robots: { index: false, follow: true },
};

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ plan?: string; billing?: string }> }) {
  const { plan, billing } = await searchParams;
  const catalog = await fetchPlanCatalog();
  const initial: PlanId = PLAN_IDS.includes(plan as PlanId) ? (plan as PlanId) : 'pro';
  return (
    <main className="min-h-[70vh] bg-[#F6F8FC] pb-20">
      <div className="custom-container pt-8">
        <Link href="/auto-api#tarife" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#3A64F6] hover:underline">
          <ArrowLeft size={16} /> Zurück zu den Tarifen
        </Link>
        <h1 className="mt-4 text-[30px] font-bold text-[#16171A] md:text-[36px]">Auto-API bestellen</h1>
        <p className="mt-2 max-w-2xl text-[15.5px] leading-[160%] text-[#5A6072]">
          Für Unternehmen und Entwickler. Wir prüfen Ihre Angaben und die Server-IP-Adressen und melden uns in der Regel innerhalb von 1–2 Werktagen.
          Bezahltarife werden per Rechnung abgerechnet – mit dieser Bestellung wird noch nichts abgebucht.
        </p>
        <div className="mt-8">
          <AccessForm api={API_BASE} catalog={catalog} initialPlan={initial} initialBilling={billing === 'yearly' ? 'yearly' : 'monthly'} />
        </div>
      </div>
    </main>
  );
}
