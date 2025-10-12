// app/sitemap-products/sitemap.ts
import type { MetadataRoute } from 'next';

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.reifencheck.de'
).replace(/\/$/, '');

const apiUrl = (
  process.env.NEXT_PUBLIC_API_URL || 'https://api.reifencheck.de/api'
).replace(/\/$/, '');

type Product = {
  slug?: string;
  product_name?: string;
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

// Handle different API shapes
function extractProducts<T extends Product>(data: unknown): T[] {
    if (!data || typeof data !== 'object') return [];
    const d = data as Record<string, unknown>;

 if (Array.isArray(data)) return data as T[];
  if (Array.isArray(d.results)) return d.results as T[];
  if (Array.isArray(d.items)) return d.items as T[];
  if (Array.isArray(d.products)) return d.products as T[];
  if (Array.isArray(d.data)) return d.data as T[];
  return [];
}
const limit = 50000; // Max URLs per sitemap
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const url = `${apiUrl}/api/products/product-lists?page=1&limit=${limit}`;

  const json = await safeFetchJSON<Product[]>(url);
  const products = extractProducts<Product>(json);
  const valid = products.filter(p => p.slug);

  console.log('✅ Sitemap products count:', valid.length);

  // Fallback if no slugs are found
  if (valid.length === 0) {
    return [
      {
        url: `${siteUrl}/api/products/product-details/`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.5,
      },
    ];
  }

  return valid.map(p => ({
    url: `${siteUrl}/products/${encodeURIComponent(
      p.slug!
    )}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));
}
