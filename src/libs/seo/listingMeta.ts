import type { Metadata } from 'next';

function norm(val?: string | string[]) {
  return Array.isArray(val) ? val[0] : val || '';
}
function titleCase(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function buildListingTitle({
  category,
  size,
  brand,
}: {
  category?: string;
  size?: string;
  brand?: string;
}) {
  const parts: string[] = [];
  if (category) parts.push(`${titleCase(category)} Angebote`);
  if (brand) parts.push(brand);
  if (size) parts.push(size);
  parts.push('– Reifen günstig vergleichen');
  return parts.join(' ');
}

export function buildListingDescription({
  category,
  size,
  brand,
}: {
  category?: string;
  size?: string;
  brand?: string;
}) {
  const bits: string[] = [];
  bits.push('Finden Sie günstige Reifenangebote auf Reifencheck.de.');
  const specifics: string[] = [];
  if (category) specifics.push(titleCase(category));
  if (brand) specifics.push(brand);
  if (size) specifics.push(size);
  if (specifics.length) {
    bits.push(
      `Vergleichen Sie ${specifics.join(
        ' '
      )} nach Preis, Marke und Verfügbarkeit.`
    );
  } else {
    bits.push(
      'Vergleichen Sie Sommer-, Winter- und Ganzjahresreifen nach Größe, Marke und Preis.'
    );
  }
  return bits.join(' ');
}

export function buildListingKeywords({
  category,
  size,
  brand,
}: {
  category?: string;
  size?: string;
  brand?: string;
}) {
  const base = [
    'reifenangebote',
    'reifen preisvergleich',
    'günstige reifen',
    'reifen online kaufen',
    'reifen sparen im vergleich',
  ];
  if (category) {
    base.push(
      `${category} angebote`,
      `${category} preisvergleich`,
      `${category} günstig kaufen`
    );
  }
  if (size) {
    base.push(
      `reifen ${size} günstig`,
      `${size} preisvergleich`,
      `${size} angebote`
    );
    if (category)
      base.push(`${category} ${size}`, `${category} ${size} günstig`);
  }
  if (brand) {
    base.push(
      `${brand} reifen`,
      `${brand} reifen angebote`,
      `${brand} reifen preisvergleich`
    );
    if (size) base.push(`${brand} ${size} reifen`);
    if (category) base.push(`${brand} ${category}`);
  }
  return Array.from(new Set(base));
}

/** Canonical: keep only SEO-relevant filters (category, size, brand) */
export function buildListingCanonical(
  sp: Record<string, string | string[] | undefined>
) {
  const u = new URL('https://reifencheck.de/products');
  (
    [
      ['category', norm(sp.category)],
      ['size', norm(sp.size)],
      ['brand', norm(sp.brand)],
    ] as const
  ).forEach(([k, v]) => {
    if (v) u.searchParams.set(k, v);
  });
  return u.toString();
}

/** Full <head> metadata object for listing pages */
export function buildListingMetadata(
  sp: Record<string, string | string[] | undefined>
): Metadata {
  const category = norm(sp.category);
  const size = norm(sp.size);
  const brand = norm(sp.brand);

  const title =
    category || size || brand
      ? buildListingTitle({ category, size, brand })
      : 'Reifenangebote – Sommer-, Winter- & Ganzjahresreifen günstig vergleichen';

  const description =
    category || size || brand
      ? buildListingDescription({ category, size, brand })
      : 'Finden Sie günstige Reifenangebote auf Reifencheck.de. Vergleichen Sie Sommerreifen, Winterreifen und Ganzjahresreifen nach Größe, Marke und Preis.';

  const keywords = buildListingKeywords({ category, size, brand });
  const canonical = buildListingCanonical(sp);

  return {
    metadataBase: new URL('https://reifencheck.de'),
    title,
    description,
    alternates: { canonical },
    keywords,
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      url: canonical,
      siteName: 'Reifencheck.de',
      title,
      description,
      images: [
        {
          url: '/images/product-detailspage.png',
          width: 1200,
          height: 630,
          alt: 'Reifenangebote auf Reifencheck.de',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/product-detailspage.png'],
    },
    robots: { index: true, follow: true },
  };
}
