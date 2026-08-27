import { toMoneyNumber } from '@/libs/money';
import type { CompareProduct } from '@/store/compareSlice';

const SPEED_ORDER = [
  'L',
  'M',
  'N',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'H',
  'V',
  'W',
  'Y',
  '(Y)',
  'Z',
];

export function parseTyreSize(p: CompareProduct) {
  const width = String(p.width || '').trim();
  const height = String(p.height || '').trim();
  const diameter = String(p.diameter || '').trim();
  if (width && height && diameter) {
    return {
      width,
      height,
      diameter,
      label: `${width}/${height} R${diameter}`,
    };
  }
  const dim = String(p.dimensions || '');
  const match =
    dim.match(/(\d+)\s*[/-]\s*(\d+)\s*R\s*(\d+)/i) ||
    dim.match(/(\d+)\s*[/-]\s*(\d+)\s*[/-]\s*(\d+)/);
  if (match) {
    return {
      width: match[1],
      height: match[2],
      diameter: match[3],
      label: `${match[1]}/${match[2]} R${match[3]}`,
    };
  }
  return { width: '', height: '', diameter: '', label: dim || '—' };
}

export function comparePrice(p: CompareProduct) {
  return (
    toMoneyNumber(p.cheapest_offer) ??
    toMoneyNumber(p.search_price) ??
    0
  );
}

export function gradeRank(grade?: string | null) {
  const g = String(grade || '').toUpperCase().replace(/[^A-G]/g, '');
  if (!g) return 99;
  return 'ABCDEFG'.indexOf(g[0]);
}

export function speedRank(index?: string | null) {
  const key = String(index || '').toUpperCase().trim();
  const i = SPEED_ORDER.indexOf(key);
  return i === -1 ? -1 : i;
}

export function loadRank(index?: string | null) {
  const n = Number(String(index || '').replace(/\D/g, ''));
  return Number.isFinite(n) ? n : -1;
}

export function noiseDb(p: CompareProduct) {
  const raw = String(p.noise_class || '').replace(',', '.');
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : null;
}

export function sameSize(a: CompareProduct, b: CompareProduct) {
  const sa = parseTyreSize(a);
  const sb = parseTyreSize(b);
  if (!sa.width || !sb.width) return sa.label === sb.label && !!sa.label;
  return (
    sa.width === sb.width &&
    sa.height === sb.height &&
    sa.diameter === sb.diameter
  );
}

export function pickWinners(products: CompareProduct[]) {
  if (products.length === 0) {
    return {
      cheapestId: null as string | null,
      bestFuelId: null as string | null,
      bestWetId: null as string | null,
      quietestId: null as string | null,
      recommendedId: null as string | null,
    };
  }

  const cheapest = [...products].sort((a, b) => comparePrice(a) - comparePrice(b))[0];
  const bestFuel = [...products].sort(
    (a, b) => gradeRank(a.fuel_class) - gradeRank(b.fuel_class)
  )[0];
  const bestWet = [...products].sort(
    (a, b) => gradeRank(a.wet_grip) - gradeRank(b.wet_grip)
  )[0];
  const withNoise = products
    .map(p => ({ p, db: noiseDb(p) }))
    .filter(x => x.db != null);
  const quietest = withNoise.sort((a, b) => (a.db || 99) - (b.db || 99))[0]?.p;

  const scored = products.map(p => {
    const price = comparePrice(p);
    const cheapestPrice = comparePrice(cheapest);
    const priceScore = cheapestPrice > 0 ? cheapestPrice / Math.max(price, 1) : 0;
    const fuelScore = 1 - Math.min(gradeRank(p.fuel_class), 6) / 6;
    const wetScore = 1 - Math.min(gradeRank(p.wet_grip), 4) / 4;
    const sizeBonus = products.every(other => sameSize(p, other)) ? 0.15 : 0;
    return {
      p,
      score: priceScore * 0.45 + wetScore * 0.3 + fuelScore * 0.25 + sizeBonus,
    };
  });
  const recommended = [...scored].sort((a, b) => b.score - a.score)[0]?.p;

  return {
    cheapestId: cheapest?._id || null,
    bestFuelId: bestFuel?._id || null,
    bestWetId: bestWet?._id || null,
    quietestId: quietest?._id || null,
    recommendedId: recommended?._id || null,
  };
}

export function listingUrlForSize(p: CompareProduct) {
  const size = parseTyreSize(p);
  const params = new URLSearchParams();
  if (p.merchant_product_third_category) {
    params.set('kategorie', p.merchant_product_third_category);
  }
  if (size.width) params.set('width', size.width);
  if (size.height) params.set('height', size.height);
  if (size.diameter) params.set('diameter', size.diameter);
  const qs = params.toString();
  return qs ? `/produkte?${qs}` : '/produkte';
}
