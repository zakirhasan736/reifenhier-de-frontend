'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, Minus, Sparkles } from 'lucide-react';
import { PLAN_IDS, eur, modelsLabel, type PlanCatalog, type PlanId } from '@/libs/autoApi';

const TAGLINE: Record<PlanId, string> = {
  free: 'Zum Ausprobieren und für private Projekte',
  pro: 'Für Reifenshops, Werkstätten und Vergleichsportale',
  advanced: 'Für Plattformen mit vollem Datenbestand',
};

const ROWS: { label: string; value: (p: PlanCatalog['plans'][PlanId]) => string | boolean }[] = [
  { label: 'Modellfamilien (häufigste zuerst)', value: p => modelsLabel(p) },
  { label: 'Generationen, Baujahre & Achsen', value: () => true },
  { label: 'Suche nach Reifengröße', value: p => p.bySize },
  { label: 'Last- & Geschwindigkeitsindex', value: p => p.indexes },
  { label: 'Anfragen pro Tag', value: p => p.daily.toLocaleString('de-DE') },
  { label: 'Freigegebene Server-IPs', value: p => String(p.ips) },
  { label: 'Kommerzielle Nutzung', value: p => p.commercial },
];

export default function PricingPlans({ catalog }: { catalog: PlanCatalog }) {
  const [yearly, setYearly] = useState(false);
  return (
    <div>
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-[#DDE2EE] shadow-sm" role="group" aria-label="Abrechnung">
          {[
            ['Monatlich', false],
            ['Jährlich', true],
          ].map(([label, value]) => (
            <button
              key={String(label)}
              type="button"
              onClick={() => setYearly(Boolean(value))}
              aria-pressed={yearly === value}
              className={`rounded-full px-5 py-2 text-[14px] font-semibold transition-colors cursor-pointer ${
                yearly === value ? 'sl-white bg-[#3A64F6]' : 'text-[#404042] hover:text-[#3A64F6]'
              }`}
            >
              {label}
              {value ? <span className={`ml-2 rounded-full px-2 py-0.5 text-[11px] ${yearly ? 'bg-white/20' : 'bg-[#E8F7EE] text-[#15803D]'}`}>2 Monate gratis</span> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {PLAN_IDS.map(id => {
          const p = catalog.plans[id];
          const featured = id === 'pro';
          const price = yearly ? p.priceYearly : p.price;
          return (
            <article
              key={id}
              className={`relative flex flex-col rounded-[24px] bg-white p-7 ${
                featured
                  ? 'ring-2 ring-[#3A64F6] shadow-[0_24px_60px_rgba(58,100,246,0.22)] lg:-translate-y-3'
                  : 'ring-1 ring-[#E4E7F0] shadow-[0_4px_20px_rgba(16,24,40,0.05)]'
              }`}
            >
              {featured ? (
                <span className="sl-white absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#3A64F6] px-4 py-1.5 text-[12.5px] font-semibold shadow-lg">
                  <Sparkles size={14} /> Beliebteste Wahl
                </span>
              ) : null}
              <h3 className="text-[22px] font-bold text-[#16171A]">{p.name}</h3>
              <p className="mt-1 min-h-[44px] text-[14px] leading-[150%] text-[#5A6072]">{TAGLINE[id]}</p>
              <div className="mt-5 flex items-end gap-1.5">
                <span className="text-[44px] font-bold leading-none tracking-tight text-[#16171A]">{eur(price)}</span>
                <span className="pb-1.5 text-[14px] text-[#5A6072]">{p.price ? (yearly ? '/ Jahr' : '/ Monat') : 'für immer'}</span>
              </div>
              <p className="mt-1.5 h-5 text-[12.5px] text-[#6B7280]">
                {p.price ? (yearly ? `entspricht ${eur(Math.round((p.priceYearly / 12) * 100) / 100)} / Monat · ` : '') + 'zzgl. USt.' : 'Keine Zahlungsdaten nötig'}
              </p>
              <Link
                href={`/auto-api/checkout?plan=${id}${yearly && p.price ? '&billing=yearly' : ''}`}
                className={`mt-6 flex items-center justify-center rounded-[14px] py-3.5 text-[15px] font-semibold transition-all ${
                  featured
                    ? 'sl-white bg-gradient-to-r from-[#4F46E5] to-[#3A64F6] shadow-[0_10px_24px_rgba(58,100,246,0.35)] hover:-translate-y-0.5'
                    : 'bg-[#F1F4FF] text-[#3A64F6] hover:bg-[#E5EBFF]'
                }`}
              >
                {p.price ? `${p.name} bestellen` : 'Kostenlos starten'}
              </Link>
              <ul className="mt-7 space-y-3 border-t border-[#EEF0F5] pt-6">
                {p.features.map(f => (
                  <li key={f} className="flex gap-2.5 text-[14px] leading-[145%] text-[#2B3040]">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8F7EE]">
                      <Check size={13} color="#16A34A" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      {/* comparison table */}
      <div className="mt-16 overflow-x-auto rounded-[20px] bg-white ring-1 ring-[#E4E7F0]">
        <table className="w-full min-w-[640px] text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#EEF0F5]">
              <th className="p-4 font-semibold text-[#16171A]">Leistungen im Vergleich</th>
              {PLAN_IDS.map(id => (
                <th key={id} className={`p-4 text-center font-semibold ${id === 'pro' ? 'text-[#3A64F6]' : 'text-[#16171A]'}`}>
                  {catalog.plans[id].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(row => (
              <tr key={row.label} className="border-b border-[#F2F3F7] last:border-0">
                <td className="p-4 text-[#404042]">{row.label}</td>
                {PLAN_IDS.map(id => {
                  const v = row.value(catalog.plans[id]);
                  return (
                    <td key={id} className={`p-4 text-center ${id === 'pro' ? 'bg-[#F7F9FF]' : ''}`}>
                      {v === true ? (
                        <Check size={18} color="#16A34A" strokeWidth={3} className="mx-auto" aria-label="ja" />
                      ) : v === false ? (
                        <Minus size={18} color="#B6BCCB" className="mx-auto" aria-label="nein" />
                      ) : (
                        <span className="font-semibold text-[#16171A]">{v}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
