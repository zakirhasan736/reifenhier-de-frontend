import LiveTraffic from '@/components/live-traffic/LiveTraffic';
import HomePageMain from "@/page-components/Home/HomePage";
import { Metadata } from "next";
import { SITE_KEYWORDS, SITE_URL } from "@/libs/seo/site";
import { HOME_KEYWORDS } from "@/libs/seo/keywords";
import JsonLd from '@/components/seo/JsonLd';
import PopularLinks from '@/components/seo/PopularLinks';
import { ArrowRight, BookOpen, Ruler, Scale, ShoppingBag, Truck } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 1800;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: 'Reifenpreisvergleich: Reifen günstig vergleichen | Reifexa' },
  description:
    'Reifenpreisvergleich für Deutschland: Sommer-, Winter- und Ganzjahresreifen nach Größe und Marke vergleichen – Händlerpreise inkl. Versand, Preisverlauf und Preisalarm.',
  alternates: { canonical: `${SITE_URL}/` },
  keywords: [...HOME_KEYWORDS, ...SITE_KEYWORDS.slice(0, 20)],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: `${SITE_URL}/`,
    siteName: 'Reifexa.de',
    title: 'Reifenpreisvergleich: Reifen günstig vergleichen | Reifexa',
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
    title: 'Reifenpreisvergleich: Reifen günstig vergleichen | Reifexa',
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
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0B1437] via-[#1B2A6B] to-[#2F4FD8] p-6 sm:p-8 md:p-12">
          <span className="pointer-events-none absolute -right-28 -top-28 h-[380px] w-[380px] rounded-full border-[44px] border-white/5" aria-hidden />
          <span className="pointer-events-none absolute -bottom-20 right-1/3 h-[200px] w-[200px] rounded-full border-[24px] border-white/5" aria-hidden />
          <div className="relative grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center">
            <div>
              <span className="sl-white inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em] ring-1 ring-white/20">
                <Scale size={14} /> Reifenpreisvergleich
              </span>
              <h2 id="vergleich-ratgeber-title" className="sl-white mt-4 text-[26px] font-bold leading-[118%] tracking-[-0.01em] md:text-[36px]">
                Reifenpreise vergleichen: transparent und einfach
              </h2>
              <p className="sl-white mt-4 max-w-[620px] !text-[15px] !leading-[165%] !tracking-normal opacity-85 md:!text-[16px]">
                Vergleichen Sie verfügbare Angebote nach Reifengröße, Marke und Saison. Prüfen Sie vor dem Kauf auch Versandkosten, Lieferzeit und das EU-Reifenlabel. Der Kauf erfolgt beim jeweiligen Händler; Preise und Verfügbarkeit können sich ändern.
              </p>
              <ol className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: <Ruler size={18} />, t: 'Größe wählen', d: 'z. B. 205/55 R16' },
                  { icon: <Truck size={18} />, t: 'Gesamtpreis prüfen', d: 'inkl. Versand & Label' },
                  { icon: <ShoppingBag size={18} />, t: 'Beim Händler kaufen', d: 'direkt im Shop' },
                ].map((st, i) => (
                  <li key={st.t} className="sl-white flex items-center gap-3 rounded-[16px] bg-white/[0.07] p-3.5 ring-1 ring-white/15 sm:flex-col sm:items-start">
                    <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white/15">
                      {st.icon}
                      <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#4ADE80] text-[11px] font-bold !text-[#0B1437]">{i + 1}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-semibold">{st.t}</span>
                      <span className="block text-[12px] opacity-70">{st.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/reifenpreisvergleich" className="group inline-flex items-center justify-between gap-3 rounded-[18px] bg-white px-6 py-5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-0.5">
                <span>
                  <span className="block text-[12px] font-bold uppercase tracking-[0.1em] !text-[#2F4FD8]">Schritt für Schritt</span>
                  <span className="mt-0.5 block text-[17px] font-bold !text-[#16171A]">So funktioniert der Reifenpreisvergleich</span>
                </span>
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1B2A6B] to-[#2F4FD8] transition-transform group-hover:translate-x-1">
                  <ArrowRight size={18} strokeWidth={2.4} color="#fff" />
                </span>
              </Link>
              <p className="sl-white mt-2 px-1 text-[12px] font-bold uppercase tracking-[0.12em] opacity-60">Ratgeber</p>
              {[
                ['/artikel/reifenpreisvergleich-reifen-vergleichsportal-2026', 'Das beste Reifen-Vergleichsportal finden'],
                ['/artikel/reifencheck-2026-reifen-selbst-pruefen-checkliste', 'Reifencheck: Reifen in 5 Minuten selbst prüfen'],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="sl-white group flex items-center gap-3 rounded-[16px] bg-white/[0.07] px-4 py-3.5 ring-1 ring-white/15 transition-colors hover:bg-white/[0.12]">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white/15">
                    <BookOpen size={16} />
                  </span>
                  <span className="flex-1 text-[14px] font-medium">{label}</span>
                  <ArrowRight size={16} className="opacity-70 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <LiveTraffic />
      {/* JSON-LD: homepage WebPage (Organization + WebSite come from the layout) */}
      <JsonLd id="ld-home-webpage" data={{
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebPage',
                '@id': `${SITE_URL}/#webpage`,
                url: `${SITE_URL}/`,
                name: 'Reifenpreisvergleich: Reifen günstig vergleichen | Reifexa',
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
