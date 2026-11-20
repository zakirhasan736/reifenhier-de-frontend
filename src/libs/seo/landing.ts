import { SITE_URL } from '@/libs/seo/site';

/**
 * URL scheme for indexable landing pages (what people type into Google):
 *   /reifen/205-55-r16          → "205/55 R16 Reifen"
 *   /marken/continental         → "Continental Reifen"
 *   /sommerreifen, /winterreifen, /ganzjahresreifen
 */

/** Landing pages need at least this many products to be indexed. */
export const MIN_LANDING_PRODUCTS = 3;
/** Size × brand / size × season pages ("Michelin 195/65 R15") are indexed from 2 products. */
export const MIN_COMBO_PRODUCTS = 2;

export type TyreSize = { width: string; height: string; diameter: string };

export const SEASONS = [
  {
    slug: 'sommerreifen',
    category: 'Sommerreifen',
    label: 'Sommerreifen',
    short: 'Sommer',
  },
  {
    slug: 'winterreifen',
    category: 'Winterreifen',
    label: 'Winterreifen',
    short: 'Winter',
  },
  {
    slug: 'ganzjahresreifen',
    category: 'Ganzjahresreifen',
    label: 'Ganzjahresreifen',
    short: 'Ganzjahres',
  },
] as const;

export type SeasonSlug = (typeof SEASONS)[number]['slug'];

export function seasonBySlug(slug: string) {
  return SEASONS.find(s => s.slug === slug);
}

/** Map a feed category ("Sommerreifen", "Allwetterreifen", ...) to a season. */
export function seasonForCategory(category?: string | null) {
  const c = String(category || '').toLowerCase();
  if (c.includes('sommer')) return SEASONS[0];
  if (c.includes('winter')) return SEASONS[1];
  if (c.includes('ganz') || c.includes('allwetter') || c.includes('all season'))
    return SEASONS[2];
  return undefined;
}

export function sizeSlug({ width, height, diameter }: TyreSize) {
  return `${width}-${height}-r${diameter}`.toLowerCase();
}

export function parseSizeSlug(slug: string): TyreSize | null {
  const m = String(slug)
    .toLowerCase()
    .match(/^(\d{3})-(\d{2})-r?(\d{2})$/);
  return m ? { width: m[1], height: m[2], diameter: m[3] } : null;
}

export function sizeLabel({ width, height, diameter }: TyreSize) {
  return `${width}/${height} R${diameter}`;
}

/** "205/55 R16 91V" / dimensions "205/55R16" → size, if any */
export function sizeFromText(text?: string | null): TyreSize | null {
  // optional HL / LT / P prefix ("HL285/35 R21"), C suffix for van tyres ("R16C")
  const m = String(text || '').match(/\b(?:HL|LT|P)?(\d{3})\s*\/\s*(\d{2})\s*Z?R?F?\s*(\d{2})C?\b/i);
  return m && isValidSize(m[1], m[2], m[3]) ? { width: m[1], height: m[2], diameter: m[3] } : null;
}

/** Plausible passenger/SUV/van metric size (filters feed glitches like 31/10 R50). */
export function isValidSize(width: string | number, height: string | number, diameter: string | number) {
  const w = Number(width), h = Number(height), d = Number(diameter);
  return w >= 115 && w <= 355 && h >= 25 && h <= 95 && d >= 10 && d <= 24;
}

export function brandSlug(name: string) {
  return String(name || '')
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const sizeUrl = (s: TyreSize) => `${SITE_URL}/reifen/${sizeSlug(s)}`;
export const sizePath = (s: TyreSize) => `/reifen/${sizeSlug(s)}`;
export const brandPath = (name: string) => `/marken/${brandSlug(name)}`;
export const brandUrl = (name: string) => `${SITE_URL}${brandPath(name)}`;
export const seasonPath = (slug: SeasonSlug) => `/${slug}`;

/** German money: 89.9 → "89,90" */
export function euro(n?: number | null) {
  if (typeof n !== 'number' || !Number.isFinite(n) || n <= 0) return '';
  return n.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** "/reifen/195-65-r15/michelin" – size × brand landing. */
export const sizeBrandPath = (s: TyreSize, brand: string) => `${sizePath(s)}/${brandSlug(brand)}`;
/** "/reifen/205-55-r16/winterreifen" – size × season landing. */
export const sizeSeasonPath = (s: TyreSize, slug: SeasonSlug) => `${sizePath(s)}/${slug}`;

/** "MICHELIN" → "Michelin", "BARUM" → "Barum"; keeps mixed case and short acronyms (BFG). */
export function displayBrand(name: string) {
  const n = String(name || '').trim();
  if (n.length <= 3 || n !== n.toUpperCase()) return n;
  return n.toLowerCase().replace(/(^|[\s-])([a-zäöü])/g, (_m, a: string, b: string) => a + b.toUpperCase());
}
