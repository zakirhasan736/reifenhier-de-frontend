import { buildTrend, eur, pct, type PricePoint } from '@/libs/priceTrend';

const COLORS = { down: '#1F8A3B', up: '#D33A3A', flat: '#8A8F9C' } as const;

/**
 * Compact best-price trend for product cards: a step-line sparkline plus
 * "↓ 4,2 % · 30 Tage". Renders nothing until there is real history.
 */
export default function PriceSparkline({
  points,
  current,
  days = 30,
  width = 72,
  height = 22,
  className = '',
}: {
  points?: PricePoint[] | unknown;
  current?: number | null;
  days?: number;
  width?: number;
  height?: number;
  className?: string;
}) {
  const t = buildTrend(points, current, days);
  if (!t || !t.meaningful) return null;

  const color = COLORS[t.direction];
  const x0 = new Date(`${t.series[0][0]}T12:00:00Z`).getTime();
  const x1 = new Date(`${t.series[t.series.length - 1][0]}T12:00:00Z`).getTime();
  const span = Math.max(1, x1 - x0);
  const lo = t.lowest;
  const hi = t.highest === t.lowest ? t.lowest + 1 : t.highest;
  const pad = 2;
  const X = (day: string) =>
    pad + ((new Date(`${day}T12:00:00Z`).getTime() - x0) / span) * (width - pad * 2);
  const Y = (p: number) => pad + (1 - (p - lo) / (hi - lo)) * (height - pad * 2);

  // step line: price holds until the next change
  let d = '';
  t.series.forEach(([day, p], i) => {
    const x = X(day).toFixed(1);
    const y = Y(p).toFixed(1);
    if (i === 0) d = `M${x},${y}`;
    else d += `H${x}V${y}`;
  });
  const [lastDay, lastPrice] = t.series[t.series.length - 1];

  const label =
    t.direction === 'flat'
      ? `Preis stabil · ${days} Tage`
      : `${t.direction === 'down' ? '↓' : '↑'} ${pct(t.changePct)} · ${days} Tage`;
  const title =
    t.direction === 'flat'
      ? `Bester Preis seit ${days} Tagen unverändert bei ${eur(lastPrice)} €`
      : `Bester Preis vor ${days} Tagen ${eur(t.first)} €, heute ${eur(lastPrice)} € (Tiefstwert ${eur(t.lowest)} €)`;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`} title={title}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={title}
        className="shrink-0"
      >
        <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx={X(lastDay)} cy={Y(lastPrice)} r="2.4" fill={color} />
      </svg>
      <span className="text-[12px] font-medium leading-none whitespace-nowrap" style={{ color }}>
        {label}
      </span>
    </span>
  );
}
