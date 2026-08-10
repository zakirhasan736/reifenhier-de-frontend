import type { MetadataRoute } from 'next'
import {
  SITE_URL,
  PRODUCT_SITEMAP_CHUNK_SIZE,
  fetchProductSitemapMeta,
} from '@/libs/seo/site'

const privatePaths = [
  '/api/',
  '/admin/',
  '/favoriten',
  '/unsubscribe',
  '/server/',
  '/private/',
  '/checkout/',
  '/cart/',
  '/compare/',
  '/account/',
  '/login/',
  '/register/',
  '/to',
  '/to/',
]

const filterQueryBlocks = [
  '/*?sort=',
  '/*?page=',
  '/*?brand=',
  '/*?width=',
  '/*?height=',
  '/*?diameter=',
  '/*?speedIndex=',
  '/*?lastIndex=',
  '/*?noise=',
  '/*?fuelClass=',
  '/*?wetGrip=',
  '/*?q=',
]

/** Full crawl permission for Google, Bing, and AI search/answer engines. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const { total, pages } = await fetchProductSitemapMeta()
  const productChunks = Math.max(
    1,
    Math.ceil(total / PRODUCT_SITEMAP_CHUNK_SIZE) || pages || 1
  )

  const productSitemaps = Array.from(
    { length: productChunks },
    (_, i) => `${SITE_URL}/sitemap-produkte/sitemap/${i}.xml`
  )

  const publicAllow = {
    allow: '/' as const,
    disallow: [...privatePaths, ...filterQueryBlocks],
  }

  return {
    rules: [
      // Default: all search engines
      { userAgent: '*', ...publicAllow },

      // Google
      { userAgent: 'Googlebot', ...publicAllow },
      { userAgent: 'Googlebot-Image', allow: '/' },
      { userAgent: 'Googlebot-News', ...publicAllow },
      { userAgent: 'Google-Extended', ...publicAllow }, // Gemini / AI Overviews
      { userAgent: 'GoogleOther', ...publicAllow },
      { userAgent: 'Storebot-Google', ...publicAllow },

      // Bing / Microsoft / Copilot
      { userAgent: 'Bingbot', ...publicAllow },
      { userAgent: 'msnbot', ...publicAllow },
      { userAgent: 'BingPreview', ...publicAllow },
      { userAgent: 'adidxbot', ...publicAllow },

      // Other search engines
      { userAgent: 'DuckDuckBot', ...publicAllow },
      { userAgent: 'Slurp', ...publicAllow }, // Yahoo
      { userAgent: 'Yandex', ...publicAllow },
      { userAgent: 'Baiduspider', ...publicAllow },
      { userAgent: 'Applebot', ...publicAllow },
      { userAgent: 'Applebot-Extended', ...publicAllow },
      { userAgent: 'SeznamBot', ...publicAllow },
      { userAgent: 'ecosia', ...publicAllow },

      // AI assistants / answer engines — full allow for reading, citing, suggesting, learning
      { userAgent: 'GPTBot', ...publicAllow },
      { userAgent: 'ChatGPT-User', ...publicAllow },
      { userAgent: 'OAI-SearchBot', ...publicAllow },
      { userAgent: 'ClaudeBot', ...publicAllow },
      { userAgent: 'Claude-Web', ...publicAllow },
      { userAgent: 'anthropic-ai', ...publicAllow },
      { userAgent: 'PerplexityBot', ...publicAllow },
      { userAgent: 'YouBot', ...publicAllow },
      { userAgent: 'Amazonbot', ...publicAllow },
      { userAgent: 'CCBot', ...publicAllow },
      { userAgent: 'meta-externalagent', ...publicAllow },
      { userAgent: 'FacebookBot', ...publicAllow },
      { userAgent: 'Bytespider', ...publicAllow },
      { userAgent: 'Diffbot', ...publicAllow },
      { userAgent: 'cohere-ai', ...publicAllow },
      { userAgent: 'AI2Bot', ...publicAllow },
      { userAgent: 'omgili', ...publicAllow },
      { userAgent: 'omgilibot', ...publicAllow },
    ],
    sitemap: [
      `${SITE_URL}/sitemaps.xml`,
      `${SITE_URL}/sitemap.xml`,
      ...productSitemaps,
      `${SITE_URL}/sitemap-blogs/sitemap/0.xml`,
      `${SITE_URL}/llms.txt`,
    ],
    host: SITE_URL,
  }
}
