import type { Metadata } from "next";
import type { Viewport } from 'next';
import "./globals.css";
import ClientProviders from '@/utils/Provider';
import Head from 'next/head';
import { Poppins } from 'next/font/google';

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <body className="angelpage-body-wrapper-area">
        <main className="angelpage-main-wrapper">
          <ClientProviders>{children}</ClientProviders>
        </main>
      </body>
    </html>
  );
}
