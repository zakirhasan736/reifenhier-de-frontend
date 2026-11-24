'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export type BrandTileItem = {
  href: string;
  name: string;
  price: string;
  count: number;
};

const MOBILE_LIMIT = 6;

const TINTS = [
  ['#EEF2FF', '#2F4FD8'], ['#FFF4E0', '#B45309'], ['#E7F7F1', '#047857'], ['#FDECEF', '#BE123C'],
  ['#F1ECFF', '#6D28D9'], ['#E6F6FB', '#0E7490'], ['#F3F4F6', '#374151'],
];
/** "MICHELIN" → "Michelin"; mixed case (BFGoodrich) stays as it is. */
const niceName = (n: string) =>
  n === n.toUpperCase() && n.length > 3 ? n.charAt(0) + n.slice(1).toLowerCase() : n;
const tint = (n: string) => TINTS[[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % TINTS.length];

/** Brand tiles; on mobile only the first few show until "more" is tapped.
 *  Hidden tiles stay in the HTML so crawlers still see every link. */
export default function BrandTiles({ items }: { items: BrandTileItem[] }) {
  const [showAll, setShowAll] = useState(false);

  return (
    <div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 md:gap-3">
        {items.map((b, idx) => (
          <li key={b.href} className={!showAll && idx >= MOBILE_LIMIT ? 'max-sm:hidden' : ''}>
            <Link
              href={b.href}
              className="group flex h-full items-center gap-3 rounded-[14px] bg-[#F8FAFE] px-3 py-3 ring-1 ring-[#E9ECF3] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:ring-[#B9C9FB] hover:shadow-[0_14px_28px_-18px_rgba(47,79,216,0.55)]"
            >
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] text-[15px] font-bold"
                style={{ background: tint(b.name)[0], color: tint(b.name)[1] }}
              >
                {niceName(b.name).charAt(0)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] md:text-[15px] font-bold !text-[#16171A] group-hover:!text-[#2F4FD8] transition-colors">
                  {niceName(b.name)}
                </span>
                <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[12px] whitespace-nowrap">
                  {b.price ? <span className="font-semibold !text-[#2F4FD8] tabular-nums">ab {b.price} €</span> : null}
                  {b.count ? <span className="!text-[#8A90A0] tabular-nums">{b.count.toLocaleString('de-DE')} Reifen</span> : null}
                </span>
              </span>
              <ArrowRight size={15} color="#9AA3B8" className="hidden shrink-0 transition-transform group-hover:translate-x-0.5 sm:block" />
            </Link>
          </li>
        ))}
        <li className={`sm:hidden ${!showAll && items.length > MOBILE_LIMIT ? 'max-sm:hidden' : ''}`}>
          <Link
            href="/marken"
            className="group flex h-full min-h-[64px] items-center justify-center gap-1.5 rounded-[14px] bg-gradient-to-br from-[#1B2A6B] to-[#2F4FD8] px-3 py-3 text-[14px] font-semibold shadow-[0_12px_24px_-14px_rgba(47,79,216,0.8)] transition-transform hover:-translate-y-0.5"
          >
            <span className="!text-white">Alle Marken</span> <ArrowRight size={15} strokeWidth={2.4} color="#fff" className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      </ul>
      {!showAll && items.length > MOBILE_LIMIT && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="sm:hidden mt-3 w-full rounded-[10px] border border-[#DCE3FB] bg-mono-0 py-2.5 text-[14px] font-semibold text-primary-100 cursor-pointer"
        >
          {items.length - MOBILE_LIMIT} weitere Marken anzeigen
        </button>
      )}
    </div>
  );
}
