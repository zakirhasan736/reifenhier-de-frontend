import type { Metadata } from 'next';
import { safeSeoImageUrl, SITE_URL, productCanonicalUrl } from '@/libs/seo/site';
import { toMoneyNumber } from '@/libs/money';

export interface Product {
  _id: string;
  slug: string;
  brand_logo: string;
  product_image: string;
  merchant_product_third_category: string; // Sommerreifen | Winterreifen | Ganzjahresreifen
  search_price: number | string;
  main_price?: number | string;
  average_rating: number;
  rating_count: number;
  cheapest_offer: number | string;
  expensive_offer: number | string;
  savings_percent: string;
  savings_amount?: number;
  related_cheaper?: unknown[];
  brand_name: string;
  product_name: string;
  in_stock: string; // "instock" | "outofstock" | etc. (your API uses lowercase strings often)
  delivery_time?: string;
  ean?: string;
  product_url?: string;
  dimensions?: string;
  fuel_class?: string;
  wet_grip?: string;
  noise_class?: string;
  width?: string;
  height?: string;
  diameter?: string;
  lastIndex?: string;
  speedIndex?: string;
}

export type FullProduct = Product;

// --- small utilities ---
export function extractSize(p: { product_name?: string; dimensions?: string }): string | undefined {
  const source = `${p.product_name} ${p.dimensions || ''}`;
  const m = source.match(/\b\d{3}\/\d{2}\s?R?\s?\d{2}\b/i);
  return m ? m[0].replace(/\s+/g, ' ').toUpperCase() : undefined;
}

export function normalizeSeason(p: {
  merchant_product_third_category?: string
}): string | undefined {
  const s = (p.merchant_product_third_category || '').toLowerCase();
  if (s.includes('sommer')) return 'Sommerreifen';
  if (s.includes('winter')) return 'Winterreifen';
  if (s.includes('ganz') || s.includes('allwetter') || s.includes('all season'))
    return 'Ganzjahresreifen';
  return undefined;
}

// --- Thin content heuristic (optional, helpful for SEO quality) ---
export function isThinProduct(p: Product): boolean {
  const hasName = Boolean(p.brand_name && p.product_name);
  const hasMediaOrOffers =
    Boolean(p.product_image) ||
    toMoneyNumber(p.search_price) != null ||
    toMoneyNumber(p.cheapest_offer) != null;

  return !hasName || !hasMediaOrOffers;
}

// --- Keyword builder ---
export function buildProductKeywords(p: Partial<Product> & { brand_name?: string; product_name?: string }): string[] {
  const season = normalizeSeason(p)
  const size = extractSize(p)
  const brand = (p.brand_name || '').trim()
  const name = (p.product_name || '').trim()
  const modelGuess = brand
    ? name.replace(new RegExp(`^${brand}\\s*`, 'i'), '').trim()
    : name
  const width = p.width?.trim()
  const height = p.height?.trim()
  const diameter = p.diameter?.trim()
  const lastIndex = p.lastIndex?.trim()
  const speedIndex = p.speedIndex?.trim()
  const ean = (p.ean || '').trim()
  const year = '2026'

  const unique: string[] = [
    [brand, modelGuess].filter(Boolean).join(' '),
    [brand, modelGuess, size].filter(Boolean).join(' '),
    [brand, modelGuess, season].filter(Boolean).join(' '),
    size ? `${size} Preisvergleich` : '',
    size ? `${size} günstig kaufen` : '',
    size ? `${size} Reifen Test ${year}` : '',
    size && season ? `${season} ${size} Preisvergleich` : '',
    size && brand ? `${brand} ${size} Vergleich` : '',
    size && brand ? `${brand} ${size} günstig` : '',
    brand ? `${brand} Reifen günstig` : '',
    brand ? `${brand} ${modelGuess} Test` : '',
    brand ? `${brand} ${modelGuess} Erfahrungen` : '',
    brand ? `${brand} ${modelGuess} Bewertung` : '',
    brand ? `${brand} ${modelGuess} kaufen` : '',
    brand ? `EU Reifenlabel ${brand} ${modelGuess}` : '',
    season ? `${season} Test ${year}` : '',
    season ? `${season} Angebote ${year}` : '',
    season ? `${season} Preisvergleich` : '',
    lastIndex && speedIndex ? `${lastIndex}${speedIndex}` : '',
    lastIndex && speedIndex && size
      ? `${size} ${lastIndex}${speedIndex}`
      : '',
    width && height && diameter ? `${width}/${height} R${diameter}` : '',
    p.fuel_class ? `Rollwiderstand ${p.fuel_class}` : '',
    p.wet_grip ? `Nasshaftung ${p.wet_grip}` : '',
    p.noise_class ? `Reifengeräusch ${p.noise_class}` : '',
    ean ? `EAN ${ean}` : '',
    'Reifen Preisvergleich',
    'Reifen online vergleichen',
    'Reifen Händler vergleichen',
    'günstigste Reifen Angebote',
    'Reifen kaufen Deutschland',
    'reifexa',
    'reifenhier',
    'reifencheck',
  ].filter(Boolean)

  const cheap = toMoneyNumber(p.cheapest_offer)
  if (cheap != null) unique.push(`ab ${cheap.toFixed(2)} €`)

  return Array.from(
    new Set(unique.map(k => k.replace(/\s+/g, ' ').trim()).filter(Boolean))
  )
}

// --- Title / Description ---
export function buildProductTitle(p: Partial<Product> & { brand_name?: string; product_name?: string }): string {
  const size = extractSize(p)
  const season = normalizeSeason(p)
  const main = [p.brand_name, p.product_name].filter(Boolean).join(' ').trim()
  const includeSize = size && !main.toUpperCase().includes(size)
  const bits = [main, includeSize ? size : '', season].filter(Boolean)
  return `${bits.join(' ')} im Preisvergleich | Reifexa.de`.replace(/\s+/g, ' ').trim()
}

export function buildProductDescription(p: Partial<Product> & { brand_name?: string; product_name?: string }): string {
  const season = normalizeSeason(p);
  const size = extractSize(p);
  const parts: string[] = [];

  parts.push(`${p.brand_name} ${p.product_name}${size ? ' ' + size : ''}`);
  if (season) parts.push(season);
  parts.push('im Händler-Preisvergleich auf Reifexa.de.')

  const eu: string[] = [];
  if (p.wet_grip) eu.push(`Nasshaftung ${p.wet_grip}`);
  if (p.fuel_class) eu.push(`Rollwiderstand ${p.fuel_class}`);
  if (p.noise_class) eu.push(`Geräusch ${p.noise_class}`);
  if (eu.length) parts.push(eu.join(', ') + '.');

  const cheap = toMoneyNumber(p.cheapest_offer);
  const expensive = toMoneyNumber(p.expensive_offer);
  const search = toMoneyNumber(p.search_price);

  if (cheap != null && expensive != null) {
    parts.push(`Preise ${cheap.toFixed(2)}–${expensive.toFixed(2)} €.`);
  } else if (search != null) {
    parts.push(`ab ${search.toFixed(2)} €.`);
  }

  return parts.join(' ').trim();
}

// --- Metadata (Next.js) ---
export function buildProductMetadata(p: Product): Metadata {
  const title = buildProductTitle(p);
  const description = buildProductDescription(p);
  const keywords = buildProductKeywords(p);
  const image = safeSeoImageUrl(p.product_image);
  const url = productCanonicalUrl(p.slug);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: url },
    keywords,
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      url,
      siteName: 'Reifexa.de',
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${p.brand_name} ${p.product_name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

// --- JSON-LD ---
export function buildProductJsonLd(p: Product) {
  const size = extractSize(p);
  const availabilityMap: Record<string, string> = {
    instock: 'https://schema.org/InStock',
    outofstock: 'https://schema.org/OutOfStock',
  };
  const availability =
    availabilityMap[(p.in_stock || '').toLowerCase()] ||
    'https://schema.org/InStock';
  const pageUrl = productCanonicalUrl(p.slug);
  const seoImage = safeSeoImageUrl(p.product_image);
  const cheap = toMoneyNumber(p.cheapest_offer);
  const expensive = toMoneyNumber(p.expensive_offer);
  const search = toMoneyNumber(p.search_price);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${pageUrl}#product`,
    name: `${p.brand_name} ${p.product_name}`,
    image: [seoImage],
    description: buildProductDescription(p),
    sku: p.ean || undefined,
    brand: { '@type': 'Brand', name: p.brand_name },
    additionalProperty: [
      size
        ? { '@type': 'PropertyValue', name: 'Größe', value: size }
        : undefined,
      p.fuel_class
        ? {
            '@type': 'PropertyValue',
            name: 'EU-Label Rollwiderstand',
            value: p.fuel_class,
          }
        : undefined,
      p.wet_grip
        ? {
            '@type': 'PropertyValue',
            name: 'EU-Label Nasshaftung',
            value: p.wet_grip,
          }
        : undefined,
      p.noise_class
        ? {
            '@type': 'PropertyValue',
            name: 'EU-Label Geräuschklasse',
            value: p.noise_class,
          }
        : undefined,
      p.delivery_time
        ? {
            '@type': 'PropertyValue',
            name: 'Lieferzeit',
            value: p.delivery_time,
          }
        : undefined,
    ].filter(Boolean),
    aggregateRating:
      Number.isFinite(p.average_rating) &&
      Number.isFinite(p.rating_count) &&
      p.rating_count > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: p.average_rating,
            reviewCount: p.rating_count,
          }
        : undefined,
    offers: {
      '@type': 'AggregateOffer',
      url: pageUrl,
      priceCurrency: 'EUR',
      lowPrice:
        cheap != null
          ? Number(cheap.toFixed(2))
          : search != null
            ? Number(search.toFixed(2))
            : undefined,
      highPrice:
        expensive != null ? Number(expensive.toFixed(2)) : undefined,
      availability,
    },
  };
}
