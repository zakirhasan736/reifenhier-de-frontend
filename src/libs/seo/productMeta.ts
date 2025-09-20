// lib/seo/productMeta.ts
import type { Metadata } from 'next';

export interface Product {
  _id: string;
  slug: string;
  brand_logo: string;
  product_image: string;
  merchant_product_third_category: string; // e.g., "Sommerreifen" | "Winterreifen" | "Ganzjahresreifen"
  search_price: number;
  main_price: number;
  average_rating: number; // 0..5
  rating_count: number;
  cheapest_offer: number; // min price across partners
  expensive_offer: number; // max price across partners
  savings_percent: string; // "12%"
  savings_amount: number; // 12.34
  related_cheaper: [];
  brand_name: string; // e.g. "MICHELIN"
  product_name: string; // e.g. "Primacy 4 205/55 R16 91V"
  in_stock: string; // "InStock" | "OutOfStock" | etc.
  delivery_time: string; // e.g. "2-4 Werktage"
  ean: string;
  product_url: string; // external merchant URL (affiliate)
  dimensions: string; // optional, can duplicate size
  fuel_class: string; // EU label rolling resistance (A–E)
  wet_grip: string; // EU label wet grip (A–E)
  noise_class: string; // EU label noise (A–C or dB class)
}

function extractSize(p: Product): string | undefined {
  // Try to pull a "205/55 R16" pattern from product_name or dimensions
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

export function buildProductKeywords(p: Product): string[] {
  const season = normalizeSeason(p);
  const size = extractSize(p);
  const brand = p.brand_name?.trim();
  // Pull the "model" part by removing brand from product_name where possible
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

  // Add a few long-tails if we have data
  if (typeof p.cheapest_offer === 'number') {
    base.push(`ab ${p.cheapest_offer.toFixed(2)} €`);
  }
  if (size) base.push(`${size} günstig kaufen`);

  // De-duplicate
  return Array.from(new Set(base));
}

export function buildProductTitle(p: Product): string {
  const size = extractSize(p);
  // Short, punchy, ≤60 chars-ish
  // Example: "MICHELIN Primacy 4 205/55 R16 – Preisvergleich"
  const main = [p.brand_name, p.product_name].filter(Boolean).join(' ');
  const suffix = '– Preisvergleich';
  const title =
    size && !main.toUpperCase().includes(size)
      ? `${main} ${size} ${suffix}`
      : `${main} ${suffix}`;
  return title.trim();
}

export function buildProductDescription(p: Product): string {
  // Aim for ≤160 chars; highlight season, EU-label, and price range if present
  const season = normalizeSeason(p);
  const size = extractSize(p);
  const parts: string[] = [];

  parts.push(`${p.brand_name} ${p.product_name}${size ? ' ' + size : ''}`);
  if (season) parts.push(`${season}`);
  parts.push('im Test & Preisvergleich.');

  const euBits = [];
  if (p.wet_grip) euBits.push(`Nasshaftung ${p.wet_grip}`);
  if (p.fuel_class) euBits.push(`Rollwiderstand ${p.fuel_class}`);
  if (p.noise_class) euBits.push(`Geräusch ${p.noise_class}`);
  if (euBits.length) parts.push(euBits.join(', ') + '.');

  if (
    typeof p.cheapest_offer === 'number' &&
    typeof p.expensive_offer === 'number'
  ) {
    parts.push(
      `Preise ${p.cheapest_offer.toFixed(2)}–${p.expensive_offer.toFixed(2)} €.`
    );
  } else if (typeof p.search_price === 'number') {
    parts.push(`ab ${p.search_price.toFixed(2)} €.`);
  }

  return parts.join(' ').trim();
}

export function buildProductMetadata(p: Product): Metadata {
  const title = buildProductTitle(p);
  const description = buildProductDescription(p);
  const keywords = buildProductKeywords(p);
  const image = p.product_image || '/images/product-detailspage.png';

  return {
    metadataBase: new URL('https://reifencheck.de'),
    title,
    description,
    alternates: { canonical: `https://reifencheck.de/p/${p.slug}` },
    keywords,
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      url: `https://reifencheck.de/p/${p.slug}`,
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

// JSON-LD builder
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
    '@id': `https://reifencheck.de/p/${p.slug}#product`,
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
      typeof p.average_rating === 'number' &&
      typeof p.rating_count === 'number' &&
      p.rating_count > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: p.average_rating,
            reviewCount: p.rating_count,
          }
        : undefined,
    offers: {
      '@type': 'AggregateOffer',
      url: `https://reifencheck.de/p/${p.slug}`,
      priceCurrency: 'EUR',
      lowPrice:
        typeof p.cheapest_offer === 'number'
          ? Number(p.cheapest_offer.toFixed(2))
          : typeof p.search_price === 'number'
          ? Number(p.search_price.toFixed(2))
          : undefined,
      highPrice:
        typeof p.expensive_offer === 'number'
          ? Number(p.expensive_offer.toFixed(2))
          : undefined,
      offerCount: undefined, // set if you know partner count
      availability,
    },
  };
}
