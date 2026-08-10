import type { Metadata } from 'next';
import Script from 'next/script';
import ProductListingsSec from '@/components/productpage/ProductListingsSec';
import { CORE_KEYWORDS, SITE_URL } from '@/libs/seo/site';

interface Props {
  searchParams: Promise<{
    category?: string;
    kategorie?: string;
    page?: string;
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
    Sommerreifen: 'Sommerreifen Angebote | Reifexa.de',
    Winterreifen: 'Winterreifen Angebote | Reifexa.de',
    Ganzjahresreifen: 'Ganzjahresreifen Angebote | Reifexa.de',
  };

  const descriptions: Record<string, string> = {
    Sommerreifen:
      'Finden Sie günstige Sommerreifen-Angebote auf Reifexa.de.',
    Winterreifen:
      'Finden Sie günstige Winterreifen-Angebote auf Reifexa.de.',
    Ganzjahresreifen:
      'Finden Sie günstige Ganzjahresreifen-Angebote auf Reifexa.de.',
  };

  const title = titles[category] || 'Reifenangebote | Reifexa.de';
  const description =
    descriptions[category] ||
    'Finden Sie günstige Reifenangebote auf Reifexa.de. Vergleichen Sie Sommer-, Winter- und Ganzjahresreifen nach Marke und Preis.';

  // Clean canonical: category landing yes; paginated/filter pages canonicalize to base/category
  const canonical = category
    ? `${SITE_URL}/produkte?kategorie=${encodeURIComponent(category)}`
    : `${SITE_URL}/produkte`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical },
    keywords: [
      ...CORE_KEYWORDS,
      'reifenangebote',
      ...(category ? [category, `${category} günstig`, `${category} Angebote`] : []),
    ],
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

  let initialProducts = [];
  let total = 0;

  try {
    const res = await fetch(
      `${apiUrl}/api/products/product-lists?${params.toString()}`,
      { next: { revalidate: 300 } }
    );
    const data = await res.json();
    initialProducts = data.products || [];
    total = data.total || 0;
  } catch (err) {
    console.error('Failed to fetch SSR products', err);
  }

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
      <ProductListingsSec
        initialProducts={initialProducts}
        total={total}
        initialPage={page}
      />
      <Script
        id="ld-produkte-static"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${pageUrl}#collection`,
          url: pageUrl,
          name: category ? `${category} Angebote` : 'Reifenangebote',
          inLanguage: 'de-DE',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          publisher: { '@id': `${SITE_URL}/#org` },
        })}
      </Script>
      <Script
        id="ld-produkte-breadcrumb"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(breadcrumbLd)}
      </Script>
    </>
  );
}
