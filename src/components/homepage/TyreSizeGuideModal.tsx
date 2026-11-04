'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Car,
  CircleDot,
  FileText,
  Gauge,
  Ruler,
  Search,
  Weight,
  X,
} from 'lucide-react';

/**
 * "Wo finde ich meine Reifengröße?" — size guide dialog for the banner filter.
 * A real sidewall photo (text removed) gets the visitor's chosen size printed
 * along the sidewall curve; each part is numbered, explained and highlighted
 * on hover/tap. Load and speed index can be picked to explore the values.
 */

export const SPEED_INDEXES: { code: string; kmh: number | string }[] = [
  { code: 'A8', kmh: 40 }, { code: 'B', kmh: 50 }, { code: 'C', kmh: 60 },
  { code: 'D', kmh: 65 }, { code: 'E', kmh: 70 }, { code: 'F', kmh: 80 },
  { code: 'G', kmh: 90 }, { code: 'J', kmh: 100 }, { code: 'K', kmh: 110 },
  { code: 'L', kmh: 120 }, { code: 'M', kmh: 130 }, { code: 'N', kmh: 140 },
  { code: 'P', kmh: 150 }, { code: 'Q', kmh: 160 }, { code: 'R', kmh: 170 },
  { code: 'S', kmh: 180 }, { code: 'T', kmh: 190 }, { code: 'U', kmh: 200 },
  { code: 'H', kmh: 210 }, { code: '(V)', kmh: '>210' }, { code: 'V', kmh: 240 },
  { code: '(W)', kmh: '>240' }, { code: 'W', kmh: 270 }, { code: 'Y', kmh: 300 },
  { code: '(Y)', kmh: '>300' }, { code: 'ZR', kmh: '>240' },
];

export const LOAD_INDEX_KG: Record<number, number> = {
  70: 335, 71: 345, 72: 355, 73: 365, 74: 375, 75: 387, 76: 400, 77: 412,
  78: 425, 79: 437, 80: 450, 81: 462, 82: 475, 83: 487, 84: 500, 85: 515,
  86: 530, 87: 545, 88: 560, 89: 580, 90: 600, 91: 615, 92: 630, 93: 650,
  94: 670, 95: 690, 96: 710, 97: 730, 98: 750, 99: 775, 100: 800, 101: 825,
  102: 850, 103: 875, 104: 900, 105: 925, 106: 950, 107: 975, 108: 1000,
  109: 1030, 110: 1060, 111: 1090, 112: 1120, 113: 1150, 114: 1180,
  115: 1215, 116: 1250, 117: 1285, 118: 1320, 119: 1360, 120: 1400,
  121: 1450, 122: 1500,
};

// --- photo geometry (public/images/tyre-size-guide.webp, 1000×468) ----------
const IMG_W = 1000;
const IMG_H = 468;
const CX = 502.3; // tyre centre (below the picture)
const CY = 574.5;
const R_BASE = 389; // text baseline radius on the sidewall
const FONT = 40; // matches the original embossing (cap height ≈ 29px)
const LS = 3; // letter spacing
const A0 = (-160 * Math.PI) / 180; // arc start angle
const TEXT_CENTER = (-86.8 * Math.PI) / 180; // where the original text was centred
const ARC_LEN = R_BASE * ((140 * Math.PI) / 180);

const de = (n: number, digits = 0) =>
  n.toLocaleString('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits });

type Part = 'width' | 'ratio' | 'build' | 'rim' | 'load' | 'speed';
type Seg = { text: string; part?: Part; gapAfter: number };

function measureFactory() {
  let ctx: CanvasRenderingContext2D | null = null;
  return (s: string) => {
    if (typeof document !== 'undefined') {
      ctx = ctx || document.createElement('canvas').getContext('2d');
      if (ctx) {
        ctx.font = `600 ${FONT}px Poppins, system-ui, sans-serif`;
        return ctx.measureText(s).width + LS * s.length;
      }
    }
    return s.length * FONT * 0.62 + LS * s.length; // server / fallback
  };
}

const pointAt = (angle: number, r: number) => ({
  x: CX + r * Math.cos(angle),
  y: CY + r * Math.sin(angle),
});

export default function TyreSizeGuideModal({
  width,
  height,
  diameter,
  lastIndex,
  onSearch,
}: {
  width?: string;
  height?: string;
  diameter?: string;
  lastIndex?: string;
  onSearch?: () => void;
}) {
  const w = width || '205';
  const h = height || '55';
  const d = diameter || '16';
  const [li, setLi] = useState(lastIndex && LOAD_INDEX_KG[Number(lastIndex)] ? lastIndex : '91');
  const [si, setSi] = useState('H');
  const [active, setActive] = useState<Part | null>(null);
  const [tab, setTab] = useState<'speed' | 'load'>('load');
  // measure with the real font only after mount (no hydration mismatch)
  const [measured, setMeasured] = useState(false);
  useEffect(() => {
    if (document.fonts?.ready) document.fonts.ready.then(() => setMeasured(true));
    else setMeasured(true);
  }, []);
  useEffect(() => {
    if (lastIndex && LOAD_INDEX_KG[Number(lastIndex)]) setLi(lastIndex);
  }, [lastIndex]);

  const segs: Seg[] = [
    { text: w, part: 'width', gapAfter: 16 },
    { text: '/', gapAfter: 16 },
    { text: h, part: 'ratio', gapAfter: 18 },
    { text: 'R', part: 'build', gapAfter: 10 },
    { text: d, part: 'rim', gapAfter: 30 },
    { text: li, part: 'load', gapAfter: 12 },
    { text: si.replace(/[()]/g, ''), part: 'speed', gapAfter: 0 },
  ];

  const layout = useMemo(() => {
    const m = measured ? measureFactory() : (s: string) => s.length * FONT * 0.62 + LS * s.length;
    const widths = segs.map(s => m(s.text));
    const total = widths.reduce((a, b, i) => a + b + segs[i].gapAfter, 0);
    let s0 = R_BASE * (TEXT_CENTER - A0) - total / 2;
    return segs.map((sg, i) => {
      const start = s0;
      const mid = s0 + widths[i] / 2;
      s0 += widths[i] + sg.gapAfter;
      return { ...sg, start, mid, angle: A0 + mid / R_BASE };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measured, w, h, d, li, si]);

  const parts = layout.filter(l => l.part);
  // markers fan out evenly above the tyre, like a technical drawing
  const fan = (i: number) => ((-128 + (i * 76) / (parts.length - 1)) * Math.PI) / 180;

  const kg = LOAD_INDEX_KG[Number(li)];
  const kmh = SPEED_INDEXES.find(s => s.code === si)?.kmh;
  const sidewall = (Number(w) * Number(h)) / 100;
  const rimMm = Number(d) * 25.4;
  const outer = rimMm + 2 * sidewall;
  const sizeText = `${w}/${h} R${d} ${li}${si.replace(/[()]/g, '')}`;
  const valid = [w, h, d].every(v => Number(v) > 0);

  const INFO: Record<Part, { n: number; label: string; short?: string; value: string; text: string; icon: typeof Ruler }> = {
    width: { n: 1, label: 'Reifenbreite', value: `${w} mm`, text: 'Breite des Reifens von Flanke zu Flanke.', icon: Ruler },
    ratio: {
      n: 2,
      label: 'Querschnitt',
      value: `${h} %`,
      text: valid ? `Flankenhöhe = ${h} % der Breite ≈ ${de(sidewall, 1)} mm.` : 'Verhältnis Flankenhöhe zu Breite.',
      icon: Ruler,
    },
    build: { n: 3, label: 'Bauart', value: 'R', text: 'Radialreifen – Standard bei allen Pkw-Reifen.', icon: CircleDot },
    rim: {
      n: 4,
      label: 'Felgendurchmesser',
      short: 'Felge',
      value: `${d} Zoll`,
      text: valid ? `Passend für ${d}-Zoll-Felgen (≈ ${de(rimMm)} mm).` : 'Durchmesser der Felge in Zoll.',
      icon: CircleDot,
    },
    load: {
      n: 5,
      label: 'Lastindex',
      value: `${li}`,
      text: kg ? `Max. ${de(kg)} kg pro Reifen · ${de(kg * 4)} kg für 4 Reifen.` : 'Tragfähigkeit pro Reifen.',
      icon: Weight,
    },
    speed: {
      n: 6,
      label: 'Geschwindigkeitsindex',
      short: 'Speedindex',
      value: si,
      text: kmh ? `Zugelassen bis ${typeof kmh === 'number' ? `${kmh}` : kmh} km/h.` : 'Zulässige Höchstgeschwindigkeit.',
      icon: Gauge,
    },
  };

  const hl = (p?: Part) => !!p && active === p;
  const close = () => (document.getElementById('tyre_size_modal') as HTMLDialogElement | null)?.close();

  const arcPath = (() => {
    const p0 = pointAt(A0, R_BASE);
    const p1 = pointAt(A0 + ARC_LEN / R_BASE, R_BASE);
    return `M${p0.x.toFixed(1)},${p0.y.toFixed(1)} A${R_BASE},${R_BASE} 0 0 1 ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
  })();

  return (
    <dialog id="tyre_size_modal" className="modal modal-bottom sm:modal-middle" aria-labelledby="tyre-size-guide-title">
      <div className="modal-box !w-full sm:!w-[94vw] !max-w-[980px] !max-h-[92vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] bg-white p-0 text-[#16171A]">
        {/* header */}
        <div className="sticky top-0 z-10 flex items-start gap-4 border-b border-[#EEF0F4] bg-white/95 px-5 py-4 backdrop-blur md:px-8 md:py-5">
          <span className="hidden sm:inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EEF2FF] text-primary-100">
            <Ruler size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 id="tyre-size-guide-title" className="text-[19px] md:text-[22px] font-semibold leading-tight">
              Wo finde ich meine Reifengröße?
            </h3>
            <p className="mt-1 hidden sm:block !text-[13px] md:!text-[14px] text-[#5A5B61]">
              So lesen Sie die Angaben auf Ihrem Reifen – mit Ihrer gewählten Größe erklärt.
            </p>
          </div>
          <form method="dialog">
            <button
              aria-label="Schließen"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E7EE] text-[#404042] hover:bg-[#F5F7FA] cursor-pointer"
            >
              <X size={18} />
            </button>
          </form>
        </div>

        <div className="px-5 pb-6 pt-5 md:px-8">
          {/* photo + sidewall text */}
          <div className="relative overflow-hidden rounded-[22px] border border-[#EEF0F4] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EEF0F4] px-4 py-3 md:px-5">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] md:text-[12px] font-medium uppercase tracking-[0.12em] text-[#6B6E76]">Ihre Größe</span>
                <span className="rounded-lg bg-[#16171A] px-2.5 py-1 text-[15px] md:text-[18px] font-semibold tabular-nums" style={{ color: '#fff' }}>
                  {sizeText}
                </span>
              </div>
              <span className="hidden sm:inline text-[12px] text-[#6B6E76]">Nummer antippen oder darüberfahren</span>
            </div>
            <div className="relative w-full" style={{ aspectRatio: `${IMG_W} / ${IMG_H}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/tyre-size-guide.webp"
                alt={`Reifenflanke mit der Größenangabe ${sizeText}`}
                width={IMG_W}
                height={IMG_H}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <svg
                viewBox={`0 0 ${IMG_W} ${IMG_H}`}
                className="absolute inset-0 h-full w-full"
                role="img"
                aria-label={`Aufbau der Reifengröße ${sizeText}`}
              >
                <defs>
                  <path id="tsg-arc" d={arcPath} />
                  <filter id="tsg-emboss" x="-5%" y="-20%" width="110%" height="140%">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="0.8" floodColor="#000" floodOpacity="0.9" />
                  </filter>
                </defs>

                {/* leader lines + markers */}
                {parts.map((p, i) => {
                  const a = fan(i);
                  const s1 = pointAt(p.angle, 428);
                  const s2 = pointAt(p.angle, 470);
                  const m = pointAt(a, 515);
                  const on = hl(p.part);
                  return (
                    <g
                      key={`m-${p.part}`}
                      className="cursor-pointer"
                      onPointerEnter={e => e.pointerType === 'mouse' && setActive(p.part!)}
                      onPointerLeave={e => e.pointerType === 'mouse' && setActive(null)}
                      onClick={() => setActive(p.part!)}
                    >
                      <polyline
                        points={`${s1.x},${s1.y} ${s2.x},${s2.y} ${m.x},${m.y}`}
                        fill="none"
                        stroke={on ? '#3A64F6' : '#9AA3B2'}
                        strokeWidth={on ? 3 : 2}
                        strokeDasharray={on ? undefined : '5 4'}
                      />
                      <circle cx={m.x} cy={m.y} r={on ? 26 : 22} fill={on ? '#3A64F6' : '#fff'} stroke="#3A64F6" strokeWidth="3" />
                      <text x={m.x} y={m.y + 8} textAnchor="middle" fontSize="22" fontWeight="700" fill={on ? '#fff' : '#3A64F6'}>
                        {INFO[p.part!].n}
                      </text>
                    </g>
                  );
                })}

                {/* the size printed along the sidewall */}
                {layout.map((sg, i) => (
                  <text
                    key={`t-${i}`}
                    fontSize={FONT}
                    fontWeight={600}
                    letterSpacing={LS}
                    fill={hl(sg.part) ? '#FFD84D' : '#F3F4F6'}
                    filter="url(#tsg-emboss)"
                    style={{ transition: 'fill .2s' }}
                    className={sg.part ? 'cursor-pointer' : undefined}
                    onPointerEnter={sg.part ? e => e.pointerType === 'mouse' && setActive(sg.part!) : undefined}
                    onPointerLeave={sg.part ? e => e.pointerType === 'mouse' && setActive(null) : undefined}
                    onClick={sg.part ? () => setActive(sg.part!) : undefined}
                  >
                    <textPath href="#tsg-arc" startOffset={sg.start.toFixed(1)}>
                      {sg.text}
                    </textPath>
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* the six parts */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3">
            {(Object.keys(INFO) as Part[]).map(p => {
              const it = INFO[p];
              const on = active === p;
              return (
                <button
                  key={p}
                  type="button"
                  onPointerEnter={e => e.pointerType === 'mouse' && setActive(p)}
                  onPointerLeave={e => e.pointerType === 'mouse' && setActive(null)}
                  onFocus={() => setActive(p)}
                  onClick={() => setActive(p)}
                  className={`group flex items-start gap-3 rounded-2xl border p-3 text-left transition md:p-4 cursor-pointer ${
                    on ? 'border-primary-100 bg-[#F4F7FF] shadow-[0_10px_30px_-18px_rgba(58,100,246,.8)]' : 'border-[#EEF0F4] bg-[#FAFBFD] hover:border-[#D9DFEA]'
                  }`}
                >
                  <span
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                      on ? 'bg-primary-100 text-white' : 'bg-white text-primary-100 ring-2 ring-primary-100'
                    }`}
                  >
                    {it.n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] md:text-[12px] font-medium uppercase tracking-[0.06em] text-[#6B6E76]">
                      <span className="md:hidden">{it.short || it.label}</span>
                      <span className="hidden md:inline">{it.label}</span>
                    </span>
                    <span className="block text-[18px] md:text-[20px] font-semibold leading-tight tabular-nums">{it.value}</span>
                    <span className="mt-0.5 block text-[12px] md:text-[13px] leading-snug text-[#5A5B61]">{it.text}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* derived dimensions */}
          {valid ? (
            <dl className="mt-3 grid grid-cols-3 gap-2.5 md:gap-3">
              {[
                { k: 'Flankenhöhe', v: `${de(sidewall, 1)} mm` },
                { k: 'Außendurchmesser', v: `${de(outer)} mm` },
                { k: 'Abrollumfang', v: `≈ ${de(outer * Math.PI)} mm` },
              ].map(s => (
                <div key={s.k} className="rounded-2xl bg-[#16171A] px-3 py-3 md:px-4">
                  <dt className="hyphens-auto break-words text-[11px] md:text-[12px]" lang="de" style={{ color: 'rgba(255,255,255,.62)' }}>{s.k}</dt>
                  <dd className="whitespace-nowrap text-[14px] md:text-[18px] font-semibold tabular-nums" style={{ color: '#fff' }}>{s.v}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {/* where to find it */}
          <h4 className="mt-7 text-[16px] md:text-[18px] font-semibold">Wo steht die Größe?</h4>
          <div className="mt-3 grid gap-2.5 md:grid-cols-3 md:gap-3">
            {[
              { icon: CircleDot, t: 'Auf der Reifenflanke', d: 'Auf jedem Reifen seitlich eingeprägt – genau wie im Bild oben.' },
              { icon: FileText, t: 'Im Fahrzeugschein', d: 'Zulassungsbescheinigung Teil I, Felder 15.1 bis 15.3 (Bereifung je Achse).' },
              { icon: Car, t: 'Am Aufkleber im Auto', d: 'Oft im Tankdeckel oder an der Fahrertür – zusammen mit dem Reifendruck.' },
            ].map(x => (
              <div key={x.t} className="flex gap-3 rounded-2xl border border-[#EEF0F4] p-3 md:p-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-primary-100">
                  <x.icon size={20} />
                </span>
                <span>
                  <span className="block text-[14px] font-semibold">{x.t}</span>
                  <span className="block text-[13px] leading-snug text-[#5A5B61]">{x.d}</span>
                </span>
              </div>
            ))}
          </div>

          {/* index tables */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-[16px] md:text-[18px] font-semibold">Index wählen und Werte sehen</h4>
            <div role="tablist" className="flex gap-1 rounded-full bg-[#F2F4F8] p-1">
              {(
                [
                  ['load', 'Lastindex'],
                  ['speed', 'Geschwindigkeit'],
                ] as const
              ).map(([k, l]) => (
                <button
                  key={k}
                  role="tab"
                  type="button"
                  aria-selected={tab === k}
                  onClick={() => setTab(k)}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium cursor-pointer ${
                    tab === k ? 'bg-white shadow-sm text-[#16171A]' : 'text-[#5A5B61]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {tab === 'load' ? (
            <div className="mt-3 grid max-h-[260px] grid-cols-4 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-6 md:grid-cols-8">
              {Object.entries(LOAD_INDEX_KG).map(([idx, v]) => {
                const on = idx === li;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLi(idx)}
                    onPointerEnter={e => e.pointerType === 'mouse' && setActive('load')}
                    onPointerLeave={e => e.pointerType === 'mouse' && setActive(null)}
                    aria-pressed={on}
                    className={`rounded-xl border px-2 py-1.5 text-center transition cursor-pointer ${
                      on ? 'border-primary-100 bg-primary-100 text-white' : 'border-[#EEF0F4] hover:border-primary-100'
                    }`}
                  >
                    <span className="block text-[13px] font-semibold">{idx}</span>
                    <span className={`block text-[11px] ${on ? 'text-white/80' : 'text-[#6B6E76]'}`}>{v} kg</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-9">
              {SPEED_INDEXES.map(({ code, kmh: k }) => {
                const on = code === si;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSi(code)}
                    onPointerEnter={e => e.pointerType === 'mouse' && setActive('speed')}
                    onPointerLeave={e => e.pointerType === 'mouse' && setActive(null)}
                    aria-pressed={on}
                    className={`rounded-xl border px-2 py-1.5 text-center transition cursor-pointer ${
                      on ? 'border-primary-100 bg-primary-100 text-white' : 'border-[#EEF0F4] hover:border-primary-100'
                    }`}
                  >
                    <span className="block text-[13px] font-semibold">{code}</span>
                    <span className={`block text-[11px] ${on ? 'text-white/80' : 'text-[#6B6E76]'}`}>{k} km/h</span>
                  </button>
                );
              })}
            </div>
          )}

          <ul className="mt-4 space-y-1.5 text-[13px] leading-snug text-[#5A5B61]">
            <li>• Ein <strong className="text-[#16171A]">höherer</strong> Last- oder Geschwindigkeitsindex als in den Fahrzeugpapieren ist zulässig, ein niedrigerer Lastindex nicht.</li>
            <li>• Winterreifen dürfen einen niedrigeren Geschwindigkeitsindex haben – dann muss ein Aufkleber mit der Höchstgeschwindigkeit im Sichtfeld kleben.</li>
            <li>• Sommer- und Winterreifen können unterschiedliche Größen haben. Prüfen Sie den jeweiligen Reifensatz.</li>
          </ul>

          <Link
            href="/artikel/lastindex-geschwindigkeitsindex-winterreifen-91h-94v-xl"
            onClick={close}
            className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-primary-100 hover:underline"
          >
            <BookOpen size={16} /> Ratgeber: Lastindex &amp; Geschwindigkeitsindex erklärt
          </Link>
        </div>

        {/* footer */}
        <div className="sticky bottom-0 flex items-center gap-2 border-t border-[#EEF0F4] bg-white/95 px-4 py-3 backdrop-blur sm:justify-end md:px-8">
          <form method="dialog" className="hidden sm:block sm:mr-auto">
            <button className="h-12 w-full rounded-xl px-4 text-[14px] font-medium text-[#404042] hover:bg-[#F5F7FA] sm:w-auto cursor-pointer">Schließen</button>
          </form>
          {onSearch ? (
            <button
              type="button"
              onClick={() => {
                close();
                onSearch();
              }}
              className="inline-flex h-12 flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-primary-100 px-6 text-[15px] font-semibold text-white hover:opacity-90 cursor-pointer"
            >
              <Search size={18} /> Reifen in {w}/{h} R{d} finden <ArrowRight size={18} />
            </button>
          ) : null}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button aria-label="Schließen">close</button>
      </form>
    </dialog>
  );
}
