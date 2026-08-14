import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import ProductSinglepage from '@/components/productpage/ProductDetailsSec';
import HowItWorks from '@/components/homepage/HowItWorks';
import RelatedProducts from '@/components/productpage/RelatedProducts';
import CompareFloatingButton from '@/components/productpage/CompareFloatingButton';
import CompareModal from '@/components/productpage/CompareModal';
import {
  productCanonicalUrl,
  safeSeoImageUrl,
  SITE_URL,
} from '@/libs/seo/site';

// ---- Config ----
const API = (
  process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de'
).replace(/\/$/, '');

// ---- Types we need for SEO only ----
interface SeoProduct {
  slug: string;
  brand_name?: string;
  product_name?: string;
  dimensions?: string;
  category_name?: string;
  average_rating?: number;
  review_count?: number;
  merchant_product_third_category?: string;
  product_image?: string;
  descriptions?: string;
  description?: string;
  ean?: string;
  cheapest_offer?: number;
  search_price?: number;
  expensive_offer?: number;
  in_stock?: string;
  offers?: Offer[];
}
interface Offer {
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

interface CheapestVendor {
  aw_deep_link: string;
  delivery_cost: string | number;
  payment_icons: string[];
  vendor: string;
  affiliate_product_cloak_url: string;
  vendor_id: string;
  vendor_logo: string;
  original_affiliate_url: string;
}

interface Product {
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

interface RelatedProduct {
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
  average_rating: number;
  rating_count: number;
  cheapest_offer: number;
  expensive_offer: number;
  ean: string;
  product_url: string;
  brand_logo: string;
  merchant_product_third_category: string;
  descriptions?: string;
  description?: string;
  width?: string;
  height?: string;
  diameter?: string;
  lastIndex?: string;
  speedIndex?: string;
  savings_percent: string;
  savings_amount: number;
  related_cheaper: [];
  showCompareButton?: boolean;
}
interface ProductDetailsResponse {
  product?: Product;
  relatedProducts?: RelatedProduct[];
  indexVariants?: Array<{
    slug: string;
    lastIndex?: string;
    speedIndex?: string;
    label?: string;
    cheapest_offer?: string | number;
    product_name?: string;
  }>;
}

// ---- Fetch a single product for metadata/LD ----
async function fetchProductData(slug: string): Promise<ProductDetailsResponse> {
  try {
    const res = await fetch(
      `${API}/api/products/product-details/${encodeURIComponent(slug)}`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return { product: undefined, relatedProducts: [], indexVariants: [] };
    return res.json();
  } catch {
    return { product: undefined, relatedProducts: [], indexVariants: [] };
  }
}
// ---- Helpers ----
function fallbackTitle(p?: SeoProduct): string {
  if (!p) return 'Reifexa.de | Reifen günstig online vergleichen';

  const brand = p.brand_name?.trim() ?? '';
  const dimension = p.dimensions?.trim() ?? '';
  const category =
    p.merchant_product_third_category?.trim() || p.category_name?.trim() || '';

  // Create base title
  const baseTitle = [brand, dimension, category]
    .filter(Boolean)
    .join(' ')
    .trim();

  // 🔸 Add fallback uniqueness via EAN or _id if major fields are missing
  const ean = p.ean?.trim();
  const fallbackId = ean || p.slug  || '';

  // 🔹 If data is complete
  if (baseTitle) {
    return `${baseTitle} | Reifexa.de`;
  }

  // 🔹 If data missing (avoid duplicate)
  return `Reifenprodukt ${fallbackId} | Reifexa.de`;
}

function fallbackDescription(p?: SeoProduct): string {
  if (!p)
    return 'Finden und vergleichen Sie günstige Reifen auf Reifexa.de.';

  const brand = p.brand_name?.trim() ?? '';
  const dimension = p.dimensions?.trim() ?? '';
  const category =
    p.merchant_product_third_category?.trim() || p.category_name?.trim() || '';
  const ean = p.ean?.trim();
  const fallbackId = ean || p.slug  || '';

  const basePhrase = [brand, dimension, category]
    .filter(Boolean)
    .join(' ')
    .trim();

  // 🔹 If we have full product data
  if (basePhrase) {
    return `Jetzt ${basePhrase} Reifenpreise vergleichen${
      ean ? ` (EAN: ${ean})` : ''
    } – Top ${
      brand || 'Reifen'
    } ${category} in Größe ${dimension} günstig online bei Reifexa.de kaufen.`;
  }

  // 🔹 If data missing — include fallback unique identifier
  return `Preisvergleich und Details für Reifenprodukt ${fallbackId} auf Reifexa.de – jetzt Angebote prüfen und sparen.`;
}



function buildKeywords(p?: SeoProduct): string[] {
  if (!p) {
    return [
      'reifexa',
      'reifexa.de',
      'reifen',
      'reifen preisvergleich',
      'günstige reifen',
      'reifen online kaufen',
      'reifen test',
      'reifen günstig',
      'reifen marken',
      'reifen shop',
      'reifen modelle',
      'reifen hersteller',
      'Preisvergleich reifen',
      'Reifen Preis berechnen',
      'Reifen Angebote',
      'Reifen kaufen',
      'reifentiefpreis',
      'Reifen check',
      'Reifen check 24',
      'Reifen 24 check',
    ];
  }

  const brand = p.brand_name?.trim();
  const dimension = p.dimensions?.trim();
  const category =
    p.merchant_product_third_category?.trim() || p.category_name?.trim() || '';
  const ean = p.ean?.trim();
  const slug = p.slug?.trim();
  const fallbackId = ean || slug || '';

  const base: string[] = [
    'reifen',
    'reifen preisvergleich',
    'reifen online kaufen',
    'reifen angebote',
    'günstige reifen',
    'reifexa',
    'reifexa.de',
    'reifen test',
    'reifen marken',
    'reifen modelle',
    'reifen kaufen',
    'reifentiefpreis',
    'Reifen check',
    'Reifen check 24',
    'Reifen 24 check',
  ];

  if (brand) {
    base.push(brand, `${brand} reifen`, `${brand} test`, `${brand} angebote`);
  }

  if (dimension) {
    base.push(
      dimension,
      `${dimension} reifen`,
      `${dimension} ${brand || ''}`.trim(),
      `${dimension} ${category || ''}`.trim()
    );
  }

  if (category) {
    base.push(
      category,
      `${category} reifen`,
      `${brand || ''} ${category}`.trim(),
      `${category} günstig`,
      `${category} online kaufen`
    );
  }

  // Include combinations for long-tail keywords
  if (brand && dimension && category) {
    base.push(
      `${brand} ${dimension} ${category}`,
      `${brand} ${category} ${dimension} reifen`,
      `${brand} ${dimension} reifen online kaufen`
    );
  }

  //  Fallback uniqueness to prevent duplicate meta tags
  if (!brand && !dimension && !category && fallbackId) {
    base.push(`reifen ${fallbackId}`, `produkt ${fallbackId} reifen`);
  }

  //  Deduplicate keywords and clean up
  return Array.from(
    new Set(base.map(k => k.toLowerCase().replace(/\s+/g, ' ').trim()))
  );
}


// ---- JSON-LD Builder ----
// Affiliate / vendor clickout URLs and unstable vendor CDN images must NEVER
// appear in schema — they cause Google/Bing indexing & image crawl errors.
function buildJsonLd(p: SeoProduct | null) {
  if (!p) return null;

  const availability =
    (p.in_stock || '').toLowerCase() === 'true'
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';

  const brand = p.brand_name?.trim() ?? '';
  const dimension = p.dimensions?.trim() ?? '';
  const category = p.merchant_product_third_category?.trim() ?? '';
  const name = [brand, dimension, category, p.product_name?.trim()]
    .filter(Boolean)
    .join(' ')
    .trim();
  const lowPrice = p.cheapest_offer;
  const highPrice = p.expensive_offer;
  const pageUrl = productCanonicalUrl(p.slug);
  const seoImage = safeSeoImageUrl(p.product_image);

  // Nested offers: prices + sellers only. URL always points to OUR product page
  // (never affiliate_product_cloak_url / aw_deep_link / original_affiliate_url).
  const individualOffers =
    p.offers && p.offers.length > 0
      ? p.offers.map(o => ({
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: o.price,
          url: pageUrl,
          availability,
          seller: { '@type': 'Organization', name: o.vendor },
        }))
      : undefined;

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${pageUrl}#produkt`,
    name: name || p.product_name || 'Reifen Produkt',
    image: [seoImage],
    description:
      p.descriptions ||
      p.description ||
      `Jetzt ${brand} ${dimension} ${category} Reifen vergleichen – Top Angebote bei Reifexa.de.`,
    sku: p.ean || undefined,
    brand: brand ? { '@type': 'Brand', name: brand } : undefined,
    category: category || undefined,
    url: pageUrl,
    offers: {
      '@type': 'AggregateOffer',
      url: pageUrl,
      priceCurrency: 'EUR',
      lowPrice: lowPrice ?? 0,
      highPrice: highPrice ?? lowPrice ?? 0,
      offerCount: p.offers?.length || 1,
      availability,
      ...(individualOffers ? { offers: individualOffers } : {}),
    },
  };

  if (
    typeof p.average_rating === 'number' &&
    p.review_count &&
    p.review_count > 0
  ) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(p.average_rating.toFixed(1)),
      reviewCount: p.review_count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return jsonLd;
}

//  Breadcrumb Schema Builder
function buildBreadcrumbJsonLd(p: SeoProduct) {
  const category =
    p.merchant_product_third_category?.trim() || p.category_name?.trim() || '';
  const pageUrl = productCanonicalUrl(p.slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Startseite',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Produkte',
        item: `${SITE_URL}/produkte`,
      },
      ...(category
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: category,
              item: `${SITE_URL}/produkte?kategorie=${encodeURIComponent(
                category
              )}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: category ? 4 : 3,
        name:
          [p.brand_name, p.dimensions, p.product_name]
            .filter(Boolean)
            .join(' ') || 'Produkt',
        item: pageUrl,
      },
    ],
  };
}

// ---- Metadata (SSR) ----
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await fetchProductData(slug);

  // If API failed, still ship a stable canonical and noindex to avoid soft-404s
  if (!product) {
    // Convert slug → readable string (remove dashes/underscores)
    let readableSlug = slug.replace(/[-_]+/g, ' ').trim();

    // Capitalize the first letter of each word
    readableSlug = readableSlug.replace(/\b\w/g, l => l.toUpperCase());

    //  Extract product ID at the end of the slug (if numeric)
    const productIdMatch = slug.match(/(\d{5,})$/); // match trailing numbers
    const productId = productIdMatch ? productIdMatch[1] : null;

    //  Create unique fallback title
    const shortTitle = `${readableSlug}${
      productId ? ` (ID: ${productId})` : ''
    }`;
    const shortDesc = `Preisvergleich und Details für ${readableSlug}${
      productId ? ` (ID: ${productId})` : ''
    } auf Reifexa.de.`;
    return {
      metadataBase: new URL(SITE_URL),
      title: `${shortTitle} | Produkt – Reifexa.de`,
      description: shortDesc,
      alternates: { canonical: `${SITE_URL}/produkte/${slug}` },
      robots: { index: false, follow: true },
      keywords: [
        'reifen',
        'reifen preisvergleich',
        'reifen online kaufen',
        'reifen test',
        'Reifen Preis berechnen',
        'reifentiefpreis',
        'reifexa',
        'reifexa.de',
        'Reifen check',
        'Reifen check 24',
        'Reifen 24 check',
      ],
    };
  }

  const title = fallbackTitle(product);
  const description = fallbackDescription(product);
  const canonical = productCanonicalUrl(product.slug);
  const keywords = buildKeywords(product);
  // Never put vendor CDN / redirecting image URLs into OG/Twitter (indexing errors)
  const ogImage = safeSeoImageUrl(product.product_image);
  const ogAlt =
    `${(product.brand_name ?? '').trim()} ${(
      product.product_name ?? ''
    ).trim()}`.trim() || 'Produkt';

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
      siteName: 'Reifexa.de',
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
    other: {
      'product:brand': product.brand_name || '',
      'product:availability':
        (product.in_stock || '').toLowerCase() === 'true'
          ? 'in stock'
          : 'out of stock',
    },
  };
}

// ---- Page (SSR wrapper) — pass slug only; let client fetch & render ----
// ---------- PAGE ----------
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { product, relatedProducts, indexVariants } = await fetchProductData(slug);
  if (!product) {
    notFound();
  }

  const jsonLd = buildJsonLd(product);
  const breadcrumbLd = buildBreadcrumbJsonLd(product);
  const pageUrl = productCanonicalUrl(product.slug);

  return (
    <>
      <div className="product-details-cont-wrapper">
        <ProductSinglepage
          product={product}
          loading={false}
          indexVariants={indexVariants ?? []}
        />
        <HowItWorks />
        <RelatedProducts
          relatedProductData={relatedProducts ?? []}
          loading={false}
        />
        <CompareFloatingButton />
        <CompareModal relatedProducts={relatedProducts ?? []} />
      </div>
      {/* WebPage Schema */}
      <Script
        id="ld-webpage"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: fallbackTitle(product),
          description: fallbackDescription(product),
          inLanguage: 'de-DE',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@id': `${pageUrl}#produkt` },
          publisher: {
            '@type': 'Organization',
            name: 'Reifexa.de',
            logo: {
              '@type': 'ImageObject',
              url: `${SITE_URL}/images/logo.png`,
            },
          },
        })}
      </Script>

      {/* Product Schema */}
      {jsonLd && (
        <Script
          id="ld-product"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(jsonLd)}
        </Script>
      )}

      {/* Breadcrumb Schema */}
      {breadcrumbLd && (
        <Script
          id="ld-breadcrumb"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(breadcrumbLd)}
        </Script>
      )}
    </>
  );
}