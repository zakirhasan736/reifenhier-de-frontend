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

/** Brand tiles; on mobile only the first few show until "more" is tapped.
 *  Hidden tiles stay in the HTML so crawlers still see every link. */
export default function BrandTiles({ items }: { items: BrandTileItem[] }) {
  const [showAll, setShowAll] = useState(false);

  return (
    <div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-2.5">
        {items.map((b, idx) => (
          <li key={b.href} className={!showAll && idx >= MOBILE_LIMIT ? 'max-sm:hidden' : ''}>
            <Link
              href={b.href}
              className="group flex h-full flex-col rounded-[12px] border border-[#E9ECF3] bg-mono-0 px-3.5 py-3 transition-all hover:border-[#C9D6FC] hover:shadow-[0_10px_24px_-16px_rgba(58,100,246,0.45)]"
            >
              <span className="text-[14px] md:text-[15px] font-semibold text-[#16171A] truncate group-hover:text-primary-100 transition-colors">
                {b.name}
              </span>
              <span className="mt-1 flex flex-wrap items-center justify-between gap-x-2 text-[12px] font-secondary whitespace-nowrap">
                {b.price ? (
                  <span className="text-primary-100 font-semibold tabular-nums">ab {b.price} €</span>
                ) : (
                  <span />
                )}
                {b.count ? <span className="text-[#9AA0A8]">{b.count} Reifen</span> : null}
              </span>
            </Link>
          </li>
        ))}
        <li className={!showAll && items.length > MOBILE_LIMIT ? 'max-sm:hidden' : ''}>
          <Link
            href="/marken"
            className="flex h-full min-h-[58px] items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-[#C9D6FC] bg-[#F5F8FF] px-3 py-3 text-[14px] font-semibold text-primary-100 hover:bg-[#EEF2FF] transition-colors"
          >
            Alle Marken <ArrowRight size={15} strokeWidth={2.4} />
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
