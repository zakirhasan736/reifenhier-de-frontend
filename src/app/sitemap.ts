import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reifencheck.de';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes
  const staticPaths = [
    '/',
    '/terms-services',
    '/privacy-policy',
    '/blogs',
    '/favorites',
    '/products',
  ];

  // Fetch dynamic blog slugs (adjust API endpoint to your CMS)
  const blogSlugs: string[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blogs`
  )
    .then(res => res.json())
    .then((data: { slug: string }[]) => data.map(b => b.slug))
    .catch(() => []);

  const productSlugs: string[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products`
  )
    .then(res => res.json())
    .then((data: { slug: string }[]) => data.map(p => p.slug))
    .catch(() => []);

  const urls: MetadataRoute.Sitemap = [
    ...staticPaths.map(path => ({
      url: `${siteUrl.replace(/\/$/, '')}${path}`,
      lastModified: now,
      changeFrequency: (path === '/' ? 'daily' : 'weekly') as
        | 'daily'
        | 'weekly',
      priority: path === '/' ? 1 : 0.6,
    })),
    ...blogSlugs.map(slug => ({
      url: `${siteUrl.replace(/\/$/, '')}/blogs/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    ...productSlugs.map(slug => ({
      url: `${siteUrl.replace(/\/$/, '')}/products/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ];

  return urls;
}
