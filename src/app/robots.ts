import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.reifencheck.de';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
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
    ],
    sitemap: [
      `${baseUrl.replace(/\/$/, '')}/sitemap.xml`,
      `${baseUrl.replace(/\/$/, '')}/sitemap-products.xml`,
      `${baseUrl.replace(/\/$/, '')}/sitemap-blogs.xml`,
    ],
    host: baseUrl.replace(/\/$/, ''),
  };
}
