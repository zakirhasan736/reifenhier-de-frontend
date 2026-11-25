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

type TyreListingInput = Pick<CompareProduct, 'width' | 'height' | 'diameter' | 'dimensions' | 'merchant_product_third_category'>;

export function parseTyreSize(p: TyreListingInput) {
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

export function listingUrlForSize(p: TyreListingInput) {
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

const PREMIUM_BRANDS = ['michelin', 'continental', 'bridgestone', 'goodyear', 'pirelli', 'dunlop'];
const QUALITY_BRANDS = [
  'hankook', 'nokian', 'vredestein', 'falken', 'toyo', 'yokohama', 'kumho', 'bfgoodrich', 'uniroyal', 'semperit',
  'barum', 'fulda', 'firestone', 'kleber', 'cooper', 'nexen', 'general', 'gt radial', 'maxxis', 'kenda', 'sava',
  'debica', 'matador', 'giti', 'laufenn', 'avon', 'apollo', 'kormoran', 'riken', 'tigar',
];
const brandScore = (name: string) => {
  const n = String(name || '').toLowerCase().trim();
  if (PREMIUM_BRANDS.some(b => n.startsWith(b))) return 1;
  if (QUALITY_BRANDS.some(b => n.startsWith(b))) return 0.5;
  return 0;
};
/** A=1 … E=0.2 – the same scale Searchlight uses */
const labelScore = (g?: string) => {
  const r = gradeRank(g);
  return r === 99 ? 0.45 : Math.max(0, (5 - r) / 5);
};

export type CompareVerdict = {
  /** 0..100 per product id – same idea as Searchlight's match score */
  scores: Record<string, number>;
  bestId: string | null;
  /** short reasons for the best product, from our own data only */
  reasons: string[];
  /** extra cost for 4 tyres compared with the cheapest product */
  extraFor4: Record<string, number>;
};

const euro = (n: number) => `${n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

/**
 * One clear answer for the comparison, weighted exactly like Searchlight's
 * "Preis-Leistung" (wet grip 3, price 3, brand 2, fuel 1.5, noise 1, rating 1),
 * so the compare winner and Searchlight's recommendation agree.
 */
export function compareVerdict(products: CompareProduct[]): CompareVerdict {
  const empty: CompareVerdict = { scores: {}, bestId: null, reasons: [], extraFor4: {} };
  if (!products.length) return empty;
  const prices = products.map(comparePrice).filter(p => p > 0);
  const lo = prices.length ? Math.min(...prices) : 0;
  const hi = prices.length ? Math.max(...prices) : 0;
  const dbs = products.map(noiseDb).filter((d): d is number => d != null);
  const dbLo = dbs.length ? Math.min(...dbs) : 0;
  const dbHi = dbs.length ? Math.max(...dbs) : 0;
  const W = { wet: 3, cheap: 3, brand: 2, fuel: 1.5, quiet: 1, rating: 1 };
  const total = Object.values(W).reduce((a, b) => a + b, 0);

  const raw = products.map(p => {
    const price = comparePrice(p);
    const cheap = price > 0 && hi > lo ? 1 - (price - lo) / (hi - lo) : price > 0 ? 1 : 0;
    const db = noiseDb(p);
    const quiet = db == null ? 0.45 : Math.max(0, Math.min(1, (76 - db) / 10));
    const r = Number(p.average_rating);
    const rating = r > 0 ? Math.max(0, Math.min(1, (r - 2.5) / 2.5)) : 0.5;
    const s =
      (labelScore(p.wet_grip) * W.wet + cheap * W.cheap + brandScore(p.brand_name) * W.brand + labelScore(p.fuel_class) * W.fuel + quiet * W.quiet + rating * W.rating) / total;
    return { p, s };
  });
  const scores: Record<string, number> = {};
  raw.forEach(r => (scores[r.p._id] = Math.round(50 + r.s * 49)));
  const best = [...raw].sort((a, b) => b.s - a.s || comparePrice(a.p) - comparePrice(b.p))[0]?.p || null;

  const extraFor4: Record<string, number> = {};
  products.forEach(p => {
    const price = comparePrice(p);
    extraFor4[p._id] = price > 0 && lo > 0 ? Math.round((price - lo) * 4 * 100) / 100 : 0;
  });

  const reasons: string[] = [];
  if (best && products.length > 1) {
    const others = products.filter(p => p._id !== best._id);
    const bestPrice = comparePrice(best);
    const wet = String(best.wet_grip || '').toUpperCase()[0];
    const betterWet = others.filter(o => gradeRank(o.wet_grip) > gradeRank(best.wet_grip)).length;
    if (bestPrice > 0 && bestPrice === lo) reasons.push('Günstigster Reifen im Vergleich');
    else if (bestPrice > 0) {
      const pricier = others.filter(o => comparePrice(o) > bestPrice);
      if (pricier.length) {
        const save = Math.max(...pricier.map(o => (comparePrice(o) - bestPrice) * 4));
        reasons.push(`Bis zu ${euro(save)} günstiger als die teureren Reifen (4 Stück)`);
      }
    }
    const sp = shopSavingsPct(best);
    if (sp) reasons.push(`${sp} % günstiger als beim teuersten Shop`);
    if (wet && betterWet === others.length && others.length) reasons.push(`Beste Nasshaftung im Vergleich (${wet})`);
    else if (wet && 'AB'.includes(wet)) reasons.push(`Sehr gute Nasshaftung (${wet}) – kurzer Bremsweg bei Regen`);
    const fuel = String(best.fuel_class || '').toUpperCase()[0];
    if (fuel && 'AB'.includes(fuel)) reasons.push(`Geringer Rollwiderstand (${fuel}) – spart Sprit`);
    const db = noiseDb(best);
    if (db != null && db === dbLo && dbHi > dbLo) reasons.push(`Leisester Reifen (${db} dB)`);
    if ((best.offer_count || 0) > 1) reasons.push(`${best.offer_count} Shops im Preisvergleich`);
  }
  return { scores, bestId: best?._id || null, reasons: reasons.slice(0, 3), extraFor4 };
}

/** Stored daily best prices of the last 60 days + today's price (null if < 2 points). */
export function trendPoints(p: CompareProduct, now = new Date()): { points: [string, number][]; pct: number; isLowest: boolean } | null {
  const raw = (p.price_trend?.points || []).filter(x => Array.isArray(x) && x.length === 2 && Number(x[1]) > 0);
  const cut = new Date(now.getTime() - 60 * 864e5).toISOString().slice(0, 10);
  const today = now.toISOString().slice(0, 10);
  let pts = raw.map(([d, v]) => [String(d).slice(0, 10), Number(v)] as [string, number]);
  const before = pts.filter(([d]) => d < cut).pop();
  pts = pts.filter(([d]) => d >= cut);
  if (before) pts.unshift([cut, before[1]]);
  const price = comparePrice(p);
  if (price > 0 && (!pts.length || pts[pts.length - 1][0] < today)) pts.push([today, price]);
  if (pts.length < 2) return null;
  const first = pts[0][1];
  const last = pts[pts.length - 1][1];
  const low = Math.min(...pts.map(x => x[1]));
  return { points: pts, pct: first > 0 ? Math.round(((last - first) / first) * 100) : 0, isLowest: last <= low + 0.005 };
}

/** % less than the most expensive shop for the same tyre (0 when unknown). */
export function shopSavingsPct(p: CompareProduct) {
  const price = comparePrice(p);
  const max = toMoneyNumber(p.expensive_offer) ?? 0;
  if (!(price > 0) || !(max > price)) return 0;
  const pct = Math.round(((max - price) / max) * 100);
  return pct >= 2 && pct <= 90 ? pct : 0;
}
