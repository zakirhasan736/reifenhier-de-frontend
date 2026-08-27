'use client';

import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import OptimizedImage from '@/components/elements/OptimizedImage';
import { productImageSrc } from '@/libs/productImage';
import {
  clearProducts,
  openModal,
  removeProduct,
} from '@/store/compareSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { formatEuro } from '@/libs/money';
import { comparePrice } from '@/libs/compare';

const SLOTS = 4;

export default function CompareTray() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.compare.products);
  const isOpen = useSelector((state: RootState) => state.compare.isOpen);

  if (products.length === 0 || isOpen) return null;

  const slots = Array.from({ length: SLOTS }, (_, i) => products[i] || null);

  return (
    <AnimatePresence>
      <motion.div
        key="compare-tray"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-4 left-1/2 z-[80] w-[min(960px,calc(100%-1.5rem))] -translate-x-1/2"
      >
        <div className="rounded-2xl border border-[#E4E5EA] bg-white/95 shadow-[0_12px_40px_rgba(22,23,26,0.16)] backdrop-blur-md px-3 py-3 md:px-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9AA0A8]">
                Vergleich {products.length}/{SLOTS}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {slots.map((item, i) => {
                  const img = item
                    ? productImageSrc(item.product_image, item.awin_image_url)
                    : null;
                  return (
                  <div
                    key={item?._id || `empty-${i}`}
                    className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E4E5EA] bg-[#F7F7F7]"
                  >
                    {item && img ? (
                      <>
                        <OptimizedImage
                          src={img.src}
                          fallbacks={img.fallbacks}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 object-contain"
                        />
                        <button
                          type="button"
                          aria-label="Entfernen"
                          onClick={() => dispatch(removeProduct(item._id))}
                          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#16171A] text-[10px] text-white"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <span className="text-[18px] leading-none text-[#C6C7CC]">+</span>
                    )}
                  </div>
                  );
                })}
                <p className="hidden min-w-0 truncate text-[13px] text-[#5A5B61] sm:block">
                  {products[0]
                    ? `${formatEuro(comparePrice(products[0]))} · ${products[0].brand_name}`
                    : 'Produkte zum Vergleichen hinzufügen'}
                </p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => dispatch(clearProducts())}
                className="hidden text-[13px] text-[#5A5B61] underline underline-offset-2 sm:inline"
              >
                Leeren
              </button>
              <button
                type="button"
                onClick={() => dispatch(openModal())}
                disabled={products.length < 2}
                className="inline-flex h-10 items-center rounded-full bg-primary-100 px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {products.length < 2
                  ? 'Noch 1 Reifen wählen'
                  : `${products.length} Reifen vergleichen`}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
