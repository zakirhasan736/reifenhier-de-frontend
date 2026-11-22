const API = (process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de').replace(/\/$/, '');

export type Pick = {
  slot: 'best_price' | 'best_choice' | 'premium' | 'current' | 'cheaper' | 'better';
  id: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  size: string;
  index: string;
  season: string;
  wet: string;
  fuel: string;
  noiseDb: number | null;
  price: number;
  priceFor4: number;
  offerCount: number;
  vendor: string;
  vendorId: string;
  token: string;
  reason: string;
};

export type Criteria = {
  width?: string;
  height?: string;
  diameter?: string;
  season?: 'sommer' | 'winter' | 'ganzjahr' | null;
  priority?: 'balanced' | 'cheap' | 'safety' | 'quiet';
  budgetPer4?: number;
  minLoadIndex?: number;
  minSpeed?: string;
};

export type RecommendResult = {
  criteria: Criteria;
  needs: 'size' | null;
  message: string;
  total?: number;
  picks: Pick[];
};

export type ProductCheck = {
  product: Pick;
  sameSizeCount: number;
  pricePosition: number;
  trendPct: number | null;
  verdict: string;
  timing: string;
  alternatives: Pick[];
};

export type CarSize = { width: string; height: string; diameter: string; loadIndex?: string; speedIndex?: string; original?: boolean };
export type CarResult = { source?: 'wheel-size' | 'ai'; generation?: string; sizes?: CarSize[]; note?: string; error?: string };
export type PhotoResult = {
  ok?: boolean;
  width?: string;
  height?: string;
  diameter?: string;
  loadIndex?: string;
  speedIndex?: string;
  brand?: string;
  dot?: string;
  season?: string;
  confidence?: string;
  hint?: string;
  error?: string;
};

async function post<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${API}/api/searchlight${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok && !j?.error) throw new Error(j?.message || `HTTP ${r.status}`);
  return j as T;
}

export const recommend = (body: Criteria & { text?: string }) => post<RecommendResult>('/recommend', body);
export const productCheck = (slug: string) => post<ProductCheck>('/product-check', { slug });
export const carSizes = (body: { make: string; model: string; year?: string }) => post<CarResult>('/car', body);
export const readPhoto = (image: string) => post<PhotoResult>('/photo', { image });

/** Downscale a photo in the browser before upload (≤ 1280 px, JPEG). */
export async function shrinkImage(file: File, max = 1280): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * scale);
    c.height = Math.round(img.height * scale);
    c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export type OpenDetail = { mode?: 'start' | 'questions' | 'photo' | 'car' | 'text' | 'product'; slug?: string };

/** Open Searchlight from anywhere (banner, sidebar, help bubble). */
export function openSearchlight(detail: OpenDetail = {}) {
  window.dispatchEvent(new CustomEvent<OpenDetail>('searchlight:open', { detail }));
}
