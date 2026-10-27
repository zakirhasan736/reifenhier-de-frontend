import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_URL } from '@/libs/seo/site';
import { euro, sizeLabel, sizePath } from '@/libs/seo/landing';
import { fetchLandings } from '@/libs/seo/landingData';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: { absolute: 'Reifengrößen A–Z: Reifen nach Größe vergleichen | Reifexa' },
  description:
    'Alle Reifengrößen im Preisvergleich – von 13 bis 22 Zoll. Größe wählen und Sommer-, Winter- oder Ganzjahresreifen beim günstigsten Händler kaufen.',
  alternates: { canonical: `${SITE_URL}/reifen` },
};

export default async function SizesIndex() {
  const { sizes } = await fetchLandings();
  const byRim = new Map<string, typeof sizes>();
  for (const s of sizes) {
    if (!byRim.has(s.diameter)) byRim.set(s.diameter, []);
    byRim.get(s.diameter)!.push(s);
  }
  const rims = [...byRim.keys()].sort((a, b) => Number(a) - Number(b));
  const crumbs = [
    { name: 'Startseite', url: `${SITE_URL}/` },
    { name: 'Reifengrößen', url: `${SITE_URL}/reifen` },
  ];
  return (
    <div className="pb-16">
      <Breadcrumbs crumbs={crumbs} />
      <section className="custom-container pt-2">
        <h1 className="text-[26px] md:text-[34px] font-semibold text-[#16171A]">Reifen nach Größe</h1>
        <p className="mt-3 max-w-3xl text-[16px] leading-[160%] text-[#404042]">
          {sizes.length.toLocaleString('de-DE')} Reifengrößen im Preisvergleich. Ihre Größe finden Sie auf der
          Reifenflanke (z. B. 205/55 R16) oder in der Zulassungsbescheinigung Teil I.
        </p>
        {rims.map(rim => (
          <section key={rim} className="mt-8">
            <h2 className="text-[20px] font-semibold text-[#16171A] mb-3">{rim} Zoll Reifen</h2>
            <ul className="flex flex-wrap gap-2">
              {byRim
                .get(rim)!
                .sort((a, b) => Number(a.width) - Number(b.width) || Number(a.height) - Number(b.height))
                .map(s => (
                  <li key={sizePath(s)}>
                    <Link
                      href={sizePath(s)}
                      className="inline-flex gap-1 rounded-full border border-[#E4E5EA] bg-white px-3 py-1.5 text-[14px] text-[#16171A] hover:border-primary-100 hover:text-primary-100"
                    >
                      {sizeLabel(s)}
                      <span className="text-[12px] text-[#9AA0A8]">ab {euro(s.minPrice)} €</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
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
