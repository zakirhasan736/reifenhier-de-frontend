import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LandingPage from '@/components/seo/LandingPage';
import { SITE_URL } from '@/libs/seo/site';
import { brandPath, brandSlug, euro, MIN_LANDING_PRODUCTS, SEASONS, seasonForCategory, sizeLabel, sizePath } from '@/libs/seo/landing';
import { fetchLandingProducts, fetchLandings } from '@/libs/seo/landingData';
import { brandFaqs, brandIntro } from '@/libs/seo/landingCopy';

export const revalidate = 1800;

type Params = { params: Promise<{ brand: string }> };

async function resolveBrand(slug: string) {
  const landings = await fetchLandings();
  const brand = landings.brands.find(b => brandSlug(b.name) === slug);
  return { brand, landings };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { brand: slug } = await params;
  const { brand } = await resolveBrand(slug);
  if (!brand) return { robots: { index: false } };
  const url = `${SITE_URL}${brandPath(brand.name)}`;
  const title = `${brand.name} Reifen günstig${brand.minPrice ? ` ab ${euro(brand.minPrice)} €` : ''} – Preisvergleich | Reifexa`;
  const description = `${brand.count.toLocaleString('de-DE')} ${brand.name} Reifen im Preisvergleich: Sommer-, Winter- und Ganzjahresreifen${
    brand.minPrice ? ` ab ${euro(brand.minPrice)} €` : ''
  }. EU-Label vergleichen und beim günstigsten Shop kaufen.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: brand.count >= MIN_LANDING_PRODUCTS, follow: true },
    openGraph: { type: 'website', locale: 'de_DE', url, siteName: 'Reifexa.de', title, description },
  };
}

export default async function BrandPage({ params }: Params) {
  const { brand: slug } = await params;
  const { brand, landings } = await resolveBrand(slug);
  if (!brand) notFound();

  const { total, products } = await fetchLandingProducts({ brand: brand.name }, 24);
  if (!total) notFound();

  const sizes = landings.brandSizes
    .filter(b => b.brand === brand.name)
    .sort((a, b) => b.count - a.count);
  const seasons = Array.from(
    new Set(products.map(p => seasonForCategory(p.merchant_product_third_category)?.label).filter(Boolean) as string[])
  );
  const otherBrands = landings.brands.filter(b => b.name !== brand.name).slice(0, 20);
  const min = products[0]?.cheapest_offer || brand.minPrice;

  return (
    <LandingPage
      path={brandPath(brand.name)}
      h1={`${brand.name} Reifen im Preisvergleich`}
      intro={brandIntro(brand.name, total, min, sizes.map(s => sizeLabel(s)), seasons)}
      products={products}
      total={total}
      moreHref={`/produkte?brand=${encodeURIComponent(brand.name)}`}
      crumbs={[
        { name: 'Startseite', url: `${SITE_URL}/` },
        { name: 'Reifenmarken', url: `${SITE_URL}/marken` },
        { name: `${brand.name} Reifen`, url: `${SITE_URL}${brandPath(brand.name)}` },
      ]}
      faqs={brandFaqs(brand.name, total, min)}
      linkGroups={[
        {
          title: `${brand.name} Reifen nach Größe`,
          links: sizes.slice(0, 30).map(s => ({ href: sizePath(s), label: sizeLabel(s), note: String(s.count) })),
        },
        { title: 'Nach Saison', links: SEASONS.map(s => ({ href: `/${s.slug}`, label: s.label })) },
        { title: 'Weitere Reifenmarken', links: otherBrands.map(b => ({ href: brandPath(b.name), label: b.name })) },
      ]}
    />
  );
}
