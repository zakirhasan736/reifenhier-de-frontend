import type { Metadata } from 'next';
import Script from 'next/script';
import ProductDetailsPage from '@/page-components/products-details/ProductDetailsPage';

// ---- Config ----
const SITE_URL = 'https://www.reifencheck.de';
const API = (
  process.env.NEXT_PUBLIC_API_URL || 'https://api.reifencheck.de'
).replace(/\/$/, '');

// ---- Types we need for SEO only ----
interface SeoProduct {
  slug: string;
  brand_name?: string;
  product_name?: string;
  product_image?: string;
  descriptions?: string;
  description?: string;
  ean?: string;
  cheapest_offer?: number;
  search_price?: number;
  expensive_offer?: number;
  in_stock?: string; // "true" | "false" (as string)
}

interface ProductDetailsResponse {
  product?: SeoProduct;
  relatedProducts?: unknown[];
}

// ---- Fetch a single product for metadata/LD ----
async function fetchProductForSeo(slug: string): Promise<SeoProduct | null> {
  try {
    const res = await fetch(
      `${API}/api/products/product-details/${encodeURIComponent(slug)}`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return null;
    const json: ProductDetailsResponse = await res.json();
    return json.product ?? null;
  } catch {
    return null;
  }
}

// ---- Helpers ----
function fallbackTitle(p?: SeoProduct): string {
  const brand = p?.brand_name?.trim() ?? '';
  const name = p?.product_name?.trim() ?? '';
  const main = [brand, name].filter(Boolean).join(' ');

  return main
    ? `Reifencheck.de | Produkts - ${main} – Preisvergleich`
    : 'Reifencheck.de | Produkts – Preisvergleich';
}

function fallbackDescription(p?: SeoProduct): string {
  if (!p) return 'Produktdetails und Preisvergleich auf Reifencheck.de.';
  const brand = p.brand_name?.trim() ?? '';
  const name = p.product_name?.trim() ?? '';
  const base =
    p.descriptions ||
    p.description ||
    [brand, name].filter(Boolean).join(' ') ||
    'Produktdetails';
  return `Jetzt Preise für ${base} vergleichen.`.trim();
}

function buildKeywords(p?: SeoProduct): string[] {
  const brand = p?.brand_name?.trim();
  const name = p?.product_name?.trim();
  const base: string[] = [
    'reifen',
    'reifen preisvergleich',
    'günstige reifen',
    'reifen online kaufen',
  ];
  if (brand) base.push(`${brand} reifen`, brand);
  if (name) base.push(name);
  if (brand && name)
    base.push(`${brand} ${name}`, `${brand} ${name} preisvergleich`);
  if (typeof p?.cheapest_offer === 'number')
    base.push(`ab ${p.cheapest_offer.toFixed(2)} €`);
  return Array.from(new Set(base));
}

function buildJsonLd(p: SeoProduct | null) {
  if (!p) return null;
  const availability =
    (p.in_stock || '').toLowerCase() === 'true'
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/products/${p.slug}#product`,
    name: `Reifencheck.de - ${(p.brand_name ?? '').trim()} ${(
      p.product_name ?? ''
    ).trim()}`.trim(),
    image: p.product_image ? [p.product_image] : undefined,
    description: p.descriptions || p.description || undefined,
    sku: p.ean || undefined,
    brand: p.brand_name ? { '@type': 'Brand', name: p.brand_name } : undefined,
    offers: {
      '@type': 'AggregateOffer',
      url: `${SITE_URL}/products/${p.slug}`,
      priceCurrency: 'EUR',
      lowPrice:
        typeof p.cheapest_offer === 'number'
          ? p.cheapest_offer
          : typeof p.search_price === 'number'
          ? p.search_price
          : undefined,
      highPrice:
        typeof p.expensive_offer === 'number' ? p.expensive_offer : undefined,
      availability,
    },
  };
}

// ---- Metadata (SSR) ----
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await fetchProductForSeo(slug);

  // If API failed, still ship a stable canonical and noindex to avoid soft-404s
  if (!p) {
    return {
      metadataBase: new URL(SITE_URL),
      title: 'Produkt | Reifencheck.de',
      description: 'Produktdetails und Preisvergleich auf Reifencheck.de.',
      alternates: { canonical: `${SITE_URL}/products/${slug}` },
      robots: { index: false, follow: true },
      keywords: [
        'reifen',
        'reifen preisvergleich',
        'reifen online kaufen',
        'reifen test',
        'Reifen Preis berechnen',
      ],
    };
  }

  const title = fallbackTitle(p);
  const description = fallbackDescription(p);
  const canonical = `${SITE_URL}/products/${p.slug}`;
  const keywords = buildKeywords(p);
  const ogImage = p.product_image || '/images/product-detailspage.png';
  const ogAlt =
    `${(p.brand_name ?? '').trim()} ${(p.product_name ?? '').trim()}`.trim() ||
    'Produkt';

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      url: canonical,
      siteName: 'Reifencheck.de',
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

// ---- Page (SSR wrapper) — pass slug only; let client fetch & render ----
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; 
  const p = await fetchProductForSeo(slug);
  const jsonLd = buildJsonLd(p);

  return (
    <>
      <ProductDetailsPage slug={slug} />
      {jsonLd && (
        <Script
          id="ld-product"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(jsonLd)}
        </Script>
      )}
    </>
  );
}
