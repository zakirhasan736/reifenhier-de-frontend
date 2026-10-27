import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import LandingPage from '@/components/seo/LandingPage';
import { SITE_URL } from '@/libs/seo/site';
import {
  brandPath,
  euro,
  MIN_LANDING_PRODUCTS,
  parseSizeSlug,
  SEASONS,
  seasonForCategory,
  sizeLabel,
  sizePath,
  sizeSlug,
} from '@/libs/seo/landing';
import { fetchLandingProducts, fetchLandings } from '@/libs/seo/landingData';
import { sizeFaqs, sizeIntro } from '@/libs/seo/landingCopy';

export const revalidate = 1800;

type Params = { params: Promise<{ size: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { size: raw } = await params;
  const size = parseSizeSlug(raw);
  if (!size) return { robots: { index: false } };
  const label = sizeLabel(size);
  const { total, products } = await fetchLandingProducts({
    width: size.width,
    height: size.height,
    diameter: size.diameter,
  }, 1);
  const min = products[0]?.cheapest_offer;
  const url = `${SITE_URL}${sizePath(size)}`;
  const title = `${label} Reifen günstig${min ? ` ab ${euro(min)} €` : ''} – Preisvergleich | Reifexa`;
  const description = `${label} Reifen im Preisvergleich: ${total.toLocaleString('de-DE')} Sommer-, Winter- und Ganzjahresreifen${
    min ? ` ab ${euro(min)} €` : ''
  }. Preise mehrerer Shops vergleichen und günstig kaufen.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: total >= MIN_LANDING_PRODUCTS, follow: true },
    openGraph: { type: 'website', locale: 'de_DE', url, siteName: 'Reifexa.de', title, description },
  };
}

export default async function SizePage({ params }: Params) {
  const { size: raw } = await params;
  const size = parseSizeSlug(raw);
  if (!size) notFound();
  // canonical form (e.g. /reifen/205-55-16 → /reifen/205-55-r16); case is handled in middleware
  if (raw.toLowerCase() !== sizeSlug(size)) permanentRedirect(sizePath(size));

  const [{ total, products }, landings] = await Promise.all([
    fetchLandingProducts({ width: size.width, height: size.height, diameter: size.diameter }, 24),
    fetchLandings(),
  ]);
  if (!total) notFound();

  const label = sizeLabel(size);
  const min = products[0]?.cheapest_offer || 0;
  const brandsHere = landings.brandSizes
    .filter(b => b.width === size.width && b.height === size.height && b.diameter === size.diameter)
    .sort((a, b) => b.count - a.count);
  const seasonsHere = Array.from(
    new Set(products.map(p => seasonForCategory(p.merchant_product_third_category)?.label).filter(Boolean) as string[])
  );
  const sameRim = landings.sizes
    .filter(s => s.diameter === size.diameter && sizeSlug(s) !== sizeSlug(size))
    .slice(0, 16);
  const popular = landings.sizes.filter(s => sizeSlug(s) !== sizeSlug(size)).slice(0, 12);

  return (
    <LandingPage
      path={sizePath(size)}
      h1={`${label} Reifen im Preisvergleich`}
      intro={sizeIntro(size, total, min, brandsHere.map(b => b.brand), seasonsHere)}
      products={products}
      total={total}
      moreHref={`/produkte?width=${size.width}&height=${size.height}&diameter=${size.diameter}`}
      crumbs={[
        { name: 'Startseite', url: `${SITE_URL}/` },
        { name: 'Reifengrößen', url: `${SITE_URL}/reifen` },
        { name: `${label} Reifen`, url: `${SITE_URL}${sizePath(size)}` },
      ]}
      faqs={sizeFaqs(size, total, min, products[0] ? `${products[0].brand_name} ${products[0].product_name}` : undefined)}
      linkGroups={[
        {
          title: `Marken in ${label}`,
          links: brandsHere.slice(0, 20).map(b => ({ href: brandPath(b.brand), label: `${b.brand} Reifen`, note: String(b.count) })),
        },
        {
          title: `${label} nach Saison`,
          links: SEASONS.map(s => ({ href: `/${s.slug}`, label: s.label })),
        },
        {
          title: `Weitere ${size.diameter}-Zoll-Größen`,
          links: sameRim.map(s => ({ href: sizePath(s), label: sizeLabel(s), note: String(s.count) })),
        },
        {
          title: 'Beliebte Reifengrößen',
          links: popular.map(s => ({ href: sizePath(s), label: sizeLabel(s) })),
        },
      ]}
    />
  );
}
