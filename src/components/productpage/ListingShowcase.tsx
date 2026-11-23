'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatEuro, toMoneyNumber } from '@/libs/money';
import { resolveEuLabelData, type TyreLabelInfo } from '@/utils/euTyreLabel';

type Highlight = {
  sales: number;
  clicks: number;
  best_vendor: string;
  best_vendor_sales: number;
  best_vendor_clicks: number;
  is_bestseller: boolean;
  has_sales: boolean;
  is_popular: boolean;
  is_top_brand: boolean;
};

type ShowcaseProduct = {
  _id: string;
  slug: string;
  brand_name: string;
  product_name: string;
  dimensions: string;
  product_image?: string | string[] | null;
  awin_image_url?: string | null;
  merchant_thumb_url?: string | null;
  merchant_image_url?: string | null;
  fuel_class?: string;
  wet_grip?: string;
  noise_class?: string;
  tyre_label_info?: TyreLabelInfo | null;
  ean?: string;
  width?: string | number;
  lastIndex?: string;
  speedIndex?: string;
  merchant_product_third_category?: string;
  cheapest_offer: number;
  expensive_offer: number;
  total_offers: number;
  price_trend?: { points?: [string, number][] } | null;
  highlight: Highlight;
};

function num(value: unknown) {
  return toMoneyNumber(value) || 0;
}

function normalize(raw: Record<string, unknown>): ShowcaseProduct | null {
  const slug = String(raw.slug || '');
  if (!slug) return null;
  const highlight = (raw.highlight || {}) as Partial<Highlight>;
  const vendor =
    highlight.best_vendor ||
    String(raw.vendor_name || '') ||
    String((raw.cheapest_vendor as { vendor?: string } | undefined)?.vendor || '');
  const low = num(raw.cheapest_offer) || num(raw.search_price);
  const high = num(raw.expensive_offer) || low;
  return {
    _id: String(raw._id || slug),
    slug,
    brand_name: String(raw.brand_name || ''),
    product_name: String(raw.product_name || ''),
    dimensions: String(raw.dimensions || ''),
    product_image: raw.product_image as ShowcaseProduct['product_image'],
    awin_image_url: (raw.awin_image_url as string) || null,
    merchant_thumb_url: (raw.merchant_thumb_url as string) || null,
    merchant_image_url: (raw.merchant_image_url as string) || null,
    fuel_class: String(raw.fuel_class || ''),
    wet_grip: String(raw.wet_grip || ''),
    noise_class: String(raw.noise_class || ''),
    tyre_label_info: (raw.tyre_label_info as TyreLabelInfo) || null,
    ean: String(raw.ean || ''),
    width: raw.width as string | number | undefined,
    lastIndex: String(raw.lastIndex || ''),
    speedIndex: String(raw.speedIndex || ''),
    merchant_product_third_category: String(raw.merchant_product_third_category || ''),
    cheapest_offer: low,
    expensive_offer: high > low ? high : low,
    total_offers: Number(raw.total_offers) || 0,
    price_trend: (raw.price_trend as ShowcaseProduct['price_trend']) || null,
    highlight: {
      sales: Number(highlight.sales) || 0,
      clicks: Number(highlight.clicks) || 0,
      best_vendor: vendor,
      best_vendor_sales: Number(highlight.best_vendor_sales) || 0,
      best_vendor_clicks: Number(highlight.best_vendor_clicks) || 0,
      is_bestseller: Boolean(highlight.is_bestseller),
      has_sales: Boolean(highlight.has_sales),
      is_popular: Boolean(highlight.is_popular),
      is_top_brand: Boolean(highlight.is_top_brand),
    },
  };
}

function PriceSpread({
  low,
  high,
  points,
}: {
  low: number;
  high: number;
  points?: [string, number][];
}) {
  const series = (points || []).map((p) => Number(p[1])).filter((n) => n > 0);
  const values = series.length >= 2 ? series : high > low && low > 0 ? [high, low] : low > 0 ? [low, low] : [];
  if (!values.length || low <= 0) return null;

  const lo = Math.min(...values, low);
  const hi = Math.max(...values, high || low);
  const span = hi - lo || 1;
  const w = 64;
  const h = 22;
  const pad = 3;
  const coords = values.map((price, i) => {
    const x = values.length === 1 ? w / 2 : pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (price - lo) / span) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const title = hi > lo + 0.5
    ? `Preis von ${formatEuro(lo)} bis ${formatEuro(hi)}`
    : `Preis ${formatEuro(low)}`;

  return (
    <div className="mt-1.5 flex items-center gap-1.5" title={title}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={title} className="shrink-0">
        <polyline
          points={coords.join(' ')}
          fill="none"
          stroke="#1F8A3B"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx={coords[coords.length - 1].split(',')[0]} cy={coords[coords.length - 1].split(',')[1]} r="2.4" fill="#1F8A3B" />
      </svg>
      <span className="min-w-0 text-[12px] leading-tight md:text-[13px]">
        <span className="block font-semibold text-[#1F8A3B]">ab {formatEuro(low)}</span>
        {hi > lo + 0.5 ? (
          <span className="block text-[12px] text-[#6B6E76]">bis {formatEuro(hi)}</span>
        ) : null}
      </span>
    </div>
  );
}

const GRADE_BG: Record<string, string> = {
  A: '#1F8A3B',
  B: '#52B153',
  C: '#C8D400',
  D: '#E3A008',
  E: '#E30613',
};

function Grade({ label, grade }: { label: string; grade: string | null }) {
  if (!grade) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#E9ECF3] bg-white px-1.5 py-0.5 text-[11px] font-medium text-[#404042]">
      {label}
      <span
        className="inline-flex h-4 min-w-4 items-center justify-center rounded-[4px] px-1 text-[11px] font-semibold text-white"
        style={{ background: GRADE_BG[grade] || '#6B6E76' }}
      >
        {grade}
      </span>
    </span>
  );
}

function badgeFor(product: ShowcaseProduct) {
  if (product.highlight.is_bestseller) return 'Bestseller';
  if (product.highlight.is_popular) return 'Beliebt';
  if (product.highlight.has_sales) return 'Gefragt';
  return '';
}

function vendorLine(product: ShowcaseProduct) {
  const name = product.highlight.best_vendor;
  if (!name) return '';
  if (product.highlight.best_vendor_sales > 0) return `Meiste Bestellungen bei ${name}`;
  if (product.highlight.best_vendor_clicks > 0) return `Beliebtester Händler: ${name}`;
  return `Günstigster Händler: ${name}`;
}

function ShowcaseCard({ product }: { product: ShowcaseProduct }) {
  const eu = resolveEuLabelData(product);
  const title = [product.brand_name, product.product_name, product.dimensions].filter(Boolean).join(' ');
  const badge = badgeFor(product);
  const vendors = vendorLine(product);
  const href = `/produkte/${encodeURIComponent(product.slug)}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E4E5EA] bg-white p-3">
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="mb-1 flex flex-wrap items-center gap-1.5">
          {badge ? (
            <span className="rounded-full bg-[#16171A] px-2 py-1 text-[10px] font-semibold leading-none text-white md:text-[11px]">
              {badge}
            </span>
          ) : null}
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#6B6E76] md:text-[12px]">
            {product.brand_name}
          </span>
          {product.highlight.is_top_brand ? (
            <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-semibold text-primary-100 md:text-[11px]">
              Top-Marke
            </span>
          ) : null}
        </div>

        <Link href={href} className="line-clamp-2 text-[13px] font-medium leading-snug text-[#16171A] underline decoration-[#16171A]/40 underline-offset-2 md:text-[14px]">
          {title}
        </Link>

        <PriceSpread
          low={product.cheapest_offer}
          high={product.expensive_offer}
          points={product.price_trend?.points}
        />

        <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-[#404042] md:text-[12px]">
          {product.total_offers > 0 ? (
            <span className="font-semibold text-[#16171A]">{product.total_offers} Händler</span>
          ) : null}
          {product.total_offers > 0 && vendors ? ' · ' : null}
          {vendors}
        </p>

        <div className="mt-1.5 flex flex-wrap gap-1">
          <Grade label="Kraftstoff" grade={eu.fuel} />
          <Grade label="Nass" grade={eu.wet} />
          <Grade label="Lärm" grade={eu.noiseClass} />
        </div>
      </div>
    </article>
  );
}

export default function ListingShowcase({ products }: { products: Array<Record<string, unknown>> }) {
  const items = products.map(normalize).filter((p): p is ShowcaseProduct => Boolean(p));
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const pausedRef = useRef(false);
  const suppressRef = useRef(false);
  const dragRef = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const slider = () => window.matchMedia('(max-width: 1023px)').matches;

  const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const el = scrollerRef.current;
    if (!el || !slider()) return;
    const cards = [...el.querySelectorAll<HTMLElement>('[data-slide]')];
    if (!cards.length) return;
    const i = (index + cards.length) % cards.length;
    const card = cards[i];
    el.scrollTo({
      left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2,
      behavior,
    });
    activeRef.current = i;
    setActive(i);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const mq = window.matchMedia('(max-width: 1023px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = 0;

    const tick = () => {
      if (pausedRef.current || !mq.matches || reduce.matches) return;
      const cards = [...el.querySelectorAll<HTMLElement>('[data-slide]')];
      if (cards.length < 2) return;
      const i = (activeRef.current + 1) % cards.length;
      const card = cards[i];
      el.scrollTo({
        left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2,
        behavior: 'smooth',
      });
    };

    const arm = () => {
      window.clearInterval(timer);
      if (mq.matches && !reduce.matches && items.length > 1) {
        timer = window.setInterval(tick, 4500);
      }
    };

    const onScroll = () => {
      if (!mq.matches) return;
      const cards = [...el.querySelectorAll<HTMLElement>('[data-slide]')];
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let dist = Infinity;
      cards.forEach((card, i) => {
        const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      if (best !== activeRef.current) {
        activeRef.current = best;
        setActive(best);
      }
    };

    arm();
    mq.addEventListener('change', arm);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearInterval(timer);
      mq.removeEventListener('change', arm);
      el.removeEventListener('scroll', onScroll);
    };
  }, [items.length]);

  if (!items.length) return null;

  const desktopVisible = 6;

  return (
    <div className="relative max-lg:-mx-4">
      {items.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Vorheriges Angebot"
            onClick={() => scrollToIndex(activeRef.current - 1)}
            className="absolute left-2 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E4E5EA] bg-white text-[#16171A] shadow-sm lg:hidden"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Nächstes Angebot"
            onClick={() => scrollToIndex(activeRef.current + 1)}
            className="absolute right-2 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E4E5EA] bg-white text-[#16171A] shadow-sm lg:hidden"
          >
            <ChevronRight size={18} />
          </button>
        </>
      ) : null}

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-3 lg:overflow-visible lg:snap-none [&::-webkit-scrollbar]:hidden"
        onPointerDown={(event) => {
          if (event.pointerType !== 'mouse' || !slider()) return;
          const el = scrollerRef.current;
          if (!el) return;
          dragRef.current = { x: event.clientX, left: el.scrollLeft, moved: false };
          pausedRef.current = true;
          el.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragRef.current || !scrollerRef.current) return;
          const dx = event.clientX - dragRef.current.x;
          if (Math.abs(dx) > 6) dragRef.current.moved = true;
          scrollerRef.current.scrollLeft = dragRef.current.left - dx;
        }}
        onPointerUp={() => {
          if (dragRef.current?.moved) {
            suppressRef.current = true;
            window.setTimeout(() => {
              suppressRef.current = false;
            }, 50);
          }
          dragRef.current = null;
          pausedRef.current = false;
        }}
        onPointerCancel={() => {
          dragRef.current = null;
          pausedRef.current = false;
        }}
        onClickCapture={(event) => {
          if (!suppressRef.current) return;
          event.preventDefault();
          event.stopPropagation();
        }}
        onTouchStart={() => {
          pausedRef.current = true;
        }}
        onTouchEnd={() => {
          window.setTimeout(() => {
            pausedRef.current = false;
          }, 2800);
        }}
      >
        {items.map((product, index) => (
          <div
            key={product._id}
            data-slide
            className={`w-full shrink-0 snap-start px-4 lg:w-auto lg:shrink lg:px-0 ${
              index >= desktopVisible && !expanded ? 'lg:hidden' : ''
            }`}
          >
            <ShowcaseCard product={product} />
          </div>
        ))}
      </div>

      {items.length > desktopVisible ? (
        <div className="mt-4 hidden justify-center lg:flex">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            className="rounded-full border border-primary-100 bg-white px-6 py-2.5 text-[14px] font-semibold text-primary-100 transition-colors hover:bg-primary-100 hover:text-white"
          >
            {expanded ? 'Weniger anzeigen' : 'Mehr anzeigen'}
          </button>
        </div>
      ) : null}

      {items.length > 1 ? (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 lg:hidden">
          {items.map((product, index) => (
            <button
              key={product._id}
              type="button"
              aria-label={`Angebot ${index + 1} von ${items.length}`}
              aria-current={index === active ? 'true' : undefined}
              onClick={() => scrollToIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === active ? 'w-4 bg-primary-100' : 'w-1.5 bg-[#D0D5DD]'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
