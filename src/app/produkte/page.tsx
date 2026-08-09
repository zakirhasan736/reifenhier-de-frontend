import type { Metadata } from 'next';
import Script from 'next/script';
import ProductListingsSec from '@/components/productpage/ProductListingsSec';

interface Props {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const resolvedParams = await searchParams; // ✅ wait for params
  const category = resolvedParams.category || '';
  const baseUrl = 'https://www.reifexa.de';

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

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/produkte${
        category ? `?kategorie=${category}` : ''
      }`,
    },
    keywords: [
      'reifenangebote',
      'reifen preisvergleich',
      'günstige reifen',
      'reifen online kaufen',
      'sommerreifen',
      'winterreifen',
      'ganzjahresreifen',
      'reifexa',
      'reifexa.de',
      'Reifen check',
      'Reifen check 24',
      'Reifen 24 check',
    ],
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      url: `${baseUrl}/produkte${category ? `?kategorie=${category}` : ''}`,
      siteName: 'Reifexa.de',
      title,
      description,
      images: [
        {
          url: `${baseUrl}/images/product-detailspage.png`,
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
      images: [`${baseUrl}/images/product-detailspage.png`],
    },
    robots: { index: true, follow: true },
  };
}

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:8000';

export default async function ProductsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams; // ✅ wait here too
  const category = resolvedParams.category || '';
  const page = Number(resolvedParams.page) || 1;
  const limit = 12;

  const params = new URLSearchParams();
  if (category) params.append('kategorie', category);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  let initialProducts = [];
  let total = 0;

  try {
    const res = await fetch(`${apiUrl}/api/products/product-lists`, {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    initialProducts = data.products || [];
    total = data.total || 0;
  } catch (err) {
    console.error('Failed to fetch SSR products', err);
  }

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
          '@id': 'https://www.reifexa.de/produkte#collection',
          url: 'https://www.reifexa.de/produkte',
          name: 'Reifenangebote',
          inLanguage: 'de-DE',
        })}
      </Script>
    </>
  );
}

