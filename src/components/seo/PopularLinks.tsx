import Link from 'next/link';
import { brandPath, euro, SEASONS, sizeLabel, sizePath } from '@/libs/seo/landing';
import { fetchLandings } from '@/libs/seo/landingData';

/**
 * Crawlable hub of the most-searched sizes, brands and seasons. Links from
 * the homepage are what make Google discover and rank the landing pages.
 */
export default async function PopularLinks() {
  const { sizes, brands } = await fetchLandings();
  if (!sizes.length && !brands.length) return null;
  const chip =
    'inline-flex items-center gap-1 rounded-full border border-[#E4E5EA] bg-white px-3 py-1.5 text-[14px] text-[#16171A] hover:border-primary-100 hover:text-primary-100';
  return (
    <section className="custom-container py-12" aria-labelledby="beliebt-title">
      <h2 id="beliebt-title" className="text-[22px] md:text-[28px] font-semibold text-[#16171A]">
        Beliebte Reifengrößen und Marken
      </h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {SEASONS.map(s => (
          <Link key={s.slug} href={`/${s.slug}`} className={`${chip} font-semibold`}>
            {s.label}
          </Link>
        ))}
      </div>
      {sizes.length ? (
        <>
          <h3 className="mt-6 mb-2 text-[16px] font-semibold text-[#404042]">Reifen nach Größe</h3>
          <ul className="flex flex-wrap gap-2">
            {sizes.slice(0, 24).map(s => (
              <li key={sizePath(s)}>
                <Link href={sizePath(s)} className={chip}>
                  {sizeLabel(s)}
                  {s.minPrice ? <span className="text-[12px] text-[#9AA0A8]">ab {euro(s.minPrice)} €</span> : null}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/reifen" className={`${chip} text-primary-100`}>
                Alle Größen ›
              </Link>
            </li>
          </ul>
        </>
      ) : null}
      {brands.length ? (
        <>
          <h3 className="mt-6 mb-2 text-[16px] font-semibold text-[#404042]">Reifen nach Marke</h3>
          <ul className="flex flex-wrap gap-2">
            {brands.slice(0, 20).map(b => (
              <li key={b.name}>
                <Link href={brandPath(b.name)} className={chip}>
                  {b.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/marken" className={`${chip} text-primary-100`}>
                Alle Marken ›
              </Link>
            </li>
          </ul>
        </>
      ) : null}
    </section>
  );
}
