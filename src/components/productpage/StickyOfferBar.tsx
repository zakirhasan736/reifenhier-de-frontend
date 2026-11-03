'use client';

import { useEffect, useState } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

/**
 * Price + "Zum Angebot" bar that slides in once the main buy button has
 * scrolled out of view, so the offer is always one tap away.
 */
export default function StickyOfferBar({
  watchId,
  title,
  price,
  vendor,
  href,
  onExit,
  offerCount,
}: {
  watchId: string;
  title: string;
  price: string;
  vendor?: string;
  href: string;
  onExit: () => void;
  offerCount: number;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.getElementById(watchId);
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [watchId]);

  if (!price) return null;

  return (
    <div
      aria-hidden={!show}
      className={`pdp-sticky-bar fixed inset-x-0 bottom-0 z-[900] border-t border-[#E9ECF3] bg-white/95 backdrop-blur-md shadow-[0_-8px_24px_-12px_rgba(16,24,40,0.25)] transition-transform duration-300 ${
        show ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="custom-container flex items-center gap-3 py-2.5 md:py-3">
        <div className="min-w-0 flex-1">
          <p className="hidden md:block truncate !text-[14px] font-semibold text-[#16171A]">{title}</p>
          <p className="!text-[12px] md:!text-[13px] text-[#6B6E76] truncate">
            Bester Preis{vendor ? ` bei ${vendor}` : ''}
          </p>
          <p className="text-[20px] md:hidden font-semibold leading-tight text-[#16171A] tabular-nums">{price}</p>
        </div>
        <span className="hidden md:block text-[22px] font-semibold text-[#16171A] tabular-nums">{price}</span>
        {offerCount > 1 && (
          <a
            href="#angebote"
            tabIndex={show ? 0 : -1}
            className="hidden sm:inline-flex h-12 items-center rounded-[12px] border border-[#DCE3FB] px-4 text-[14px] font-semibold text-primary-100 hover:bg-[#F5F8FF]"
          >
            {offerCount} Angebote
          </a>
        )}
        <a
          href={href}
          target="_blank"
          rel="nofollow sponsored noopener"
          onClick={onExit}
          tabIndex={show ? 0 : -1}
          className="inline-flex h-12 md:h-12 items-center justify-center gap-2 rounded-[12px] bg-primary-100 px-5 md:px-6 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(58,100,246,0.7)] transition hover:opacity-90"
        >
          <MdAddShoppingCart className="text-[20px]" /> Zum Angebot
        </a>
      </div>
    </div>
  );
}
