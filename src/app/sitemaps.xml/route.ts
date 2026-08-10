import {
  SITE_URL,
  PRODUCT_SITEMAP_CHUNK_SIZE,
  fetchProductSitemapMeta,
} from '@/libs/seo/site'

const wpUrl = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://wp.reifexa.de'
).replace(/\/$/, '')

async function getBlogPages(): Promise<number> {
  try {
    const res = await fetch(
      `${wpUrl}/wp-json/wp/v2/posts?per_page=1&_fields=id`,
      { next: { revalidate: 3600 } }
    )
    const total = Number(res.headers.get('X-WP-Total') || '0')
    return Math.max(1, Math.ceil(total / 100) || 1)
  } catch {
    return 1
  }
}

/** Single sitemap index for Search Console (main + products chunks + blogs). */
export async function GET() {
  const now = new Date().toISOString()
  const { total, pages } = await fetchProductSitemapMeta()
  const productChunks = Math.max(
    1,
    Math.ceil(total / PRODUCT_SITEMAP_CHUNK_SIZE) || pages || 1
  )
  const blogChunks = await getBlogPages()

  const entries: string[] = [
    `${SITE_URL}/sitemap.xml`,
    ...Array.from(
      { length: productChunks },
      (_, i) => `${SITE_URL}/sitemap-produkte/sitemap/${i}.xml`
    ),
    ...Array.from(
      { length: blogChunks },
      (_, i) => `${SITE_URL}/sitemap-blogs/sitemap/${i}.xml`
    ),
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    loc => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
