import HomePageMain from "@/page-components/Home/HomePage";
import { Metadata } from "next";
import Script from "next/script";
export const metadata: Metadata = {
  metadataBase: new URL('https://reifencheck.de'),
  title: 'Reifen günstig vergleichen & kaufen | Reifencheck',
  description:
    'Finden Sie günstige Reifenangebote auf Reifencheck.de. Vergleichen Sie Sommerreifen, Winterreifen und Ganzjahresreifen nach Größe, Marke und Preis.',
  alternates: { canonical: 'https://reifencheck.de/produkte' },
  keywords: [
    // Core
    'reifenpreisvergleich',
    'günstige reifen',
    'reifen online kaufen',
    'sommerreifen',
    'winterreifen',
    'ganzjahresreifen',
    'reifenangebote',
    'reifen test',
    'reifen größen',
    'reifengrößen',

    // Top 20 targeted ideas
    'Winterreifen 205/55 R16',
    'Sommerreifen 225/45 R17 günstig',
    'Ganzjahresreifen Test 2025',
    'EU Reifenlabel Nasshaftung erklärt',
    'Markenreifen online kaufen',
    'Reifen Angebote Deutschland',
    'Billige Winterreifen ab 50 Euro',
    'Reifen passend fürs Auto Modell',
    'Reifenprofil gesetzlich vorgeschrieben Deutschland',
    'Reifenpflege Tipps',
    'Michelin Primacy 4 Test',
    'Geräusch Werte Reifen Vergleich',
    'Winterreifenpflicht Deutschland',
    'Sommerreifen Ratgeber',
    'Reifen Versandkosten vergleichen',
    'Reifen Bewertungen',
    'Reifen für SUV Modelle',
    'Ganzjahresreifen Vorteil Nachteil',
    'Leise Reifen Geräuschwert',
    'Kompletträder Angebote mit Felgen',
  ],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://reifencheck.de/produkte',
    siteName: 'Reifencheck.de',
    title: 'Reifenangebote – Reifen günstig vergleichen & kaufen',
    description:
      'Stöbern Sie durch unsere Produktübersicht und finden Sie Top-Angebote für Sommer-, Winter- und Ganzjahresreifen.',
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
    title: 'Reifenangebote – Reifen günstig vergleichen & kaufen',
    description:
      'Markenreifen im Preisvergleich. Sommerreifen, Winterreifen und Ganzjahresreifen günstig kaufen.',
    images: ['/images/product-detailspage.png'],
  },
  robots: { index: true, follow: true },
};
export default function Home() {
  return (
    <div className="home-page-wrapper-area">
      <HomePageMain />
      {/* JSON-LD: Organization + WebSite (global) */}
      <Script
        id="ld-org-website"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': 'https://reifencheck.de/#org',
              name: 'Reifencheck.de',
              url: 'https://reifencheck.de/',
              logo: 'https://reifencheck.de/images/logo.png',
              sameAs: [
                'https://www.facebook.com/REPLACE',
                'https://www.instagram.com/REPLACE',
              ],
            },
            {
              '@type': 'WebSite',
              '@id': 'https://reifencheck.de/#website',
              url: 'https://reifencheck.de/',
              name: 'Reifencheck.de',
              publisher: { '@id': 'https://reifencheck.de/#org' },
              inLanguage: 'de-DE',
            },
          ],
        })}
      </Script>

      {/* JSON-LD: Homepage WebPage */}
      <Script
        id="ld-homepage"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://reifencheck.de/#webpage',
          url: 'https://reifencheck.de/',
          name: 'Reifenpreisvergleich & günstige Reifen | Reifencheck.de',
          isPartOf: { '@id': 'https://reifencheck.de/#website' },
          inLanguage: 'de-DE',
          about: {
            '@type': 'Thing',
            name: 'Reifenpreisvergleich, Sommerreifen, Winterreifen, Ganzjahresreifen',
          },
        })}
      </Script>

      {/* JSON-LD: Breadcrumbs */}
      <Script
        id="ld-breadcrumbs"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Startseite',
              item: 'https://reifencheck.de/',
            },
          ],
        })}
      </Script>
    </div>
  );
}
