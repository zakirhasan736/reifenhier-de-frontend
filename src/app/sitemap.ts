import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/libs/seo/site'
import { brandPath, MIN_COMBO_PRODUCTS, MIN_LANDING_PRODUCTS, SEASONS, sizeBrandPath, sizePath } from '@/libs/seo/landing'
import { fetchLandings } from '@/libs/seo/landingData'

export const revalidate = 3600

/** Root sitemap: static pages + size/brand/season landing pages. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: Array<{
    path: string
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
    priority: number
  }> = [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/produkte', changeFrequency: 'daily', priority: 0.9 },
    { path: '/reifenpreisvergleich', changeFrequency: 'weekly', priority: 0.85 },
    ...SEASONS.map(s => ({ path: `/${s.slug}`, changeFrequency: 'daily' as const, priority: 0.9 })),
    { path: '/reifen', changeFrequency: 'daily', priority: 0.8 },
    { path: '/reifengroessen-rechner', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/marken', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/artikel', changeFrequency: 'daily', priority: 0.8 },
    { path: '/impressum-datenschutz', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/AGB', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/auto-api', changeFrequency: 'weekly', priority: 0.6 },
    { path: '/auto-api/dokumentation', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/auto-api/bedingungen', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/auto-api/preise-und-zahlung', changeFrequency: 'monthly', priority: 0.3 },
  ]

  const { sizes, brands, brandSizes } = await fetchLandings()
  const landing: MetadataRoute.Sitemap = [
    ...sizes
      .filter(s => s.count >= MIN_LANDING_PRODUCTS)
      .map(s => ({
        url: `${SITE_URL}${sizePath(s)}`,
        ...(s.updatedAt ? { lastModified: new Date(s.updatedAt) } : {}),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      })),
    ...brands
      .filter(b => b.count >= MIN_LANDING_PRODUCTS)
      .map(b => ({
        url: `${SITE_URL}${brandPath(b.name)}`,
        ...(b.updatedAt ? { lastModified: new Date(b.updatedAt) } : {}),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      })),
    // size × brand ("Michelin 195/65 R15") – the long-tail queries that already bring impressions
    ...brandSizes
      .filter(b => b.count >= MIN_COMBO_PRODUCTS)
      .slice(0, 2000)
      .map(b => ({
        url: `${SITE_URL}${sizeBrandPath(b, b.brand)}`,
        changeFrequency: 'daily' as const,
        priority: 0.6,
      })),
  ]

  return [
    ...pages.map(({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency,
      priority,
    })),
    ...landing,
  ]
}
