// app/products/[slug]/page.tsx
import Script from 'next/script';
import type { Metadata } from 'next';
import ProductDetailsPage from '@/page-components/products-details/ProductDetailsPage';

export interface Offer {
  brand: string;
  vendor_logo: string;
  vendor: string;
  brand_name: string;
  product_category: string;
  product_name: string;
  price: number;
  affiliate_product_cloak_url: string;
  aw_deep_link: string;
  savings_percent: string;
  delivery_cost: string | number;
  delivery_time: string;
  payment_icons: string[];
  original_affiliate_url: string;
}

export interface CheapestVendor {
  aw_deep_link: string;
  delivery_cost: string | number;
  payment_icons: string[];
  vendor: string;
  affiliate_product_cloak_url: string;
  vendor_id: string;
  vendor_logo: string;
}

export interface Product {
  _id: string;
  slug: string;
  product_name: string;
  brand_name: string;
  product_image: string;
  dimensions: string;
  search_price: number;
  fuel_class: string;
  wet_grip: string;
  noise_class: string;
  in_stock: string;
  delivery_time: string;
  review_count: number;
  average_rating: number;
  cheapest_offer: number;
  expensive_offer: number;
  savings_percent: string;
  related_cheaper: Product[];
  cheapest_vendor: CheapestVendor;
  ean: string;
  product_url: string;
  brand_logo?: string;
  merchant_product_third_category?: string;
  descriptions?: string;
  description?: string;
  width?: string;
  height?: string;
  diameter?: string;
  lastIndex?: string;
  speedIndex?: string;
  offers?: Offer[];
}

// ---- Data fetching (SSR) ----
async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(
    `https://api.reifencheck.de/products/${encodeURIComponent(slug)}`,
    { next: { revalidate: 1800 } }
  );
  if (!res.ok) return null;
  return (await res.json()) as Product;
}

// ---- Helpers ----
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
function buildDescription(p: Product) {
  const season = normalizeSeason(p);
  const size = extractSize(p);
  const bits: string[] = [];
  bits.push(
    `${p.brand_name} ${p.product_name}${size ? ' ' + size : ''} ${
      season || ''
    } im Test & Preisvergleich.`.trim()
  );
  const eu: string[] = [];
  if (p.wet_grip) eu.push(`Nasshaftung ${p.wet_grip}`);
  if (p.fuel_class) eu.push(`Rollwiderstand ${p.fuel_class}`);
  if (p.noise_class) eu.push(`Geräusch ${p.noise_class}`);
  if (eu.length) bits.push(eu.join(', ') + '.');
  if (Number.isFinite(p.cheapest_offer) && Number.isFinite(p.expensive_offer)) {
    bits.push(
      `Preise ${p.cheapest_offer.toFixed(2)}–${p.expensive_offer.toFixed(2)} €.`
    );
  } else if (Number.isFinite(p.search_price)) {
    bits.push(`ab ${p.search_price.toFixed(2)} €.`);
  }
  return bits.join(' ').trim();
}

// ---- Dynamic <head> metadata ----
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> } // ← Next 15 quirk: params is Promise
): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) {
    return {
      title: 'Produkt nicht gefunden | Reifencheck.de',
      description: 'Dieses Produkt ist nicht verfügbar.',
      robots: { index: false, follow: true },
    };
  }

  const size = extractSize(p);
  const titleBase = `${p.brand_name} ${p.product_name}`;
  const title = `${titleBase}${
    size && !titleBase.toUpperCase().includes(size) ? ' ' + size : ''
  } – Preisvergleich`;
  const description = buildDescription(p);

  return {
    metadataBase: new URL('https://reifencheck.de'),
    title,
    description,
    alternates: { canonical: `https://reifencheck.de/products/${p.slug}` },
    keywords: Array.from(
      new Set(
        [
          `${p.brand_name} ${p.product_name}`,
          size ? `${p.brand_name} ${p.product_name} ${size}` : undefined,
          normalizeSeason(p)
            ? `${p.brand_name} ${p.product_name} ${normalizeSeason(p)}`
            : undefined,
          size
            ? `${normalizeSeason(p) || 'Reifen'} ${size} Preisvergleich`
            : undefined,
          `${p.brand_name} Reifen günstig`,
          `${p.brand_name} ${p.product_name} Test`,
          `${p.brand_name} ${p.product_name} Erfahrungen`,
          `${p.brand_name} ${p.product_name} Bewertung`,
          `EU Reifenlabel ${p.brand_name} ${p.product_name}`,
          p.fuel_class ? `Rollwiderstand ${p.fuel_class}` : undefined,
          p.wet_grip ? `Nasshaftung ${p.wet_grip}` : undefined,
          p.noise_class ? `Reifengeräusch ${p.noise_class}` : undefined,
          'Reifen online kaufen',
          'Reifenpreisvergleich',
        ].filter(Boolean) as string[]
      )
    ),
    openGraph: {
      type: 'website', // keep within Next Metadata union
      locale: 'de_DE',
      url: `https://reifencheck.de/products/${p.slug}`,
      siteName: 'Reifencheck.de',
      title,
      description,
      images: [
        {
          url: p.product_image || '/images/product-detailspage.png',
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
      images: [p.product_image || '/images/product-detailspage.png'],
    },
    robots: { index: true, follow: true },
  };
}

// ---- Page (Server Component) ----
export default async function ProductPage(
  { params }: { params: Promise<{ slug: string }> } // ← Promise here too
) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return <div>Produkt nicht gefunden</div>;

  const size = extractSize(product);
  const availability =
    (product.in_stock || '').toLowerCase() === 'instock'
      ? 'https://schema.org/InStock'
      : (product.in_stock || '').toLowerCase() === 'outofstock'
      ? 'https://schema.org/OutOfStock'
      : 'https://schema.org/InStock';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://reifencheck.de/products/${product.slug}#product`,
    name: `${product.brand_name} ${product.product_name}`,
    image: [product.product_image].filter(Boolean),
    description: buildDescription(product),
    sku: product.ean || undefined,
    brand: { '@type': 'Brand', name: product.brand_name },
    additionalProperty: [
      size
        ? { '@type': 'PropertyValue', name: 'Größe', value: size }
        : undefined,
      product.fuel_class
        ? {
            '@type': 'PropertyValue',
            name: 'EU-Label Rollwiderstand',
            value: product.fuel_class,
          }
        : undefined,
      product.wet_grip
        ? {
            '@type': 'PropertyValue',
            name: 'EU-Label Nasshaftung',
            value: product.wet_grip,
          }
        : undefined,
      product.noise_class
        ? {
            '@type': 'PropertyValue',
            name: 'EU-Label Geräuschklasse',
            value: product.noise_class,
          }
        : undefined,
      product.delivery_time
        ? {
            '@type': 'PropertyValue',
            name: 'Lieferzeit',
            value: product.delivery_time,
          }
        : undefined,
    ].filter(Boolean),
    aggregateRating:
      Number.isFinite(product.average_rating) &&
      Number.isFinite(product.review_count) &&
      product.review_count > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.average_rating,
            reviewCount: product.review_count,
          }
        : undefined,
    offers: {
      '@type': 'AggregateOffer',
      url: `https://reifencheck.de/products/${product.slug}`,
      priceCurrency: 'EUR',
      lowPrice: Number.isFinite(product.cheapest_offer)
        ? Number(product.cheapest_offer.toFixed(2))
        : Number.isFinite(product.search_price)
        ? Number(product.search_price.toFixed(2))
        : undefined,
      highPrice: Number.isFinite(product.expensive_offer)
        ? Number(product.expensive_offer.toFixed(2))
        : undefined,
      availability,
    },
  };

  return (
    <>
      <ProductDetailsPage /* product={product} */ />
      <Script
        id="ld-product"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(jsonLd)}
      </Script>
    </>
  );
}
