import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from '@/utils/Provider';
import Script from 'next/script';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://reifencheck.de'),
  title: 'Reifencheck.de – Reifenpreisvergleich & günstige Reifen',
  description:
    'Vergleichen Sie Reifenpreise in Sekunden. Sommer-, Winter- & Ganzjahresreifen günstig finden und direkt beim Händler kaufen.',
  icons: { icon: '/images/favicon.png', apple: '/images/favicon.png' },
  alternates: { canonical: 'https://reifencheck.de/' },
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
    url: 'https://reifencheck.de/',
    siteName: 'Reifencheck.de',
    title: 'Reifenpreisvergleich & günstige Reifen | Reifencheck.de',
    description:
      'Markenreifen vergleichen, Angebote finden und beim besten Händler kaufen.',
    images: [
      {
        url: '/images/banner-og-image.png',
        width: 1200,
        height: 630,
        alt: 'Reifenpreisvergleich bei Reifencheck.de',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reifenpreisvergleich & günstige Reifen | Reifencheck.de',
    description:
      'Sommer-, Winter- & Ganzjahresreifen im Preisvergleich. Jetzt sparen.',
    images: ['/images/banner-og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={poppins.className}>
      <head>
        {/* Cookiebot — must load before any tags that use cookies */}
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="1011cf97-2ce9-406a-85a7-8249e98f91c3"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        />

        {/* Default consent for GTM/Analytics */}
        <Script id="consent-defaults" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied'
            });
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TGMCZH48');
          `}
        </Script>

        {/* Google Analytics */}
        <Script
          id="gtag-src"
          src="https://www.googletagmanager.com/gtag/js?id=G-GJPR5ZRS4G"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GJPR5ZRS4G');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "synxux4l9y");
          `}
        </Script>

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

        
          {/* JSON-LD: Optional Featured ItemList (enable when you have real slugs)
          <Script id="ld-home-items" type="application/ld+json" strategy="afterInteractive">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Top Angebote',
              itemListOrder: 'https://schema.org/ItemListOrderDescending',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  url: 'https://reifencheck.de/p/michelin-primacy-4-205-55-r16',
                  name: 'MICHELIN Primacy 4 205/55 R16',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  url: 'https://reifencheck.de/p/continental-wintercontact-ts-870-195-65-r15',
                  name: 'Continental WinterContact TS 870 195/65 R15',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  url: 'https://reifencheck.de/p/goodyear-vector-4seasons-gen-3-225-45-r17',
                  name: 'Goodyear Vector 4Seasons Gen-3 225/45 R17',
                },
              ],
            })}
          </Script> */}
       
      </head>

      <body className="angelpage-body-wrapper-area">
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TGMCZH48"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <main className="angelpage-main-wrapper">
          <ClientProviders>{children}</ClientProviders>
        </main>
      </body>
    </html>
  );
}
