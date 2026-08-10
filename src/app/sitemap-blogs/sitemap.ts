import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/libs/seo/site'

const wpUrl = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://wp.reifexa.de'
).replace(/\/$/, '')

type WPPost = {
  slug: string
  modified: string
  date: string
}

const PER_PAGE = 100

async function fetchWpPosts(page: number): Promise<WPPost[]> {
  const url = `${wpUrl}/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${page}&_fields=slug,date,modified`
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    return (await res.json()) as WPPost[]
  } catch {
    return []
  }
}

async function getBlogSitemapCount(): Promise<number> {
  try {
    const res = await fetch(
      `${wpUrl}/wp-json/wp/v2/posts?per_page=1&_fields=id`,
      { next: { revalidate: 3600 } }
    )
    const total = Number(res.headers.get('X-WP-Total') || '0')
    return Math.max(1, Math.ceil(total / PER_PAGE) || 1)
  } catch {
    return 1
  }
}

/** Blog sitemaps — split if many posts. /sitemap-blogs/sitemap/0.xml */
export async function generateSitemaps() {
  const pages = await getBlogSitemapCount()
  return Array.from({ length: pages }, (_, i) => ({ id: i }))
}

export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id) || 0
  const page = id + 1
  const posts = await fetchWpPosts(page)

  if (posts.length === 0) {
    return id === 0
      ? [
          {
            url: `${SITE_URL}/artikel`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
          },
        ]
      : []
  }

  return posts.map(post => ({
    url: `${SITE_URL}/artikel/${encodeURIComponent(post.slug)}`,
    lastModified: new Date(post.modified || post.date || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
}
