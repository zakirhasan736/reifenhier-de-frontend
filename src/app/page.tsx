import HomePageMain from "@/page-components/Home/HomePage";
import { Metadata } from "next";
import Script from "next/script";
import { SITE_KEYWORDS, SITE_URL } from "@/libs/seo/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Reifen günstig vergleichen & kaufen | Reifexa',
  description:
    'Finden Sie günstige Reifenangebote auf Reifexa.de. Vergleichen Sie Sommerreifen, Winterreifen und Ganzjahresreifen nach Größe, Marke und Preis.',
  alternates: { canonical: `${SITE_URL}/` },
  keywords: [
    ...SITE_KEYWORDS,
    'Winterreifen 205/55 R16',
    'Sommerreifen 225/45 R17 günstig',
    'Ganzjahresreifen Test 2026',
    'EU Reifenlabel Nasshaftung erklärt',
    'Markenreifen online kaufen',
    'Reifen Angebote Deutschland',
    'Billige Winterreifen',
    'Reifenpflege Tipps',
    'Winterreifenpflicht Deutschland',
    'Sommerreifen Ratgeber',
    'Reifen für SUV Modelle',
    'Kompletträder Angebote mit Felgen',
  ],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: `${SITE_URL}/`,
    siteName: 'Reifexa.de',
    title: 'Reifenangebote – Reifen günstig vergleichen & kaufen',
    description:
      'Stöbern Sie durch unsere Produktübersicht und finden Sie Top-Angebote für Sommer-, Winter- und Ganzjahresreifen.',
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
    title: 'Reifenangebote – Reifen günstig vergleichen & kaufen',
    description:
      'Markenreifen im Preisvergleich. Sommerreifen, Winterreifen und Ganzjahresreifen günstig kaufen.',
    images: [`${SITE_URL}/images/product-detailspage.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Home() {
  return (
    <div className="home-page-wrapper-area">
      <HomePageMain />
      {/* JSON-LD: Organization + WebSite (homepage) */}
      <Script
        id="ld-org-website"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                '@id': `${SITE_URL}/#org`,
                name: 'Reifexa.de',
                url: `${SITE_URL}/`,
                logo: {
                  '@type': 'ImageObject',
                  url: `${SITE_URL}/images/logo.png`,
                },
                sameAs: [
                  'https://www.facebook.com/reifexa.de',
                  'https://www.instagram.com/reifexa.de',
                  'https://www.tiktok.com/@reifexa',
                ],
              },
              {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                url: `${SITE_URL}/`,
                name: 'Reifexa.de',
                inLanguage: 'de-DE',
                publisher: { '@id': `${SITE_URL}/#org` },
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${SITE_URL}/produkte?q={search_term_string}`,
                  },
                  'query-input': 'required name=search_term_string',
                },
              },
              {
                '@type': 'WebPage',
                '@id': `${SITE_URL}/#webpage`,
                url: `${SITE_URL}/`,
                name: 'Reifen günstig vergleichen & kaufen | Reifexa',
                isPartOf: { '@id': `${SITE_URL}/#website` },
                about: { '@id': `${SITE_URL}/#org` },
                inLanguage: 'de-DE',
                description:
                  'Finden Sie günstige Reifenangebote auf Reifexa.de. Vergleichen Sie Sommerreifen, Winterreifen und Ganzjahresreifen nach Größe, Marke und Preis.',
              },
              {
                '@type': 'BreadcrumbList',
                '@id': `${SITE_URL}/#breadcrumb`,
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Startseite',
                    item: `${SITE_URL}/`,
                  },
                ],
              },
            ],
          }),
        }}
      />
    </div>
  );
}
