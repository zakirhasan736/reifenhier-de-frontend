import type { MetadataRoute } from 'next';

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.reifencheck.de'
).replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static/parent pages
  const staticPaths: string[] = [
    '/',
    '/produkte',
    '/blogs',
    '/impressum-datenschutz',
    '/AGB',
  ];

  // Create entries for each static route
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map(path => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));

  // Add sitemap index entries
  const indexEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/sitemap-produkte/sitemap.xml`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/sitemap-blogs/sitemap.xml`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Merge and return
  return [...indexEntries, ...staticEntries];
}
