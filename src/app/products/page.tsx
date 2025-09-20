// app/produkte/page.tsx
import Script from 'next/script';
import type { Metadata } from 'next';
import ProductsListing from '@/page-components/products/ProductsListing';

// ---- Minimal product type for this page ----
interface Product {
  _id: string;
  slug: string;
  product_name: string;
  brand_name: string;
  product_image: string;
}

// ---- Helpers ----
function norm(val?: string | string[]) {
  return Array.isArray(val) ? val[0] : val || '';
}
function titleCase(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function buildListingTitle({
  category,
  size,
  brand,
}: {
  category?: string;
  size?: string;
  brand?: string;
}) {
  const parts: string[] = [];
  if (category) parts.push(`${titleCase(category)} Angebote`);
  if (brand) parts.push(brand);
  if (size) parts.push(size);
  parts.push('– Reifen günstig vergleichen');
  return parts.join(' ');
}

function buildListingDescription({
  category,
  size,
  brand,
}: {
  category?: string;
  size?: string;
  brand?: string;
}) {
  const bits: string[] = [];
  bits.push('Finden Sie günstige Reifenangebote auf Reifencheck.de.');
  const specifics: string[] = [];
  if (category) specifics.push(titleCase(category));
  if (brand) specifics.push(brand);
  if (size) specifics.push(size);
  if (specifics.length) {
    bits.push(
      `Vergleichen Sie ${specifics.join(
        ' '
      )} nach Preis, Marke und Verfügbarkeit.`
    );
  } else {
    bits.push(
      'Vergleichen Sie Sommer-, Winter- und Ganzjahresreifen nach Größe, Marke und Preis.'
    );
  }
  return bits.join(' ');
}

function buildListingKeywords({
  category,
  size,
  brand,
}: {
  category?: string;
  size?: string;
  brand?: string;
}) {
  const base = [
    'reifenangebote',
    'reifen preisvergleich',
    'günstige reifen',
    'reifen online kaufen',
    'reifen sparen im vergleich',
  ];
  if (category) {
    base.push(
      `${category} angebote`,
      `${category} preisvergleich`,
      `${category} günstig kaufen`
    );
  }
  if (size) {
    base.push(
      `reifen ${size} günstig`,
      `${size} preisvergleich`,
      `${size} angebote`
    );
    if (category)
      base.push(`${category} ${size}`, `${category} ${size} günstig`);
  }
  if (brand) {
    base.push(
      `${brand} reifen`,
      `${brand} reifen angebote`,
      `${brand} reifen preisvergleich`
    );
    if (size) base.push(`${brand} ${size} reifen`);
    if (category) base.push(`${brand} ${category}`);
  }
  return Array.from(new Set(base));
}

// Keep canonical clean: only SEO-relevant filters
function buildCanonical(sp: Record<string, string | string[] | undefined>) {
  const u = new URL('https://reifencheck.de/produkte');
  (
    [
      ['category', norm(sp.category)],
      ['size', norm(sp.size)],
      ['brand', norm(sp.brand)],
    ] as const
  ).forEach(([k, v]) => {
    if (v) u.searchParams.set(k, v);
  });
  return u.toString();
}

// Build a URL preserving size/brand where useful
function buildCategoryLink(
  base: string,
  category: string,
  sp: Record<string, string | string[] | undefined>
) {
  const u = new URL(base);
  u.pathname = '/products';
  u.searchParams.set('category', category);
  const size = norm(sp.size);
  const brand = norm(sp.brand);
  if (size) u.searchParams.set('size', size);
  if (brand) u.searchParams.set('brand', brand);
  return u.toString();
}

// ---- Server fetch for the listing ----
async function getProducts(
  sp: Record<string, string | string[] | undefined>
): Promise<Product[]> {
  const api = new URL('https://api.reifencheck.de/products');
  (
    [
      'category',
      'size',
      'brand',
      'minPrice',
      'maxPrice',
      'sortField',
      'sortOrder',
      'page',
    ] as const
  ).forEach(k => {
    const v = norm(sp[k]);
    if (v) api.searchParams.set(k, v);
  });
  if (!api.searchParams.get('sortField'))
    api.searchParams.set('sortField', 'createdAt');
  if (!api.searchParams.get('sortOrder'))
    api.searchParams.set('sortOrder', 'desc');
  if (!api.searchParams.get('page')) api.searchParams.set('page', '1');

  const res = await fetch(api.toString(), { next: { revalidate: 900 } });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray((data as { results?: unknown }).results)
    ? (data as { results: Product[] }).results
    : (data as Product[]);
}

// ---- Dynamic <head> metadata ----
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const category = norm(sp.category);
  const size = norm(sp.size);
  const brand = norm(sp.brand);

  const title =
    category || size || brand
      ? buildListingTitle({ category, size, brand })
      : 'Reifenangebote – Sommer-, Winter- & Ganzjahresreifen günstig vergleichen';

  const description =
    category || size || brand
      ? buildListingDescription({ category, size, brand })
      : 'Finden Sie günstige Reifenangebote auf Reifencheck.de. Vergleichen Sie Sommerreifen, Winterreifen und Ganzjahresreifen nach Größe, Marke und Preis.';

  const keywords = buildListingKeywords({ category, size, brand });
  const canonical = buildCanonical(sp);

  return {
    metadataBase: new URL('https://reifencheck.de'),
    title,
    description,
    alternates: { canonical },
    keywords,
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      url: canonical,
      siteName: 'Reifencheck.de',
      title,
      description,
      images: [
        {
          url: '/images/product-detailspage.png',
          width: 1200,
          height: 630,
          alt: 'Reifenangebote auf Reifencheck.de',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/product-detailspage.png'],
    },
    robots: { index: true, follow: true },
  };
}

// ---- Page (Server Component) ----
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const products = await getProducts(sp);
  const canonical = buildCanonical(sp);

  // Build plain, SEO-friendly links to product pages
  const itemList = products.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `https://reifencheck.de/p/${p.slug}`,
    name: p.product_name,
  }));

  // Category quick links (preserves size/brand if present)
  const base = 'https://reifencheck.de';
  const catSommer = buildCategoryLink(base, 'Sommerreifen', sp);
  const catWinter = buildCategoryLink(base, 'Winterreifen', sp);
  const catAll = buildCategoryLink(base, 'Ganzjahresreifen', sp);

  return (
    <>
      {/* Schnellzugriff: Kategorie-Links */}
      <nav aria-label="Schnellzugriff" className="container hidden mx-auto mb-4 px-3">
        <ul className="flex flex-wrap gap-3 text-sm">
          <li>
            <a href={catSommer} className="underline hover:no-underline">
              Sommerreifen – Angebote
            </a>
          </li>
          <li>
            <a href={catWinter} className="underline hover:no-underline">
              Winterreifen – Angebote
            </a>
          </li>
          <li>
            <a href={catAll} className="underline hover:no-underline">
              Ganzjahresreifen – Angebote
            </a>
          </li>
        </ul>
      </nav>

      {/* Your main UI */}
      <ProductsListing /* products={products} */ />

      {/* Plain list of result links (helps users + crawlability) */}
      <aside
        className="container mx-auto mt-8 px-3"
        aria-label="Suchergebnis-Links"
      >
        <h2 className="text-base font-semibold mb-2">Direkte Produktlinks</h2>
        <ul className="list-disc pl-5 space-y-1">
          {products.map(p => (
            <li key={p._id}>
              <a
                href={`/p/${p.slug}`}
                title={`${p.brand_name} ${p.product_name}`}
              >
                {p.brand_name} {p.product_name}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* CollectionPage + ItemList JSON-LD */}
      <Script
        id="ld-products-dynamic"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${canonical}#collection`,
          url: canonical,
          name: 'Reifenangebote',
          inLanguage: 'de-DE',
          mainEntity: {
            '@type': 'ItemList',
            itemListOrder: 'https://schema.org/ItemListOrderAscending',
            itemListElement: itemList,
          },
        })}
      </Script>
    </>
  );
}
