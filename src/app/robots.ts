import type { MetadataRoute } from 'next';

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.reifencheck.de';

export default function robots(): MetadataRoute.Robots {
  const site = baseUrl.replace(/\/$/, '');

  return {
    rules: [
      // 🌍 Default rule for all normal crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/server/',
          '/private/',
          '/checkout/',
          '/cart/',
          '/compare/',
          '/account/',
          '/login/',
          '/register/',
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
        ],
      },

      // AI crawlers allowed for indexing BUT not training
      { userAgent: 'GPTBot', allow: '/', disallow: ['/admin/', '/api/'] },
      { userAgent: 'ClaudeBot', allow: '/', disallow: ['/admin/', '/api/'] },
      { userAgent: 'PerplexityBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'YouBot', allow: '/', disallow: ['/api/'] },

      // AI training bots fully disallowed
      { userAgent: 'Google-Extended', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'AmazonBot', disallow: '/' },
    ],

    // 🗺️ Sitemaps
    sitemap: [
      `${site}/sitemap.xml`,
      `${site}/sitemap-produkte/sitemap.xml`,
      `${site}/sitemap-blogs/sitemap.xml`,
    ],

    // 🏠 Host reference
    host: site,
  };
}
