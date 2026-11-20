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
  title: { absolute: 'Reifenpreisvergleich: Reifen günstig vergleichen & kaufen | Reifexa' },
  description:
    'Reifenpreisvergleich für Deutschland: Sommer-, Winter- und Ganzjahresreifen nach Größe und Marke vergleichen – Händlerpreise inkl. Versand, Preisverlauf und Preisalarm.',
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
    'Reifen Vergleichsportal',
    'Reifencheck',
  ],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: `${SITE_URL}/`,
    siteName: 'Reifexa.de',
    title: 'Reifenpreisvergleich – Reifen günstig vergleichen & kaufen | Reifexa.de',
    description:
      'Händlerpreise inkl. Versand, Preisverlauf und Preisalarm: Sommer-, Winter- und Ganzjahresreifen im unabhängigen Reifenpreisvergleich.',
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
    title: 'Reifenpreisvergleich – Reifen günstig vergleichen & kaufen | Reifexa.de',
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
            <p className="mt-3 md:!text-[15px] !text-[14px] text-[#6B6E76]">
              Ratgeber:{' '}
              <Link href="/artikel/reifenpreisvergleich-reifen-vergleichsportal-2026" className="text-primary-100 underline underline-offset-2">Das beste Reifen-Vergleichsportal finden</Link>
              {' · '}
              <Link href="/artikel/reifencheck-2026-reifen-selbst-pruefen-checkliste" className="text-primary-100 underline underline-offset-2">Reifencheck: Reifen in 5 Minuten selbst prüfen</Link>
            </p>
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
                name: 'Reifenpreisvergleich: Reifen günstig vergleichen & kaufen | Reifexa',
                isPartOf: { '@id': `${SITE_URL}/#website` },
                about: { '@id': `${SITE_URL}/#org` },
                inLanguage: 'de-DE',
                description:
                  'Reifenpreisvergleich für Deutschland: Sommer-, Winter- und Ganzjahresreifen nach Größe und Marke vergleichen – Händlerpreise inkl. Versand, Preisverlauf und Preisalarm.',
              },
            ],
          }} />
    </div>
  );
}
