'use client';

import { useId } from 'react';

export type TrendPoint = [string, number];

/**
 * Small price line: area + line, today's price as a dot, the lowest price
 * marked. Green when the price went down, red when it went up.
 */
export default function PriceTrendChart({
  points,
  height = 56,
  dark = false,
  showAxis = true,
}: {
  points: TrendPoint[];
  height?: number;
  dark?: boolean;
  showAxis?: boolean;
}) {
  const id = useId().replace(/:/g, '');
  if (!points || points.length < 2) return null;
  const W = 300;
  const H = height;
  const pad = { t: 8, b: showAxis ? 16 : 6, l: 4, r: 8 };
  const t0 = Date.parse(points[0][0]);
  const t1 = Date.parse(points[points.length - 1][0]);
  const vals = points.map(p => p[1]);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const span = hi - lo || 1;
  const x = (d: string) => pad.l + ((Date.parse(d) - t0) / Math.max(1, t1 - t0)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - lo) / span) * (H - pad.t - pad.b);
  // step line: a price stays until it changes
  let d = `M${x(points[0][0]).toFixed(1)},${y(points[0][1]).toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    d += ` H${x(points[i][0]).toFixed(1)} V${y(points[i][1]).toFixed(1)}`;
  }
  const last = points[points.length - 1];
  const down = last[1] <= points[0][1];
  const color = down ? '#16A34A' : '#DC2626';
  const area = `${d} V${H - pad.b} H${x(points[0][0]).toFixed(1)} Z`;
  const lowPt = points.reduce((a, b) => (b[1] < a[1] ? b : a));
  const fmt = (s: string) => new Date(s).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  const axisColor = dark ? 'rgba(255,255,255,0.6)' : '#8A90A2';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`Preisverlauf: ${down ? 'gefallen' : 'gestiegen'}`}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={dark ? 0.35 : 0.22} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {lowPt !== last ? <circle cx={x(lowPt[0])} cy={y(lowPt[1])} r={2.6} fill={dark ? '#fff' : '#fff'} stroke={color} strokeWidth={1.6} /> : null}
      <circle cx={x(last[0])} cy={y(last[1])} r={7} fill={color} opacity={0.18} />
      <circle cx={x(last[0])} cy={y(last[1])} r={3.8} fill={color} stroke="#fff" strokeWidth={1.6} />
      {showAxis ? (
        <>
          <text x={pad.l} y={H - 3} fontSize="10" fill={axisColor}>
            {fmt(points[0][0])}
          </text>
          <text x={W - pad.r} y={H - 3} fontSize="10" fill={axisColor} textAnchor="end">
            heute
          </text>
        </>
      ) : null}
    </svg>
  );
}
