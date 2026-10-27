import type { Metadata } from 'next';
import { safeSeoImageUrl, SITE_URL, productCanonicalUrl } from '@/libs/seo/site';
import { toMoneyNumber } from '@/libs/money';
import {
  brandUrl,
  euro,
  seasonForCategory,
  sizeFromText,
  sizeLabel,
  sizeUrl,
} from '@/libs/seo/landing';

export interface SeoOffer {
  vendor?: string;
  price?: number | string;
  in_stock?: boolean | string;
  delivery_cost?: string | number;
  delivery_time?: string;
}

export interface SeoProduct {
  slug: string;
  brand_name?: string;
  product_name?: string;
  product_image?: string | string[];
  merchant_product_third_category?: string;
  category_name?: string;
  search_price?: number | string;
  cheapest_offer?: number | string;
  expensive_offer?: number | string;
  average_rating?: number;
  review_count?: number;
  rating_count?: number;
  in_stock?: string | boolean;
  ean?: string;
  dimensions?: string;
  fuel_class?: string;
  wet_grip?: string;
  noise_class?: string;
  width?: string;
  height?: string;
  diameter?: string;
  lastIndex?: string;
  speedIndex?: string;
  description?: string;
  descriptions?: string;
  tyre_label_info?: { noise_level_db?: string | number | null } | null;
  offers?: SeoOffer[];
}

// ---------------------------------------------------------------- helpers

export function productSize(p: SeoProduct) {
  if (p.width && p.height && p.diameter) {
    return {
      width: String(p.width),
      height: String(p.height),
      diameter: String(p.diameter),
    };
  }
  return sizeFromText(p.dimensions) || sizeFromText(p.product_name);
}

/** "205/55 R16" */
export function extractSize(p: SeoProduct): string | undefined {
  const s = productSize(p);
  return s ? sizeLabel(s) : undefined;
}

export function normalizeSeason(p: SeoProduct): string | undefined {
  return seasonForCategory(p.merchant_product_third_category)?.label;
}

function pricedOffers(p: SeoProduct) {
  return (p.offers || [])
    .map(o => ({ ...o, price: toMoneyNumber(o.price) ?? 0 }))
    .filter(o => o.price > 0);
}

function priceRange(p: SeoProduct) {
  const offers = pricedOffers(p);
  const prices = offers.map(o => o.price as number);
  const low =
    (prices.length ? Math.min(...prices) : null) ??
    toMoneyNumber(p.cheapest_offer) ??
    toMoneyNumber(p.search_price) ??
    null;
  const high =
    (prices.length ? Math.max(...prices) : null) ??
    toMoneyNumber(p.expensive_offer) ??
    low;
  return { low, high, count: offers.length };
}

export function isInStock(v: unknown) {
  if (v === false) return false;
  const s = String(v ?? '').toLowerCase();
  return !(
    s === 'false' ||
    s === '0' ||
    s === 'outofstock' ||
    s === 'out of stock'
  );
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Name without brand and without the size (the title adds both itself). */
export function modelName(p: SeoProduct) {
  let name = String(p.product_name || '').trim();
  const brand = String(p.brand_name || '').trim();
  if (brand) name = name.replace(new RegExp(`^${escapeRegExp(brand)}\\s*`, 'i'), '');
  return name
    .replace(/\b\d{3}\s*\/\s*\d{2}\s*Z?R?F?\s*\d{2}\b/i, '')
    .replace(/\b\d{2,3}[A-Z]{1,2}\b\s*$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function loadSpeed(p: SeoProduct) {
  if (p.lastIndex && p.speedIndex) return `${p.lastIndex}${p.speedIndex}`;
  const m = String(p.product_name || '').match(
    /\bR\s?\d{2}\s+(\d{2,3}[A-Z]{1,2})\b/i
  );
  return m ? m[1].toUpperCase() : '';
}

/** Nothing worth indexing (no name or no price). */
export function isThinProduct(p: SeoProduct): boolean {
  return !(p.brand_name && p.product_name) || priceRange(p).low == null;
}

// ---------------------------------------------------------------- title & description

/**
 * "Continental PremiumContact 6 205/55 R16 91V ab 89,90 € | Reifexa"
 * Brand + model + size first (what people search), price for click-through.
 */
export function buildProductTitle(p: SeoProduct): string {
  const size = extractSize(p);
  const base = [p.brand_name, modelName(p), size, loadSpeed(p)]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  const { low } = priceRange(p);
  const price = low ? ` ab ${euro(low)} €` : ' Preisvergleich';
  const full = `${base}${price} | Reifexa`;
  return full.length <= 72 ? full : `${base}${price}`;
}

/** ≤ ~160 chars, German, numbers + call to action. */
export function buildProductDescription(p: SeoProduct): string {
  const size = extractSize(p);
  const season = normalizeSeason(p);
  const { low, high, count } = priceRange(p);
  const name = [p.brand_name, modelName(p), size].filter(Boolean).join(' ');

  let priceText = 'im Reifen-Preisvergleich.';
  if (count > 1 && low && high && high > low) {
    priceText = `${count} Shops im Vergleich: ${euro(low)} € bis ${euro(high)} €.`;
  } else if (low) {
    priceText = `ab ${euro(low)} € im Reifen-Preisvergleich.`;
  }

  const noise = p.tyre_label_info?.noise_level_db
    ? `${p.tyre_label_info.noise_level_db} dB`
    : p.noise_class
      ? `Geräusch ${p.noise_class}`
      : '';
  const label = [
    p.fuel_class && `Rollwiderstand ${p.fuel_class}`,
    p.wet_grip && `Nasshaftung ${p.wet_grip}`,
    noise,
  ].filter(Boolean);

  const parts = [
    `${name}${season ? ` (${season})` : ''}: ${priceText}`,
    label.length ? `EU-Label: ${label.join(', ')}.` : '',
    'Jetzt günstigsten Händler finden.',
  ].filter(Boolean);

  let text = parts.join(' ');
  if (text.length > 160) text = `${parts[0]} Jetzt vergleichen.`;
  return text.replace(/\s+/g, ' ').trim();
}

/** Google ignores meta keywords; keep a short, honest list for other engines. */
export function buildProductKeywords(p: SeoProduct): string[] {
  const size = extractSize(p);
  const season = normalizeSeason(p);
  const brand = (p.brand_name || '').trim();
  const model = modelName(p);
  return Array.from(
    new Set(
      [
        [brand, model].filter(Boolean).join(' '),
        [brand, model, size].filter(Boolean).join(' '),
        size && `${size} ${season || 'Reifen'}`,
        size && `${size} Preisvergleich`,
        brand && `${brand} Reifen`,
        brand && season && `${brand} ${season}`,
        p.ean && `EAN ${p.ean}`,
      ].filter(Boolean) as string[]
    )
  );
}

export function buildProductMetadata(p: SeoProduct): Metadata {
  const title = buildProductTitle(p);
  const description = buildProductDescription(p);
  const url = productCanonicalUrl(p.slug);
  const image = safeSeoImageUrl(
    Array.isArray(p.product_image) ? p.product_image[0] : p.product_image
  );
  const { low } = priceRange(p);
  const inStock = p.offers?.length
    ? p.offers.some(o => isInStock(o.in_stock))
    : isInStock(p.in_stock);
  const alt = `${p.brand_name || ''} ${p.product_name || ''}`.trim() || 'Reifen';

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description,
    keywords: buildProductKeywords(p),
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      url,
      siteName: 'Reifexa.de',
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
    // Products without a price are thin pages — keep them out of the index
    // (still followed so link equity flows to size/brand pages).
    robots: isThinProduct(p)
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
        },
    other: {
      'product:brand': p.brand_name || '',
      'product:availability': inStock ? 'in stock' : 'out of stock',
      ...(low
        ? { 'product:price:amount': low.toFixed(2), 'product:price:currency': 'EUR' }
        : {}),
    },
  };
}

// ---------------------------------------------------------------- JSON-LD

export function buildProductJsonLd(p: SeoProduct) {
  const url = productCanonicalUrl(p.slug);
  const size = extractSize(p);
  const season = normalizeSeason(p);
  const image = safeSeoImageUrl(
    Array.isArray(p.product_image) ? p.product_image[0] : p.product_image
  );
  const { low, high } = priceRange(p);
  const offers = pricedOffers(p);
  const gtin = String(p.ean || '').replace(/\D/g, '');
  const gtinKey =
    gtin.length === 13
      ? 'gtin13'
      : gtin.length === 12
        ? 'gtin12'
        : gtin.length === 14
          ? 'gtin14'
          : gtin.length === 8
            ? 'gtin8'
            : null;
  const anyInStock = offers.length
    ? offers.some(o => isInStock(o.in_stock))
    : isInStock(p.in_stock);
  const priceValidUntil = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
  const ls = loadSpeed(p);

  const additionalProperty = [
    size && { '@type': 'PropertyValue', name: 'Reifengröße', value: size },
    ls && { '@type': 'PropertyValue', name: 'Last-/Geschwindigkeitsindex', value: ls },
    season && { '@type': 'PropertyValue', name: 'Saison', value: season },
    p.fuel_class && {
      '@type': 'PropertyValue',
      name: 'EU-Reifenlabel Rollwiderstand',
      value: p.fuel_class,
    },
    p.wet_grip && {
      '@type': 'PropertyValue',
      name: 'EU-Reifenlabel Nasshaftung',
      value: p.wet_grip,
    },
    p.tyre_label_info?.noise_level_db && {
      '@type': 'PropertyValue',
      name: 'Rollgeräusch (dB)',
      value: Number(p.tyre_label_info.noise_level_db) || p.tyre_label_info.noise_level_db,
    },
  ].filter(Boolean);

  const reviewCount = Number(p.review_count || p.rating_count || 0);
  const rating = Number(p.average_rating || 0);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#produkt`,
    url,
    name: [p.brand_name, modelName(p), size, ls].filter(Boolean).join(' '),
    image: [image],
    description: buildProductDescription(p),
    sku: gtin || p.slug,
    ...(gtinKey ? { [gtinKey]: gtin } : {}),
    ...(p.brand_name ? { brand: { '@type': 'Brand', name: p.brand_name } } : {}),
    category: season ? `Reifen > ${season}` : 'Reifen',
    additionalProperty,
    ...(rating > 0 && reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(rating.toFixed(1)),
            reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(low
      ? {
          offers: {
            '@type': 'AggregateOffer',
            url,
            priceCurrency: 'EUR',
            lowPrice: Number(low.toFixed(2)),
            highPrice: Number((high ?? low).toFixed(2)),
            offerCount: Math.max(1, offers.length),
            availability: anyInStock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            ...(offers.length
              ? {
                  offers: offers.map(o => ({
                    '@type': 'Offer',
                    url, // our page, never the affiliate link
                    price: Number((o.price as number).toFixed(2)),
                    priceCurrency: 'EUR',
                    priceValidUntil,
                    itemCondition: 'https://schema.org/NewCondition',
                    availability: isInStock(o.in_stock)
                      ? 'https://schema.org/InStock'
                      : 'https://schema.org/OutOfStock',
                    seller: { '@type': 'Organization', name: o.vendor || 'Händler' },
                  })),
                }
              : {}),
          },
        }
      : {}),
  };
}

export type Crumb = { name: string; url: string };

/** Startseite › Sommerreifen › 205/55 R16 Reifen › Continental Reifen › Produkt */
export function buildProductBreadcrumbs(p: SeoProduct): Crumb[] {
  const size = productSize(p);
  const season = seasonForCategory(p.merchant_product_third_category);
  const crumbs: Crumb[] = [{ name: 'Startseite', url: `${SITE_URL}/` }];
  if (season) crumbs.push({ name: season.label, url: `${SITE_URL}/${season.slug}` });
  if (size) crumbs.push({ name: `${sizeLabel(size)} Reifen`, url: sizeUrl(size) });
  if (p.brand_name) crumbs.push({ name: `${p.brand_name} Reifen`, url: brandUrl(p.brand_name) });
  crumbs.push({
    name: [p.brand_name, modelName(p)].filter(Boolean).join(' ') || 'Produkt',
    url: productCanonicalUrl(p.slug),
  });
  return crumbs;
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}
