'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export type SizeFinderItem = {
  href: string;
  label: string;
  diameter: string;
  price: string;
  count: number;
};

/**
 * Popular sizes with a rim (Zoll) filter. Every link stays in the HTML —
 * the filter only hides tiles — so crawlers still see all landing pages.
 */
export default function SizeFinder({ items }: { items: SizeFinderItem[] }) {
  const [rim, setRim] = useState<string>('');
  const [showAll, setShowAll] = useState(false);
  const MOBILE_LIMIT = 6;

  const rims = useMemo(
    () =>
      Array.from(new Set(items.map(i => i.diameter)))
        .filter(Boolean)
        .sort((a, b) => Number(a) - Number(b)),
    [items]
  );

  const visible = items.filter(i => !rim || i.diameter === rim).length;

  const chip = (active: boolean) =>
    `rounded-full px-3.5 py-1.5 text-[13px] md:text-[14px] font-semibold font-secondary transition-colors cursor-pointer ${
      active
        ? 'bg-primary-100 text-mono-0'
        : 'bg-[#F2F4F8] text-[#404042] hover:bg-[#E7EBF3]'
    }`;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Nach Zoll filtern"
        className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap [scrollbar-width:none]"
      >
        <button type="button" role="tab" aria-selected={!rim} onClick={() => setRim('')} className={`shrink-0 ${chip(!rim)}`}>
          Alle
        </button>
        {rims.map(r => (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={rim === r}
            onClick={() => setRim(r)}
            className={`shrink-0 ${chip(rim === r)}`}
          >
            R{r}
          </button>
        ))}
        <span className="ml-auto hidden sm:inline text-[13px] text-[#6B6E76] font-secondary">
          {visible} {visible === 1 ? 'Größe' : 'Größen'}
        </span>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
        {items.map((i, idx) => {
          const hidden = !!rim && i.diameter !== rim;
          const mobileHidden = !rim && !showAll && idx >= MOBILE_LIMIT;
          return (
            <li
              key={i.href}
              className={hidden ? 'hidden' : mobileHidden ? 'max-sm:hidden' : ''}
            >
              <Link
                href={i.href}
                className="group flex h-full flex-col justify-between rounded-[12px] border border-[#E9ECF3] bg-mono-0 px-3.5 py-3 transition-all hover:border-[#C9D6FC] hover:shadow-[0_10px_24px_-16px_rgba(58,100,246,0.45)]"
              >
                <span className="text-[15px] md:text-[16px] font-semibold font-primary text-[#16171A] tabular-nums group-hover:text-primary-100 transition-colors">
                  {i.label}
                </span>
                <span className="mt-1 flex items-center justify-between gap-2 text-[12px] font-secondary">
                  {i.price ? (
                    <span className="text-primary-100 font-semibold tabular-nums">ab {i.price} €</span>
                  ) : (
                    <span />
                  )}
                  {i.count > 0 && <span className="text-[#9AA0A8]">{i.count} Reifen</span>}
                </span>
              </Link>
            </li>
          );
        })}
        <li className={!rim && !showAll && items.length > MOBILE_LIMIT ? 'max-sm:hidden' : ''}>
          <Link
            href="/reifen"
            className="flex h-full min-h-[64px] items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-[#C9D6FC] bg-[#F5F8FF] px-3 py-3 text-[14px] font-semibold text-primary-100 hover:bg-[#EEF2FF] transition-colors"
          >
            Alle Größen <ArrowRight size={15} strokeWidth={2.4} />
          </Link>
        </li>
      </ul>
      {!rim && !showAll && items.length > MOBILE_LIMIT && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="sm:hidden mt-3 w-full rounded-[10px] border border-[#DCE3FB] bg-mono-0 py-2.5 text-[14px] font-semibold text-primary-100 cursor-pointer"
        >
          {items.length - MOBILE_LIMIT} weitere Größen anzeigen
        </button>
      )}
    </div>
  );
}
