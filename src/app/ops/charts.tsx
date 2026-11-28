'use client';

import { useState } from 'react';

export type Point = {
  label: string;
  views: number;
  clicks: number;
  sales: number;
  amount: number;
  profit: number;
};

type Key = keyof Omit<Point, 'label'>;

type Series = { key: Key; label: string; color: string; format?: (n: number) => string };

export function AreaChart({
  points,
  series,
  format,
}: {
  points: Point[];
  series: Series[];
  format: (n: number) => string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const w = 720;
  const h = 248;
  const padL = 8;
  const padR = 8;
  const padT = 18;
  const padB = 28;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const max = Math.max(1, ...points.flatMap((point) => series.map((item) => point[item.key])));
  const n = Math.max(points.length, 1);
  const x = (index: number) => (n === 1 ? padL + innerW / 2 : padL + (index * innerW) / (n - 1));
  const y = (value: number) => padT + (1 - value / max) * innerH;
  const line = (key: Key) => points.map((point, index) => `${index ? 'L' : 'M'}${x(index).toFixed(1)},${y(point[key]).toFixed(1)}`).join(' ');
  const area = (key: Key) => {
    if (points.length < 2) return '';
    return `${line(key)} L${x(points.length - 1).toFixed(1)},${(padT + innerH).toFixed(1)} L${x(0).toFixed(1)},${(padT + innerH).toFixed(1)} Z`;
  };
  const labelStep = Math.max(1, Math.ceil(points.length / 6));
  const tip = active != null ? points[active] : null;

  return (
    <div className="relative">
      <div className="mb-3 flex flex-wrap gap-4">
        {series.map((item) => (
          <span key={item.key} className="inline-flex items-center gap-2 text-xs font-semibold text-[#5C6370]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img">
        <defs>
          {series.map((item) => (
            <linearGradient key={item.key} id={`fill-${item.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={item.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={item.color} stopOpacity="0.02" />
            </linearGradient>
          ))}
        </defs>
        {[0.25, 0.5, 0.75, 1].map((step) => (
          <line
            key={step}
            x1={padL}
            x2={w - padR}
            y1={y(max * step)}
            y2={y(max * step)}
            stroke="#E6EAF2"
            strokeDasharray="3 4"
          />
        ))}
        {series.map((item) => (
          <path key={`${item.key}-area`} d={area(item.key)} fill={`url(#fill-${item.key})`} />
        ))}
        {series.map((item) => (
          <path key={item.key} d={line(item.key)} fill="none" stroke={item.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {points.map((point, index) => (
          <text
            key={`${point.label}-${index}`}
            x={x(index)}
            y={h - 6}
            textAnchor="middle"
            className="fill-[#8B90A0]"
            fontSize="11"
          >
            {index % labelStep === 0 ? point.label : ''}
          </text>
        ))}
        {active != null && (
          <line x1={x(active)} x2={x(active)} y1={padT} y2={padT + innerH} stroke="#C5CAD6" />
        )}
        {points.map((point, index) => (
          <rect
            key={`hit-${point.label}-${index}`}
            x={x(index) - innerW / Math.max(n, 1) / 2}
            y={0}
            width={innerW / Math.max(n, 1)}
            height={h}
            fill="transparent"
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
          />
        ))}
      </svg>
      {tip && active != null && (
        <div
          className="pointer-events-none absolute top-8 z-10 min-w-36 rounded-xl bg-[#12141C] px-3 py-2 text-xs text-white shadow-lg"
          style={{ left: `${(x(active) / w) * 100}%`, transform: 'translateX(-50%)' }}
        >
          <p className="font-semibold">{tip.label}</p>
          {series.map((item) => (
            <p key={item.key} className="mt-0.5" style={{ color: item.color }}>
              {item.label}: {(item.format || format)(tip[item.key])}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function HBars({ rows }: { rows: { label: string; value: number; hint: string }[] }) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  if (!rows.length) return <p className="text-sm text-[#6B7080]">Nothing in this range yet.</p>;
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-medium text-[#16171A]">{row.label}</span>
            <span className="shrink-0 text-[#5C6370]">{row.hint}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#EEF1F6]">
            <div className="h-full rounded-full bg-[#3A64F6]" style={{ width: `${Math.max(4, (row.value / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
