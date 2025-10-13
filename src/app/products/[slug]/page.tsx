// import type { Metadata } from 'next';
// import Script from 'next/script';
// import ProductDetailsPage from '@/page-components/products-details/ProductDetailsPage';

// // ---- Config ----
// const SITE_URL = 'https://www.reifencheck.de';
// const API = (
//   process.env.NEXT_PUBLIC_API_URL || 'https://api.reifencheck.de'
// ).replace(/\/$/, '');

// // ---- Types we need for SEO only ----
// interface SeoProduct {
//   slug: string;
//   brand_name?: string;
//   product_name?: string;
//   product_image?: string;
//   descriptions?: string;
//   description?: string;
//   ean?: string;
//   cheapest_offer?: number;
//   search_price?: number;
//   expensive_offer?: number;
//   in_stock?: string; // "true" | "false" (as string)
// }

// interface ProductDetailsResponse {
//   product?: SeoProduct;
//   relatedProducts?: unknown[];
// }

// // ---- Fetch a single product for metadata/LD ----
// async function fetchProductForSeo(slug: string): Promise<SeoProduct | null> {
//   try {
//     const res = await fetch(
//       `${API}/api/products/product-details/${encodeURIComponent(slug)}`,
//       { next: { revalidate: 1800 } }
//     );
//     if (!res.ok) return null;
//     const json: ProductDetailsResponse = await res.json();
//     return json.product ?? null;
//   } catch {
//     return null;
//   }
// }

// // ---- Helpers ----
// function fallbackTitle(p?: SeoProduct): string {
//   const brand = p?.brand_name?.trim() ?? '';
//   const name = p?.product_name?.trim() ?? '';
//   const main = [brand, name].filter(Boolean).join(' ');

//   return main
//     ? `Reifencheck.de | Produkts - ${main} – Preisvergleich`
//     : 'Reifencheck.de | Produkts – Preisvergleich';
// }

// function fallbackDescription(p?: SeoProduct): string {
//   if (!p) return 'Produktdetails und Preisvergleich auf Reifencheck.de.';
//   const brand = p.brand_name?.trim() ?? '';
//   const name = p.product_name?.trim() ?? '';
//   const base =
//     p.descriptions ||
//     p.description ||
//     [brand, name].filter(Boolean).join(' ') ||
//     'Produktdetails';
//   return `Jetzt Preise für ${base} vergleichen.`.trim();
// }

// function buildKeywords(p?: SeoProduct): string[] {
//   const brand = p?.brand_name?.trim();
//   const name = p?.product_name?.trim();
//   const base: string[] = [
//     'reifen',
//     'reifen preisvergleich',
//     'günstige reifen',
//     'reifen online kaufen',
//   ];
//   if (brand) base.push(`${brand} reifen`, brand);
//   if (name) base.push(name);
//   if (brand && name)
//     base.push(`${brand} ${name}`, `${brand} ${name} preisvergleich`);
//   if (typeof p?.cheapest_offer === 'number')
//     base.push(`ab ${p.cheapest_offer.toFixed(2)} €`);
//   return Array.from(new Set(base));
// }

// function buildJsonLd(p: SeoProduct | null) {
//   if (!p) return null;
//   const availability =
//     (p.in_stock || '').toLowerCase() === 'true'
//       ? 'https://schema.org/InStock'
//       : 'https://schema.org/OutOfStock';

//   return {
//     '@context': 'https://schema.org',
//     '@type': 'Product',
//     '@id': `${SITE_URL}/products/${p.slug}#product`,
//     name: `Reifencheck.de - ${(p.brand_name ?? '').trim()} ${(
//       p.product_name ?? ''
//     ).trim()}`.trim(),
//     image: p.product_image ? [p.product_image] : undefined,
//     description: p.descriptions || p.description || undefined,
//     sku: p.ean || undefined,
//     brand: p.brand_name ? { '@type': 'Brand', name: p.brand_name } : undefined,
//     offers: {
//       '@type': 'AggregateOffer',
//       url: `${SITE_URL}/products/${p.slug}`,
//       priceCurrency: 'EUR',
//       lowPrice:
//         typeof p.cheapest_offer === 'number'
//           ? p.cheapest_offer
//           : typeof p.search_price === 'number'
//           ? p.search_price
//           : undefined,
//       highPrice:
//         typeof p.expensive_offer === 'number' ? p.expensive_offer : undefined,
//       availability,
//     },
//   };
// }

// // ---- Metadata (SSR) ----
// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }): Promise<Metadata> {
//   const { slug } = await params;
//   const p = await fetchProductForSeo(slug);

//   // If API failed, still ship a stable canonical and noindex to avoid soft-404s
//   if (!p) {
//     return {
//       metadataBase: new URL(SITE_URL),
//       title: 'Produkt | Reifencheck.de',
//       description: 'Produktdetails und Preisvergleich auf Reifencheck.de.',
//       alternates: { canonical: `${SITE_URL}/products/${slug}` },
//       robots: { index: false, follow: true },
//       keywords: [
//         'reifen',
//         'reifen preisvergleich',
//         'reifen online kaufen',
//         'reifen test',
//         'Reifen Preis berechnen',
//       ],
//     };
//   }

//   const title = fallbackTitle(p);
//   const description = fallbackDescription(p);
//   const canonical = `${SITE_URL}/products/${p.slug}`;
//   const keywords = buildKeywords(p);
//   const ogImage = p.product_image || '/images/product-detailspage.png';
//   const ogAlt =
//     `${(p.brand_name ?? '').trim()} ${(p.product_name ?? '').trim()}`.trim() ||
//     'Produkt';

//   return {
//     metadataBase: new URL(SITE_URL),
//     title,
//     description,
//     keywords,
//     alternates: { canonical },
//     openGraph: {
//       type: 'website',
//       locale: 'de_DE',
//       url: canonical,
//       siteName: 'Reifencheck.de',
//       title,
//       description,
//       images: [{ url: ogImage, width: 1200, height: 630, alt: ogAlt }],
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title,
//       description,
//       images: [ogImage],
//     },
//     robots: { index: true, follow: true },
//   };
// }

// // ---- Page (SSR wrapper) — pass slug only; let client fetch & render ----
// export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = await params; 
//   const p = await fetchProductForSeo(slug);
//   const jsonLd = buildJsonLd(p);

//   return (
//     <>
//       <ProductDetailsPage slug={slug} />
//       {jsonLd && (
//         <Script
//           id="ld-product"
//           type="application/ld+json"
//           strategy="afterInteractive"
//         >
//           {JSON.stringify(jsonLd)}
//         </Script>
//       )}
//     </>
//   );
// }
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
// import ProductDetailsPage from '@/page-components/products-details/ProductDetailsPage';
import ProductSinglepage from '@/components/productpage/ProductDetailsSec';
import HowItWorks from '@/components/homepage/HowItWorks';
import RelatedProducts from '@/components/productpage/RelatedProducts';
import CompareFloatingButton from '@/components/productpage/CompareFloatingButton';
import CompareModal from '@/components/productpage/CompareModal';

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
  dimensions?: string;
  category_name?: string;
  merchant_product_third_category?: string;
  product_image?: string;
  descriptions?: string;
  description?: string;
  ean?: string;
  cheapest_offer?: number;
  search_price?: number;
  expensive_offer?: number;
  in_stock?: string;
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
  // loading?: Boolean;
}

// ---- Fetch a single product for metadata/LD ----
async function fetchProductData(slug: string): Promise<ProductDetailsResponse> {
  try {
    const res = await fetch(
      `${API}/api/products/product-details/${encodeURIComponent(slug)}`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return { product: undefined, relatedProducts: [] };
    return res.json();
  } catch {
    return { product: undefined, relatedProducts: [] };
  }
}
// ---- Helpers ----
function fallbackTitle(p?: SeoProduct): string {
  const brand = p?.brand_name?.trim() ?? '';
  const name = p?.dimensions?.trim() ?? '';
  const merchantCategory = p?.merchant_product_third_category?.trim() ?? '';
  const main = [brand, name, merchantCategory].filter(Boolean).join(' ');

  return main
    ? `${main} | Reifencheck.de`
    : 'Reifencheck.de | Produkts – Reifen Preisvergleich';
}

function fallbackDescription(p?: SeoProduct): string {
  if (!p) return 'Produktdetails und Preisvergleich auf Reifencheck.de.';
  const brand = p.brand_name?.trim() ?? '';
  const name = p.dimensions?.trim() ?? '';
  const merchantCategory = p.merchant_product_third_category?.trim() ?? '';
  const base =
    p.descriptions ||
    p.description ||
    [brand, name, merchantCategory].filter(Boolean).join(' ') ||
    'Produktdetails';
  return `Jetzt Preise für ${base} vergleichen.`.trim();
}

function buildKeywords(p?: SeoProduct): string[] {
  const brand = p?.brand_name?.trim();
  const name = p?.dimensions?.trim();
  const category = p?.category_name?.trim();
  const merchantCategory = p?.merchant_product_third_category?.trim();
  const base: string[] = [
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
  ];
  if (brand) base.push(`${brand} reifen`, brand);
  if (name) base.push(name);
  if (category) base.push(category);
  if (merchantCategory) base.push(merchantCategory);
  if (brand && name)
    base.push(`${brand} ${name}`, `${brand} ${name} preisvergleich`);
  if (brand && category) base.push(`${brand} ${category}`);
  if (brand && merchantCategory) base.push(`${brand} ${merchantCategory}`);
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

  // Safely handle category/dimension/brand
  const brand = p.brand_name?.trim() ?? '';
  const dimension = p.dimensions?.trim?.() ?? ''; // if your API sends it
  const category = p.merchant_product_third_category?.trim?.() ?? '';
  const name = [brand, dimension, category, p.product_name?.trim()]
    .filter(Boolean)
    .join(' ');

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/products/${p.slug}#product`,
    name: name || p.product_name || 'Reifen Produkt',
    image: p.product_image ? [p.product_image] : undefined,
    description: `Jetzt ${brand} ${dimension} ${category} Preise vergleichen – ${
      p.descriptions ||
      p.description ||
      'Reifen Preisvergleich auf Reifencheck.de.'
    }`,
    sku: p.ean || undefined,
    brand: brand ? { '@type': 'Brand', name: brand } : undefined,
    category: category || undefined,
    price: p.search_price
      ? `${
          typeof p.search_price === 'number'
            ? p.search_price.toFixed(2)
            : p.search_price
        }`
      : undefined,
    url: `${SITE_URL}/products/${p.slug}`,
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
  const { product } = await fetchProductData(slug);

  // If API failed, still ship a stable canonical and noindex to avoid soft-404s
  if (!product) {
    // Convert slug → readable string (remove dashes/underscores)
    let readableSlug = slug.replace(/[-_]+/g, ' ').trim();

    // Capitalize the first letter of each word
    readableSlug = readableSlug.replace(/\b\w/g, l => l.toUpperCase());

    // ✅ Limit length to keep SEO-safe (< 60 for title, < 150 for desc)
    const shortTitle =
      readableSlug.length > 50
        ? readableSlug.slice(0, 50).trim() + '…'
        : readableSlug;

    const shortDesc =
      readableSlug.length > 120
        ? readableSlug.slice(0, 120).trim() + '…'
        : readableSlug;
    return {
      metadataBase: new URL(SITE_URL),
      title: `${shortTitle} | 'Produkt - Reifencheck.de'`,
      description: `Preisvergleich und Details für ${shortDesc} auf Reifencheck.de.`,
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

  const title = fallbackTitle(product);
  const description = fallbackDescription(product);
  const canonical = `${SITE_URL}/products/${product.slug}`;
  const keywords = buildKeywords(product);
  const ogImage = product.product_image || '/images/product-detailspage.png';
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
// ---------- PAGE ----------
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { product, relatedProducts } = await fetchProductData(slug);

  if (!product) {
    console.warn('Missing product slug:', await fetchProductData(slug));
    notFound();
  }

  const jsonLd = buildJsonLd(product);

  return (
    <>
      <div className="product-details-cont-wrapper">
        <ProductSinglepage product={product} loading={false} />
        <HowItWorks />
        <RelatedProducts
          relatedProductData={relatedProducts ?? []}
          loading={false}
        />
        <CompareFloatingButton />
        <CompareModal relatedProducts={relatedProducts ?? []} />
      </div>
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
