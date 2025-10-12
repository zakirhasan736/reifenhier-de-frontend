import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from '@/utils/Provider';
import Script from 'next/script';
import { Poppins } from 'next/font/google';
import Header from '@/components/shared/header/Header';
import Footer from '@/components/shared/footer/Footer';

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
    'reifencheck',
    'reifen',
    'check',
    'best reifen',
    'top reifen',
    'best selling reifen',

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
    'Geräusch Werte Reifen Vergleich',
    'Winterreifenpflicht Deutschland',
    'Sommerreifen Ratgeber',
    'Reifen Versandkosten vergleichen',
    'Reifen Bewertungen',
    'Reifen für SUV Modelle',
    'Ganzjahresreifen Vorteil Nachteil',
    'Leise Reifen Geräuschwert',
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
          src="https://www.googletagmanager.com/gtag/js?id=G-EB4TB5RNER"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EB4TB5RNER');
          `}
        </Script>

        {/* JSON-LD basic org data */}
        <Script
          id="ld-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Reifencheck.de',
              url: 'https://reifencheck.de/',
              logo: 'https://reifencheck.de/images/logo.png',
            }),
          }}
        />

        {/* Silktide Cookie Manager */}
        <link
          rel="stylesheet"
          href="/cookie-banner/silktide-consent-manager.css"
          id="silktide-consent-manager-css"
        />
        <Script
          src="/cookie-banner/silktide-consent-manager.js"
          strategy="afterInteractive"
        />

        {/* Safe Silktide Init + Conditional Clarity */}
        <Script id="silktide-init" strategy="afterInteractive">
          {`
            (function initSilktide() {
              function loadClarity() {
                if (window.__clarityLoaded) return; // prevent duplicate loads
                window.__clarityLoaded = true;
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "synxux4l9y");
              }

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
                      name: "Necessary",
                      description: "<p>Essential cookies needed for site functionality.</p>",
                      required: true
                    },
                    {
                      id: "analytics",
                      name: "Analytics",
                      description: "<p>Helps us understand how visitors use the website.</p>",
                      defaultValue: true,
                      onAccept: function() {
                        if (typeof gtag === 'function') {
                          gtag('consent', 'update', { analytics_storage: 'granted' });
                          dataLayer.push({ event: 'consent_accepted_analytics' });
                        }
                        loadClarity(); // load Clarity when analytics is accepted
                      },
                      onReject: function() {
                        if (typeof gtag === 'function') {
                          gtag('consent', 'update', { analytics_storage: 'denied' });
                        }
                      }
                    },
                    {
                      id: "advertising",
                      name: "Advertising",
                      description: "<p>Enables personalization and ads.</p>",
                      onAccept: function() {
                        if (typeof gtag === 'function') {
                          gtag('consent', 'update', {
                            ad_storage: 'granted',
                            ad_user_data: 'granted',
                            ad_personalization: 'granted',
                          });
                          dataLayer.push({ event: 'consent_accepted_advertising' });
                        }
                        loadClarity(); // also load Clarity when advertising is accepted
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
                      description: "<p>We use cookies to improve your experience. <a href='/cookie-policy' target='_blank'>Cookie Policy</a></p>",
                      acceptAllButtonText: "Accept all",
                      rejectNonEssentialButtonText: "Reject non-essential",
                      preferencesButtonText: "Preferences"
                    },
                    preferences: {
                      title: "Customize your cookie preferences",
                      description: "<p>Choose which cookies you want to allow.</p>"
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
          <ClientProviders>
            <Header />
            {children}
            <Footer />
          </ClientProviders>
        </main>
      </body>
    </html>
  );
}
