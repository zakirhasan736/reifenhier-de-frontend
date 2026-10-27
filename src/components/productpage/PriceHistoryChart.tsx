'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  berlinToday,
  buildTrend,
  dayMinus,
  eur,
  pct,
  shortDate,
  type PricePoint,
} from '@/libs/priceTrend';

const API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
const RANGES = [30, 90, 365] as const;
const BEST_COLOR = '#3A64F6';
const SHOP_COLORS = ['#E07A1F', '#1F8A6B', '#8B5CF6', '#C2417A', '#6B7280', '#0E7490'];

type Series = { key: string; vendor: string; points: PricePoint[] };
type HistoryResponse = {
  from: string;
  to: string;
  best: Series;
  vendors: Series[];
  current: { best: number; offers: { vendor: string; vendor_id?: string; price: number; in_stock: boolean }[] };
};

/** price on `day` for a step series (last point on or before that day) */
function priceAt(points: PricePoint[], day: string) {
  let v: number | undefined;
  for (const [d, p] of points) {
    if (d <= day) v = p;
    else break;
  }
  return v;
}

export default function PriceHistoryChart({
  slug,
  productName,
  initialTrend,
  currentBest,
}: {
  slug: string;
  productName: string;
  /** product.price_trend.points – shown immediately, replaced by API data */
  initialTrend?: PricePoint[];
  currentBest?: number;
}) {
  const [days, setDays] = useState<(typeof RANGES)[number]>(90);
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [hover, setHover] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  // Draw at the real pixel width so axis text stays readable on phones
  const [W, setW] = useState(720);
  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!API) return setState('error');
    let cancelled = false;
    setState('loading');
    fetch(`${API}/api/products/price-history/${encodeURIComponent(slug)}?days=${days}`)
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j: HistoryResponse) => {
        if (!cancelled) {
          setData(j);
          setState('ready');
        }
      })
      .catch(() => !cancelled && setState('error'));
    return () => {
      cancelled = true;
    };
  }, [slug, days]);

  const today = berlinToday();
  const from = dayMinus(today, days);

  // Best-price line: API history, falling back to the product's own trend
  const bestTrend = useMemo(
    () =>
      buildTrend(
        data?.best?.points?.length ? data.best.points : initialTrend,
        data?.current?.best ?? currentBest,
        days,
        today
      ),
    [data, initialTrend, currentBest, days, today]
  );

  // Shop lines: history + today's offer, top 6 by current price
  const shops = useMemo(() => {
    if (!data) return [];
    const now = new Map(data.current.offers.map(o => [o.vendor.toLowerCase(), o]));
    return data.vendors
      .map(v => {
        const cur = now.get(String(v.vendor || '').toLowerCase());
        const t = buildTrend(v.points, cur?.price, days, today);
        return t ? { key: v.key, vendor: v.vendor, trend: t, inStock: cur?.in_stock !== false, current: cur?.price } : null;
      })
      .filter((x): x is NonNullable<typeof x> => !!x && !!x.current)
      .sort((a, b) => (a.current ?? 0) - (b.current ?? 0))
      .slice(0, SHOP_COLORS.length)
      .map((s, i) => ({ ...s, color: SHOP_COLORS[i] }));
  }, [data, days, today]);

  // ---- geometry
  const narrow = W < 520;
  const H = narrow ? 210 : 260;
  const M = { l: narrow ? 50 : 56, r: 12, t: 14, b: 28 };
  const visible = [
    ...(bestTrend ? [bestTrend.series] : []),
    ...shops.filter(s => !hidden.has(s.key)).map(s => s.trend.series),
  ];
  const all = visible.flat().map(p => p[1]);
  const rawLo = all.length ? Math.min(...all) : 0;
  const rawHi = all.length ? Math.max(...all) : 1;
  const padY = Math.max(1, (rawHi - rawLo) * 0.15);
  const lo = Math.max(0, Math.floor((rawLo - padY) / 5) * 5);
  const hi = Math.ceil((rawHi + padY) / 5) * 5;
  const t0 = new Date(`${from}T12:00:00Z`).getTime();
  const t1 = new Date(`${today}T12:00:00Z`).getTime();
  const X = (day: string) =>
    M.l + ((Math.max(t0, new Date(`${day}T12:00:00Z`).getTime()) - t0) / Math.max(1, t1 - t0)) * (W - M.l - M.r);
  const Y = (p: number) => M.t + (1 - (p - lo) / Math.max(1, hi - lo)) * (H - M.t - M.b);
  const step = (pts: PricePoint[]) =>
    pts.map(([d, p], i) => (i === 0 ? `M${X(d).toFixed(1)},${Y(p).toFixed(1)}` : `H${X(d).toFixed(1)}V${Y(p).toFixed(1)}`)).join('');

  const yTicks = Array.from({ length: 5 }, (_, i) => lo + ((hi - lo) * i) / 4);
  const xCount = narrow ? 3 : 5;
  const xTicks = Array.from({ length: xCount }, (_, i) => dayMinus(today, Math.round(days - (days * i) / (xCount - 1))));

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width) * W;
    const frac = Math.min(1, Math.max(0, (x - M.l) / (W - M.l - M.r)));
    const back = Math.round((1 - frac) * days);
    setHover(dayMinus(today, back));
  };

  const hoverRows = hover
    ? [
        ...(bestTrend ? [{ name: 'Bester Preis', color: BEST_COLOR, v: priceAt(bestTrend.series, hover) }] : []),
        ...shops.filter(s => !hidden.has(s.key)).map(s => ({ name: s.vendor, color: s.color, v: priceAt(s.trend.series, hover) })),
      ].filter(r => r.v)
    : [];

  const toggle = (key: string) =>
    setHidden(prev => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });

  const recordingSince = (data?.best?.points?.[0]?.[0] || initialTrend?.[0]?.[0]) ?? today;
  const young = !bestTrend?.meaningful;
  const priceList = (data?.current.offers || []).slice().sort((a, b) => a.price - b.price);
  const maxPrice = priceList.length ? priceList[priceList.length - 1].price : 0;

  // No history API yet (e.g. backend not deployed) and no trend on the product: show nothing
  if (state === 'error' && !bestTrend) return null;

  return (
    <section aria-labelledby="preisverlauf-title" className="custom-container py-10">
      <div className="rounded-3xl border border-[#E4E5EA] bg-white p-5 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 id="preisverlauf-title" className="text-[20px] md:text-[24px] font-semibold text-[#16171A]">
              Preisentwicklung
            </h2>
            <p className="text-[14px] text-[#5A5B61]">{productName} – bester Preis und Preise der einzelnen Shops</p>
          </div>
          <div role="tablist" aria-label="Zeitraum" className="flex gap-1 rounded-full bg-[#F2F4F8] p-1">
            {RANGES.map(r => (
              <button
                key={r}
                role="tab"
                aria-selected={days === r}
                onClick={() => setDays(r)}
                className={`rounded-full px-3 py-1.5 text-[13px] font-medium ${
                  days === r ? 'bg-white text-[#16171A] shadow-sm' : 'text-[#5A5B61] hover:text-[#16171A]'
                }`}
              >
                {r === 365 ? '1 Jahr' : `${r} Tage`}
              </button>
            ))}
          </div>
        </div>

        {bestTrend ? (
          <dl className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { k: 'Bester Preis heute', v: `${eur(bestTrend.last)} €` },
              { k: `Tiefster Preis (${days === 365 ? '1 Jahr' : `${days} T.`})`, v: `${eur(bestTrend.lowest)} €` },
              { k: `Höchster Preis (${days === 365 ? '1 Jahr' : `${days} T.`})`, v: `${eur(bestTrend.highest)} €` },
              {
                k: 'Veränderung',
                v: young ? '–' : bestTrend.direction === 'flat' ? 'stabil' : `${bestTrend.direction === 'down' ? '↓' : '↑'} ${pct(bestTrend.changePct)}`,
                c: young || bestTrend.direction === 'flat' ? '#16171A' : bestTrend.direction === 'down' ? '#1F8A3B' : '#D33A3A',
              },
            ].map(s => (
              <div key={s.k} className="rounded-2xl bg-[#F7F8FB] px-4 py-3">
                <dt className="text-[12px] text-[#5A5B61]">{s.k}</dt>
                <dd className="text-[18px] font-semibold tabular-nums" style={{ color: s.c || '#16171A' }}>{s.v}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {bestTrend && bestTrend.lowest === bestTrend.last && !young ? (
          <p className="mt-3 inline-flex rounded-full bg-[#EEFAE5] px-3 py-1 text-[13px] font-medium text-[#1F7A33]">
            Aktuell der günstigste Preis der letzten {days === 365 ? '12 Monate' : `${days} Tage`}
          </p>
        ) : null}

        <div ref={boxRef} className="relative mt-5">
          {state === 'loading' && !bestTrend ? (
            <div className="h-[260px] animate-pulse rounded-2xl bg-[#F2F4F8]" />
          ) : bestTrend ? (
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              width={W}
              height={H}
              className="block w-full h-auto touch-none select-none"
              role="img"
              aria-label={`Preisverlauf ${productName}: bester Preis ${eur(bestTrend.first)} € vor ${days} Tagen, heute ${eur(bestTrend.last)} €`}
              onPointerMove={onMove}
              onPointerDown={onMove}
              onPointerLeave={() => setHover(null)}
            >
              {yTicks.map(v => (
                <g key={v}>
                  <line x1={M.l} x2={W - M.r} y1={Y(v)} y2={Y(v)} stroke="#EEF0F4" />
                  <text x={M.l - 8} y={Y(v) + 4} textAnchor="end" fontSize="11" fill="#7A7E89">
                    {eur(v).replace(/,00$/, '')} €
                  </text>
                </g>
              ))}
              {xTicks.map((d, i) => (
                <text key={d} x={X(d)} y={H - 8} textAnchor={i === 0 ? 'start' : i === xTicks.length - 1 ? 'end' : 'middle'} fontSize="11" fill="#7A7E89">
                  {shortDate(d).slice(0, 5)}
                </text>
              ))}
              {shops
                .filter(s => !hidden.has(s.key))
                .map(s => (
                  <path key={s.key} d={step(s.trend.series)} fill="none" stroke={s.color} strokeWidth="1.5" strokeOpacity={s.inStock ? 0.9 : 0.4} strokeDasharray={s.inStock ? undefined : '4 3'} />
                ))}
              <path
                d={`${step(bestTrend.series)}V${Y(lo)}H${X(bestTrend.series[0][0])}Z`}
                fill={BEST_COLOR}
                fillOpacity="0.08"
              />
              <path d={step(bestTrend.series)} fill="none" stroke={BEST_COLOR} strokeWidth="2.6" strokeLinejoin="round" />
              <circle cx={X(today)} cy={Y(bestTrend.last)} r="4" fill={BEST_COLOR} stroke="#fff" strokeWidth="2" />
              {hover ? (
                <g>
                  <line x1={X(hover)} x2={X(hover)} y1={M.t} y2={H - M.b} stroke="#16171A" strokeOpacity="0.25" strokeDasharray="3 3" />
                  {hoverRows.map(r => (
                    <circle key={r.name} cx={X(hover)} cy={Y(r.v!)} r="3.5" fill={r.color} stroke="#fff" strokeWidth="1.5" />
                  ))}
                </g>
              ) : null}
            </svg>
          ) : (
            <p className="rounded-2xl bg-[#F7F8FB] px-4 py-6 text-center text-[14px] text-[#5A5B61]">
              Der Preisverlauf konnte gerade nicht geladen werden.
            </p>
          )}

          {hover && hoverRows.length ? (
            <div
              className="pointer-events-none absolute top-2 z-10 rounded-xl border border-[#E4E5EA] bg-white/95 px-3 py-2 text-[12px] shadow-lg"
              // keep the 190px tooltip inside the chart: right of the cursor, or left of it near the edge
              style={{
                left: Math.max(0, Math.min(W - 190, X(hover) > W - 210 ? X(hover) - 198 : X(hover) + 10)),
                width: 190,
              }}
            >
              <div className="mb-1 font-semibold text-[#16171A]">{shortDate(hover)}</div>
              {hoverRows.map(r => (
                <div key={r.name} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 text-[#404042]">
                    <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                    {r.name}
                  </span>
                  <span className="font-semibold tabular-nums text-[#16171A]">{eur(r.v!)} €</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap gap-2" aria-label="Linien ein- und ausblenden">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E5EA] px-3 py-1 text-[13px] font-medium text-[#16171A]">
            <span className="h-[3px] w-4 rounded" style={{ background: BEST_COLOR }} /> Bester Preis
          </span>
          {shops.map(s => (
            <button
              key={s.key}
              type="button"
              aria-pressed={!hidden.has(s.key)}
              onClick={() => toggle(s.key)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] ${
                hidden.has(s.key) ? 'border-[#E4E5EA] text-[#9AA0A8] line-through' : 'border-[#E4E5EA] text-[#16171A]'
              }`}
            >
              <span className="h-[3px] w-4 rounded" style={{ background: s.color, opacity: hidden.has(s.key) ? 0.3 : 1 }} />
              {s.vendor}
              {!s.inStock ? <span className="text-[11px] text-[#9AA0A8]">(nicht lieferbar)</span> : null}
            </button>
          ))}
        </div>

        {young ? (
          <p className="mt-3 text-[13px] text-[#5A5B61]">
            Wir zeichnen den Preis dieses Reifens seit dem {shortDate(recordingSince)} auf. Der Verlauf füllt sich mit jeder Preisänderung der Händler.
          </p>
        ) : null}

        {priceList.length > 1 ? (
          <div className="mt-6">
            <h3 className="text-[15px] font-semibold text-[#16171A]">Preise heute im Vergleich</h3>
            <ul className="mt-2 space-y-1.5">
              {priceList.map((o, i) => (
                <li key={`${o.vendor}-${i}`} className="grid grid-cols-[minmax(90px,140px)_1fr_auto] items-center gap-3 text-[13px]">
                  <span className="truncate text-[#404042]">{o.vendor}</span>
                  <span className="h-2.5 rounded-full bg-[#F2F4F8]">
                    <span
                      className="block h-2.5 rounded-full"
                      style={{
                        width: `${Math.max(8, (o.price / maxPrice) * 100)}%`,
                        background: i === 0 ? BEST_COLOR : '#C9CED8',
                        opacity: o.in_stock ? 1 : 0.5,
                      }}
                    />
                  </span>
                  <span className={`tabular-nums ${i === 0 ? 'font-semibold text-[#16171A]' : 'text-[#404042]'}`}>
                    {eur(o.price)} €{i > 0 ? <span className="ml-1 text-[#9AA0A8]">+{eur(o.price - priceList[0].price)}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
