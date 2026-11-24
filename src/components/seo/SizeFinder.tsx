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
  const maxCount = Math.max(1, ...items.map(i => i.count));

  const chip = (active: boolean) =>
    `rounded-full px-3.5 py-1.5 text-[13px] md:text-[14px] font-semibold font-secondary transition-colors cursor-pointer ${
      active
        ? 'bg-gradient-to-r from-[#1B2A6B] to-[#2F4FD8] !text-white shadow-[0_6px_14px_-6px_rgba(47,79,216,0.7)]'
        : 'bg-white !text-[#4B5163] ring-1 ring-[#E4E7F0] hover:ring-[#C9D6FC] hover:!text-[#2F4FD8]'
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

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5 md:gap-3">
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
                className="group relative flex h-full flex-col rounded-[14px] bg-[#F8FAFE] px-3.5 py-3 ring-1 ring-[#E9ECF3] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:ring-[#B9C9FB] hover:shadow-[0_14px_28px_-18px_rgba(47,79,216,0.55)]"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="text-[15px] md:text-[16px] font-bold font-primary !text-[#16171A] tabular-nums group-hover:!text-[#2F4FD8] transition-colors">
                    {i.label}
                  </span>
                  {idx < 3 && !rim ? (
                    <span className="rounded-full bg-[#FFF4E0] px-1.5 py-0.5 text-[10px] font-bold !text-[#B45309]">#{idx + 1}</span>
                  ) : null}
                </span>
                {i.price ? (
                  <span className="mt-1 text-[13px] font-semibold !text-[#2F4FD8] tabular-nums">ab {i.price} €</span>
                ) : null}
                {i.count > 0 && (
                  <span className="mt-2 flex items-center gap-2">
                    <span className="h-1 flex-1 overflow-hidden rounded-full bg-[#E6EAF3]">
                      <span
                        className="block h-full rounded-full bg-gradient-to-r from-[#7C9BFF] to-[#2F4FD8]"
                        style={{ width: `${Math.max(8, Math.round((i.count / maxCount) * 100))}%` }}
                      />
                    </span>
                    <span className="text-[11px] !text-[#8A90A0] tabular-nums">{i.count}</span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
        <li className={`sm:hidden ${!rim && !showAll && items.length > MOBILE_LIMIT ? 'max-sm:hidden' : ''}`}>
          <Link
            href="/reifen"
            className="group flex h-full min-h-[84px] items-center justify-center gap-1.5 rounded-[14px] bg-gradient-to-br from-[#1B2A6B] to-[#2F4FD8] px-3 py-3 text-[14px] font-semibold !text-white shadow-[0_12px_24px_-14px_rgba(47,79,216,0.8)] transition-transform hover:-translate-y-0.5"
          >
            <span className="!text-white">Alle Größen</span> <ArrowRight size={15} strokeWidth={2.4} color="#fff" className="transition-transform group-hover:translate-x-0.5" />
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
