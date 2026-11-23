import type { Metadata } from 'next';
import ProductListingsSec from '@/components/productpage/ProductListingsSec';
import { CORE_KEYWORDS, SITE_URL } from '@/libs/seo/site';
import { listingKeywords } from '@/libs/seo/keywords';
import JsonLd from '@/components/seo/JsonLd';
import { brandPath, seasonForCategory, sizePath } from '@/libs/seo/landing';
import type { Product } from '@/types/product';
import { stripInternalLinks } from '@/libs/seo/stripInternalLinks';
import ListingShowcase from '@/components/productpage/ListingShowcase';

interface Props {
  searchParams: Promise<{
    category?: string;
    kategorie?: string;
    page?: string;
    brand?: string;
    width?: string;
    height?: string;
    diameter?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const category =
    resolvedParams.kategorie || resolvedParams.category || '';
  const page = Number(resolvedParams.page) || 1;

  const titles: Record<string, string> = {
    Sommerreifen: 'Sommerreifen günstig: Angebote im Preisvergleich | Reifexa',
    Winterreifen: 'Winterreifen günstig: Angebote im Preisvergleich | Reifexa',
    Ganzjahresreifen: 'Ganzjahresreifen günstig: Angebote im Preisvergleich | Reifexa',
  };

  const descriptions: Record<string, string> = {
    Sommerreifen:
      'Sommerreifen günstig kaufen: Angebote aller Größen und Marken im Preisvergleich – Händlerpreise inkl. Versand, EU-Label und Preisverlauf.',
    Winterreifen:
      'Winterreifen günstig kaufen: Angebote aller Größen und Marken im Preisvergleich – Händlerpreise inkl. Versand, EU-Label und Preisverlauf.',
    Ganzjahresreifen:
      'Ganzjahresreifen günstig kaufen: Allwetterreifen aller Größen und Marken im Preisvergleich – Händlerpreise inkl. Versand und EU-Label.',
  };

  const title = titles[category] || 'Reifen günstig kaufen: alle Angebote im Reifenvergleich | Reifexa';
  const description =
    descriptions[category] ||
    'Finden Sie günstige Reifenangebote auf Reifexa.de. Vergleichen Sie Sommer-, Winter- und Ganzjahresreifen nach Marke und Preis.';

  // Clean canonical: category landing yes; paginated/filter pages canonicalize to base/category
  // Season filters consolidate on the indexable season landing pages
  // Brand-only or exact-size filters consolidate on their landing pages too
  const one = (v?: string) => {
    const list = String(v || '').split(',').map(x => x.trim()).filter(Boolean);
    return list.length === 1 ? list[0] : '';
  };
  const brand = one(resolvedParams.brand);
  const width = one(resolvedParams.width);
  const height = one(resolvedParams.height);
  const diameter = one(resolvedParams.diameter);
  const seasonSlug = seasonForCategory(category)?.slug;
  const canonical =
    width && height && diameter && !brand
      ? `${SITE_URL}${sizePath({ width, height, diameter })}`
      : brand && !category && !width && !height && !diameter
        ? `${SITE_URL}${brandPath(brand)}`
        : seasonSlug
          ? `${SITE_URL}/${seasonSlug}`
          : category
            ? `${SITE_URL}/produkte?kategorie=${encodeURIComponent(category)}`
            : `${SITE_URL}/produkte`;

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description,
    alternates: { canonical },
    keywords: [...listingKeywords(category || undefined), ...CORE_KEYWORDS.slice(0, 8)],
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      url: canonical,
      siteName: 'Reifexa.de',
      title,
      description,
      images: [
        {
          url: `${SITE_URL}/images/product-detailspage.png`,
          width: 1200,
          height: 630,
          alt: 'Reifenangebote auf Reifexa.de',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/product-detailspage.png`],
    },
    robots:
      page > 1
        ? { index: false, follow: true }
        : { index: true, follow: true },
  };
}

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:8000';

export default async function ProductsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const category =
    resolvedParams.kategorie || resolvedParams.category || '';
  const page = Number(resolvedParams.page) || 1;
  const limit = 12;

  const params = new URLSearchParams();
  if (category) params.append('kategorie', category);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  let initialProducts: Product[] = [];
  let showcaseProducts: Array<Record<string, unknown>> = [];
  let total = 0;

  const showcaseParams = new URLSearchParams();
  if (category) showcaseParams.set('kategorie', category);
  showcaseParams.set('limit', '12');

  const [listResult, showcaseResult] = await Promise.all([
    fetch(`${apiUrl}/api/products/product-lists?${params.toString()}`, {
      next: { revalidate: 300 },
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error('Failed to fetch SSR products', err);
        return null;
      }),
    fetch(`${apiUrl}/api/products/listing-showcase?${showcaseParams.toString()}`, {
      next: { revalidate: 300 },
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error('Failed to fetch listing showcase', err);
        return null;
      }),
  ]);

  if (listResult) {
    initialProducts = stripInternalLinks(listResult.products || []);
    total = listResult.total || 0;
  }
  showcaseProducts = Array.isArray(showcaseResult?.products) ? showcaseResult.products : [];

  const pageUrl = category
    ? `${SITE_URL}/produkte?kategorie=${encodeURIComponent(category)}`
    : `${SITE_URL}/produkte`;

  const breadcrumbLd = {
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
              item: pageUrl,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-8" aria-labelledby="server-reifen-title">
        <h1 id="server-reifen-title" className="mb-4 text-2xl font-semibold">{category || 'Reifenangebote'} im Preisvergleich</h1>
        <p className="mb-4">Aktuelle Reifenangebote nach Modell, Größe und Händler vergleichen. Preise können sich beim Anbieter ändern.</p>
        <ListingShowcase
          products={showcaseProducts.length ? showcaseProducts : (initialProducts as unknown as Array<Record<string, unknown>>)}
        />
      </section>
      <ProductListingsSec
        initialProducts={initialProducts}
        total={total}
        initialPage={page}
      />
      <JsonLd id="ld-produkte-static" data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${pageUrl}#collection`,
          url: pageUrl,
          name: category ? `${category} Angebote` : 'Reifenangebote',
          inLanguage: 'de-DE',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          publisher: { '@id': `${SITE_URL}/#org` },
        }} />
      <JsonLd id="ld-produkte-breadcrumb" data={breadcrumbLd} />
    </>
  );
}
