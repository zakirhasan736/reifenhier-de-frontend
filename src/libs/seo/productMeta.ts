import type { Metadata } from 'next';

export interface Product {
  _id: string;
  slug: string;
  brand_logo: string;
  product_image: string;
  merchant_product_third_category: string; // Sommerreifen | Winterreifen | Ganzjahresreifen
  search_price: number;
  main_price?: number;
  average_rating: number;
  rating_count: number;
  cheapest_offer: number;
  expensive_offer: number;
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
}

export type FullProduct = Product;

// --- small utilities ---
function extractSize(p: Product): string | undefined {
  const source = `${p.product_name} ${p.dimensions || ''}`;
  const m = source.match(/\b\d{3}\/\d{2}\s?R?\s?\d{2}\b/i);
  return m ? m[0].replace(/\s+/g, ' ').toUpperCase() : undefined;
}

function normalizeSeason(p: Product): string | undefined {
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
    Number.isFinite(p.search_price) ||
    Number.isFinite(p.cheapest_offer);

  return !hasName || !hasMediaOrOffers;
}

// --- Keyword builder ---
export function buildProductKeywords(p: Product): string[] {
  const season = normalizeSeason(p);
  const size = extractSize(p);
  const brand = (p.brand_name || '').trim();
  const modelGuess = brand
    ? p.product_name.replace(new RegExp(`^${brand}\\s*`, 'i'), '').trim()
    : p.product_name;

  const base = [
    `${brand} ${modelGuess}`.trim(),
    size ? `${brand} ${modelGuess} ${size}`.trim() : undefined,
    season ? `${brand} ${modelGuess} ${season}` : undefined,
    size ? `${season || 'Reifen'} ${size} Preisvergleich` : undefined,
    `${brand} Reifen günstig`,
    `${brand} ${modelGuess} Test`,
    `${brand} ${modelGuess} Erfahrungen`,
    `${brand} ${modelGuess} Bewertung`,
    `EU Reifenlabel ${brand} ${modelGuess}`,
    p.fuel_class ? `Rollwiderstand ${p.fuel_class}` : undefined,
    p.wet_grip ? `Nasshaftung ${p.wet_grip}` : undefined,
    p.noise_class ? `Reifengeräusch ${p.noise_class}` : undefined,
    'Reifen online kaufen',
    'Reifenpreisvergleich',
  ].filter(Boolean) as string[];

  if (Number.isFinite(p.cheapest_offer)) {
    base.push(`ab ${p.cheapest_offer.toFixed(2)} €`);
  }
  if (size) base.push(`${size} günstig kaufen`);

  return Array.from(new Set(base));
}

// --- Title / Description ---
export function buildProductTitle(p: Product): string {
  const size = extractSize(p);
  const main = [p.brand_name, p.product_name].filter(Boolean).join(' ').trim();
  const suffix = '– Preisvergleich';
  const includeSize = size && !main.toUpperCase().includes(size);
  return `${main}${includeSize ? ` ${size}` : ''} ${suffix}`.trim();
}

export function buildProductDescription(p: Product): string {
  const season = normalizeSeason(p);
  const size = extractSize(p);
  const parts: string[] = [];

  parts.push(`${p.brand_name} ${p.product_name}${size ? ' ' + size : ''}`);
  if (season) parts.push(season);
  parts.push('im Test & Preisvergleich.');

  const eu: string[] = [];
  if (p.wet_grip) eu.push(`Nasshaftung ${p.wet_grip}`);
  if (p.fuel_class) eu.push(`Rollwiderstand ${p.fuel_class}`);
  if (p.noise_class) eu.push(`Geräusch ${p.noise_class}`);
  if (eu.length) parts.push(eu.join(', ') + '.');

  if (Number.isFinite(p.cheapest_offer) && Number.isFinite(p.expensive_offer)) {
    parts.push(
      `Preise ${p.cheapest_offer.toFixed(2)}–${p.expensive_offer.toFixed(2)} €.`
    );
  } else if (Number.isFinite(p.search_price)) {
    parts.push(`ab ${p.search_price.toFixed(2)} €.`);
  }

  return parts.join(' ').trim();
}

// --- Metadata (Next.js) ---
export function buildProductMetadata(p: Product): Metadata {
  const title = buildProductTitle(p);
  const description = buildProductDescription(p);
  const keywords = buildProductKeywords(p);
  const image = p.product_image || '/images/product-detailspage.png';
  const url = `https://reifencheck.de/produkte/${p.slug}`;

  return {
    metadataBase: new URL('https://reifencheck.de'),
    title,
    description,
    alternates: { canonical: url },
    keywords,
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      url,
      siteName: 'Reifencheck.de',
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

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://reifencheck.de/produkte/${p.slug}#product`,
    name: `${p.brand_name} ${p.product_name}`,
    image: [p.product_image].filter(Boolean),
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
      url: `https://reifencheck.de/produkte/${p.slug}`,
      priceCurrency: 'EUR',
      lowPrice: Number.isFinite(p.cheapest_offer)
        ? Number(p.cheapest_offer.toFixed(2))
        : Number.isFinite(p.search_price)
        ? Number(p.search_price.toFixed(2))
        : undefined,
      highPrice: Number.isFinite(p.expensive_offer)
        ? Number(p.expensive_offer.toFixed(2))
        : undefined,
      availability,
    },
  };
}
