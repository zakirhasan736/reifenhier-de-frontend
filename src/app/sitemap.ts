// app/sitemap.ts
import type { MetadataRoute } from 'next';

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.reifencheck.de'
).replace(/\/$/, '');
const apiUrl = (
  process.env.NEXT_PUBLIC_API_URL || 'https://api.reifencheck.de/api'
).replace(/\/$/, '');

type SlugItem = { slug?: string };
type ResultsShape = { results?: SlugItem[] };
type ItemsShape = { items?: SlugItem[] };

function isArrayOfSlugItem(x: unknown): x is SlugItem[] {
  return (
    Array.isArray(x) &&
    x.every(
      i =>
        typeof i === 'object' &&
        i !== null &&
        'slug' in (i as Record<string, unknown>)
    )
  );
}
function hasResults(x: unknown): x is ResultsShape {
  return (
    typeof x === 'object' &&
    x !== null &&
    'results' in (x as Record<string, unknown>) &&
    isArrayOfSlugItem((x as ResultsShape).results)
  );
}
function hasItems(x: unknown): x is ItemsShape {
  return (
    typeof x === 'object' &&
    x !== null &&
    'items' in (x as Record<string, unknown>) &&
    isArrayOfSlugItem((x as ItemsShape).items)
  );
}

/** Safe fetch that supports {results:[{slug}]} | [{slug}] | {items:[{slug}]} */
async function fetchSlugs(endpoint: string): Promise<string[]> {
  try {
    const res = await fetch(endpoint, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data: unknown = await res.json();

    let candidates: SlugItem[] = [];
    if (isArrayOfSlugItem(data)) candidates = data;
    else if (hasResults(data) && Array.isArray(data.results))
      candidates = data.results ?? [];
    else if (hasItems(data) && Array.isArray(data.items))
      candidates = data.items ?? [];

    const slugs = candidates
      .map(i => i.slug)
      .filter((s): s is string => typeof s === 'string' && s.length > 0);

    return Array.from(new Set(slugs));
  } catch {
    return [];
  }
}

/** Pull many product slugs; adjust params to your API if needed */
async function fetchAllProductSlugs(): Promise<string[]> {
  const direct = await fetchSlugs(`${apiUrl}/products?limit=10000&fields=slug`);
  if (direct.length) return direct;

  const stitched: string[] = [];
  const MAX_PAGES = 10;
  for (let page = 1; page <= MAX_PAGES; page++) {
    const pageSlugs = await fetchSlugs(
      `${apiUrl}/products?page=${page}&limit=1000&fields=slug`
    );
    if (!pageSlugs.length) break;
    stitched.push(...pageSlugs);
  }
  return Array.from(new Set(stitched));
}

/** Pull many blog slugs; adjust params to your CMS if needed */
async function fetchAllBlogSlugs(): Promise<string[]> {
  const direct = await fetchSlugs(`${apiUrl}/blogs?limit=10000&fields=slug`);
  if (direct.length) return direct;

  const stitched: string[] = [];
  const MAX_PAGES = 10;
  for (let page = 1; page <= MAX_PAGES; page++) {
    const pageSlugs = await fetchSlugs(
      `${apiUrl}/blogs?page=${page}&limit=1000&fields=slug`
    );
    if (!pageSlugs.length) break;
    stitched.push(...pageSlugs);
  }
  return Array.from(new Set(stitched));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static, canonical routes (no query strings)
  const staticPaths: string[] = [
    '/', // homepage
    '/products', // listing canonical (if you prefer /products, switch here)
    '/blogs', // blog index
    '/favorites',
    '/privacy-policy',
    '/terms-services',
  ];

  const [productSlugs, blogSlugs] = await Promise.all([
    fetchAllProductSlugs(),
    fetchAllBlogSlugs(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map(path => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = productSlugs.map(slug => ({
    url: `${siteUrl}/products/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map(slug => ({
    url: `${siteUrl}/blogs/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  // Dedupe (defensive)
  const all = [...staticEntries, ...productEntries, ...blogEntries];
  const seen = new Set<string>();
  const deduped = all.filter(item => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  return deduped;
}
