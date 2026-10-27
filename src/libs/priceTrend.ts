/**
 * Price trend maths shared by the card sparkline and the product page chart.
 * Points are [YYYY-MM-DD, price]; a missing day means "unchanged".
 */
export type PricePoint = [string, number];

export type Trend = {
  /** points inside the window, starting value carried in, ending today */
  series: PricePoint[];
  first: number;
  last: number;
  changePct: number; // + = more expensive
  direction: 'down' | 'up' | 'flat';
  lowest: number;
  highest: number;
  /** enough data to say something meaningful */
  meaningful: boolean;
};

export function berlinToday(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

export function dayMinus(day: string, n: number) {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string) {
  return Math.round(
    (new Date(`${b}T12:00:00Z`).getTime() - new Date(`${a}T12:00:00Z`).getTime()) / 864e5
  );
}

/**
 * Builds the series for the last `days` days: the last price before the
 * window becomes the starting value, and today's price closes the line.
 */
export function buildTrend(
  raw: unknown,
  current?: number | null,
  days = 30,
  today = berlinToday()
): Trend | null {
  const pts = (Array.isArray(raw) ? raw : [])
    .filter(
      (p): p is PricePoint =>
        Array.isArray(p) && typeof p[0] === 'string' && Number(p[1]) > 0
    )
    .map(p => [p[0], Number(p[1])] as PricePoint)
    .sort((a, b) => a[0].localeCompare(b[0]));
  if (!pts.length && !(Number(current) > 0)) return null;

  const from = dayMinus(today, days);
  const before = pts.filter(p => p[0] < from).pop();
  const inside = pts.filter(p => p[0] >= from && p[0] <= today);
  const series: PricePoint[] = [];
  if (before) series.push([from, before[1]]);
  series.push(...inside);
  const now = Number(current) > 0 ? Number(current) : series[series.length - 1]?.[1];
  if (!series.length && now) series.push([today, now]);
  if (now && series[series.length - 1][0] !== today) series.push([today, now]);
  if (now && series[series.length - 1][0] === today) series[series.length - 1][1] = now;

  const prices = series.map(p => p[1]);
  const first = series[0][1];
  const last = series[series.length - 1][1];
  const changePct = first > 0 ? ((last - first) / first) * 100 : 0;
  const spanDays = daysBetween(series[0][0], today);
  return {
    series,
    first,
    last,
    changePct,
    direction: Math.abs(changePct) < 1 ? 'flat' : changePct < 0 ? 'down' : 'up',
    lowest: Math.min(...prices),
    highest: Math.max(...prices),
    // at least two distinct prices, or an unchanged price we've watched for a week
    meaningful: new Set(prices).size > 1 || spanDays >= 7,
  };
}

export const eur = (n: number) =>
  n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const pct = (n: number) =>
  `${Math.abs(n).toLocaleString('de-DE', { maximumFractionDigits: Math.abs(n) < 10 ? 1 : 0 })} %`;

export function shortDate(day: string) {
  const [y, m, d] = day.split('-');
  return `${d}.${m}.${y.slice(2)}`;
}
