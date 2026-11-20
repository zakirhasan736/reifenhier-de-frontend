'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeftRight, ArrowRight } from 'lucide-react';
import { tyreGeometry, type SizeInput } from '@/libs/seo/tyreGeometry';

const WIDTHS = [135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325];
const HEIGHTS = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
const RIMS = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

const nf = (n: number, d = 0) => n.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const label = (s: SizeInput) => `${s.width}/${s.height} R${s.diameter}`;

function SizePicker({ value, onChange, tone, title }: { value: SizeInput; onChange: (s: SizeInput) => void; tone: string; title: string }) {
  const sel = 'w-full rounded-[10px] border border-[#E1E5EE] bg-mono-0 px-3 py-2.5 text-[15px] font-medium text-[#16171A] focus:outline-none focus:border-primary-100';
  return (
    <fieldset className="rounded-[16px] border border-[#E9ECF3] bg-mono-0 p-4 md:p-5">
      <legend className="px-1 text-[14px] font-semibold" style={{ color: tone }}>{title}</legend>
      <div className="grid grid-cols-3 gap-2">
        <label className="text-[12px] text-[#6B6E76]">Breite (mm)
          <select className={sel} value={value.width} onChange={e => onChange({ ...value, width: Number(e.target.value) })}>
            {WIDTHS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </label>
        <label className="text-[12px] text-[#6B6E76]">Querschnitt (%)
          <select className={sel} value={value.height} onChange={e => onChange({ ...value, height: Number(e.target.value) })}>
            {HEIGHTS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </label>
        <label className="text-[12px] text-[#6B6E76]">Felge (Zoll)
          <select className={sel} value={value.diameter} onChange={e => onChange({ ...value, diameter: Number(e.target.value) })}>
            {RIMS.map(r => <option key={r} value={r}>R{r}</option>)}
          </select>
        </label>
      </div>
    </fieldset>
  );
}

/** Side-view drawing of both tyres at the same scale (mm → px). */
function Visual({ a, b }: { a: SizeInput; b: SizeInput }) {
  const ga = tyreGeometry(a);
  const gb = tyreGeometry(b);
  const max = Math.max(ga.outer, gb.outer);
  const H = 260;
  const scale = (H - 20) / max;
  const tyre = (g: ReturnType<typeof tyreGeometry>, cx: number, color: string, name: string) => {
    const R = (g.outer / 2) * scale;
    const r = (g.rim / 2) * scale;
    const cy = H - 10 - R; // both standing on the same ground line
    return (
      <g>
        <circle cx={cx} cy={cy} r={R} fill="#22252B" />
        <circle cx={cx} cy={cy} r={R - 3} fill="none" stroke="#3A3E46" strokeWidth={2} strokeDasharray="6 5" />
        <circle cx={cx} cy={cy} r={r} fill="#E6E9F0" stroke={color} strokeWidth={3} />
        <circle cx={cx} cy={cy} r={r * 0.28} fill="#C9CED8" />
        <line x1={cx + R + 8} x2={cx + R + 8} y1={cy - R} y2={cy + R} stroke={color} strokeWidth={2} />
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={13} fontWeight={600} fill="#16171A">{name}</text>
        <text x={cx + R + 14} y={cy} fontSize={12} fill={color} fontWeight={600}>{nf(g.outer)} mm</text>
      </g>
    );
  };
  return (
    <svg viewBox={`0 0 560 ${H}`} className="w-full h-auto" role="img" aria-label={`Seitenansicht: ${label(a)} neben ${label(b)}`}>
      <line x1={0} x2={560} y1={H - 10} y2={H - 10} stroke="#C9CED8" strokeWidth={2} />
      {tyre(ga, 150, '#3A64F6', label(a))}
      {tyre(gb, 400, '#E8590C', label(b))}
    </svg>
  );
}

export default function TyreSizeCompare({ initialA, initialB }: { initialA: SizeInput; initialB: SizeInput }) {
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const ga = useMemo(() => tyreGeometry(a), [a]);
  const gb = useMemo(() => tyreGeometry(b), [b]);
  const diff = ((gb.circumference - ga.circumference) / ga.circumference) * 100;
  const speedo = 100 * (gb.circumference / ga.circumference);
  const ok = Math.abs(diff) <= 2;
  const warn = Math.abs(diff) > 2 && Math.abs(diff) <= 3;

  const rows: Array<[string, string, string, string]> = [
    ['Gesamtdurchmesser', `${nf(ga.outer)} mm`, `${nf(gb.outer)} mm`, `${gb.outer - ga.outer >= 0 ? '+' : ''}${nf(gb.outer - ga.outer, 1)} mm`],
    ['Abrollumfang', `${nf(ga.circumference)} mm`, `${nf(gb.circumference)} mm`, `${diff >= 0 ? '+' : ''}${nf(diff, 2)} %`],
    ['Flankenhöhe', `${nf(ga.sidewall, 1)} mm`, `${nf(gb.sidewall, 1)} mm`, `${gb.sidewall - ga.sidewall >= 0 ? '+' : ''}${nf(gb.sidewall - ga.sidewall, 1)} mm`],
    ['Reifenbreite', `${a.width} mm`, `${b.width} mm`, `${b.width - a.width >= 0 ? '+' : ''}${b.width - a.width} mm`],
    ['Felgendurchmesser', `${a.diameter} Zoll`, `${b.diameter} Zoll`, `${b.diameter - a.diameter >= 0 ? '+' : ''}${b.diameter - a.diameter} Zoll`],
    ['Umdrehungen pro km', nf(ga.revsPerKm), nf(gb.revsPerKm), `${gb.revsPerKm - ga.revsPerKm >= 0 ? '+' : ''}${nf(gb.revsPerKm - ga.revsPerKm)}`],
  ];

  const filterHref = (s: SizeInput) => `/produkte?width=${s.width}&height=${s.height}&diameter=${s.diameter}`;

  return (
    <div className="tyre-size-compare">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] items-center">
        <SizePicker title="Aktuelle Größe" tone="#3A64F6" value={a} onChange={setA} />
        <button
          type="button"
          onClick={() => { setA(b); setB(a); }}
          className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E1E5EE] bg-mono-0 text-[#4B4F58] hover:text-primary-100 hover:border-primary-100"
          aria-label="Größen tauschen"
        >
          <ArrowLeftRight size={18} />
        </button>
        <SizePicker title="Neue Größe" tone="#E8590C" value={b} onChange={setB} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-[16px] border border-[#E9ECF3] bg-mono-0 p-4">
          <Visual a={a} b={b} />
        </div>
        <div className="rounded-[16px] border border-[#E9ECF3] bg-mono-0 p-4 overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-left text-[#6B6E76]">
                <th className="py-2 font-medium">Wert</th>
                <th className="py-2 font-medium text-[#3A64F6]">{label(a)}</th>
                <th className="py-2 font-medium text-[#E8590C]">{label(b)}</th>
                <th className="py-2 font-medium">Differenz</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r[0]} className="border-t border-[#EEF0F5]">
                  <td className="py-2 text-[#4B4F58]">{r[0]}</td>
                  <td className="py-2 font-medium">{r[1]}</td>
                  <td className="py-2 font-medium">{r[2]}</td>
                  <td className="py-2 font-semibold">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            className={`mt-4 rounded-[12px] px-4 py-3 text-[14px] ${ok ? 'bg-[#E7F7F1] text-[#0F6B53]' : warn ? 'bg-[#FFF4E5] text-[#9A5B00]' : 'bg-[#FDECEC] text-[#A12626]'}`}
            role="status"
          >
            <strong>Tacho bei 100 km/h: tatsächlich {nf(speedo, 1)} km/h.</strong>{' '}
            {ok
              ? 'Abweichung im Abrollumfang unter 2 % – üblicher Rahmen für Umrüstgrößen.'
              : warn
                ? 'Abweichung zwischen 2 und 3 % – nur mit Freigabe im COC-Papier oder vom Hersteller.'
                : 'Abweichung über 3 % – als Alternativgröße in der Regel nicht geeignet.'}{' '}
            Verbindlich sind die Fahrzeugpapiere.
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <Link href={filterHref(a)} className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-primary-100 px-5 py-3 font-semibold text-white hover:opacity-90">
          {label(a)} Preise vergleichen <ArrowRight size={16} />
        </Link>
        <Link href={filterHref(b)} className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-primary-100 px-5 py-3 font-semibold text-primary-100 hover:bg-primary-100 hover:text-white">
          {label(b)} Preise vergleichen <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
