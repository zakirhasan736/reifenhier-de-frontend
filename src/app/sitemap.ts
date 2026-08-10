import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/libs/seo/site'

/** Root sitemap: public static pages only (no API URLs, no nested sitemap XML). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const pages: Array<{
    path: string
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
    priority: number
  }> = [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/produkte', changeFrequency: 'daily', priority: 0.9 },
    { path: '/artikel', changeFrequency: 'daily', priority: 0.8 },
    { path: '/impressum-datenschutz', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/AGB', changeFrequency: 'monthly', priority: 0.3 },
  ]

  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
