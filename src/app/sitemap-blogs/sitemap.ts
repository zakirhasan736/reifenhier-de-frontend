// app/sitemap-blogs/sitemap.ts
import type { MetadataRoute } from 'next';

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.reifencheck.de'
).replace(/\/$/, '');

const apiUrl = (
  process.env.NEXT_PUBLIC_API_URL || 'https://api.reifencheck.de/api'
).replace(/\/$/, '');

type Blog = {
  slug?: string;
  title?: string;
  body?: string;
};

// Safely fetch JSON with revalidation
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

// Handle different possible API shapes
function extractBlogs<T extends Blog>(data: unknown): T[] {
  if (!data || typeof data !== 'object') return [];
  const d = data as Record<string, unknown>;

  if (Array.isArray(data)) return data as T[];
  if (Array.isArray(d.results)) return d.results as T[];
  if (Array.isArray(d.items)) return d.items as T[];
  if (Array.isArray(d.blogs)) return d.blogs as T[];
  if (Array.isArray(d.data)) return d.data as T[];
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ✅ Use the correct backend endpoint for blogs
  const url = `${apiUrl}/api/blogs/list`;

  const json = await safeFetchJSON<Blog[]>(url);
  const blogs = extractBlogs<Blog>(json);
  const valid = blogs.filter(b => b.slug);

  console.log('✅ Sitemap blogs count:', valid.length);

  // Fallback if API returned nothing
  if (valid.length === 0) {
    return [
      {
        url: `${siteUrl}/blogs`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.5,
      },
    ];
  }

  // ✅ Map valid slugs to public blog URLs
  return valid.map(b => ({
    url: `${siteUrl}/blogs/${encodeURIComponent(b.slug!)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));
}
