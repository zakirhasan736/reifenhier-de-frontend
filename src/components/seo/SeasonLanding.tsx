import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LandingPage from '@/components/seo/LandingPage';
import { SITE_URL } from '@/libs/seo/site';
import { brandPath, euro, SEASONS, seasonBySlug, sizeLabel, sizePath, type SeasonSlug } from '@/libs/seo/landing';
import { fetchLandingProducts, fetchLandings } from '@/libs/seo/landingData';
import { SEASON_COPY } from '@/libs/seo/landingCopy';

export async function seasonMetadata(slug: SeasonSlug): Promise<Metadata> {
  const season = seasonBySlug(slug)!;
  const { total, products } = await fetchLandingProducts({ kategorie: season.category }, 1);
  const min = products[0]?.cheapest_offer;
  const url = `${SITE_URL}/${slug}`;
  const title = `${season.label} günstig kaufen${min ? ` ab ${euro(min)} €` : ''} – Preisvergleich | Reifexa`;
  const description = `${total.toLocaleString('de-DE')} ${season.label} im Preisvergleich${
    min ? ` ab ${euro(min)} €` : ''
  }: Marken- und Budgetreifen, EU-Label und Preise mehrerer Online-Shops vergleichen.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: total > 0, follow: true },
    openGraph: { type: 'website', locale: 'de_DE', url, siteName: 'Reifexa.de', title, description },
  };
}

export default async function SeasonLanding({ slug }: { slug: SeasonSlug }) {
  const season = seasonBySlug(slug);
  if (!season) notFound();
  const copy = SEASON_COPY[slug];
  const [{ total, products }, landings] = await Promise.all([
    fetchLandingProducts({ kategorie: season.category }, 24),
    fetchLandings(),
  ]);
  if (!total) notFound();
  const min = products[0]?.cheapest_offer || 0;

  return (
    <LandingPage
      path={`/${slug}`}
      h1={`${season.label} im Preisvergleich`}
      intro={copy.intro(total, min)}
      products={products}
      total={total}
      moreHref={`/produkte?kategorie=${encodeURIComponent(season.category)}`}
      crumbs={[
        { name: 'Startseite', url: `${SITE_URL}/` },
        { name: season.label, url: `${SITE_URL}/${slug}` },
      ]}
      faqs={copy.faqs(min)}
      linkGroups={[
        {
          title: `${season.label} nach Größe`,
          links: landings.sizes.slice(0, 30).map(s => ({ href: sizePath(s), label: sizeLabel(s) })),
        },
        {
          title: `${season.label} nach Marke`,
          links: landings.brands.slice(0, 24).map(b => ({ href: brandPath(b.name), label: b.name })),
        },
        {
          title: 'Weitere Reifenarten',
          links: SEASONS.filter(s => s.slug !== slug).map(s => ({ href: `/${s.slug}`, label: s.label })),
        },
      ]}
    />
  );
}
