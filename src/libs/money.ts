/** Parse API money values that may be number or DE-formatted string ("163,77"). */
export function toMoneyNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const cleaned = value.trim().replace(/\s/g, '').replace(',', '.');
    if (!cleaned) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Format for German UI, e.g. "163,77 €". */
export function formatEuro(
  value: unknown,
  opts?: { suffix?: boolean; fallback?: string }
): string {
  const n = toMoneyNumber(value);
  if (n == null) return opts?.fallback ?? '';
  const formatted = n.toFixed(2).replace('.', ',');
  return opts?.suffix === false ? formatted : `${formatted} €`;
}
