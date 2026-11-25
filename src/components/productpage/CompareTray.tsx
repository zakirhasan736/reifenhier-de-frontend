'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowRight, Crown, GitCompareArrows, Plus, Trash2, X } from 'lucide-react';
import OptimizedImage from '@/components/elements/OptimizedImage';
import { productImageSrc } from '@/libs/productImage';
import { addProduct, clearProducts, openModal, removeProduct } from '@/store/compareSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { formatEuro } from '@/libs/money';
import { comparePrice, compareVerdict, parseTyreSize, sameSize } from '@/libs/compare';

const SLOTS = 4;

/**
 * Floating compare bar. Mobile: full-width bottom sheet with big thumbs and
 * one big button. With one tyre it suggests a same-size partner (one tap),
 * with two or more it already names the winner.
 */
export default function CompareTray() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.compare.products);
  const suggestions = useSelector((state: RootState) => state.compare.suggestions);
  const isOpen = useSelector((state: RootState) => state.compare.isOpen);
  const visible = products.length > 0 && !isOpen;
  const trayRef = useRef<HTMLDivElement>(null);

  const verdict = useMemo(() => compareVerdict(products), [products]);
  const best = products.find(p => p._id === verdict.bestId);
  const partner = useMemo(() => {
    const base = products[0];
    if (!base || products.length !== 1) return null;
    return suggestions.find(s => s._id !== base._id && sameSize(base, s)) || null;
  }, [products, suggestions]);

  // Publish the tray height as --compare-tray-h so toasts / Searchlight sit above it.
  useEffect(() => {
    const root = document.documentElement;
    const el = trayRef.current;
    if (!visible || !el) {
      root.style.setProperty('--compare-tray-h', '0px');
      return;
    }
    const update = () => root.style.setProperty('--compare-tray-h', `${el.offsetHeight + 8}px`);
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty('--compare-tray-h', '0px');
    };
  }, [visible, products.length, partner]);

  if (!visible) return null;

  const slots = Array.from({ length: SLOTS }, (_, i) => products[i] || null);
  const size = products[0] ? parseTyreSize(products[0]).label : '';
  const canCompare = products.length >= 2;

  return (
    <AnimatePresence>
      <motion.div
        key="compare-tray"
        ref={trayRef}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed inset-x-0 z-[9990] transition-[bottom] duration-300 md:left-1/2 md:right-auto md:w-[min(980px,calc(100%-2rem))] md:-translate-x-1/2"
        style={{ bottom: 'calc(var(--pdp-sticky-h, 0px) + var(--compare-tray-gap, 0px))' }}
      >
        <div className="rounded-t-[22px] border-t border-[#E4E7F0] bg-white/97 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-12px_40px_rgba(16,24,40,0.16)] backdrop-blur-md md:mb-4 md:rounded-[22px] md:border md:px-4 md:py-3">
          {/* Line 1: what is in the comparison */}
          <div className="flex items-center gap-3">
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#EEF2FF] sm:inline-flex">
              <GitCompareArrows size={20} color="#2F4FD8" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-[12px] font-bold !text-[#16171A]">
                Vergleich
                <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[11px] !text-[#2F4FD8]">
                  {products.length}/{SLOTS}
                </span>
                {size ? <span className="truncate text-[11.5px] font-medium !text-[#6B7280]">{size}</span> : null}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                {slots.map((item, i) => {
                  const img = item ? productImageSrc(item.product_image, item.awin_image_url) : null;
                  const isBest = item && canCompare && item._id === verdict.bestId;
                  return (
                    <div
                      key={item?._id || `empty-${i}`}
                      className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] ${
                        item ? (isBest ? 'bg-white ring-2 ring-[#16A34A]' : 'bg-[#F4F6FB] ring-1 ring-[#E4E7F0]') : 'border border-dashed border-[#CDD3E1] bg-white'
                      }`}
                    >
                      {item && img ? (
                        <>
                          <OptimizedImage src={img.src} fallbacks={img.fallbacks} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
                          <button
                            type="button"
                            aria-label={`${item.brand_name} entfernen`}
                            onClick={() => dispatch(removeProduct(item._id))}
                            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#16171A] ring-2 ring-white cursor-pointer"
                          >
                            <X size={11} color="#fff" strokeWidth={3} />
                          </button>
                          {isBest ? (
                            <span className="absolute -bottom-1.5 left-1/2 inline-flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-[#16A34A] ring-2 ring-white">
                              <Crown size={9} color="#fff" />
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <Plus size={16} color="#B6BDCD" />
                      )}
                    </div>
                  );
                })}
                <p className="ml-1 hidden min-w-0 flex-1 text-[12.5px] leading-snug !text-[#4B5163] md:block">
                  {canCompare && best ? (
                    <>
                      <span className="font-bold !text-[#15803D]">Empfehlung:</span> {best.brand_name} · {formatEuro(comparePrice(best))}
                    </>
                  ) : (
                    'Wähle noch einen Reifen derselben Größe zum Vergleichen.'
                  )}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => {
                  dispatch(clearProducts());
                  toast.success('Vergleich geleert');
                }}
                aria-label="Vergleich leeren"
                className="hidden rounded-full p-2 hover:bg-[#F4F6FB] cursor-pointer sm:inline-flex"
              >
                <Trash2 size={17} color="#6B7280" />
              </button>
              <button
                type="button"
                onClick={() => dispatch(openModal())}
                disabled={!canCompare}
                className="sl-white inline-flex h-11 items-center gap-1.5 rounded-[14px] bg-gradient-to-r from-[#1B2A6B] to-[#2F4FD8] px-4 text-[14px] font-bold shadow-[0_10px_22px_-10px_rgba(47,79,216,0.8)] transition disabled:cursor-not-allowed disabled:from-[#9AA6C8] disabled:to-[#9AA6C8] disabled:shadow-none cursor-pointer"
              >
                {canCompare ? (
                  <>
                    Vergleichen <ArrowRight size={16} />
                  </>
                ) : (
                  'Noch 1 wählen'
                )}
              </button>
            </div>
          </div>

          {/* Line 2 (mobile): winner, or a one-tap partner suggestion */}
          {canCompare && best ? (
            <p className="mt-2 flex items-center gap-1.5 rounded-[10px] bg-[#F0FDF4] px-2.5 py-1.5 text-[12px] !text-[#14532D] md:hidden">
              <Crown size={13} color="#15803D" /> <b>Empfehlung:</b> <span className="truncate">{best.brand_name} · {formatEuro(comparePrice(best))}</span>
            </p>
          ) : partner ? (
            <div className="mt-2 flex items-center gap-2 rounded-[12px] bg-[#F6F8FC] p-1.5 pr-2 ring-1 ring-[#E4E7F0]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white">
                {(() => {
                  const img = productImageSrc(partner.product_image, partner.awin_image_url);
                  return <OptimizedImage src={img.src} fallbacks={img.fallbacks} alt="" width={30} height={30} className="h-[30px] w-[30px] object-contain" />;
                })()}
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block text-[10.5px] font-bold uppercase tracking-[0.06em] !text-[#2F4FD8]">Passt dazu · gleiche Größe</span>
                <span className="block truncate text-[12.5px] font-semibold !text-[#16171A]">
                  {partner.brand_name} {partner.product_name.replace(new RegExp(`^${partner.brand_name}\\s*`, 'i'), '')} · {formatEuro(comparePrice(partner))}
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  dispatch(addProduct(partner));
                  toast.success('Zum Vergleich hinzugefügt');
                }}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[12px] font-bold !text-[#1B2A6B] ring-1 ring-[#C9D6FC] cursor-pointer"
              >
                <Plus size={13} color="#1B2A6B" strokeWidth={3} /> Dazu
              </button>
            </div>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
