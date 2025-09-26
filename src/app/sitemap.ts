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

/** Extract slugs from common response shapes: {results:[]}|{items:[]}|[] */
async function fetchSlugs(endpoint: string): Promise<string[]> {
  try {
    const res = await fetch(endpoint, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data: unknown = await res.json();

    let candidates: SlugItem[] = [];
    if (isArrayOfSlugItem(data)) candidates = data;
    else if (hasResults(data)) candidates = data.results ?? [];
    else if (hasItems(data)) candidates = data.items ?? [];

    return Array.from(
      new Set(
        candidates
          .map(i => i.slug)
          .filter((s): s is string => typeof s === 'string' && s.length > 0)
      )
    );
  } catch {
    return [];
  }
}

/** Page through an endpoint until it returns no slugs (defensive caps included) */
async function fetchPagedSlugs(
  base: string,
  {
    pageParam = 'page',
    limitParam = 'limit',
    limit = 1000,
    maxPages = 200, // enough for 200k items at 1k/page
  }: {
    pageParam?: string;
    limitParam?: string;
    limit?: number;
    maxPages?: number;
  } = {}
): Promise<string[]> {
  const all: string[] = [];

  for (let page = 1; page <= maxPages; page++) {
    const url = new URL(base);
    url.searchParams.set(limitParam, String(limit));
    url.searchParams.set(pageParam, String(page));
    // If your API supports "fields=slug", keep responses tiny:
    if (!url.searchParams.has('fields')) url.searchParams.set('fields', 'slug');

    const slugs = await fetchSlugs(url.toString());
    if (!slugs.length) break;

    all.push(...slugs);
  }
  return Array.from(new Set(all));
}

/** Pull many product slugs with a fast path + paged fallback */
async function fetchAllProductSlugs(): Promise<string[]> {
  // Fast path (single large response if your API supports it)
  const direct = await fetchSlugs(`${apiUrl}/products?limit=10000&fields=slug`);
  if (direct.length) return direct;

  // Fallback: page through
  return fetchPagedSlugs(`${apiUrl}/products`, {
    pageParam: 'page',
    limitParam: 'limit',
    limit: 1000,
    maxPages: 200,
  });
}

/** Pull many blog slugs with a fast path + paged fallback */
async function fetchAllBlogSlugs(): Promise<string[]> {
  const direct = await fetchSlugs(`${apiUrl}/blogs?limit=10000&fields=slug`);
  if (direct.length) return direct;

  return fetchPagedSlugs(`${apiUrl}/blogs`, {
    pageParam: 'page',
    limitParam: 'limit',
    limit: 1000,
    maxPages: 200,
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static, canonical routes (no query strings)
  const staticPaths: string[] = [
    '/',
    '/products', // keep listing canonical clean (no params)
    '/blogs',
    '/favorites',
    '/privacy-policy',
    '/terms-of-service', // if your route is /terms-of-service, keep that instead
  ];

  const [productSlugs, blogSlugs] = await Promise.all([
    fetchAllProductSlugs(),
    fetchAllBlogSlugs(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map(path => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: (path === '/' ? 'daily' : 'weekly') as 'daily' | 'weekly',
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
