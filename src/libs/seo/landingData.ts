const API = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'https://api.reifexa.de'
).replace(/\/$/, '');

export type LandingSize = {
  width: string;
  height: string;
  diameter: string;
  count: number;
  minPrice: number;
  updatedAt?: string;
};
export type LandingBrand = { name: string; count: number; minPrice: number; updatedAt?: string };
export type LandingSeason = { name: string; count: number; minPrice: number };
export type LandingBrandSize = {
  brand: string;
  width: string;
  height: string;
  diameter: string;
  count: number;
};
export type Landings = {
  sizes: LandingSize[];
  brands: LandingBrand[];
  seasons: LandingSeason[];
  brandSizes: LandingBrandSize[];
};

export type ListProduct = {
  _id: string;
  slug: string;
  product_name: string;
  brand_name: string;
  product_image?: string | string[];
  awin_image_url?: string;
  merchant_product_third_category?: string;
  dimensions?: string;
  width?: string;
  height?: string;
  diameter?: string;
  lastIndex?: string;
  speedIndex?: string;
  fuel_class?: string;
  wet_grip?: string;
  noise_class?: string;
  cheapest_offer?: number;
  expensive_offer?: number;
  total_offers?: number;
  vendor_name?: string;
  average_rating?: number;
  review_count?: number;
};

const EMPTY: Landings = { sizes: [], brands: [], seasons: [], brandSizes: [] };

export async function fetchLandings(): Promise<Landings> {
  try {
    const res = await fetch(`${API}/api/products/seo-landings`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return EMPTY;
    const j = await res.json();
    return { ...EMPTY, ...j };
  } catch {
    return EMPTY;
  }
}

export async function fetchLandingProducts(
  filters: Record<string, string>,
  limit = 24
): Promise<{ total: number; products: ListProduct[]; minPrice: number; maxPrice: number }> {
  const q = new URLSearchParams({
    ...filters,
    priced: '1',
    sortField: 'price',
    sortOrder: 'asc',
    page: '1',
    limit: String(limit),
  });
  try {
    const res = await fetch(`${API}/api/products/product-lists?${q}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return { total: 0, products: [], minPrice: 0, maxPrice: 0 };
    const j = await res.json();
    return {
      total: Number(j.total) || 0,
      products: Array.isArray(j.products) ? j.products : [],
      minPrice: Number(j.minPrices) || 0,
      maxPrice: Number(j.maxPrices) || 0,
    };
  } catch {
    return { total: 0, products: [], minPrice: 0, maxPrice: 0 };
  }
}
