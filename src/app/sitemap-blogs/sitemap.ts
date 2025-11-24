// app/sitemap-blogs/sitemap.ts
import type { MetadataRoute } from 'next';

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.reifencheck.de'
).replace(/\/$/, '');

const wpUrl = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://wp.reifencheck.de'
).replace(/\/$/, '');

type WPPost = {
  slug: string;
  modified: string;
  date: string;
};

// Safe fetch helper
async function safeFetchJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`❌ Sitemap fetch failed: ${res.status} ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error('❌ Sitemap fetch error:', err);
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // WordPress REST endpoint
  const url = `${wpUrl}/wp-json/wp/v2/posts?per_page=100&_fields=slug,date,modified`;

  const posts = await safeFetchJSON<WPPost[]>(url);

  if (!posts || posts.length === 0) {
    console.warn('⚠️ No WordPress posts found for sitemap.');
    return [
      {
        url: `${siteUrl}/artikel`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.5,
      },
    ];
  }

  console.log('✅ Sitemap WP blogs count:', posts.length);

  return posts.map(post => ({
    url: `${siteUrl}/artikel/${encodeURIComponent(post.slug)}`,
    lastModified: new Date(post.modified || post.date || now),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
}
