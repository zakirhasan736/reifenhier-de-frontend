import { toMoneyNumber } from '@/libs/money';

export const SAVINGS_TOOLTIP =
  'Ersparnis gegenüber dem teuersten Angebot';

function positivePrices(values: unknown[]): number[] {
  return values
    .map(v => toMoneyNumber(v))
    .filter((n): n is number => n != null && n > 0);
}

export function highestPrice(...values: unknown[]): number | null {
  const nums = positivePrices(values);
  return nums.length ? Math.max(...nums) : null;
}

export function lowestPrice(...values: unknown[]): number | null {
  const nums = positivePrices(values);
  return nums.length ? Math.min(...nums) : null;
}

/** Discount vs the most expensive offer. Null when there is no real saving. */
export function savingsPercentValue(
  price: unknown,
  expensive: unknown,
): number | null {
  const p = toMoneyNumber(price);
  const max = toMoneyNumber(expensive);
  if (p == null || max == null || p <= 0 || max <= 0) return null;
  const pct = Math.round(((max - p) / max) * 100);
  if (!Number.isFinite(pct) || pct < 2 || pct > 99) return null;
  return pct;
}

/** Same badge on listing, homepage, and product page, e.g. "15%". */
export function formatSavingsPercent(
  price: unknown,
  expensive: unknown,
): string | null {
  const pct = savingsPercentValue(price, expensive);
  return pct == null ? null : `${pct}%`;
}
