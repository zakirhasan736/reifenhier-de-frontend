/* ===================== FILE: app/sitemap.ts ===================== */
import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reifencheck.de';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static routes you currently have
  const staticPaths = ['/', '/terms', '/privacy'];

  // If you have dynamic content (e.g., /blog/[slug] or /products/[id]),
  // fetch/compose those URLs here and push into the list.
  // Example placeholder:
  // const dynamicEntries = await fetch(`${process.env.CMS_URL}/api/entries`).then(r => r.json());
  // urls.push(...dynamicEntries.map((e: { slug: string }) => ({ url: `${siteUrl}/blog/${e.slug}`, lastModified: now })));

  const urls: MetadataRoute.Sitemap = staticPaths.map(path => ({
    url: `${siteUrl.replace(/\/$/, '')}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.6,
  }));

  return urls;
}
/* ===================== END OF FILE ===================== */