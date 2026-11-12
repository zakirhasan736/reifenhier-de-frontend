'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  berlinToday,
  buildTrend,
  dayMinus,
  daysBetween,
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
  /** first day a price was ever recorded for this tyre (newer backends only) */
  since?: string | null;
  best: Series;
  vendors: Series[];
  current: { best: number; offers: { vendor: string; vendor_id?: string; price: number; in_stock: boolean }[] };
};

const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
/** "2026-03-14" → "März 2026" */
const monthYear = (day: string) => {
  const [y, m] = day.split('-');
  return `${MONTHS[Number(m) - 1] || ''} ${y}`.trim();
};

/**
 * What the best-price line says in plain numbers: when the lowest and highest
 * price occurred, the average over the period (weighted by how long each price
 * was valid) and how often the price changed.
 */
function describeSeries(series: PricePoint[], today: string) {
  if (!series.length) return null;
  let low = series[0];
  let high = series[0];
  let changes = 0;
  let weighted = 0;
  let span = 0;
  series.forEach((pt, i) => {
    // latest occurrence wins, so "Tiefster Preis am …" names the most recent low
    if (pt[1] <= low[1]) low = pt;
    if (pt[1] > high[1]) high = pt;
    if (i > 0 && Math.abs(pt[1] - series[i - 1][1]) >= 0.01) changes += 1;
    const until = series[i + 1]?.[0] ?? today;
    const d = Math.max(0, daysBetween(pt[0], until));
    weighted += pt[1] * d;
    span += d;
  });
  const last = series[series.length - 1][1];
  return { low, high, changes, average: span > 0 ? weighted / span : last };
}

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
  // Line in focus (legend / price-row / line hover): 'best' or a shop key.
  // The focused line is drawn thick and on top, all others fade out.
  const [focus, setFocus] = useState<string | null>(null);
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
          setData(j && typeof j === 'object' && !Array.isArray(j) ? j : null);
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
    // The API may answer with an error or partial body — never crash the page
    const offers = Array.isArray(data.current?.offers) ? data.current.offers : [];
    const now = new Map(offers.map(o => [String(o.vendor || '').toLowerCase(), o]));
    return (Array.isArray(data.vendors) ? data.vendors : [])
      .map(v => {
        const cur = now.get(String(v.vendor || '').toLowerCase());
        const t = buildTrend(Array.isArray(v.points) ? v.points : [], cur?.price, days, today);
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
        ...(bestTrend ? [{ key: 'best', name: 'Bester Preis', color: BEST_COLOR, v: priceAt(bestTrend.series, hover) }] : []),
        ...shops.filter(s => !hidden.has(s.key)).map(s => ({ key: s.key, name: s.vendor, color: s.color, v: priceAt(s.trend.series, hover) })),
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
  const facts = useMemo(() => (bestTrend ? describeSeries(bestTrend.series, today) : null), [bestTrend, today]);
  const rangeLabel = days === 365 ? '12 Monate' : `${days} Tage`;
  const young = !bestTrend?.meaningful;
  const priceList = (Array.isArray(data?.current?.offers) ? data.current.offers : []).slice().sort((a, b) => a.price - b.price);
  const maxPrice = priceList.length ? priceList[priceList.length - 1].price : 0;

  const dim = (key: string) => focus !== null && focus !== key;
  const focusHandlers = (key: string) => ({
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === 'mouse' && setFocus(key),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === 'mouse' && setFocus(f => (f === key ? null : f)),
    onFocus: () => setFocus(key),
    onBlur: () => setFocus(f => (f === key ? null : f)),
  });
  const shopByVendor = new Map(shops.map(s => [s.vendor.toLowerCase(), s]));
  const visibleShops = shops.filter(s => !hidden.has(s.key));
  const focusedShop = visibleShops.find(s => s.key === focus);

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
              {
                k: `Tiefster Preis (${days === 365 ? '1 Jahr' : `${days} T.`})`,
                v: `${eur(bestTrend.lowest)} €`,
                sub: facts && !young && bestTrend.lowest !== bestTrend.highest ? `zuletzt am ${shortDate(facts.low[0])}` : undefined,
              },
              {
                k: `Höchster Preis (${days === 365 ? '1 Jahr' : `${days} T.`})`,
                v: `${eur(bestTrend.highest)} €`,
                sub: facts && !young && bestTrend.lowest !== bestTrend.highest ? `am ${shortDate(facts.high[0])}` : undefined,
              },
              {
                k: 'Veränderung',
                v: young ? '–' : bestTrend.direction === 'flat' ? 'stabil' : `${bestTrend.direction === 'down' ? '↓' : '↑'} ${pct(bestTrend.changePct)}`,
                c: young || bestTrend.direction === 'flat' ? '#16171A' : bestTrend.direction === 'down' ? '#1F8A3B' : '#D33A3A',
              },
            ].map(s => (
              <div key={s.k} className="rounded-2xl bg-[#F7F8FB] px-4 py-3">
                <dt className="text-[12px] text-[#5A5B61]">{s.k}</dt>
                <dd className="text-[18px] font-semibold tabular-nums" style={{ color: s.c || '#16171A' }}>{s.v}</dd>
                {'sub' in s && s.sub ? <dd className="text-[11px] text-[#7A7E89]">{s.sub}</dd> : null}
              </div>
            ))}
          </dl>
        ) : null}

        {bestTrend && bestTrend.lowest === bestTrend.last && !young ? (
          <p className="mt-3 inline-flex rounded-full bg-[#EEFAE5] px-3 py-1 text-[13px] font-medium text-[#1F7A33]">
            Aktuell der günstigste Preis der letzten {days === 365 ? '12 Monate' : `${days} Tage`}
          </p>
        ) : null}

        {/* Plain-language reading of the chart: how today's price compares */}
        {bestTrend && facts && !young && bestTrend.lowest !== bestTrend.highest ? (
          <p className="mt-3 text-[14px] leading-relaxed text-[#404042]">
            {bestTrend.last > bestTrend.lowest ? (
              <>
                Heute <strong className="font-semibold text-[#16171A]">{eur(bestTrend.last - bestTrend.lowest)} €</strong> (
                {pct(((bestTrend.last - bestTrend.lowest) / bestTrend.lowest) * 100)}) über dem Tiefstpreis vom {shortDate(facts.low[0])}.{' '}
              </>
            ) : null}
            Durchschnitt der letzten {rangeLabel}:{' '}
            <strong className="font-semibold text-[#16171A]">{eur(facts.average)} €</strong>
            {Math.abs(bestTrend.last - facts.average) >= 0.01 ? (
              <>
                {' '}– heute{' '}
                <span style={{ color: bestTrend.last < facts.average ? '#1F7A33' : '#B4541A' }} className="font-semibold">
                  {pct(((bestTrend.last - facts.average) / facts.average) * 100)} {bestTrend.last < facts.average ? 'darunter' : 'darüber'}
                </span>
              </>
            ) : null}
            .
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
              {visibleShops
                .filter(s => s.key !== focus)
                .map(s => (
                  <path
                    key={s.key}
                    d={step(s.trend.series)}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="1.5"
                    strokeOpacity={dim(s.key) ? 0.12 : s.inStock ? 0.9 : 0.4}
                    strokeDasharray={s.inStock ? undefined : '4 3'}
                    className="transition-[stroke-opacity] duration-200"
                  />
                ))}
              <path
                d={`${step(bestTrend.series)}V${Y(lo)}H${X(bestTrend.series[0][0])}Z`}
                fill={BEST_COLOR}
                fillOpacity={focus === 'best' ? 0.14 : dim('best') ? 0.03 : 0.08}
                className="transition-[fill-opacity] duration-200"
              />
              <path
                d={step(bestTrend.series)}
                fill="none"
                stroke={BEST_COLOR}
                strokeWidth={focus === 'best' ? 3.4 : 2.6}
                strokeOpacity={dim('best') ? 0.18 : 1}
                strokeLinejoin="round"
                className="transition-[stroke-opacity] duration-200"
              />
              <circle cx={X(today)} cy={Y(bestTrend.last)} r="4" fill={BEST_COLOR} stroke="#fff" strokeWidth="2" opacity={dim('best') ? 0.25 : 1} />
              {/* lowest / highest price of the period, labelled on the line */}
              {facts && !young && bestTrend.lowest !== bestTrend.highest
                ? ([
                    { pt: facts.high, color: '#B4541A', dy: -9 },
                    { pt: facts.low, color: '#1F7A33', dy: 17 },
                  ] as const).map(m => {
                    const x = X(m.pt[0]);
                    const anchor = x < M.l + 44 ? 'start' : x > W - M.r - 44 ? 'end' : 'middle';
                    return (
                      <g key={m.dy} opacity={dim('best') ? 0.2 : 1} pointerEvents="none">
                        <circle cx={x} cy={Y(m.pt[1])} r="4" fill={m.color} stroke="#fff" strokeWidth="2" />
                        <text
                          x={x}
                          y={Y(m.pt[1]) + m.dy}
                          textAnchor={anchor}
                          fontSize="11"
                          fontWeight="600"
                          fill={m.color}
                          stroke="#fff"
                          strokeWidth="3"
                          paintOrder="stroke"
                        >
                          {eur(m.pt[1])} €
                        </text>
                      </g>
                    );
                  })
                : null}
              {/* focused shop: on top of everything, thicker, with today's dot */}
              {focusedShop ? (
                <g>
                  <path
                    d={step(focusedShop.trend.series)}
                    fill="none"
                    stroke={focusedShop.color}
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeDasharray={focusedShop.inStock ? undefined : '6 4'}
                  />
                  <circle
                    cx={X(today)}
                    cy={Y(focusedShop.trend.last)}
                    r="4"
                    fill={focusedShop.color}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                </g>
              ) : null}
              {/* wide invisible hit areas: hovering a line highlights it */}
              {[
                ...visibleShops.map(s => ({ key: s.key, d: step(s.trend.series) })),
                { key: 'best', d: step(bestTrend.series) },
              ].map(h => (
                <path
                  key={`hit-${h.key}`}
                  d={h.d}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="12"
                  pointerEvents="stroke"
                  onPointerEnter={e => e.pointerType === 'mouse' && setFocus(h.key)}
                  onPointerLeave={e => e.pointerType === 'mouse' && setFocus(f => (f === h.key ? null : f))}
                />
              ))}
              {hover ? (
                <g>
                  <line x1={X(hover)} x2={X(hover)} y1={M.t} y2={H - M.b} stroke="#16171A" strokeOpacity="0.25" strokeDasharray="3 3" />
                  {hoverRows.map(r => (
                    <circle
                      key={r.name}
                      cx={X(hover)}
                      cy={Y(r.v!)}
                      r={focus === r.key ? 5 : 3.5}
                      fill={r.color}
                      stroke="#fff"
                      strokeWidth="1.5"
                      opacity={dim(r.key) ? 0.2 : 1}
                    />
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
                <div
                  key={r.name}
                  className={`flex items-center justify-between gap-4 transition-opacity ${dim(r.key) ? 'opacity-35' : ''} ${
                    focus === r.key ? 'font-semibold' : ''
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-1.5 truncate text-[#404042]">
                    <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                    {r.name}
                  </span>
                  <span className="whitespace-nowrap font-semibold tabular-nums text-[#16171A]">{eur(r.v!)} €</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap gap-2" aria-label="Linien ein- und ausblenden">
          <span
            tabIndex={0}
            {...focusHandlers('best')}
            className={`inline-flex cursor-default items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-medium text-[#16171A] outline-none transition ${
              focus === 'best' ? 'border-[#3A64F6] bg-[#EEF2FF]' : 'border-[#E4E5EA]'
            } ${dim('best') ? 'opacity-40' : ''}`}
          >
            <span className="h-[3px] w-4 rounded" style={{ background: BEST_COLOR }} /> Bester Preis
          </span>
          {shops.map(s => (
            <button
              key={s.key}
              type="button"
              aria-pressed={!hidden.has(s.key)}
              onClick={() => toggle(s.key)}
              {...(hidden.has(s.key) ? {} : focusHandlers(s.key))}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] transition ${
                hidden.has(s.key)
                  ? 'border-[#E4E5EA] text-[#9AA0A8] line-through'
                  : focus === s.key
                  ? 'text-[#16171A]'
                  : 'border-[#E4E5EA] text-[#16171A]'
              } ${dim(s.key) && !hidden.has(s.key) ? 'opacity-40' : ''}`}
              style={focus === s.key ? { borderColor: s.color, background: `${s.color}14` } : undefined}
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

        {bestTrend && facts && !young ? (
          <p className="mt-3 text-[13px] text-[#5A5B61]">
            {data?.since ? (
              <>
                Preis aufgezeichnet seit <strong className="font-semibold text-[#16171A]">{monthYear(data.since)}</strong> ·{' '}
              </>
            ) : null}
            {facts.changes === 0
              ? `Keine Preisänderung in den letzten ${days === 365 ? '12 Monaten' : `${days} Tagen`}`
              : `${facts.changes} ${facts.changes === 1 ? 'Preisänderung' : 'Preisänderungen'} vom ${shortDate(bestTrend.series[0][0])} bis ${shortDate(today)}`}
            .
          </p>
        ) : null}

        {priceList.length > 1 ? (
          <div className="mt-6">
            <h3 className="text-[15px] font-semibold text-[#16171A]">Preise heute im Vergleich</h3>
            <ul className="mt-2 space-y-1.5">
              {priceList.map((o, i) => {
                const line = shopByVendor.get(String(o.vendor || '').toLowerCase());
                const lineKey = line && !hidden.has(line.key) ? line.key : null;
                return (
                <li
                  key={`${o.vendor}-${i}`}
                  {...(lineKey
                    ? {
                        onPointerEnter: (e: React.PointerEvent) => e.pointerType === 'mouse' && setFocus(lineKey),
                        onPointerLeave: (e: React.PointerEvent) =>
                          e.pointerType === 'mouse' && setFocus(f => (f === lineKey ? null : f)),
                        // phones have no hover: tap a shop to highlight its line, tap again to clear
                        onClick: () => setFocus(f => (f === lineKey ? null : lineKey)),
                      }
                    : {})}
                  className={`grid grid-cols-[minmax(90px,140px)_1fr_auto] items-center gap-3 rounded-lg px-1 text-[13px] transition-opacity ${
                    lineKey ? 'cursor-pointer hover:bg-[#F7F8FB]' : ''
                  } ${focus && focus !== 'best' && lineKey !== focus ? 'opacity-45' : ''}`}
                >
                  <span className="flex min-w-0 items-center gap-1.5 truncate text-[#404042]">
                    {line ? <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: line.color }} /> : null}
                    <span className="truncate">{o.vendor}</span>
                  </span>
                  <span className="h-2.5 rounded-full bg-[#F2F4F8]">
                    <span
                      className="block h-2.5 rounded-full"
                      style={{
                        width: `${Math.max(8, (o.price / maxPrice) * 100)}%`,
                        background: lineKey && focus === lineKey ? line!.color : i === 0 ? BEST_COLOR : '#C9CED8',
                        opacity: o.in_stock ? 1 : 0.5,
                      }}
                    />
                  </span>
                  <span className={`tabular-nums ${i === 0 ? 'font-semibold text-[#16171A]' : 'text-[#404042]'}`}>
                    {eur(o.price)} €{i > 0 ? <span className="ml-1 text-[#9AA0A8]">+{eur(o.price - priceList[0].price)}</span> : null}
                  </span>
                </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
