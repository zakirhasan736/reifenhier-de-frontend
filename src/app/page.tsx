import HomePageMain from "@/page-components/Home/HomePage";
import { Metadata } from "next";
import { SITE_KEYWORDS, SITE_URL } from "@/libs/seo/site";
import JsonLd from '@/components/seo/JsonLd';
import PopularLinks from '@/components/seo/PopularLinks';
import { ArrowRight, Scale } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 1800;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Reifen günstig vergleichen & kaufen | Reifexa',
  description:
    'Finden Sie günstige Reifenangebote auf Reifexa.de. Vergleichen Sie Sommerreifen, Winterreifen und Ganzjahresreifen nach Größe, Marke und Preis.',
  alternates: { canonical: `${SITE_URL}/` },
  keywords: [
    ...SITE_KEYWORDS,
    'Winterreifen 205/55 R16',
    'Sommerreifen 225/45 R17',
    'Ganzjahresreifen 205/55 R16',
    'Reifen Händler vergleichen',
    'günstigste Reifen Angebote 2026',
    'Reifen Test 2026',
    'EU Reifenlabel erklärt',
    'Markenreifen online vergleichen',
    'Reifen Angebote Deutschland',
    'Billige Winterreifen',
    'Billige Sommerreifen',
    'Billige Ganzjahresreifen',
    'Winterreifenpflicht Deutschland',
    'Reifen für SUV',
    'Kompletträder Angebote',
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
      <PopularLinks />
      <section className="custom-container py-12 md:py-16" aria-labelledby="vergleich-ratgeber-title">
        <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8 rounded-[20px] border border-[#E9ECF3] bg-mono-0 p-6 md:p-8">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#EEF2FF] text-primary-100">
            <Scale size={24} strokeWidth={2} />
          </span>
          <div className="flex-1">
            <h2 id="vergleich-ratgeber-title" className="text-[20px] md:text-[24px] font-semibold text-[#16171A] mb-2">Reifenpreise vergleichen: transparent und einfach</h2>
            <p className="md:!text-[16px] !text-[14px] text-[#6B6E76]">Vergleichen Sie verfügbare Angebote nach Reifengröße, Marke und Saison. Prüfen Sie vor dem Kauf auch Versandkosten, Lieferzeit und das EU-Reifenlabel. Der Kauf erfolgt beim jeweiligen Händler; Preise und Verfügbarkeit können sich ändern.</p>
          </div>
          <Link href="/reifenpreisvergleich" className="inline-flex shrink-0 items-center gap-2 self-start md:self-auto rounded-[10px] bg-primary-100 px-5 py-3 text-[14px] font-semibold text-mono-0 hover:opacity-90 transition">
            So funktioniert der Reifenpreisvergleich
            <ArrowRight size={16} strokeWidth={2.4} />
          </Link>
        </div>
      </section>
      {/* JSON-LD: homepage WebPage (Organization + WebSite come from the layout) */}
      <JsonLd id="ld-home-webpage" data={{
            '@context': 'https://schema.org',
            '@graph': [
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
            ],
          }} />
    </div>
  );
}
