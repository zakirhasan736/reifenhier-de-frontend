'use client';

import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OptimizedImage from '@/components/elements/OptimizedImage';
import { productImageSrc } from '@/libs/productImage';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  addProduct,
  closeModal,
  clearProducts,
  removeProduct,
  type CompareProduct,
} from '@/store/compareSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { formatEuro } from '@/libs/money';
import { formatSavingsPercent, highestPrice, lowestPrice } from '@/libs/savings';
import {
  comparePrice,
  listingUrlForSize,
  parseTyreSize,
  pickWinners,
  sameSize,
  speedRank,
  loadRank,
} from '@/libs/compare';
import { getFuelEfficiencyMeta, getWetGripMeta } from '@/utils/euLabelMapping';

function displayName(p: CompareProduct) {
  return [p.brand_name, p.product_name].filter(Boolean).join(' ');
}

function Badge({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'green' | 'amber' }) {
  const tones = {
    blue: 'bg-[#EEF4FF] text-primary-100 border-primary-100/20',
    green: 'bg-[#EEFAE5] text-[#2d8934] border-[#2d8934]/20',
    amber: 'bg-[#FFF6E8] text-[#E66605] border-[#E66605]/20',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export default function CompareModal() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.compare.products);
  const suggestions = useSelector((state: RootState) => state.compare.suggestions);
  const isOpen = useSelector((state: RootState) => state.compare.isOpen);
  const panelRef = useRef<HTMLDivElement>(null);

  const winners = useMemo(() => pickWinners(products), [products]);
  const base = products[0];
  const mixedSizes = products.length > 1 && products.some(p => base && !sameSize(base, p));

  const compatibleSuggestions = useMemo(() => {
    if (!base) return [];
    return suggestions
      .filter(s => !products.some(p => p._id === s._id))
      .filter(s => sameSize(base, s))
      .slice(0, 6);
  }, [suggestions, products, base]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch(closeModal());
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, dispatch]);

  if (!isOpen || products.length === 0) return null;

  const handleAdd = (prod: CompareProduct) => {
    if (products.length >= 4) {
      toast.error('Maximal 4 Reifen im Vergleich');
      return;
    }
    dispatch(addProduct(prod));
    toast.success('Zum Vergleich hinzugefügt');
  };

  const cols = `minmax(140px,180px) repeat(${products.length}, minmax(180px,1fr))`;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-[#16171A]/45 p-0 md:items-center md:p-6"
      onClick={() => dispatch(closeModal())}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-title"
        onClick={e => e.stopPropagation()}
        className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl md:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#F0F0F2] px-5 py-4 md:px-7">
          <div>
            <h2 id="compare-title" className="text-[22px] font-semibold text-[#16171A]">
              Reifenvergleich
            </h2>
            <p className="mt-1 text-[14px] text-[#5A5B61]">
              Preis, EU-Label und Größe nebeneinander — so finden Sie den passenden Reifen.
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E4E5EA] text-[#16171A]"
            aria-label="Schließen"
          >
            ×
          </button>
        </div>

        <div className="overflow-auto px-5 py-4 md:px-7">
          {mixedSizes ? (
            <div className="mb-4 rounded-xl border border-[#F5D9B8] bg-[#FFF8F0] px-4 py-3 text-[13px] text-[#8A4B12]">
              Unterschiedliche Größen im Vergleich. Für Ihr Auto sollten Breite, Höhe und Zoll übereinstimmen.
            </div>
          ) : base ? (
            <div className="mb-4 rounded-xl border border-[#DCEBFF] bg-[#F5F9FF] px-4 py-3 text-[13px] text-[#1B4F8A]">
              Vergleich für Größe <strong>{parseTyreSize(base).label}</strong>
              {base.merchant_product_third_category
                ? ` · ${base.merchant_product_third_category}`
                : ''}
              . Last- und Geschwindigkeitsindex dürfen gleich oder höher sein.
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <div className="min-w-[640px]" style={{ display: 'grid', gridTemplateColumns: cols }}>
              <div className="sticky left-0 z-10 bg-white p-3 text-[12px] font-semibold uppercase tracking-wide text-[#9AA0A8]">
                Modell
              </div>
              {products.map(p => {
                const recommended = winners.recommendedId === p._id;
                const cheapest = winners.cheapestId === p._id;
                const img = productImageSrc(p.product_image, p.awin_image_url);
                return (
                  <div key={p._id} className="border-l border-[#F0F0F2] p-3 text-center">
                    <div className="relative mx-auto mb-3 flex h-28 items-center justify-center rounded-2xl bg-[#F7F7F7]">
                      <OptimizedImage
                        src={img.src}
                        fallbacks={img.fallbacks}
                        alt={displayName(p)}
                        width={110}
                        height={110}
                        className="h-24 w-24 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => dispatch(removeProduct(p._id))}
                        className="absolute right-2 top-2 text-[12px] text-[#9AA0A8] hover:text-[#16171A]"
                      >
                        Entfernen
                      </button>
                    </div>
                    <div className="mb-2 flex flex-wrap justify-center gap-1">
                      {recommended ? <Badge>Empfehlung</Badge> : null}
                      {cheapest ? <Badge tone="green">Bester Preis</Badge> : null}
                    </div>
                    <Link
                      href={`/produkte/${p.slug}`}
                      className="block text-[14px] font-semibold leading-snug text-[#16171A] hover:text-primary-100"
                    >
                      {displayName(p)}
                    </Link>
                  </div>
                );
              })}

              <RowLabel>Preis</RowLabel>
              {products.map(p => {
                const label = formatSavingsPercent(
                  lowestPrice(p.cheapest_offer, p.search_price),
                  highestPrice(p.expensive_offer),
                );
                return (
                <Cell key={p._id} win={winners.cheapestId === p._id}>
                  <span className="text-[20px] font-semibold text-[#16171A]">
                    {formatEuro(comparePrice(p))}
                  </span>
                  {label ? (
                    <span className="mt-1 block text-[12px] font-medium text-[#E66605]">
                      {label}
                    </span>
                  ) : null}
                </Cell>
                );
              })}

              <RowLabel>Größe / Passform</RowLabel>
              {products.map(p => {
                const size = parseTyreSize(p);
                const fits = base ? sameSize(base, p) : true;
                return (
                  <Cell key={p._id} win={fits}>
                    <div className="font-medium text-[#16171A]">{size.label}</div>
                    {fits ? (
                      <Badge tone="green">Passend zur Auswahl</Badge>
                    ) : (
                      <Badge tone="amber">Andere Größe</Badge>
                    )}
                  </Cell>
                );
              })}

              <RowLabel>Last- / Speedindex</RowLabel>
              {products.map(p => {
                const loadOk =
                  !base ||
                  loadRank(p.lastIndex) < 0 ||
                  loadRank(p.lastIndex) >= loadRank(base.lastIndex);
                const speedOk =
                  !base ||
                  speedRank(p.speedIndex) < 0 ||
                  speedRank(p.speedIndex) >= speedRank(base.speedIndex);
                return (
                  <Cell key={p._id} win={loadOk && speedOk}>
                    <div className="font-medium text-[#16171A]">
                      {p.lastIndex || '—'}
                      {p.speedIndex || ''}
                    </div>
                    {loadOk && speedOk ? (
                      <span className="text-[12px] text-[#2d8934]">Für die gewählte Größe geeignet</span>
                    ) : (
                      <span className="text-[12px] text-[#E66605]">Index prüfen — ggf. zu niedrig</span>
                    )}
                  </Cell>
                );
              })}

              <RowLabel>Kraftstoffeffizienz</RowLabel>
              {products.map(p => {
                const meta = getFuelEfficiencyMeta(p.fuel_class);
                return (
                  <Cell key={p._id} win={winners.bestFuelId === p._id}>
                    <span className="text-[18px] font-bold" style={{ color: meta.color }}>
                      {p.fuel_class || '—'}
                    </span>
                    <div className="text-[12px] text-[#5A5B61]">{meta.textDE}</div>
                  </Cell>
                );
              })}

              <RowLabel>Nasshaftung</RowLabel>
              {products.map(p => {
                const meta = getWetGripMeta(p.wet_grip);
                return (
                  <Cell key={p._id} win={winners.bestWetId === p._id}>
                    <span className="text-[18px] font-bold" style={{ color: meta.color }}>
                      {p.wet_grip || '—'}
                    </span>
                    <div className="text-[12px] text-[#5A5B61]">{meta.textDE}</div>
                  </Cell>
                );
              })}

              <RowLabel>Rollgeräusch</RowLabel>
              {products.map(p => (
                <Cell key={p._id} win={winners.quietestId === p._id}>
                  <span className="font-medium text-[#16171A]">
                    {p.noise_class || '—'}
                    {String(p.noise_class || '').toLowerCase().includes('db') ? '' : ' dB'}
                  </span>
                </Cell>
              ))}

              <RowLabel></RowLabel>
              {products.map(p => (
                <div key={p._id} className="border-l border-[#F0F0F2] p-3 text-center">
                  <Link
                    href={`/produkte/${p.slug}`}
                    className="inline-flex h-10 w-full items-center justify-center rounded-full bg-primary-100 text-[13px] font-semibold text-white"
                    onClick={() => dispatch(closeModal())}
                  >
                    Angebote ansehen
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {base ? (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#F7F7F7] px-4 py-4">
              <p className="text-[14px] text-[#404042]">
                Weitere Reifen in <strong>{parseTyreSize(base).label}</strong> für Ihr Fahrzeug finden.
              </p>
              <Link
                href={listingUrlForSize(base)}
                className="inline-flex h-10 items-center rounded-full border border-primary-100 px-4 text-[13px] font-semibold text-primary-100"
                onClick={() => dispatch(closeModal())}
              >
                Gleiche Größe suchen
              </Link>
            </div>
          ) : null}

          {compatibleSuggestions.length > 0 ? (
            <div className="mt-6">
              <h3 className="mb-3 text-[16px] font-semibold text-[#16171A]">
                Passende Alternativen derselben Größe
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {compatibleSuggestions.map(prod => {
                  const img = productImageSrc(prod.product_image, prod.awin_image_url);
                  return (
                  <div
                    key={prod._id}
                    className="flex items-center gap-3 rounded-2xl border border-[#E4E5EA] p-3"
                  >
                    <OptimizedImage
                      src={img.src}
                      fallbacks={img.fallbacks}
                      alt=""
                      width={48}
                      height={48}
                      className="h-12 w-12 object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-[#16171A]">
                        {displayName(prod)}
                      </p>
                      <p className="text-[13px] text-primary-100">
                        {formatEuro(comparePrice(prod))}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAdd(prod)}
                      className="rounded-full bg-primary-100 px-3 py-1.5 text-[12px] font-semibold text-white"
                    >
                      Hinzufügen
                    </button>
                  </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F0F0F2] px-5 py-4 md:px-7">
          <button
            type="button"
            onClick={() => {
              dispatch(clearProducts());
              toast.success('Vergleich geleert');
            }}
            className="text-[13px] text-[#5A5B61] underline underline-offset-2"
          >
            Alle entfernen
          </button>
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="inline-flex h-10 items-center rounded-full bg-primary-100 px-5 text-[14px] font-semibold text-white"
          >
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
}

function RowLabel({ children }: { children?: ReactNode }) {
  return (
    <div className="sticky left-0 z-10 flex items-center border-t border-[#F0F0F2] bg-white p-3 text-[13px] font-medium text-[#5A5B61]">
      {children}
    </div>
  );
}

function Cell({
  children,
  win,
}: {
  children: ReactNode;
  win?: boolean;
}) {
  return (
    <div
      className={`border-l border-t border-[#F0F0F2] p-3 text-center ${
        win ? 'bg-[#F4FBF0]' : 'bg-white'
      }`}
    >
      {children}
    </div>
  );
}
