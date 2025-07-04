import type { Metadata } from "next";
import "./globals.css";
import '@/styles/styles.css';
import ClientProviders from '@/utils/Provider';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
  icons: {
    icon: '/images/favicon_reifenhier_transparent-270x270.png',
    apple: '/images/favicon_reifenhier_transparent-270x270.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <Head>
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
