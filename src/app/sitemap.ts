// app/sitemap.ts
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
  product_image?: string;
  search_price?: number;
  cheapest_offer?: number;
  expensive_offer?: number;
  offers?: unknown[]; // some APIs return this, some don't
};

type Blog = {
  slug?: string;
  title?: string;
  body?: string;
};

type PagedResponse<T> =
  | { results?: T[]; total?: number; page?: number; limit?: number }
  | { items?: T[]; total?: number; page?: number; limit?: number }
  | T[];

/* ---------- small utils ---------- */
const unique = <T>(arr: T[]) => Array.from(new Set(arr));

async function safeFetchJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function getArrayFromPaged<T>(data: PagedResponse<T> | null): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if ('results' in data && Array.isArray(data.results)) return data.results;
  if ('items' in data && Array.isArray(data.items)) return data.items;
  return [];
}

/** Looser, practical “value” check to avoid soft-404s */
function isValidProduct(p: Product): boolean {
  if (!p?.slug || !p?.product_name) return false;
  const hasImage = Boolean(p.product_image);
  const hasPrice =
    typeof p.search_price === 'number' ||
    typeof p.cheapest_offer === 'number' ||
    typeof p.expensive_offer === 'number' ||
    (Array.isArray(p.offers) && p.offers.length > 0);
  return hasImage || hasPrice;
}

function isValidBlog(b: Blog): boolean {
  return Boolean(b?.slug && (b?.title || b?.body));
}

/** Generic pager with optional field selection & per-item validator */
async function fetchPaged<T>({
  base,
  pageParam = 'page',
  limitParam = 'limit',
  limit = 1000,
  maxPages = 200,
  fields,
  validate,
}: {
  base: string;
  pageParam?: string;
  limitParam?: string;
  limit?: number;
  maxPages?: number;
  fields?: string; // e.g. "slug,product_name,product_image,search_price,cheapest_offer"
  validate?: (item: T) => boolean;
}): Promise<T[]> {
  const out: T[] = [];

  for (let page = 1; page <= maxPages; page++) {
    const url = new URL(base);
    url.searchParams.set(pageParam, String(page));
    url.searchParams.set(limitParam, String(limit));
    if (fields && !url.searchParams.has('fields')) {
      url.searchParams.set('fields', fields);
    }

    const data = await safeFetchJSON<PagedResponse<T>>(url.toString());
    const batch = getArrayFromPaged<T>(data);
    if (!batch.length) break;

    out.push(...(validate ? batch.filter(validate) : batch));

    if (batch.length < limit) break; // last page
  }

  return out;
}

/** Products — paginated & validated */
async function fetchAllProductSlugs(): Promise<string[]> {
  const products = await fetchPaged<Product>({
    base: `${apiUrl}/products`,
    limit: 1000,
    maxPages: 200,
    // request fields commonly available; safe if API ignores unknown query
    fields:
      'slug,product_name,product_image,search_price,cheapest_offer,expensive_offer',
    validate: isValidProduct,
  });

  return unique(
    products
      .map(p => p.slug)
      .filter((s): s is string => typeof s === 'string' && s.length > 0)
  );
}

/** Blogs — paginated & validated */
async function fetchAllBlogSlugs(): Promise<string[]> {
  const blogs = await fetchPaged<Blog>({
    base: `${apiUrl}/blogs`,
    limit: 1000,
    maxPages: 200,
    fields: 'slug,title,body',
    validate: isValidBlog,
  });

  return unique(
    blogs
      .map(b => b.slug)
      .filter((s): s is string => typeof s === 'string' && s.length > 0)
  );
}

/* ---------- sitemap ---------- */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Keep static canonicals clean (no params). EXCLUDE /favorites here.
  const staticPaths: string[] = [
    '/',
    '/products',
    '/blogs',
    '/privacy-policy',
    '/terms-of-service',
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

  const all = [...staticEntries, ...productEntries, ...blogEntries];

  // Paranoid dedupe
  const seen = new Set<string>();
  const deduped = all.filter(item => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  return deduped;
}
