/** Parse API money values that may be number or DE-formatted string ("163,77"). */
export function toMoneyNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const s = value.trim();
    if (!s) return null;
    const normalized = s
      .replace(/\s/g, '')
      .replace(/\.(?=\d{3}(\D|$))/g, '')
      .replace(',', '.')
      .replace(/[^\d.-]/g, '');
    if (!normalized || normalized === '-' || normalized === '.') return null;
    const n = Number(normalized);
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
