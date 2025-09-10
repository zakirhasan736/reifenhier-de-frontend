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
  title: 'Reifenpreisvergleich: Finden Sie die günstigsten Reifen',
  description:
    'Entdecken Sie Reifenhier.de für den besten Reifenpreisvergleich. Informieren Sie sich über Angebote und sparen Sie Geld beim Kauf.',
  icons: { icon: '/images/favicon.png', apple: '/images/favicon.png' },
  openGraph: {
    title: 'Reifenpreisvergleich: Finden Sie die günstigsten Reifen',
    description:
      'Entdecken Sie Reifenhier.de für den besten Reifenpreisvergleich. Informieren Sie sich über Angebote und sparen Sie Geld beim Kauf.',
    url: 'https://reifenhier.de',
    siteName: 'Reifenhier.de',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Reifenpreisvergleich bei Reifenhier.de',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
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
