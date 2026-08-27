import type { Product } from '@/types/product';

const API = (
  process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de'
).replace(/\/$/, '');

export type FeaturedHomeData = {
  title: string;
  category: string;
  products: Product[];
};

export type BrandHomeItem = {
  brand_name: string;
  brandLogo: string;
  count: number;
};

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}/api/products/${path}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getFeaturedHomeData(): Promise<FeaturedHomeData> {
  const data = await fetchJson<FeaturedHomeData>('sessions-products');
  return {
    title: data?.title || 'Our recommendation',
    category: data?.category || 'Winterreifen',
    products: Array.isArray(data?.products) ? data.products : [],
  };
}

export async function getLatestHomeProducts(): Promise<Product[]> {
  const data = await fetchJson<{ products?: Product[] }>('latest-products');
  return Array.isArray(data?.products) ? data.products : [];
}

export async function getHomeBrands(): Promise<BrandHomeItem[]> {
  const data = await fetchJson<{ brands?: BrandHomeItem[] }>('brand-summary');
  return Array.isArray(data?.brands) ? data.brands : [];
}
