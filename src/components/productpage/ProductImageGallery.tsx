'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from '@/components/elements/OptimizedImage';
import { productImageSrc } from '@/libs/productImage';

function normalizeImages(source: string | string[] | undefined | null): string[] {
  if (!source) return [];
  if (Array.isArray(source)) return source.map(String).filter(Boolean);
  const value = String(source).trim();
  return value ? [value] : [];
}

export default function ProductImageGallery({
  images,
  awinImageUrl,
  merchantThumbUrl,
  merchantImageUrl,
  alt,
  header,
}: {
  images?: string | string[] | null;
  awinImageUrl?: string | null;
  merchantThumbUrl?: string | null;
  merchantImageUrl?: string | null;
  alt: string;
  header?: ReactNode;
}) {
  const list = useMemo(() => normalizeImages(images), [images]);
  const extras = useMemo(
    () => [merchantThumbUrl, merchantImageUrl],
    [merchantThumbUrl, merchantImageUrl]
  );
  const [active, setActive] = useState(0);
  const current = list[Math.min(active, Math.max(list.length - 1, 0))];
  const { src, fallbacks } = productImageSrc(current, awinImageUrl, extras);

  const go = (dir: 1 | -1) => {
    if (list.length < 2) return;
    setActive(i => (i + dir + list.length) % list.length);
  };

  return (
    <div className="product-image-gallery">
      <div className="swiper-slides-view-area relative overflow-hidden rounded-[20px] border border-[#E9ECF3] bg-gradient-to-b from-[#F7F8FB] to-white p-3 md:p-6">
        {header ? <div className="relative z-20">{header}</div> : null}
        <div className="swiper-slider-view relative w-full">
          <div className="slide-view-item flex h-[220px] sm:h-[320px] lg:h-[420px] items-center justify-center">
            <OptimizedImage
              key={src}
              src={src}
              alt={alt}
              className="max-h-full w-auto object-contain drop-shadow-[0_18px_24px_rgba(16,24,40,0.18)]"
              width={420}
              height={420}
              priority
              fetchPriority="high"
              fallbacks={fallbacks}
            />
          </div>

          {list.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Vorheriges Bild"
                onClick={() => go(-1)}
                className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#16171A] shadow-[0_2px_8px_rgba(16,24,40,0.15)] cursor-pointer hover:scale-105"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Nächstes Bild"
                onClick={() => go(1)}
                className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#16171A] shadow-[0_2px_8px_rgba(16,24,40,0.15)] cursor-pointer hover:scale-105"
              >
                <ChevronRight size={18} />
              </button>
            </>
          ) : null}
        </div>
      </div>

      {list.length > 1 ? (
        <div className="mt-2 md:mt-3 flex justify-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {list.map((image, index) => {
            const thumb = productImageSrc(image, awinImageUrl, [merchantThumbUrl, merchantImageUrl]);
            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Bild ${index + 1}`}
                aria-current={index === active}
                className={`slide-tab-item-wrap flex h-[56px] w-[56px] md:h-[84px] md:w-[84px] shrink-0 items-center justify-center rounded-[12px] border-2 bg-[#F7F8FB] p-1.5 cursor-pointer transition ${
                  index === active ? 'border-primary-100' : 'border-transparent hover:border-[#C9D6FC]'
                }`}
              >
                <OptimizedImage
                  src={thumb.src}
                  alt=""
                  className="max-h-full w-auto object-contain"
                  width={84}
                  height={84}
                  fallbacks={thumb.fallbacks}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
