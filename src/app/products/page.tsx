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
  const baseUrl = 'https://www.reifencheck.de';

  const titles: Record<string, string> = {
    Sommerreifen: 'Sommerreifen Angebote | Reifencheck.de',
    Winterreifen: 'Winterreifen Angebote | Reifencheck.de',
    Ganzjahresreifen: 'Ganzjahresreifen Angebote | Reifencheck.de',
  };

  const descriptions: Record<string, string> = {
    Sommerreifen:
      'Finden Sie günstige Sommerreifen-Angebote auf Reifencheck.de.',
    Winterreifen:
      'Finden Sie günstige Winterreifen-Angebote auf Reifencheck.de.',
    Ganzjahresreifen:
      'Finden Sie günstige Ganzjahresreifen-Angebote auf Reifencheck.de.',
  };

  const title = titles[category] || 'Reifenangebote | Reifencheck.de';
  const description =
    descriptions[category] ||
    'Finden Sie günstige Reifenangebote auf Reifencheck.de. Vergleichen Sie Sommer-, Winter- und Ganzjahresreifen nach Marke und Preis.';

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/products${
        category ? `?category=${category}` : ''
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
    ],
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      url: `${baseUrl}/products${category ? `?category=${category}` : ''}`,
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

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:8000';

export default async function ProductsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams; // ✅ wait here too
  const category = resolvedParams.category || '';
  const page = Number(resolvedParams.page) || 1;
  const limit = 12;

  const params = new URLSearchParams();
  if (category) params.append('category', category);
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
        id="ld-products-static"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': 'https://www.reifencheck.de/products#collection',
          url: 'https://www.reifencheck.de/products',
          name: 'Reifenangebote',
          inLanguage: 'de-DE',
        })}
      </Script>
    </>
  );
}

