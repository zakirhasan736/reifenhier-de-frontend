import HomePageMain from "@/page-components/Home/HomePage";
import { Metadata } from "next";
import Script from "next/script";
export const metadata: Metadata = {
  metadataBase: new URL('https://www.reifexa.de'),
  title: 'Reifen günstig vergleichen & kaufen | Reifexa',
  description:
    'Finden Sie günstige Reifenangebote auf Reifexa.de. Vergleichen Sie Sommerreifen, Winterreifen und Ganzjahresreifen nach Größe, Marke und Preis.',
  alternates: { canonical: 'https://www.reifexa.de/' },
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
    'reifexa',
    'reifexa.de',
    'Reifen check',
    'Reifen check 24',
    'Reifen 24 check',

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
    url: 'https://www.reifexa.de/',
    siteName: 'Reifexa.de',
    title: 'Reifenangebote – Reifen günstig vergleichen & kaufen',
    description:
      'Stöbern Sie durch unsere Produktübersicht und finden Sie Top-Angebote für Sommer-, Winter- und Ganzjahresreifen.',
    images: [
      {
        url: `https://www.reifexa.de/images/product-detailspage.png`,
        width: 1200,
        height: 630,
        alt: 'Reifenangebote auf Reifexa.de',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reifenangebote – Reifen günstig vergleichen & kaufen',
    description:
      'Markenreifen im Preisvergleich. Sommerreifen, Winterreifen und Ganzjahresreifen günstig kaufen.',
    images: ['https://www.reifexa.de/images/product-detailspage.png'],
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
              '@id': 'https://www.reifexa.de/#org',
              name: 'Reifexa.de',
              url: 'https://www.reifexa.de/',
              logo: 'https://www.reifexa.de/images/logo.png',
              sameAs: [
                'https://www.facebook.com/REPLACE',
                'https://www.instagram.com/REPLACE',
              ],
            },
            {
              '@type': 'WebSite',
              '@id': 'https://www.reifexa.de/#website',
              url: 'https://www.reifexa.de/',
              name: 'Reifexa.de',
              publisher: { '@id': 'https://www.reifexa.de/#org' },
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
          '@id': 'https://www.reifexa.de/#webpage',
          url: 'https://www.reifexa.de/',
          name: 'Reifenpreisvergleich & günstige Reifen | Reifexa.de',
          isPartOf: { '@id': 'https://www.reifexa.de/#website' },
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
              item: 'https://www.reifexa.de/',
            },
          ],
        })}
      </Script>
    </div>
  );
}
