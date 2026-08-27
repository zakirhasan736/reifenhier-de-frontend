'use client';

import { useMemo, useState, type ReactNode } from 'react';
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
  alt,
  header,
}: {
  images?: string | string[] | null;
  awinImageUrl?: string | null;
  alt: string;
  header?: ReactNode;
}) {
  const list = useMemo(() => normalizeImages(images), [images]);
  const [active, setActive] = useState(0);
  const current = list[Math.min(active, Math.max(list.length - 1, 0))];
  const { src, fallbacks } = productImageSrc(current, awinImageUrl);

  const go = (dir: 1 | -1) => {
    if (list.length < 2) return;
    setActive(i => (i + dir + list.length) % list.length);
  };

  return (
    <div className="product-image-gallery">
      <div className="swiper-slides-view-area border border-border-100 bg-[#F7F7F7] rounded-[10px] md:p-8 p-6">
        {header}
        <div className="swiper-slider-view relative mt-2 w-full">
          <div className="slide-view-item flex justify-center">
            <OptimizedImage
              key={src}
              src={src}
              alt={alt}
              className="lg:h-[417px] h-[218px] max-md:w-auto object-contain"
              width={343}
              height={417}
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
                className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#16171A] shadow"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Nächstes Bild"
                onClick={() => go(1)}
                className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#16171A] shadow"
              >
                ›
              </button>
            </>
          ) : null}
        </div>
      </div>

      {list.length > 1 ? (
        <div className="mt-3 flex justify-center gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {list.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Bild ${index + 1}`}
              aria-current={index === active}
              className={`slide-tab-item-wrap w-[87px] xl:w-auto shrink-0 rounded-[10px] bg-[#F7F7F7] px-3 py-2 md:px-4 md:py-3 xl:px-[47px] xl:pt-[25px] xl:pb-[24px] flex justify-center border ${
                index === active
                  ? 'border-primary-100'
                  : 'border-transparent'
              }`}
            >
              <OptimizedImage
                src={image}
                alt=""
                className="h-[70px] w-[87px] object-contain xl:h-[106px] xl:w-auto"
                width={106}
                height={106}
                fallbacks={awinImageUrl ? [awinImageUrl] : []}
              />
            </button>
          ))}
        </div>
      ) : list.length === 1 ? (
        <div className="swiper-product-slide-tab-item mt-3 flex justify-center items-center">
          <div className="slide-tab-item">
            <div className="slide-tab-item-wrap w-[87px] xl:w-auto bg-[#F7F7F7] rounded-[10px] xl:pl-[47px] xl:pt-[25px] xl:pr-[47px] xl:pb-[24px] py-3 px-4 flex justify-center">
              <OptimizedImage
                src={list[0]}
                alt=""
                className="w-[87px] xl:w-auto xl:h-[106px] max-sm:h-[78px] h-[70px] object-contain"
                width={106}
                height={106}
                fallbacks={awinImageUrl ? [awinImageUrl] : []}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
