'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Variant = 'products' | 'brands' | 'compact';

const SLIDE_CLASS: Record<Variant, string> = {
  products:
    'w-[calc((100%-10px)*0.75)] flex-[0_0_calc((100%-10px)*0.75)] md:w-[calc((100%-16px)/2)] md:flex-[0_0_calc((100%-16px)/2)] lg:w-[calc((100%-57px)/4)] lg:flex-[0_0_calc((100%-57px)/4)]',
  brands:
    'w-[calc((100%-16px)/3)] flex-[0_0_calc((100%-16px)/3)] md:w-[calc((100%-45px)/4)] md:flex-[0_0_calc((100%-45px)/4)] lg:w-[calc((100%-120px)/6)] lg:flex-[0_0_calc((100%-120px)/6)] xl:w-[calc((100%-168px)/8)] xl:flex-[0_0_calc((100%-168px)/8)] 2xl:w-[calc((100%-192px)/9)] 2xl:flex-[0_0_calc((100%-192px)/9)]',
  compact:
    'w-[calc((100%-10px)*0.75)] flex-[0_0_calc((100%-10px)*0.75)] md:w-[calc((100%-16px)/2)] md:flex-[0_0_calc((100%-16px)/2)] lg:w-[calc((100%-57px)/4)] lg:flex-[0_0_calc((100%-57px)/4)]',
};

const GAP_CLASS: Record<Variant, string> = {
  products: 'gap-[10px] md:gap-4 lg:gap-[19px]',
  brands: 'gap-2 md:gap-[15px] lg:gap-6',
  compact: 'gap-[10px] md:gap-4 lg:gap-5',
};

const ARROW =
  'ssr-carousel-arrow flex h-9 w-9 md:h-[42px] md:w-[42px] items-center justify-center rounded-full border border-[#E8E8EC] bg-white text-[#0D0113] shadow-[0_8px_24px_rgba(13,1,19,0.12)] transition-transform duration-300 hover:scale-105 hover:bg-white active:scale-95';

function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

function animateScrollLeft(el: HTMLElement, to: number, duration = 620) {
  const start = el.scrollLeft;
  const change = to - start;
  if (Math.abs(change) < 1) return Promise.resolve();

  const prevSnap = el.style.scrollSnapType;
  el.style.scrollSnapType = 'none';

  return new Promise<void>(resolve => {
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      el.scrollLeft = start + change * easeOutQuint(p);
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        el.scrollLeft = to;
        el.style.scrollSnapType = prevSnap;
        resolve();
      }
    };
    requestAnimationFrame(step);
  });
}

function slideMetrics(el: HTMLElement) {
  const slide = el.querySelector('[data-ssr-slide]') as HTMLElement | null;
  const style = slide ? window.getComputedStyle(el) : null;
  const gap = style ? parseFloat(style.columnGap || style.gap || '0') || 0 : 0;
  const width = slide
    ? slide.getBoundingClientRect().width + gap
    : el.clientWidth;
  return { width, max: Math.max(0, el.scrollWidth - el.clientWidth) };
}

export default function SsrCarousel({
  children,
  variant = 'products',
  autoplayMs = 0,
  className = '',
  ariaLabel = 'Karussell',
  fullBleed = false,
  slidesToScroll = 1,
  arrowAlign = 'edge',
  showDots = true,
}: {
  children: React.ReactNode;
  variant?: Variant;
  autoplayMs?: number;
  className?: string;
  ariaLabel?: string;
  fullBleed?: boolean;
  slidesToScroll?: number;
  arrowAlign?: 'edge' | 'container';
  showDots?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);
  const animatingRef = useRef(false);
  const stepRef = useRef(slidesToScroll);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  stepRef.current = Math.max(1, slidesToScroll);
  const items = React.Children.toArray(children).filter(Boolean);

  const scrollBySlides = useCallback(async (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el || animatingRef.current) return;
    const { width, max } = slideMetrics(el);
    if (width <= 0) return;

    const step = width * stepRef.current;
    let next = el.scrollLeft + dir * step;
    if (next > max - 8) next = 0;
    if (next < 0) next = max;

    animatingRef.current = true;
    await animateScrollLeft(el, next, 640);
    animatingRef.current = false;
  }, []);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { width, max } = slideMetrics(el);
    if (width <= 0) return;
    const step = width * stepRef.current;
    setPage(Math.round(el.scrollLeft / step));
    setPages(Math.max(1, Math.round(max / step) + 1));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update, items.length]);

  useEffect(() => {
    if (!autoplayMs || items.length < 2) return;
    const id = window.setInterval(() => {
      if (!hoverRef.current && !animatingRef.current) scrollBySlides(1);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplayMs, items.length, scrollBySlides]);

  if (items.length === 0) return null;

  const showArrows = pages > 1 || items.length > 1;
  const containerArrows = arrowAlign === 'container';
  const arrowInset = fullBleed
    ? 'left-2 sm:left-4 lg:left-6'
    : 'left-1 sm:left-2 md:left-[-10px]';
  const arrowInsetRight = fullBleed
    ? 'right-2 sm:right-4 lg:right-6'
    : 'right-1 sm:right-2 md:right-[-10px]';

  const arrows = showArrows ? (
    <>
      <button
        type="button"
        aria-label="Zurück"
        onClick={() => scrollBySlides(-1)}
        className={
          containerArrows
            ? `${ARROW} pointer-events-auto absolute top-[38%] left-0 z-30 -translate-x-1/2 -translate-y-1/2`
            : `${ARROW} absolute top-[42%] z-30 -translate-y-1/2 ${arrowInset}`
        }
      >
        <ChevronLeft size={18} strokeWidth={2.5} />
      </button>
      <button
        type="button"
        aria-label="Weiter"
        onClick={() => scrollBySlides(1)}
        className={
          containerArrows
            ? `${ARROW} pointer-events-auto absolute top-[38%] right-0 z-30 translate-x-1/2 -translate-y-1/2`
            : `${ARROW} absolute top-[42%] z-30 -translate-y-1/2 ${arrowInsetRight}`
        }
      >
        <ChevronRight size={18} strokeWidth={2.5} />
      </button>
    </>
  ) : null;

  return (
    <div
      className={`ssr-carousel relative ${className}`}
      onMouseEnter={() => {
        hoverRef.current = true;
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
      }}
    >
      <div
        ref={scrollerRef}
        role="region"
        aria-label={ariaLabel}
        className={`ssr-carousel-track flex overflow-x-auto snap-x snap-mandatory touch-pan-x [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden ${GAP_CLASS[variant]}`}
      >
        {items.map((child, i) => (
          <div
            key={
              React.isValidElement(child) && child.key != null ? child.key : i
            }
            data-ssr-slide
            className={`ssr-carousel-slide flex h-full min-w-0 shrink-0 snap-start will-change-transform [&>*]:h-full [&>*]:w-full ${SLIDE_CLASS[variant]}`}
          >
            {child}
          </div>
        ))}
      </div>

      {containerArrows && arrows ? (
        <div className="pointer-events-none absolute inset-0 z-30">
          <div className="custom-container relative h-full">{arrows}</div>
        </div>
      ) : (
        arrows
      )}

      {showDots && pages > 1 ? (
        <div className="mt-5 flex justify-center gap-1.5 md:mt-6">
          {Array.from({ length: Math.min(pages, 10) }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                i === page ? 'w-5 bg-primary-100' : 'w-1.5 bg-[#D9DDE5]'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
