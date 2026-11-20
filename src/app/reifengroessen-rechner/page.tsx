import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import TyreSizeCompare from '@/components/seo/TyreSizeCompare';
import { tyreGeometry, type SizeInput } from '@/libs/seo/tyreGeometry';
import { SITE_URL } from '@/libs/seo/site';
import { MIN_LANDING_PRODUCTS, sizeLabel, sizePath, sizeSlug } from '@/libs/seo/landing';
import { fetchLandings } from '@/libs/seo/landingData';
import { SIZE_TOOL_KEYWORDS, uniqKeywords } from '@/libs/seo/keywords';

export const revalidate = 86400;

const PAGE_URL = `${SITE_URL}/reifengroessen-rechner`;
const TITLE = 'Reifengrößenrechner: Reifengrößen nebeneinander vergleichen | Reifexa';
const DESCRIPTION =
  'Zwei Reifengrößen nebeneinander vergleichen: Durchmesser, Abrollumfang, Flankenhöhe und Tachoabweichung – mit maßstabsgetreuer Grafik. Kostenlos, ohne Anmeldung.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  keywords: uniqKeywords([
    ...SIZE_TOOL_KEYWORDS,
    'Reifengrößen Vergleich nebeneinander',
    'Reifenvergleich Größe',
    'Tachoabweichung Reifen berechnen',
    'Reifen Umrüstung Rechner',
    'Kompletträder Größe vergleichen',
    '205/55 R16 vs 225/45 R17',
    'Reifenpreisvergleich',
    'Reifexa',
  ]),
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: PAGE_URL,
    siteName: 'Reifexa.de',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${SITE_URL}/images/banner-og-image.png`, width: 1230, height: 613, alt: 'Reifengrößenrechner' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/images/banner-og-image.png`] },
};

/** Common upsize/downsize pairs (same rolling circumference family). */
const PAIRS: Array<[SizeInput, SizeInput]> = [
  [{ width: 205, height: 55, diameter: 16 }, { width: 225, height: 45, diameter: 17 }],
  [{ width: 195, height: 65, diameter: 15 }, { width: 205, height: 55, diameter: 16 }],
  [{ width: 225, height: 45, diameter: 17 }, { width: 225, height: 40, diameter: 18 }],
  [{ width: 205, height: 60, diameter: 16 }, { width: 215, height: 55, diameter: 17 }],
  [{ width: 215, height: 55, diameter: 17 }, { width: 225, height: 50, diameter: 17 }],
  [{ width: 225, height: 45, diameter: 17 }, { width: 245, height: 40, diameter: 18 }],
  [{ width: 185, height: 65, diameter: 15 }, { width: 195, height: 55, diameter: 16 }],
  [{ width: 235, height: 55, diameter: 18 }, { width: 235, height: 50, diameter: 19 }],
];

const FAQS = [
  {
    q: 'Wie rechnet der Reifengrößenrechner?',
    a: 'Flankenhöhe = Breite × Querschnitt ÷ 100. Gesamtdurchmesser = Felge in Zoll × 25,4 mm + 2 × Flankenhöhe. Abrollumfang = Durchmesser × π. Aus dem Verhältnis der Abrollumfänge ergibt sich die Tachoabweichung.',
  },
  {
    q: 'Welche Abweichung beim Abrollumfang ist erlaubt?',
    a: 'Als Faustregel gelten Alternativgrößen mit bis zu etwa 2 % Abweichung als unkritisch. Verbindlich ist aber nur, was in der Zulassungsbescheinigung, im COC-Papier oder in einer Freigabe des Fahrzeug- bzw. Felgenherstellers steht.',
  },
  {
    q: 'Was bedeutet 205/55 R16?',
    a: '205 ist die Reifenbreite in Millimetern, 55 der Querschnitt (Flankenhöhe in Prozent der Breite), R steht für Radialbauweise und 16 für den Felgendurchmesser in Zoll.',
  },
  {
    q: 'Zeigt der Tacho mit größeren Reifen weniger an?',
    a: 'Ja. Hat die neue Größe einen größeren Abrollumfang, fahren Sie bei gleicher Tachoanzeige etwas schneller. Der Rechner zeigt die tatsächliche Geschwindigkeit bei 100 km/h laut Tacho.',
  },
];

const nf = (n: number, d = 0) => n.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });

export default async function ReifengroessenRechnerPage() {
  const { sizes } = await fetchLandings();
  const indexable = new Set(
    sizes.filter(s => s.count >= MIN_LANDING_PRODUCTS).map(s => sizeSlug(s))
  );
  const asText = (s: SizeInput) => ({ width: String(s.width), height: String(s.height), diameter: String(s.diameter) });
  const sizeLink = (s: SizeInput) => {
    const t = asText(s);
    return indexable.has(sizeSlug(t)) ? (
      <Link href={sizePath(t)} className="text-primary-100 hover:underline">{sizeLabel(t)}</Link>
    ) : (
      <span>{sizeLabel(t)}</span>
    );
  };
  const crumbs = [
    { name: 'Startseite', url: `${SITE_URL}/` },
    { name: 'Reifengrößen', url: `${SITE_URL}/reifen` },
    { name: 'Reifengrößenrechner', url: PAGE_URL },
  ];

  return (
    <div className="pb-16">
      <Breadcrumbs crumbs={crumbs} />
      <section className="custom-container pt-2">
        <h1 className="text-[26px] md:text-[34px] font-semibold text-[#16171A]">
          Reifengrößenrechner: zwei Reifengrößen nebeneinander vergleichen
        </h1>
        <p className="mt-3 max-w-3xl text-[16px] leading-[160%] text-[#404042]">
          Wählen Sie Ihre aktuelle und eine neue Reifengröße. Der Rechner zeigt Durchmesser, Abrollumfang, Flankenhöhe
          und Tachoabweichung im direkten Vergleich – inklusive maßstabsgetreuer Seitenansicht. Ideal für Umrüstgrößen,
          Winterreifen auf kleineren Felgen oder Kompletträder.
        </p>
        <div className="mt-6">
          <TyreSizeCompare initialA={PAIRS[0][0]} initialB={PAIRS[0][1]} />
        </div>

        <h2 className="mt-12 mb-3 text-[22px] md:text-[26px] font-semibold text-[#16171A]">Beliebte Reifengrößen im Vergleich</h2>
        <div className="overflow-x-auto rounded-[16px] border border-[#E9ECF3] bg-mono-0">
          <table className="w-full min-w-[560px] text-[14px]">
            <thead>
              <tr className="text-left text-[#6B6E76] bg-[#F6F8FC]">
                <th className="px-4 py-3 font-medium">Größe A</th>
                <th className="px-4 py-3 font-medium">Größe B</th>
                <th className="px-4 py-3 font-medium">Durchmesser A / B</th>
                <th className="px-4 py-3 font-medium">Abweichung Abrollumfang</th>
              </tr>
            </thead>
            <tbody>
              {PAIRS.map(([a, b]) => {
                const ga = tyreGeometry(a);
                const gb = tyreGeometry(b);
                const d = ((gb.circumference - ga.circumference) / ga.circumference) * 100;
                return (
                  <tr key={`${sizeSlug(asText(a))}-${sizeSlug(asText(b))}`} className="border-t border-[#EEF0F5]">
                    <td className="px-4 py-3 font-medium">{sizeLink(a)}</td>
                    <td className="px-4 py-3 font-medium">{sizeLink(b)}</td>
                    <td className="px-4 py-3">{nf(ga.outer)} mm / {nf(gb.outer)} mm</td>
                    <td className="px-4 py-3 font-semibold">{d >= 0 ? '+' : ''}{nf(d, 2)} %</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13px] text-[#6B6E76]">
          Rechenwerte nach Nennmaß; reale Reifen weichen je nach Modell leicht ab. Ob eine Größe zulässig ist, steht in
          den Fahrzeugpapieren.
        </p>

        <h2 className="mt-12 mb-3 text-[22px] md:text-[26px] font-semibold text-[#16171A]">Häufige Fragen zu Reifengrößen</h2>
        <div className="space-y-5 max-w-3xl">
          {FAQS.map(f => (
            <div key={f.q}>
              <h3 className="text-[17px] md:text-[18px] leading-[140%] font-semibold text-[#16171A]">{f.q}</h3>
              <p className="mt-1 text-[15px] leading-[165%] text-[#404042]">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          <Link href="/reifen" className="rounded-full border border-[#E1E5EE] px-4 py-2 text-[14px] hover:border-primary-100 hover:text-primary-100">Alle Reifengrößen</Link>
          <Link href="/reifenpreisvergleich" className="rounded-full border border-[#E1E5EE] px-4 py-2 text-[14px] hover:border-primary-100 hover:text-primary-100">Reifenpreisvergleich</Link>
          <Link href="/winterreifen" className="rounded-full border border-[#E1E5EE] px-4 py-2 text-[14px] hover:border-primary-100 hover:text-primary-100">Winterreifen günstig</Link>
          <Link href="/sommerreifen" className="rounded-full border border-[#E1E5EE] px-4 py-2 text-[14px] hover:border-primary-100 hover:text-primary-100">Sommerreifen günstig</Link>
          <Link href="/marken" className="rounded-full border border-[#E1E5EE] px-4 py-2 text-[14px] hover:border-primary-100 hover:text-primary-100">Reifenmarken</Link>
        </div>
      </section>

      <JsonLd
        id="ld-tool"
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Reifengrößenrechner',
          url: PAGE_URL,
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web',
          inLanguage: 'de-DE',
          description: DESCRIPTION,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
          isPartOf: { '@id': `${SITE_URL}/#website` },
        }}
      />
      <JsonLd
        id="ld-faq"
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />
      <JsonLd
        id="ld-breadcrumb"
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
        }}
      />
    </div>
  );
}
