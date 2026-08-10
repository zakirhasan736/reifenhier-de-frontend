import type { MetadataRoute } from 'next'
import {
  SITE_URL,
  getApiBase,
  PRODUCT_SITEMAP_CHUNK_SIZE,
  fetchProductSitemapMeta,
} from '@/libs/seo/site'

type SitemapSlug = { slug?: string; updatedAt?: string | null }

type SitemapSlugsResponse = {
  products?: SitemapSlug[]
  total?: number
  pages?: number
}

/**
 * Multiple product sitemaps for 50–60k+ products.
 * Served at: /sitemap-produkte/sitemap/0.xml, /1.xml, ...
 */
export async function generateSitemaps() {
  const { pages } = await fetchProductSitemapMeta()
  const count = Math.max(1, pages)
  return Array.from({ length: count }, (_, i) => ({ id: i }))
}

export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id) || 0
  const page = id + 1
  const apiBase = getApiBase()
  const url = `${apiBase}/api/products/sitemap-slugs?page=${page}&limit=${PRODUCT_SITEMAP_CHUNK_SIZE}`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) {
      console.error(`Product sitemap chunk ${id} failed: ${res.status}`)
      return id === 0
        ? [
            {
              url: `${SITE_URL}/produkte`,
              lastModified: new Date(),
              changeFrequency: 'daily',
              priority: 0.8,
            },
          ]
        : []
    }

    const data = (await res.json()) as SitemapSlugsResponse
    const products = (data.products || []).filter(p => p.slug)

    return products.map(p => ({
      url: `${SITE_URL}/produkte/${encodeURIComponent(p.slug!)}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch (err) {
    console.error(`Product sitemap chunk ${id} error:`, err)
    return []
  }
}
