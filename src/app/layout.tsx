import type { Metadata } from "next";
import type { Viewport } from 'next';
import "./globals.css";
import ClientProviders from '@/utils/Provider';
import Head from 'next/head';
import Script from 'next/script';
import { Poppins } from 'next/font/google';
import CookiesBanner from "@/components/CookiesBanner";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // choose weights you use
  display: 'swap',
  variable: '--font-poppins', // optional: for CSS custom property usage
});
export const metadata: Metadata = {
  title: 'Reifenpreisvergleich: Finden Sie die günstigsten Reifen',
  description: 'Entdecken Sie Reifenhier.de für den besten Reifenpreisvergleich. Informieren Sie sich über Angebote und sparen Sie Geld beim Kauf.',
  icons: { icon: '/images/favicon.png', apple: '/images/favicon.png' },
};
export const viewport: Viewport = {
  themeColor: 'light',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={poppins.className}>
      <Head>
        <>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="noindex, nofollow" />

          {/* Consent Mode defaults (v2) — must run before any Google tags */}
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
          <Script
            id="gtag-src"
            src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXX', { anonymize_ip: true });
          `}
          </Script>
        </>
      </Head>
      <body className="angelpage-body-wrapper-area">
        <main className="angelpage-main-wrapper">
          <ClientProviders>{children}</ClientProviders>
          <CookiesBanner />
        </main>
      </body>
    </html>
  );
}
