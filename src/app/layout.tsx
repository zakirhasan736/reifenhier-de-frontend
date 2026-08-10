import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from '@/utils/Provider';
import Script from 'next/script';
import { Poppins } from 'next/font/google';
import Header from '@/components/shared/header/Header';
import Footer from '@/components/shared/footer/Footer';
import { SITE_KEYWORDS, SITE_URL, SOCIAL_PROFILES } from '@/libs/seo/site';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Reifexa.de – Reifenpreisvergleich & günstige Reifen',
    template: '%s | Reifexa.de',
  },
  description:
    'Vergleichen Sie Reifenpreise in Sekunden. Sommer-, Winter- & Ganzjahresreifen günstig finden und direkt beim Händler kaufen. Unabhängiger Reifenpreisvergleich für Deutschland.',
  applicationName: 'Reifexa.de',
  authors: [{ name: 'Reifexa.de', url: SITE_URL }],
  creator: 'Reifexa.de',
  publisher: 'Reifexa.de',
  category: 'shopping',
  classification: 'Reifenpreisvergleich, Automotive, E-Commerce Affiliate',
  keywords: [...SITE_KEYWORDS],
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/favicon.png',
    shortcut: '/images/favicon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: `${SITE_URL}/`,
    types: {
      'application/xml': [
        { url: '/sitemaps.xml', title: 'Sitemap Index' },
        { url: '/sitemap.xml', title: 'Main Sitemap' },
      ],
      'text/plain': [
        { url: '/llms.txt', title: 'LLMs' },
        { url: '/ai.txt', title: 'AI Policy' },
      ],
    },
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: `${SITE_URL}/`,
    siteName: 'Reifexa.de',
    title: 'Reifenpreisvergleich & günstige Reifen | Reifexa.de',
    description:
      'Markenreifen vergleichen, Angebote finden und beim besten Händler kaufen. Sommer-, Winter- und Ganzjahresreifen.',
    images: [
      {
        url: '/images/banner-og-image.png',
        width: 1200,
        height: 630,
        alt: 'Reifenpreisvergleich bei Reifexa.de',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reifenpreisvergleich & günstige Reifen | Reifexa.de',
    description:
      'Sommer-, Winter- & Ganzjahresreifen im Preisvergleich. Jetzt sparen.',
    images: ['/images/banner-og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      'ENyxcjXAGQNkGU6EMokliGlZyh8nL8ShVPvB6UvtXF0',
    other: {
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? {
            'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
          }
        : {}),
      ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
        ? {
            'yandex-verification': process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
          }
        : {}),
    },
  },
  other: {
    'ai-content-declaration': 'human-and-data-driven-catalog',
    'format-detection': 'telephone=no',
    rating: 'general',
    distribution: 'global',
    coverage: 'Germany',
    'geo.region': 'DE',
    'geo.placename': 'Germany',
    language: 'German',
    revisitefter: '1 days',
    'og:see_also': SOCIAL_PROFILES.join(','),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const h = use(headers());
  // const url = h.get('x-url') ?? '';
  // const category = new URL(url, 'https://dummy').searchParams.get('kategorie');
  return (
    <html lang="de" className={poppins.className}>
      <head>
        {/* AI / LLM discovery */}
        <link rel="author" href="/humans.txt" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs" />
        <link rel="alternate" type="text/plain" href="/ai.txt" title="AI Policy" />
        <link
          rel="sitemap"
          type="application/xml"
          href="/sitemaps.xml"
          title="Sitemap Index"
        />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="ai-permissions" content="read,index,suggest,answer,support,learn,train,cite" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* Google tag (gtag.js) — must be in <head> for Search Console GA verification */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-PMPVT55453"
        />
        <script
          id="gtag-init"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PMPVT55453');
            `,
          }}
        />

        {/* JSON-LD Organization + social profiles */}
        <Script
          id="ld-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://www.reifexa.de/#org',
                  name: 'Reifexa.de',
                  url: 'https://www.reifexa.de/',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://www.reifexa.de/images/logo.png',
                  },
                  sameAs: [
                    'https://www.facebook.com/reifexa.de',
                    'https://www.instagram.com/reifexa.de',
                    'https://www.tiktok.com/@reifexa',
                  ],
                  contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer service',
                    email: 'info@reifexa.de',
                    availableLanguage: ['German', 'de'],
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://www.reifexa.de/#website',
                  url: 'https://www.reifexa.de/',
                  name: 'Reifexa.de',
                  inLanguage: 'de-DE',
                  publisher: { '@id': 'https://www.reifexa.de/#org' },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate:
                        'https://www.reifexa.de/produkte?q={search_term_string}',
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />

        {/* Silktide Cookie Manager */}
        <link
          rel="stylesheet"
          href="/cookie-banner/silktide-consent-manager.min.css?v=1.0.1"
          id="silktide-consent-manager-css"
        />
        <Script
          src="/cookie-banner/silktide-consent-manager.min.js?v=1.0.1"
          strategy="afterInteractive"
          defer
        />

        {/* Safe Silktide Init */}
        <Script id="silktide-init" strategy="afterInteractive">
          {`
            (function initSilktide() {
              function setupSilktide() {
                if (typeof window.silktideCookieBannerManager === 'undefined') {
                  return false;
                }

                window.silktideCookieBannerManager.updateCookieBannerConfig({
                  background: { showBackground: true },
                  cookieIcon: { position: "bottomLeft" },
                  cookieTypes: [
                    {
                      id: "necessary",
                      name: "Notwendig",
                      description: "<p>Für die Funktionalität der Website sind unbedingt erforderliche Cookies erforderlich.</p>",
                      required: true
                    },
                    {
                      id: "analytics",
                      name: "Analyse",
                      description: "<p>Hilft uns zu verstehen, wie Besucher die Website nutzen.</p>",
                      defaultValue: true,
                      onAccept: function() {
                        if (typeof gtag === 'function') {
                          gtag('consent', 'update', { analytics_storage: 'granted' });
                          dataLayer.push({ event: 'consent_accepted_analytics' });
                        }
                      },
                      onReject: function() {
                        if (typeof gtag === 'function') {
                          gtag('consent', 'update', { analytics_storage: 'denied' });
                        }
                      }
                    },
                    {
                      id: "advertising",
                      name: "Werbung",
                      description: "<p>Ermöglicht Personalisierung und Werbung.</p>",
                      onAccept: function() {
                        if (typeof gtag === 'function') {
                          gtag('consent', 'update', {
                            ad_storage: 'granted',
                            ad_user_data: 'granted',
                            ad_personalization: 'granted',
                          });
                          dataLayer.push({ event: 'consent_accepted_advertising' });
                        }
                      },
                      onReject: function() {
                        if (typeof gtag === 'function') {
                          gtag('consent', 'update', {
                            ad_storage: 'denied',
                            ad_user_data: 'denied',
                            ad_personalization: 'denied',
                          });
                        }
                      }
                    }
                  ],
                  text: {
                    banner: {
                      description: "<p>Hiermit informieren wir Sie darüber, dass auf dieser Website Cookies verwendet werden. <a href='/cookie-policy' target='_blank'>Cookie-Richtlinie</a></p>",
                      acceptAllButtonText: "Alle akzeptieren",
                      rejectNonEssentialButtonText: "Alle ablehnen",
                      preferencesButtonText: "Einstellungen"
                    },
                    preferences: {
                      title: "Passen Sie Ihre Cookie-Einstellungen an",
                      description: "<p>Wählen Sie aus, welche Cookies Sie zulassen möchten.</p>"
                    }
                  }
                });
                return true;
              }

              // Check every 100ms until script is ready
              const interval = setInterval(() => {
                if (setupSilktide()) clearInterval(interval);
              }, 100);
            })();
          `}
        </Script>
      </head>

      <body className="angelpage-body-wrapper-area">
        <main className="angelpage-main-wrapper">
          <ClientProviders>
            {/* <Suspense
              fallback={<Loading />}
            > */}
            <Header />
            {children}
            <Footer />
            {/* </Suspense> */}
          </ClientProviders>
        </main>
        <script src="https://www.dwin2.com/pub.2614230.min.js"></script>
      </body>
    </html>
  );
}
