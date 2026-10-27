import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductSinglepage from '@/components/productpage/ProductDetailsSec';
import HowItWorks from '@/components/homepage/HowItWorks';
import RelatedProducts from '@/components/productpage/RelatedProducts';
import { productCanonicalUrl, SITE_URL } from '@/libs/seo/site';
import {
  breadcrumbJsonLd,
  buildProductBreadcrumbs,
  buildProductDescription,
  buildProductJsonLd,
  buildProductMetadata,
  buildProductTitle,
} from '@/libs/seo/productMeta';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import PriceHistoryChart from '@/components/productpage/PriceHistoryChart';
import Link from 'next/link';

// ---- Config ----
const API = (
  process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de'
).replace(/\/$/, '');

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
  price_trend?: { points?: [string, number][] } | null;
  tyre_label_info?: {
    supplier?: string | null;
    identifier?: string | null;
    size?: string | null;
    efficiency_class?: string | null;
    wet_grip_class?: string | null;
    noise_level_db?: string | number | null;
    noise_class?: string | null;
    snow_icon?: boolean | null;
  } | null;
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
// ---- Metadata (SSR) ----
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await fetchProductData(slug);

  if (!product) {
    // API down or product gone: stable canonical, keep out of the index.
    return {
      metadataBase: new URL(SITE_URL),
      title: { absolute: 'Reifen nicht gefunden | Reifexa' },
      alternates: { canonical: `${SITE_URL}/produkte/${slug}` },
      robots: { index: false, follow: true },
    };
  }
  return buildProductMetadata(product);
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

  const pageUrl = productCanonicalUrl(product.slug);
  const crumbs = buildProductBreadcrumbs(product);

  return (
    <>
      <div className="product-details-cont-wrapper">
        <Breadcrumbs crumbs={crumbs} />
        <section className="mx-auto max-w-6xl px-4 py-5" aria-label="Reifendaten und Händlerpreise">
          <h1 className="text-2xl font-semibold">{[product.brand_name, product.product_name, product.dimensions].filter(Boolean).join(" ")}</h1>
          <p className="mt-2">{buildProductDescription(product)}</p>
          {Number(product.cheapest_offer || product.search_price) > 0 && (
            <p className="mt-2 font-semibold">Angebote ab {Number(product.cheapest_offer || product.search_price).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</p>
          )}
          <p className="mt-2 text-sm">Preise und Verfügbarkeit können beim Händler abweichen. Bitte vor dem Kauf prüfen.</p>
          <Link className="mt-2 inline-block underline" href="/reifenpreisvergleich">Reifenpreise richtig vergleichen</Link>
        </section>
        <ProductSinglepage
          product={product}
          loading={false}
          indexVariants={indexVariants ?? []}
        />
        <PriceHistoryChart
          slug={product.slug}
          productName={[product.brand_name, product.product_name].filter(Boolean).join(' ')}
          initialTrend={product.price_trend?.points}
          currentBest={Number(product.cheapest_offer) || undefined}
        />
        <HowItWorks />
        <RelatedProducts
          relatedProductData={relatedProducts ?? []}
          loading={false}
        />
      </div>
      <JsonLd
        id="ld-webpage"
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: buildProductTitle(product),
          description: buildProductDescription(product),
          inLanguage: 'de-DE',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          mainEntity: { '@id': `${pageUrl}#produkt` },
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        }}
      />
      <JsonLd id="ld-product" data={buildProductJsonLd(product)} />
      <JsonLd
        id="ld-breadcrumb"
        data={{ ...breadcrumbJsonLd(crumbs), '@id': `${pageUrl}#breadcrumb` }}
      />
    </>
  );
}