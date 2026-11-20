import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import LandingPage from '@/components/seo/LandingPage';
import { SITE_URL } from '@/libs/seo/site';
import { fitTitle } from '@/libs/seo/title';
import { uniqKeywords } from '@/libs/seo/keywords';
import {
  brandPath,
  brandSlug,
  displayBrand,
  euro,
  MIN_COMBO_PRODUCTS,
  parseSizeSlug,
  SEASONS,
  seasonBySlug,
  seasonForCategory,
  sizeBrandPath,
  sizeLabel,
  sizePath,
  sizeSeasonPath,
  sizeSlug,
  type TyreSize,
} from '@/libs/seo/landing';
import { fetchLandingProducts, fetchLandings, type ListProduct } from '@/libs/seo/landingData';
import { comboFaqs, comboIntro } from '@/libs/seo/landingCopy';

export const revalidate = 1800;

type Params = { params: Promise<{ size: string; sub: string }> };

/** Synonyms people type → our season slugs. */
const SEASON_ALIASES: Record<string, string> = { allwetterreifen: 'ganzjahresreifen', 'all-season': 'ganzjahresreifen' };

type Resolved =
  | { kind: 'season'; size: TyreSize; season: (typeof SEASONS)[number]; subject: string; path: string; filters: Record<string, string> }
  | { kind: 'brand'; size: TyreSize; brand: string; subject: string; path: string; filters: Record<string, string> };

async function resolve(rawSize: string, rawSub: string): Promise<Resolved | 'redirect' | null> {
  const size = parseSizeSlug(rawSize);
  if (!size) return null;
  const sub = rawSub.toLowerCase();
  const base = { width: size.width, height: size.height, diameter: size.diameter };
  const aliased = SEASON_ALIASES[sub];
  if (aliased) return 'redirect';
  const season = seasonBySlug(sub);
  if (season) {
    return { kind: 'season', size, season, subject: season.label, path: sizeSeasonPath(size, season.slug), filters: { ...base, kategorie: season.category } };
  }
  const { brands } = await fetchLandings();
  const brand = brands.find(b => brandSlug(b.name) === sub);
  if (!brand) return null;
  return { kind: 'brand', size, brand: brand.name, subject: displayBrand(brand.name), path: sizeBrandPath(size, brand.name), filters: { ...base, brand: brand.name } };
}

function indexesOf(products: ListProduct[]) {
  return Array.from(
    new Set(products.map(p => `${p.lastIndex || ''}${p.speedIndex || ''}`.trim()).filter(x => /^\d{2,3}[A-Z]{1,2}$/i.test(x)))
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { size: rs, sub: rb } = await params;
  const r = await resolve(rs, rb);
  if (!r || r === 'redirect') return { robots: { index: false } };
  const { total, products } = await fetchLandingProducts(r.filters, 12);
  const label = sizeLabel(r.size);
  const min = products[0]?.cheapest_offer;
  const url = `${SITE_URL}${r.path}`;
  const idx = indexesOf(products);
  const title =
    r.kind === 'brand'
      ? fitTitle(`${r.subject} ${label} Reifen${min ? ` ab ${euro(min)} €` : ''} – Preisvergleich`)
      : fitTitle(`${r.subject} ${label} günstig${min ? ` ab ${euro(min)} €` : ''} – Preisvergleich`);
  const description =
    r.kind === 'brand'
      ? `${r.subject} ${label} im Preisvergleich: ${total} ${total === 1 ? 'Modell' : 'Modelle'}${min ? ` ab ${euro(min)} €` : ''}${
          idx.length ? ` (${idx.slice(0, 3).join(', ')})` : ''
        }. Händlerpreise inkl. Versand, EU-Label, Preisverlauf & Preisalarm.`
      : `${r.subject} ${label} günstig kaufen: ${total} ${total === 1 ? 'Modell' : 'Modelle'}${min ? ` ab ${euro(min)} €` : ''} im Preisvergleich – Händlerpreise inkl. Versand, EU-Label und Preisverlauf.`;
  const compact = `${r.size.width} ${r.size.height} R${r.size.diameter}`;
  const keywords = uniqKeywords([
    `${r.subject} ${label}`,
    `${r.subject} ${r.size.width}/${r.size.height}R${r.size.diameter}`,
    `${r.subject} ${compact}`,
    `${label} ${r.subject}`,
    `${r.subject} ${label} günstig`,
    `${r.subject} ${label} Preisvergleich`,
    ...idx.slice(0, 4).map(i => `${label} ${i}`),
    ...(r.kind === 'season' && r.season.slug === 'ganzjahresreifen' ? [`Allwetterreifen ${label}`, `All Season ${label}`] : []),
    r.kind === 'brand' ? `${r.subject} Reifen` : `${r.subject} günstig`,
    'Reifenpreisvergleich',
    'Reifexa',
  ]);
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: url },
    robots: { index: total >= MIN_COMBO_PRODUCTS, follow: true },
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      url,
      siteName: 'Reifexa.de',
      title,
      description,
      images: [{ url: `${SITE_URL}/images/banner-og-image.png`, width: 1230, height: 613, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/images/banner-og-image.png`] },
  };
}

export default async function SizeComboPage({ params }: Params) {
  const { size: rs, sub: rb } = await params;
  const r = await resolve(rs, rb);
  if (r === 'redirect') {
    const size = parseSizeSlug(rs);
    permanentRedirect(size ? sizeSeasonPath(size, 'ganzjahresreifen') : '/ganzjahresreifen');
  }
  if (!r) notFound();
  if (`${rs}/${rb}`.toLowerCase() !== r.path.replace('/reifen/', '') || rs !== rs.toLowerCase() || rs !== sizeSlug(r.size)) {
    permanentRedirect(r.path);
  }

  const [{ total, products }, landings] = await Promise.all([fetchLandingProducts(r.filters, 24), fetchLandings()]);
  if (!total) notFound();

  const label = sizeLabel(r.size);
  const min = products[0]?.cheapest_offer || 0;
  const sameSize = (x: { width: string; height: string; diameter: string }) =>
    x.width === r.size.width && x.height === r.size.height && x.diameter === r.size.diameter;
  const brandsHere = landings.brandSizes.filter(sameSize).sort((a, b) => b.count - a.count);
  const seasonsHere = Array.from(
    new Set(products.map(p => seasonForCategory(p.merchant_product_third_category)?.label).filter(Boolean) as string[])
  );
  const models = Array.from(new Set(products.map(p => p.product_name).filter(Boolean))).slice(0, 6);
  const crumbs = [
    { name: 'Startseite', url: `${SITE_URL}/` },
    { name: 'Reifengrößen', url: `${SITE_URL}/reifen` },
    { name: `${label} Reifen`, url: `${SITE_URL}${sizePath(r.size)}` },
    { name: `${r.subject} ${label}`, url: `${SITE_URL}${r.path}` },
  ];
  const brandLinks = brandsHere
    .filter(b => r.kind !== 'brand' || b.brand !== r.brand)
    .slice(0, 20)
    .map(b => ({ href: sizeBrandPath(r.size, b.brand), label: `${displayBrand(b.brand)} ${label}`, note: String(b.count) }));
  const brandSizes =
    r.kind === 'brand'
      ? landings.brandSizes
          .filter(b => b.brand === r.brand && !sameSize(b))
          .sort((a, b) => b.count - a.count)
          .slice(0, 16)
          .map(b => ({ href: sizeBrandPath(b, r.brand), label: `${r.subject} ${sizeLabel(b)}`, note: String(b.count) }))
      : [];

  return (
    <LandingPage
      path={r.path}
      h1={r.kind === 'brand' ? `${r.subject} ${label} Reifen im Preisvergleich` : `${r.subject} ${label} im Preisvergleich`}
      intro={comboIntro({
        size: r.size,
        subject: r.subject,
        kind: r.kind,
        total,
        minPrice: min,
        models: r.kind === 'brand' ? models : products.slice(0, 6).map(p => `${displayBrand(p.brand_name)} ${p.product_name}`),
        indexes: indexesOf(products),
        seasons: seasonsHere,
      })}
      products={products}
      total={total}
      moreHref={`/produkte?${new URLSearchParams(r.filters).toString()}`}
      crumbs={crumbs}
      faqs={comboFaqs({
        size: r.size,
        subject: r.subject,
        kind: r.kind,
        total,
        minPrice: min,
        cheapestName: products[0] ? `${displayBrand(products[0].brand_name)} ${products[0].product_name}` : undefined,
      })}
      linkGroups={[
        {
          title: `Alle ${label} Reifen`,
          links: [
            { href: sizePath(r.size), label: `${label} Reifen – alle Marken` },
            ...SEASONS.filter(s => r.kind !== 'season' || s.slug !== r.season.slug).map(s => ({
              href: sizeSeasonPath(r.size, s.slug),
              label: `${s.label} ${label}`,
            })),
          ],
        },
        ...(brandSizes.length ? [{ title: `Weitere ${r.subject} Größen`, links: brandSizes }] : []),
        { title: r.kind === 'brand' ? `Andere Marken in ${label}` : `Marken in ${label}`, links: brandLinks },
        ...(r.kind === 'brand'
          ? [{ title: `${r.subject} Reifen`, links: [{ href: brandPath(r.brand), label: `Alle ${r.subject} Reifen` }] }]
          : [{ title: r.subject, links: [{ href: `/${r.season.slug}`, label: `Alle ${r.subject}` }] }]),
      ]}
    />
  );
}
