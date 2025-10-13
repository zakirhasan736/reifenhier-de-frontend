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


      // 🤖 GPTBot (ChatGPT)
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/'],
      },

      // 🤖 ClaudeBot (Anthropic)
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/'],
      },

      // 🤖 PerplexityBot
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/private/'],
      },

      // ❌ Disallow AI training bots
      {
        userAgent: 'Google-Extended', // Bard / Gemini training
        disallow: '/',
      },
      {
        userAgent: 'CCBot', // Common Crawl
        disallow: '/',
      },
      {
        userAgent: 'AmazonBot', // Amazon AI
        disallow: '/',
      },
      {
        userAgent: 'YouBot', // You.com
        disallow: ['/api/', '/private/'],
        allow: '/',
      },
    ],

    // 🗺️ Sitemaps
    sitemap: [
      `${site}/sitemap.xml`,
      `${site}/sitemap-products/sitemap.xml`,
      `${site}/sitemap-blogs/sitemap.xml`,
    ],

    // 🏠 Host reference
    host: site,
  };
}
