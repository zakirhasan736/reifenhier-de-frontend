// lib/seo.ts
import type { Metadata } from 'next';
import { safeSeoImageUrl, SITE_URL as SHARED_SITE_URL } from '@/libs/seo/site';

export const SITE_URL = SHARED_SITE_URL;

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
    title = 'Reifexa.de',
    description = 'Reifen günstig vergleichen.',
    pathname,
    images = ['/images/banner-og-image.png'],
    index = true,
  } = opts;

  const canon = canonical(pathname);
  const safeImages = images.map(img => safeSeoImageUrl(img));

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
      siteName: 'Reifexa.de',
      type: 'website',
      images: safeImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: safeImages,
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
