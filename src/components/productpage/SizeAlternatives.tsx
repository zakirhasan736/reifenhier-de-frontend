import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export type SizeAlternative = {
  slug: string;
  brand_name?: string;
  product_name?: string;
  dimensions?: string;
  cheapest_offer?: number | string;
  search_price?: number | string;
};

const toNumber = (v?: number | string) => {
  if (typeof v === 'number') return v;
  const n = Number(
    String(v ?? '')
      .replace(/[^\d.,]/g, '')
      .replace(/\.(?=\d{3}(\D|$))/g, '') // "1.234,56" → "1234,56"
      .replace(',', '.')
  );
  return Number.isFinite(n) ? n : 0;
};

const eur = (n: number) =>
  n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** "195/60 R16C 99T Winter PorTran CW51" → "Winter PorTran CW51" (size and index are shown separately) */
function modelName(name = '', brand = '') {
  const cleaned = name
    .replace(/^\s*\d{3}\s*\/\s*\d{2}\s*Z?R?\s*\d{2}\s*C?\s*/i, '')
    .replace(/^\s*\d{2,3}(\/\d{2,3})?\s?[A-Z]{1,2}\b\s*/, '')
    .replace(new RegExp(`^${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+`, 'i'), '')
    .trim();
  return cleaned || name;
}

/**
 * Compact list in the buy box: same tyre size, other brands, cheapest first.
 * Text only — the large product cards stay in the "Ähnliche Produkte" slider further down.
 */
export default function SizeAlternatives({
  items,
  currentBrand,
  currentPrice,
  sizeLabel,
  allHref,
  max = 5,
}: {
  items: SizeAlternative[];
  currentBrand?: string;
  /** best price of the tyre on this page, to show "x € günstiger" */
  currentPrice?: number | null;
  sizeLabel?: string;
  allHref?: string;
  max?: number;
}) {
  const own = String(currentBrand || '').trim().toLowerCase();
  const seenBrands = new Set<string>();
  const rows = (Array.isArray(items) ? items : [])
    .map(p => ({ ...p, price: toNumber(p.cheapest_offer) || toNumber(p.search_price) }))
    .filter(p => p.slug && p.price > 0 && String(p.brand_name || '').trim().toLowerCase() !== own)
    .sort((a, b) => a.price - b.price)
    // one tyre per brand: the cheapest
    .filter(p => {
      const b = String(p.brand_name || '').trim().toLowerCase();
      if (!b || seenBrands.has(b)) return false;
      seenBrands.add(b);
      return true;
    })
    .slice(0, max);

  if (!rows.length) return null;

  return (
    <section aria-labelledby="alternativen-title" className="mt-4 rounded-[18px] border border-[#E9ECF3] p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="alternativen-title" className="text-[15px] font-semibold text-[#16171A]">
          Alternativen in dieser Größe
        </h2>
        {sizeLabel ? <span className="shrink-0 text-[12px] text-[#6B6E76]">{sizeLabel}</span> : null}
      </div>
      <p className="mt-0.5 !text-[12px] text-[#6B6E76]">Gleiche Größe, andere Marken – günstigste zuerst</p>

      <ul className="mt-2 divide-y divide-[#EEF0F4]">
        {rows.map(p => {
          const diff = currentPrice && currentPrice > 0 ? p.price - currentPrice : 0;
          return (
            <li key={p.slug}>
              <Link
                href={`/produkte/${p.slug}`}
                className="group flex items-center gap-3 py-2.5"
                title={[p.brand_name, p.product_name].filter(Boolean).join(' ')}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold text-[#16171A] group-hover:text-primary-100">
                    {p.brand_name}
                  </span>
                  <span className="block truncate text-[12px] text-[#6B6E76]">
                    {modelName(p.product_name, p.brand_name)}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-[14px] font-semibold tabular-nums text-[#16171A]">
                    ab {eur(p.price)} €
                  </span>
                  {diff <= -0.01 ? (
                    <span className="block text-[11px] font-medium tabular-nums text-[#1F7A33]">
                      {eur(Math.abs(diff))} € günstiger
                    </span>
                  ) : null}
                </span>
                <ChevronRight size={16} className="shrink-0 text-[#C0C4CC] group-hover:text-primary-100" />
              </Link>
            </li>
          );
        })}
      </ul>

      {allHref ? (
        <Link
          href={allHref}
          className="mt-2 inline-block text-[13px] font-semibold text-primary-100 underline-offset-2 hover:underline"
        >
          Alle Reifen in {sizeLabel || 'dieser Größe'} vergleichen
        </Link>
      ) : null}
    </section>
  );
}
