import Link from 'next/link';
import { BadgeCheck, CarFront } from 'lucide-react';

type Vehicle = {
  make: string;
  model: string;
  verified?: boolean;
  fitments: { variant: string; yearFrom: number; yearTo: number; axle: string }[];
};

const AXLE: Record<string, string> = { front: 'vorne', rear: 'hinten', both: '' };

/**
 * "205/55 R16 passt z. B. auf …" — models whose factory size this is, from
 * Reifexa's own vehicle database (most common cars first). Hidden when none.
 */
export default async function VehicleFitment({ size }: { size?: string }) {
  if (!size) return null;
  const api = (process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de').replace(/\/$/, '');
  const result = (await fetch(`${api}/api/fitment/examples?size=${encodeURIComponent(size)}&limit=10`, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(2500),
  })
    .then(response => (response.ok ? response.json() : null))
    .catch(() => null)) as { size?: string; total?: number; vehicles: Vehicle[] } | null;
  if (!result?.vehicles?.length) return null;
  const total = result.total || result.vehicles.length;
  const more = total - result.vehicles.length;
  const label = result.size || size;
  const now = new Date().getFullYear();

  return (
    <section className="custom-container my-10" aria-labelledby="passt-auf-title">
      <div className="rounded-[20px] bg-white p-5 ring-1 ring-[#E4E7F0] shadow-[0_2px_12px_rgba(16,24,40,0.04)] md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="passt-auf-title" className="flex items-center gap-3 text-[19px] font-semibold text-[#16171A] md:text-[22px]">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EEF2FF]">
              <CarFront size={21} color="#3A64F6" />
            </span>
            {label} passt z.&nbsp;B. auf
          </h2>
          <span className="rounded-full bg-[#F4F6FB] px-3 py-1 text-[13px] text-[#5A6072]">
            {total.toLocaleString('de-DE')} {total === 1 ? 'Modell' : 'Modelle'} in unserer Fahrzeugdatenbank
          </span>
        </div>
        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {result.vehicles.map(vehicle => {
            const f = vehicle.fitments;
            const variants = [...new Set(f.map(x => x.variant))].slice(0, 2);
            const from = Math.min(...f.map(x => x.yearFrom));
            const to = Math.max(...f.map(x => x.yearTo));
            const axle = f.every(x => x.axle === f[0]?.axle) ? AXLE[f[0]?.axle] || '' : '';
            return (
              <li key={`${vehicle.make}-${vehicle.model}`} className="flex items-start gap-3 rounded-[14px] bg-[#F8F9FC] p-3.5 ring-1 ring-[#EEF0F5]">
                <span className="mt-0.5 inline-flex h-8 min-w-8 items-center justify-center rounded-[10px] bg-white px-1.5 text-[11px] font-bold uppercase text-[#3A64F6] ring-1 ring-[#E4E7F0]">
                  {vehicle.make.slice(0, 3)}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-[14.5px] font-semibold text-[#16171A]">
                    {vehicle.make} {vehicle.model}
                    {vehicle.verified ? <BadgeCheck size={15} color="#16A34A" aria-label="von Reifexa geprüft" /> : null}
                  </span>
                  <span className="block truncate text-[12.5px] text-[#5A6072]">
                    {variants.join(', ')}
                    {Number.isFinite(from) ? ` · ${from}–${to >= now ? 'heute' : to}` : ''}
                    {axle ? ` · ${axle}` : ''}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        {more > 0 ? <p className="mt-3 text-[13px] text-[#5A6072]">… und {more.toLocaleString('de-DE')} weitere Modelle.</p> : null}
        <p className="mt-4 text-[12.5px] leading-[155%] text-[#6B7280]">
          Werksgrößen laut Reifexa-Fahrzeugdatenbank{result.vehicles.some(v => !v.verified) ? ' (teilweise KI-gestützt, ohne Häkchen noch nicht geprüft)' : ''}. Welche
          Größe für Ihr Auto zugelassen ist, steht im CoC-Papier bzw. in der Zulassungsbescheinigung. Bitte vor dem Kauf auch Achse, Traglast und
          Geschwindigkeitsindex prüfen.{' '}
          <Link href="/auto-api" className="text-[#3A64F6] underline">Fahrzeugdaten als API</Link>
        </p>
      </div>
    </section>
  );
}
