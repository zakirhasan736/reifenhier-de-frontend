import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_URL } from '@/libs/seo/site';
import { brandPath, euro } from '@/libs/seo/landing';
import { fetchLandings } from '@/libs/seo/landingData';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: { absolute: 'Reifenmarken A–Z: Continental, Michelin & mehr vergleichen | Reifexa' },
  description:
    'Alle Reifenmarken im Preisvergleich – Premium-, Qualitäts- und Budgetreifen. Marke wählen und Sommer-, Winter- oder Ganzjahresreifen günstig kaufen.',
  alternates: { canonical: `${SITE_URL}/marken` },
};

export default async function BrandsIndex() {
  const { brands } = await fetchLandings();
  const sorted = [...brands].sort((a, b) => a.name.localeCompare(b.name, 'de'));
  const crumbs = [
    { name: 'Startseite', url: `${SITE_URL}/` },
    { name: 'Reifenmarken', url: `${SITE_URL}/marken` },
  ];
  return (
    <div className="pb-16">
      <Breadcrumbs crumbs={crumbs} />
      <section className="custom-container pt-2">
        <h1 className="text-[26px] md:text-[34px] font-semibold text-[#16171A]">Reifenmarken im Preisvergleich</h1>
        <p className="mt-3 max-w-3xl text-[16px] leading-[160%] text-[#404042]">
          {brands.length} Reifenhersteller im Vergleich – von Premiummarken bis zu günstigen Budgetreifen.
        </p>
        <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {sorted.map(b => (
            <li key={b.name}>
              <Link
                href={brandPath(b.name)}
                className="flex flex-col rounded-xl border border-[#E4E5EA] bg-white px-3 py-2 hover:border-primary-100"
              >
                <span className="text-[15px] font-medium text-[#16171A]">{b.name} Reifen</span>
                <span className="text-[12px] text-[#9AA0A8]">
                  {b.count.toLocaleString('de-DE')} Modelle · ab {euro(b.minPrice)} €
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
        }}
      />
    </div>
  );
}
