import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/libs/seo/site'
import { brandPath, MIN_LANDING_PRODUCTS, SEASONS, sizePath } from '@/libs/seo/landing'
import { fetchLandings } from '@/libs/seo/landingData'

export const revalidate = 3600

/** Root sitemap: static pages + size/brand/season landing pages. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const pages: Array<{
    path: string
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
    priority: number
  }> = [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/produkte', changeFrequency: 'daily', priority: 0.9 },
    ...SEASONS.map(s => ({ path: `/${s.slug}`, changeFrequency: 'daily' as const, priority: 0.9 })),
    { path: '/reifen', changeFrequency: 'daily', priority: 0.8 },
    { path: '/marken', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/artikel', changeFrequency: 'daily', priority: 0.8 },
    { path: '/impressum-datenschutz', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/AGB', changeFrequency: 'monthly', priority: 0.3 },
  ]

  const { sizes, brands } = await fetchLandings()
  const landing: MetadataRoute.Sitemap = [
    ...sizes
      .filter(s => s.count >= MIN_LANDING_PRODUCTS)
      .map(s => ({
        url: `${SITE_URL}${sizePath(s)}`,
        lastModified: s.updatedAt ? new Date(s.updatedAt) : now,
        changeFrequency: 'daily' as const,
        priority: 0.8,
      })),
    ...brands
      .filter(b => b.count >= MIN_LANDING_PRODUCTS)
      .map(b => ({
        url: `${SITE_URL}${brandPath(b.name)}`,
        lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      })),
  ]

  return [
    ...pages.map(({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...landing,
  ]
}
