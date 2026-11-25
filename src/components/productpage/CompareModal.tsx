'use client';

import { useEffect, useMemo, type ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { AlertTriangle, ArrowRight, Check, Crown, Gauge, Plus, Ruler, ShieldCheck, Trash2, Volume1, X, Droplets, Fuel, Tag } from 'lucide-react';
import OptimizedImage from '@/components/elements/OptimizedImage';
import PriceTrendChart from '@/components/elements/PriceTrendChart';
import VendorExitLink from '@/components/elements/VendorExitLink';
import { productImageSrc } from '@/libs/productImage';
import { addProduct, refreshCompareProducts, closeModal, clearProducts, removeProduct, type CompareProduct } from '@/store/compareSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { formatEuro } from '@/libs/money';
import { comparePrice, compareVerdict, gradeRank, listingUrlForSize, loadRank, noiseDb, parseTyreSize, sameSize, shopSavingsPct, speedRank, trendPoints } from '@/libs/compare';
import { buildVendorExitUrl, onVendorExitClick } from '@/libs/analytics/vendorExit';

const API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
const GRADE_COLOR: Record<string, string> = { A: '#16A34A', B: '#65A30D', C: '#CA8A04', D: '#EA580C', E: '#DC2626' };
const WET_TEXT: Record<string, string> = { A: 'Kürzester Bremsweg', B: 'Sehr gut', C: 'Gut', D: 'Ausreichend', E: 'Schwach' };
const FUEL_TEXT: Record<string, string> = { A: 'Sehr sparsam', B: 'Sparsam', C: 'Mittel', D: 'Erhöht', E: 'Hoch' };

const shortName = (p: CompareProduct) => p.product_name.replace(new RegExp(`^${p.brand_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i'), '') || p.product_name;
const letter = (g?: string) => String(g || '').toUpperCase().replace(/[^A-G]/g, '')[0] || '';

function ShopLink({ p, className, label = 'Zum Angebot', hand = true }: { p: CompareProduct; className: string; label?: string; hand?: boolean }) {
  if (!p.best_vendor_token) {
    return (
      <Link href={`/produkte/${p.slug}`} className={className}>
        Angebote ansehen <ArrowRight size={15} />
      </Link>
    );
  }
  return (
    <VendorExitLink
      href={buildVendorExitUrl({ token: p.best_vendor_token, productId: p._id, from: 'compare-modal', vendor: p.best_vendor, vendorId: p.best_vendor_id, brand: p.brand_name, instruction: 'Zum Angebot' })}
      onExit={() =>
        onVendorExitClick({ productId: p._id, productName: p.product_name, brandName: p.brand_name, vendor: p.best_vendor, vendorId: p.best_vendor_id, source: 'compare-modal', instruction: 'Zum Angebot', vendorPrice: comparePrice(p) || undefined })
      }
      hand={hand}
      className={className}
    >
      {label} <ArrowRight size={15} />
    </VendorExitLink>
  );
}

function Grade({ g }: { g?: string }) {
  const l = letter(g);
  if (!l) return <span className="!text-[#9AA0A8]">—</span>;
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] text-[14px] font-bold !text-white" style={{ background: GRADE_COLOR[l] || '#64748B' }}>
      {l}
    </span>
  );
}

function BestBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-[#DCFCE7] px-1.5 py-0.5 text-[10.5px] font-bold !text-[#15803D]">
      <Check size={10} strokeWidth={3.5} color="#15803D" /> Bester
    </span>
  );
}

function ScoreBar({ value, best }: { value: number; best?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E8ECF5]">
        <span className={`block h-full rounded-full ${best ? 'bg-gradient-to-r from-[#22C55E] to-[#16A34A]' : 'bg-gradient-to-r from-[#93A8F5] to-[#2F4FD8]'}`} style={{ width: `${value}%` }} />
      </span>
      <span className={`w-7 text-right text-[12px] font-bold ${best ? '!text-[#15803D]' : '!text-[#2B3040]'}`}>{value}</span>
    </span>
  );
}

type Row = {
  key: string;
  label: string;
  icon: ReactNode;
  /** true for every product that has the best value of this row (ties included) */
  isBest: (p: CompareProduct) => boolean;
  render: (p: CompareProduct) => ReactNode;
  /** small text under the value on mobile */
  hint?: (p: CompareProduct) => string;
};

export default function CompareModal() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.compare.products);
  const suggestions = useSelector((state: RootState) => state.compare.suggestions);
  const isOpen = useSelector((state: RootState) => state.compare.isOpen);

  const verdict = useMemo(() => compareVerdict(products), [products]);
  const base = products[0];
  const mixedSizes = products.length > 1 && products.some(p => base && !sameSize(base, p));
  const best = products.find(p => p._id === verdict.bestId) || null;

  const compatibleSuggestions = useMemo(() => {
    if (!base) return [];
    return suggestions
      .filter(s => !products.some(p => p._id === s._id))
      .filter(s => sameSize(base, s))
      .slice(0, 6);
  }, [suggestions, products, base]);

  // Refresh live prices / best vendor whenever the comparison is opened.
  const idsKey = products.map(p => p._id).join(',');
  useEffect(() => {
    if (!isOpen || !API || products.length === 0) return;
    let cancelled = false;
    Promise.all(
      products.map(p =>
        fetch(`${API}/api/products/product-details/${encodeURIComponent(p.slug)}`, { cache: 'no-store' })
          .then(r => (r.ok ? r.json() : null))
          .then(j => (j?.product?._id ? j.product : null))
          .catch(() => null)
      )
    ).then(list => {
      const fresh = list.filter(Boolean);
      if (!cancelled && fresh.length) dispatch(refreshCompareProducts(fresh));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, idsKey, dispatch]);

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
  const close = () => dispatch(closeModal());

  const minOf = (vals: number[]) => (vals.length ? Math.min(...vals) : NaN);
  const priceMin = minOf(products.map(comparePrice).filter(x => x > 0));
  const wetMin = minOf(products.map(p => gradeRank(p.wet_grip)).filter(x => x < 99));
  const fuelMin = minOf(products.map(p => gradeRank(p.fuel_class)).filter(x => x < 99));
  const dbMin = minOf(products.map(noiseDb).filter((x): x is number => x != null));
  const allSame = (vals: number[]) => vals.length > 1 && vals.every(v => v === vals[0]);
  const wetAll = products.map(p => gradeRank(p.wet_grip));
  const fuelAll = products.map(p => gradeRank(p.fuel_class));
  const dbAll = products.map(p => noiseDb(p) ?? -1);
  const indexOk = (p: CompareProduct) =>
    (!base || loadRank(p.lastIndex) < 0 || loadRank(p.lastIndex) >= loadRank(base.lastIndex)) && (!base || speedRank(p.speedIndex) < 0 || speedRank(p.speedIndex) >= speedRank(base.speedIndex));

  const rows: Row[] = [
    {
      key: 'price',
      label: 'Preis',
      icon: <Tag size={15} color="#2F4FD8" />,
      isBest: p => comparePrice(p) > 0 && comparePrice(p) === priceMin && !allSame(products.map(comparePrice)),
      render: p => {
        const sp = shopSavingsPct(p);
        const t = trendPoints(p);
        return (
          <span className="block w-full">
            <span className="block text-[17px] font-bold !text-[#16171A]">{formatEuro(comparePrice(p))}</span>
            <span className="block text-[11.5px] !text-[#6B7280]">4 Stück {formatEuro(comparePrice(p) * 4)}</span>
            {verdict.extraFor4[p._id] > 0 ? <span className="block text-[11.5px] font-semibold !text-[#C2410C]">+{formatEuro(verdict.extraFor4[p._id])} für 4</span> : null}
            {sp ? (
              <span className="mt-1 inline-block rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10.5px] font-bold !text-[#15803D]">−{sp} % vs. teuerster Shop</span>
            ) : null}
            {t ? (
              <span className="mx-auto mt-1.5 block max-w-[170px]">
                <PriceTrendChart points={t.points} height={40} showAxis={false} />
                <span className={`block text-[10.5px] font-semibold ${t.pct < 0 ? '!text-[#15803D]' : t.pct > 0 ? '!text-[#B91C1C]' : '!text-[#6B7280]'}`}>
                  {t.pct < 0 ? `↓ ${Math.abs(t.pct)} %` : t.pct > 0 ? `↑ ${t.pct} %` : 'stabil'} · 60 Tage{t.isLowest ? ' · Tiefstpreis' : ''}
                </span>
              </span>
            ) : null}
          </span>
        );
      },
      hint: p => (p.best_vendor ? `bei ${p.best_vendor}${p.offer_count && p.offer_count > 1 ? ` · ${p.offer_count} Shops` : ''}` : ''),
    },
    {
      key: 'wet',
      label: 'Nasshaftung',
      icon: <Droplets size={15} color="#2563EB" />,
      isBest: p => gradeRank(p.wet_grip) === wetMin && !allSame(wetAll),
      render: p => <Grade g={p.wet_grip} />,
      hint: p => WET_TEXT[letter(p.wet_grip)] || '',
    },
    {
      key: 'fuel',
      label: 'Verbrauch',
      icon: <Fuel size={15} color="#047857" />,
      isBest: p => gradeRank(p.fuel_class) === fuelMin && !allSame(fuelAll),
      render: p => <Grade g={p.fuel_class} />,
      hint: p => FUEL_TEXT[letter(p.fuel_class)] || '',
    },
    {
      key: 'noise',
      label: 'Lautstärke',
      icon: <Volume1 size={15} color="#0E7490" />,
      isBest: p => noiseDb(p) != null && noiseDb(p) === dbMin && !allSame(dbAll),
      render: p => {
        const db = noiseDb(p);
        return <span className="text-[15px] font-bold !text-[#16171A]">{db != null ? `${db} dB` : '—'}</span>;
      },
    },
    {
      key: 'index',
      label: 'Last / Speed',
      icon: <Gauge size={15} color="#7C3AED" />,
      isBest: () => false,
      render: p => (
        <span className="inline-flex items-center gap-1.5 text-[14px] font-bold !text-[#16171A]">
          {p.lastIndex || '—'}
          {p.speedIndex || ''}
          {indexOk(p) ? <Check size={14} strokeWidth={3} color="#16A34A" /> : <AlertTriangle size={14} color="#C2410C" />}
        </span>
      ),
      hint: p => (indexOk(p) ? 'Passt' : 'Index prüfen'),
    },
    {
      key: 'size',
      label: 'Größe',
      icon: <Ruler size={15} color="#B45309" />,
      isBest: () => false,
      render: p => {
        const fits = base ? sameSize(base, p) : true;
        return (
          <span className={`text-[13.5px] font-bold ${fits ? '!text-[#16171A]' : '!text-[#C2410C]'}`}>
            {parseTyreSize(p).label}
            {!fits ? ' ⚠' : ''}
          </span>
        );
      },
    },
  ];

  const cols = `minmax(130px,170px) repeat(${products.length}, minmax(170px,1fr))`;

  return (
    <div className="fixed inset-0 z-[99990] flex items-end justify-center bg-[#0B1020]/50 backdrop-blur-[3px] md:items-center md:p-6" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-title"
        onClick={e => e.stopPropagation()}
        className="flex max-h-[94dvh] w-full max-w-6xl flex-col overflow-hidden rounded-t-[26px] bg-[#F6F8FC] shadow-2xl md:rounded-[26px]"
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#E4E7F0] bg-white px-4 py-3.5 md:px-6">
          <div className="min-w-0 flex-1">
            <h2 id="compare-title" className="text-[19px] font-bold !text-[#16171A] md:text-[22px]">
              Reifenvergleich
            </h2>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[12.5px] !text-[#5A6072]">
              {products.length} Reifen
              {base && !mixedSizes ? (
                <>
                  <span className="h-1 w-1 rounded-full bg-[#C9D2E8]" />
                  <span className="font-semibold !text-[#1B2A6B]">{parseTyreSize(base).label}</span>
                </>
              ) : null}
              <span className="h-1 w-1 rounded-full bg-[#C9D2E8]" /> Live-Preise
            </p>
          </div>
          <button type="button" onClick={close} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F6FB] hover:bg-[#E9EDF6] cursor-pointer" aria-label="Schließen">
            <X size={19} color="#16171A" />
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain px-3 py-3 md:px-6 md:py-5">
          {mixedSizes ? (
            <div className="mb-3 flex items-start gap-2 rounded-[14px] bg-[#FFF7ED] px-3.5 py-2.5 text-[13px] !text-[#7C2D12] ring-1 ring-[#FED7AA]">
              <AlertTriangle size={16} color="#C2410C" className="mt-[1px] shrink-0" />
              Unterschiedliche Größen im Vergleich. Für dein Auto müssen Breite, Querschnitt und Zoll übereinstimmen.
            </div>
          ) : null}

          {/* Verdict: one clear answer */}
          {best && products.length > 1 ? (
            <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0B1437] via-[#1B2A6B] to-[#2F4FD8] p-4 md:p-5">
              <span className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full border-[26px] border-white/[0.06]" aria-hidden />
              <div className="relative flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3.5">
                  <span className="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-[18px] bg-white">
                    {(() => {
                      const img = productImageSrc(best.product_image, best.awin_image_url);
                      return <OptimizedImage src={img.src} fallbacks={img.fallbacks} alt={best.product_name} width={72} height={72} className="h-[72px] w-[72px] object-contain" />;
                    })()}
                  </span>
                  <div className="sl-white min-w-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4ADE80]/20 px-2.5 py-1 text-[11.5px] font-bold ring-1 ring-[#4ADE80]/40">
                      <Crown size={13} /> Unsere Empfehlung · {verdict.scores[best._id]}/100
                    </span>
                    <p className="mt-1.5 text-[12px] font-bold uppercase tracking-[0.08em] opacity-70">{best.brand_name}</p>
                    <p className="line-clamp-2 text-[16px] font-bold leading-snug md:text-[18px]">{shortName(best)}</p>
                  </div>
                </div>
                <ul className="sl-white space-y-1.5 md:w-[38%]">
                  {verdict.reasons.map(r => (
                    <li key={r} className="flex items-start gap-2 text-[13px] leading-[140%]">
                      <span className="mt-[1px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#4ADE80]">
                        <Check size={11} strokeWidth={3.5} color="#0B1437" />
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-3 md:flex-col md:items-stretch md:w-[200px]">
                  <div className="sl-white flex-1 md:flex-none">
                    <p className="text-[22px] font-bold leading-none">{formatEuro(comparePrice(best))}</p>
                    <p className="mt-1 text-[12px] opacity-75">4 Stück {formatEuro(comparePrice(best) * 4)}</p>
                    {(() => {
                      const t = trendPoints(best);
                      return t ? (
                        <div className="mt-1.5 max-w-[200px]">
                          <PriceTrendChart points={t.points} height={34} showAxis={false} dark />
                          <p className="text-[11px] font-semibold opacity-90">
                            {t.pct < 0 ? `↓ ${Math.abs(t.pct)} % in 60 Tagen` : t.pct > 0 ? `↑ ${t.pct} % in 60 Tagen` : 'Preis stabil'}
                            {t.isLowest ? ' · Tiefstpreis' : ''}
                          </p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                  <ShopLink
                    p={best}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[13px] bg-white px-4 py-3 pr-9 text-[14px] font-bold !text-[#1B2A6B] shadow-lg"
                  />
                </div>
              </div>
            </div>
          ) : products.length === 1 ? (
            <div className="rounded-[16px] bg-white p-4 text-[14px] !text-[#2B3040] ring-1 ring-[#E4E7F0]">Füge noch mindestens einen Reifen derselben Größe hinzu – dann zeige ich dir, welcher besser ist.</div>
          ) : null}

          {/* ---------- Mobile: one block per attribute ---------- */}
          <div className="mt-3 space-y-2.5 md:hidden">
            {/* product strip */}
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0,1fr))` }}>
              {products.map(p => {
                const img = productImageSrc(p.product_image, p.awin_image_url);
                const isBest = p._id === verdict.bestId && products.length > 1;
                return (
                  <div key={p._id} className={`relative rounded-[14px] bg-white p-2 text-center ${isBest ? 'ring-2 ring-[#16A34A]' : 'ring-1 ring-[#E4E7F0]'}`}>
                    <button type="button" onClick={() => dispatch(removeProduct(p._id))} aria-label="Entfernen" className="absolute right-1 top-1 rounded-full p-1 hover:bg-[#F4F6FB] cursor-pointer">
                      <X size={13} color="#9AA0A8" />
                    </button>
                    <Link href={`/produkte/${p.slug}`} onClick={close} className="mx-auto flex h-14 w-14 items-center justify-center">
                      <OptimizedImage src={img.src} fallbacks={img.fallbacks} alt="" width={52} height={52} className="h-[52px] w-[52px] object-contain" />
                    </Link>
                    <p className="mt-1 truncate text-[10.5px] font-bold uppercase !text-[#6B7280]">{p.brand_name}</p>
                    <p className="line-clamp-2 text-[11.5px] font-semibold leading-tight !text-[#16171A]">{shortName(p)}</p>
                    {products.length > 1 ? (
                      <div className="mt-1.5">
                        <ScoreBar value={verdict.scores[p._id]} best={isBest} />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {rows.map(row => (
              <div key={row.key} className="rounded-[14px] bg-white p-2.5 ring-1 ring-[#E4E7F0]">
                <p className="mb-2 flex items-center gap-1.5 text-[12px] font-bold !text-[#2B3040]">
                  {row.icon} {row.label}
                </p>
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0,1fr))` }}>
                  {products.map(p => {
                    const win = products.length > 1 && row.isBest(p);
                    return (
                      <div key={p._id} className={`flex flex-col items-center gap-1 rounded-[10px] px-1 py-2 text-center ${win ? 'bg-[#F0FDF4] ring-1 ring-[#BBF7D0]' : 'bg-[#F8FAFE]'}`}>
                        {row.render(p)}
                        {row.hint?.(p) ? <span className="text-[10.5px] leading-tight !text-[#6B7280]">{row.hint(p)}</span> : null}
                        {win ? <BestBadge /> : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0,1fr))` }}>
              {products.map(p => (
                <ShopLink
                  key={p._id}
                  p={p}
                  label="Angebot"
                  hand={false}
                  className={`sl-white inline-flex items-center justify-center gap-1 rounded-[12px] py-2.5 text-[12.5px] font-bold ${
                    p._id === verdict.bestId ? 'bg-gradient-to-r from-[#15803D] to-[#22C55E]' : 'bg-gradient-to-r from-[#1B2A6B] to-[#2F4FD8]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ---------- Desktop: table ---------- */}
          <div className="mt-4 hidden overflow-x-auto rounded-[20px] bg-white ring-1 ring-[#E4E7F0] md:block">
            <div className="min-w-[640px]" style={{ display: 'grid', gridTemplateColumns: cols }}>
              <div className="sticky left-0 z-10 flex items-end bg-white p-4 text-[11.5px] font-bold uppercase tracking-[0.08em] !text-[#9AA0A8]">Modell</div>
              {products.map(p => {
                const img = productImageSrc(p.product_image, p.awin_image_url);
                const isBest = p._id === verdict.bestId && products.length > 1;
                return (
                  <div key={p._id} className={`relative border-l border-[#EEF0F6] p-4 text-center ${isBest ? 'bg-[#F0FDF4]' : ''}`}>
                    {isBest ? (
                      <span className="absolute left-1/2 top-0 inline-flex -translate-x-1/2 items-center gap-1 rounded-b-[10px] bg-[#16A34A] px-2.5 py-1 text-[11px] font-bold !text-white">
                        <Crown size={12} color="#fff" /> Empfehlung
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => dispatch(removeProduct(p._id))}
                      aria-label="Entfernen"
                      className="absolute right-2 top-2 rounded-full p-1.5 hover:bg-[#F4F6FB] cursor-pointer"
                    >
                      <X size={14} color="#9AA0A8" />
                    </button>
                    <Link href={`/produkte/${p.slug}`} onClick={close} className="mx-auto mt-3 flex h-24 w-24 items-center justify-center rounded-[18px] bg-[#F4F6FB]">
                      <OptimizedImage src={img.src} fallbacks={img.fallbacks} alt={p.product_name} width={84} height={84} className="h-[84px] w-[84px] object-contain" />
                    </Link>
                    <p className="mt-2.5 text-[11px] font-bold uppercase tracking-[0.08em] !text-[#6B7280]">{p.brand_name}</p>
                    <Link href={`/produkte/${p.slug}`} onClick={close} className="line-clamp-2 text-[14px] font-bold leading-snug !text-[#16171A] hover:!text-[#2F4FD8]">
                      {shortName(p)}
                    </Link>
                    {products.length > 1 ? (
                      <div className="mx-auto mt-2 max-w-[150px]">
                        <ScoreBar value={verdict.scores[p._id]} best={isBest} />
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {rows.map(row => (
                <div key={row.key} className="contents">
                  <div className="sticky left-0 z-10 flex items-center gap-2 border-t border-[#EEF0F6] bg-white px-4 py-3 text-[13px] font-semibold !text-[#4B5163]">
                    {row.icon} {row.label}
                  </div>
                  {products.map(p => {
                    const win = products.length > 1 && row.isBest(p);
                    return (
                      <div key={p._id} className={`flex flex-col items-center justify-center gap-1 border-l border-t border-[#EEF0F6] px-3 py-3 text-center ${win ? 'bg-[#F0FDF4]' : ''}`}>
                        {row.render(p)}
                        {row.hint?.(p) ? <span className="text-[11.5px] !text-[#6B7280]">{row.hint(p)}</span> : null}
                        {win ? <BestBadge /> : null}
                      </div>
                    );
                  })}
                </div>
              ))}

              <div className="sticky left-0 z-10 border-t border-[#EEF0F6] bg-white" />
              {products.map(p => (
                <div key={p._id} className="border-l border-t border-[#EEF0F6] p-3">
                  <ShopLink
                    p={p}
                    className={`sl-white flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-[12px] py-2.5 pr-8 text-[13.5px] font-bold shadow-[0_8px_18px_-10px_rgba(47,79,216,0.8)] ${
                      p._id === verdict.bestId && products.length > 1 ? 'bg-gradient-to-r from-[#15803D] to-[#22C55E]' : 'bg-gradient-to-r from-[#1B2A6B] to-[#2F4FD8]'
                    }`}
                  />
                  <Link href={`/produkte/${p.slug}`} onClick={close} className="mt-1.5 block text-center text-[12px] font-semibold !text-[#2F4FD8] hover:underline">
                    Alle Angebote
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Add more of the same size */}
          {compatibleSuggestions.length > 0 && products.length < 4 ? (
            <div className="mt-4">
              <h3 className="mb-2 flex items-center gap-2 text-[14px] font-bold !text-[#16171A]">
                <ShieldCheck size={16} color="#2F4FD8" /> Passt auch – gleiche Größe {base ? parseTyreSize(base).label : ''}
              </h3>
              <div className="-mx-3 flex snap-x gap-2.5 overflow-x-auto px-3 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
                {compatibleSuggestions.map(prod => {
                  const img = productImageSrc(prod.product_image, prod.awin_image_url);
                  return (
                    <div key={prod._id} className="flex w-[78%] shrink-0 snap-start items-center gap-3 rounded-[16px] bg-white p-2.5 ring-1 ring-[#E4E7F0] md:w-auto">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#F4F6FB]">
                        <OptimizedImage src={img.src} fallbacks={img.fallbacks} alt="" width={42} height={42} className="h-[42px] w-[42px] object-contain" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold !text-[#16171A]">
                          {prod.brand_name} {shortName(prod)}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[12px] !text-[#4B5163]">
                          <b className="!text-[#2F4FD8]">{formatEuro(comparePrice(prod))}</b>
                          {letter(prod.wet_grip) ? <span>· Nass {letter(prod.wet_grip)}</span> : null}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAdd(prod)}
                        aria-label="Zum Vergleich hinzufügen"
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] hover:bg-[#2F4FD8] [&:hover_svg]:!text-white cursor-pointer"
                      >
                        <Plus size={17} strokeWidth={2.8} className="!text-[#2F4FD8]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-[#E4E7F0] bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:px-6">
          <button
            type="button"
            onClick={() => {
              dispatch(clearProducts());
              toast.success('Vergleich geleert');
            }}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold !text-[#6B7280] hover:!text-[#B91C1C] cursor-pointer"
          >
            <Trash2 size={15} color="#6B7280" /> Alle entfernen
          </button>
          <div className="flex items-center gap-2">
            {base ? (
              <Link href={listingUrlForSize(base)} onClick={close} className="hidden h-10 items-center rounded-full px-4 text-[13px] font-bold !text-[#1B2A6B] ring-1 ring-[#C9D6FC] sm:inline-flex">
                Mehr in {parseTyreSize(base).label}
              </Link>
            ) : null}
            <button type="button" onClick={close} className="sl-white inline-flex h-10 items-center rounded-full bg-gradient-to-r from-[#1B2A6B] to-[#2F4FD8] px-5 text-[14px] font-bold cursor-pointer">
              Fertig
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

