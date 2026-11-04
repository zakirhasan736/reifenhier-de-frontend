'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

/**
 * Price range filter for the listing sidebar.
 *
 * - histogram of how many tyres sit at each price (from the API)
 * - two-thumb slider (pointer, touch and keyboard), 1 € steps
 * - editable min / max fields
 * - quick ranges ("bis 60 €", …)
 * Nothing is fetched while dragging: the range is committed on release,
 * on Enter/blur in the fields, on a quick range, or 500 ms after keyboard use.
 */

export type PriceHistogram = { min: number; max: number; bins: number[] };

interface PriceRangeSliderProps {
  /** price bounds of the current result set (other filters applied) */
  min: number;
  max: number;
  /** current filter; 0 / 99999 (or anything outside the bounds) = no limit */
  minPrice: number;
  maxPrice: number;
  histogram?: PriceHistogram;
  total?: number;
  loading?: boolean;
  /** null = no limit on that side */
  onCommit: (min: number | null, max: number | null) => void;
}

const eur = (n: number) => `${Math.round(n).toLocaleString('de-DE')} €`;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** round a step to 5 / 10 / 25 / 50 / 100 … */
function niceStep(raw: number) {
  const pow = Math.pow(10, Math.floor(Math.log10(Math.max(raw, 1))));
  for (const m of [1, 2, 2.5, 5, 10]) if (raw <= m * pow) return m * pow;
  return 10 * pow;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  minPrice,
  maxPrice,
  histogram,
  total,
  loading,
  onCommit,
}) => {
  const lo0 = Math.floor(Number.isFinite(min) ? min : 0);
  const hi0 = Math.ceil(Number.isFinite(max) ? max : 0);
  const ready = hi0 > lo0 && hi0 < 99999;

  const fromProps = useCallback((): [number, number] => {
    const a = minPrice > lo0 && minPrice < hi0 ? Math.floor(minPrice) : lo0;
    const b = maxPrice < hi0 && maxPrice > lo0 ? Math.ceil(maxPrice) : hi0;
    return [Math.min(a, b), Math.max(a, b)];
  }, [minPrice, maxPrice, lo0, hi0]);

  const [range, setRange] = useState<[number, number]>(fromProps);
  const [drag, setDrag] = useState<0 | 1 | null>(null);
  const [inputs, setInputs] = useState<[string, string]>(['', '']);
  const [focusField, setFocusField] = useState<0 | 1 | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const thumbId = (i: 0 | 1) => `price-thumb-${i}-${uid}`;
  const labelId = `price-range-label-${uid}`;
  const keyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // follow the store (URL, reset, new bounds) while the user isn't interacting
  useEffect(() => {
    if (drag === null) setRange(fromProps());
  }, [fromProps, drag]);

  const [a, b] = range;
  const active = ready && (a > lo0 || b < hi0);
  const pct = (v: number) => (ready ? ((v - lo0) / (hi0 - lo0)) * 100 : 0);

  const commit = useCallback(
    (x: number, y: number) => {
      const lo = Math.round(Math.min(x, y));
      const hi = Math.round(Math.max(x, y));
      onCommit(lo <= lo0 ? null : lo, hi >= hi0 ? null : hi);
    },
    [onCommit, lo0, hi0]
  );

  // ---- pointer dragging --------------------------------------------------
  const valueAt = (clientX: number) => {
    const r = trackRef.current?.getBoundingClientRect();
    if (!r || !ready) return lo0;
    const f = clamp((clientX - r.left) / r.width, 0, 1);
    return Math.round(lo0 + f * (hi0 - lo0));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ready) return;
    e.preventDefault();
    const v = valueAt(e.clientX);
    // pick the closer thumb; on a tie, the side we're moving towards
    const which: 0 | 1 = Math.abs(v - a) < Math.abs(v - b) ? 0 : Math.abs(v - a) > Math.abs(v - b) ? 1 : v < a ? 0 : 1;
    setDrag(which);
    setRange(which === 0 ? [Math.min(v, b), b] : [a, Math.max(v, a)]);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    (document.getElementById(thumbId(which)) as HTMLElement | null)?.focus({ preventScroll: true });
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag === null) return;
    const v = valueAt(e.clientX);
    setRange(([x, y]) => (drag === 0 ? [Math.min(v, y), y] : [x, Math.max(v, x)]));
  };
  const endDrag = () => {
    if (drag === null) return;
    setDrag(null);
    commit(range[0], range[1]);
  };

  // ---- keyboard on the thumbs ---------------------------------------------
  const onKey = (which: 0 | 1) => (e: React.KeyboardEvent) => {
    const big = Math.max(5, niceStep((hi0 - lo0) / 20));
    const delta: Record<string, number> = {
      ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1,
      PageDown: -big, PageUp: big,
    };
    let next: number | undefined;
    if (e.key in delta) next = (which === 0 ? a : b) + delta[e.key] * (e.shiftKey && Math.abs(delta[e.key]) === 1 ? 10 : 1);
    if (e.key === 'Home') next = which === 0 ? lo0 : a;
    if (e.key === 'End') next = which === 0 ? b : hi0;
    if (next === undefined) return;
    e.preventDefault();
    const n = which === 0 ? ([clamp(next, lo0, b), b] as [number, number]) : ([a, clamp(next, a, hi0)] as [number, number]);
    setRange(n);
    if (keyTimer.current) clearTimeout(keyTimer.current);
    keyTimer.current = setTimeout(() => commit(n[0], n[1]), 500);
  };
  useEffect(() => () => { if (keyTimer.current) clearTimeout(keyTimer.current); }, []);

  // ---- typed values ---------------------------------------------------------
  const commitInput = (which: 0 | 1) => {
    const raw = inputs[which].replace(/[^\d,.]/g, '').replace(',', '.');
    setFocusField(null);
    if (raw === '') {
      const n: [number, number] = which === 0 ? [lo0, b] : [a, hi0];
      setRange(n);
      commit(n[0], n[1]);
      return;
    }
    const v = Math.round(Number(raw));
    if (!Number.isFinite(v)) return;
    const c = clamp(v, lo0, hi0);
    // typed value wins: a max below the min (or a min above the max) opens the other side
    const n: [number, number] = which === 0 ? [c, c > b ? hi0 : b] : [c < a ? lo0 : a, c];
    setRange(n);
    commit(n[0], n[1]);
  };
  const fieldValue = (which: 0 | 1) =>
    focusField === which ? inputs[which] : String(which === 0 ? a : b);

  // ---- quick ranges ---------------------------------------------------------
  const presets = useMemo(() => {
    if (!ready) return [];
    const span = hi0 - lo0;
    if (span < 20) return [];
    const step = niceStep(span / 4);
    const cuts: number[] = [];
    for (let v = Math.ceil((lo0 + step * 0.6) / step) * step; v < hi0 - step * 0.4 && cuts.length < 3; v += step) cuts.push(v);
    if (!cuts.length) return [];
    const out: { label: string; r: [number, number] }[] = [{ label: `bis ${eur(cuts[0])}`, r: [lo0, cuts[0]] }];
    for (let i = 1; i < cuts.length; i++) out.push({ label: `${cuts[i - 1]}–${eur(cuts[i])}`, r: [cuts[i - 1], cuts[i]] });
    out.push({ label: `ab ${eur(cuts[cuts.length - 1])}`, r: [cuts[cuts.length - 1], hi0] });
    return out;
  }, [ready, lo0, hi0]);

  // ---- histogram -------------------------------------------------------------
  const bins = histogram && histogram.bins?.length && histogram.max > histogram.min ? histogram.bins : null;
  const peak = bins ? Math.max(...bins, 1) : 1;
  const binInRange = (i: number) => {
    if (!histogram || !bins) return false;
    const w = (histogram.max - histogram.min) / bins.length;
    const from = histogram.min + i * w;
    const to = from + w;
    return to > a && from < b;
  };

  return (
    <div className="price-filter-v3 flex flex-col gap-3">
      <span id={labelId} className="sr-only">Preisbereich in Euro</span>

      {/* summary */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] text-[#6B6E76]" aria-live="polite">
          {loading ? 'Wird aktualisiert…' : typeof total === 'number' ? `${total.toLocaleString('de-DE')} Reifen` : ''}
        </span>
        {active ? (
          <button
            type="button"
            onClick={() => {
              setRange([lo0, hi0]);
              onCommit(null, null);
            }}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary-100 hover:underline cursor-pointer"
          >
            <RotateCcw size={12} /> Zurücksetzen
          </button>
        ) : null}
      </div>

      {/* histogram + slider */}
      <div className="px-1">
        {bins ? (
          <div className="flex h-12 items-end gap-[2px]" aria-hidden="true">
            {bins.map((c, i) => (
              <span
                key={i}
                className="flex-1 rounded-t-[3px] transition-colors"
                style={{
                  height: `${c ? Math.max(8, (c / peak) * 100) : 3}%`,
                  background: binInRange(i) ? '#3A64F6' : '#DDE2EC',
                  opacity: binInRange(i) ? 0.85 : 1,
                }}
              />
            ))}
          </div>
        ) : null}

        <div
          ref={trackRef}
          role="group"
          aria-labelledby={labelId}
          className={`relative h-8 select-none touch-none ${ready ? 'cursor-pointer' : 'opacity-50'}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#E4E7EE]" />
          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary-100"
            style={{ left: `${pct(a)}%`, width: `${pct(b) - pct(a)}%` }}
          />
          {([0, 1] as const).map(i => {
            const v = i === 0 ? a : b;
            return (
              <button
                key={i}
                id={thumbId(i)}
                data-thumb={i}
                type="button"
                role="slider"
                aria-label={i === 0 ? 'Mindestpreis' : 'Höchstpreis'}
                aria-valuemin={i === 0 ? lo0 : a}
                aria-valuemax={i === 0 ? b : hi0}
                aria-valuenow={v}
                aria-valuetext={eur(v)}
                disabled={!ready}
                onKeyDown={onKey(i)}
                className={`absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-primary-100 bg-white shadow-[0_2px_8px_rgba(16,24,40,.25)] outline-none transition-transform focus-visible:ring-4 focus-visible:ring-[#3a63f633] ${
                  drag === i ? 'scale-110' : ''
                }`}
                style={{ left: `${pct(v)}%`, zIndex: drag === i || (i === 0 && a === b && a === hi0) ? 3 : 2 }}
              >
                {/* inner dot – also keeps the button non-empty (globals.css hides button:empty) */}
                <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-100" />
                {drag === i ? (
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#16171A] px-2 py-1 text-[12px] font-semibold text-white">
                    {eur(v)}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        {ready ? (
          <div className="flex justify-between text-[11px] text-[#9AA0A8] tabular-nums">
            <span>{eur(lo0)}</span>
            <span>{eur(hi0)}</span>
          </div>
        ) : null}
      </div>

      {/* typed values */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {([0, 1] as const).map(i => (
          <React.Fragment key={i}>
            {i === 1 ? <span className="text-[#9AA0A8]">–</span> : null}
            <label className="flex h-11 items-center rounded-[10px] border border-[#E4E7EE] bg-[#F7F8FB] px-3 focus-within:border-primary-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3a63f623]">
              <span className="sr-only">{i === 0 ? 'Mindestpreis in Euro' : 'Höchstpreis in Euro'}</span>
              <span className="mr-1 text-[11px] font-semibold text-[#6B6E76]">{i === 0 ? 'Min' : 'Max'}</span>
              <input
                type="text"
                inputMode="numeric"
                disabled={!ready}
                value={ready ? fieldValue(i) : ''}
                onFocus={e => {
                  setFocusField(i);
                  setInputs(p => (i === 0 ? [String(a), p[1]] : [p[0], String(b)]));
                  e.currentTarget.select();
                }}
                onChange={e => {
                  const v = e.target.value;
                  setInputs(p => (i === 0 ? [v, p[1]] : [p[0], v]));
                }}
                onBlur={() => commitInput(i)}
                onKeyDown={e => {
                  if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur();
                }}
                className="w-full min-w-0 bg-transparent text-right text-[15px] font-semibold text-[#16171A] tabular-nums outline-none"
              />
              <span className="ml-1 text-[14px] text-[#6B6E76]">€</span>
            </label>
          </React.Fragment>
        ))}
      </div>

      {/* quick ranges */}
      {presets.length ? (
        <div className="flex flex-wrap gap-1.5">
          {presets.map(p => {
            const on = a === p.r[0] && b === p.r[1];
            return (
              <button
                key={p.label}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setRange(p.r);
                  commit(p.r[0], p.r[1]);
                }}
                className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition cursor-pointer ${
                  on ? 'border-primary-100 bg-primary-100 text-white' : 'border-[#E4E7EE] bg-white text-[#404042] hover:border-primary-100 hover:text-primary-100'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default PriceRangeSlider;
