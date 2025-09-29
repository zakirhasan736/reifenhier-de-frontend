// lib/seo.ts
import type { Metadata } from 'next';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.reifencheck.de'
).replace(/\/$/, '');

export function canonical(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : '/' + path}`;
}

export function buildPageMetadata(opts: {
  title?: string;
  description?: string;
  pathname: string;
  images?: string[];
  index?: boolean;
}): Metadata {
  const {
    title = 'Reifencheck.de',
    description = 'Reifen günstig vergleichen.',
    pathname,
    images = ['/images/banner-og-image.png'],
    index = true,
  } = opts;

  const canon = canonical(pathname);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: canon },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      url: canon,
      title,
      description,
      siteName: 'Reifencheck.de',
      type: 'website',
      images: images.map(img =>
        img.startsWith('http') ? img : `${SITE_URL}${img}`
      ),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map(img =>
        img.startsWith('http') ? img : `${SITE_URL}${img}`
      ),
    },
  };
}

export function isThinProduct(p: {
  product_name?: string;
  product_image?: string;
  offers?: unknown[];
}): boolean {
  return !p?.product_name || !p?.product_image || !(p?.offers?.length ?? 0);
}
