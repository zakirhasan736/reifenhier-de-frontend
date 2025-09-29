import type { Metadata } from 'next';
import Script from 'next/script';
import ProductsListing from '@/page-components/products/ProductsListing';

// ---- Metadata (static for now) ----
export const metadata: Metadata = {
  title: 'Reifenangebote | Reifencheck.de',
  description:
    'Finden Sie günstige Reifenangebote auf Reifencheck.de. Vergleichen Sie Sommerreifen, Winterreifen und Ganzjahresreifen nach Größe, Marke und Preis.',
  alternates: { canonical: 'https://reifencheck.de/products' },
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
    url: 'https://reifencheck.de/products',
    siteName: 'Reifencheck.de',
    title: 'Reifenangebote | Reifencheck.de',
    description:
      'Vergleichen Sie Sommer, Winter und Ganzjahresreifen nach Größe, Marke und Preis.',
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
    title: 'Reifenangebote | Reifencheck.de',
    description:
      'Vergleichen Sie Sommer-, Winter- und Ganzjahresreifen nach Größe, Marke und Preis.',
    images: ['/images/product-detailspage.png'],
  },
  robots: { index: true, follow: true },
};

// ---- Page (SSR) ----
export default function ProductsPage() {
  return (
    <>
      {/* Your main UI */}
      <ProductsListing />

      {/* Static JSON-LD for CollectionPage (no dynamic items) */}
      <Script
        id="ld-products-static"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': 'https://reifencheck.de/products#collection',
          url: 'https://reifencheck.de/products',
          name: 'Reifenangebote',
          inLanguage: 'de-DE',
        })}
      </Script>
    </>
  );
}
