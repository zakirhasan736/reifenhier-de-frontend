/** Shared SEO site constants for Reifexa.de */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.reifexa.de'
).replace(/\/$/, '')

export const SITE_NAME = 'Reifexa.de'

/** URLs per product sitemap chunk (Google max is 50k; keep headroom). */
export const PRODUCT_SITEMAP_CHUNK_SIZE = 10000

/** Normalize API base (no trailing slash, no trailing /api) */
export function getApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de')
    .replace(/\/$/, '')
    .replace(/\/api$/, '')
}

export const SOCIAL_PROFILES = [
  'https://www.facebook.com/reifexa.de',
  'https://www.instagram.com/reifexa.de',
  'https://www.tiktok.com/@reifexa',
] as const

export const CORE_KEYWORDS = [
  'reifenpreisvergleich',
  'reifenpreisvergleich deutschland',
  'günstige reifen',
  'billige reifen',
  'reifen online kaufen',
  'reifenangebote',
  'reifen angebote',
  'sommerreifen',
  'winterreifen',
  'ganzjahresreifen',
  'allwetterreifen',
  'reifen test',
  'reifen vergleich',
  'reifen größen',
  'reifengrößen',
  'reifengröße finden',
  '205/55 R16',
  '225/45 R17',
  '195/65 R15',
  'reifen marken',
  'michelin reifen',
  'continental reifen',
  'bridgestone reifen',
  'goodyear reifen',
  'pirelli reifen',
  'eu reifenlabel',
  'nasshaftung',
  'rollwiderstand',
  'externes rollgeräusch',
  'winterreifenpflicht deutschland',
  'suv reifen',
  'elektroauto reifen',
  'pkw reifen',
  'reifexa',
  'reifexa.de',
  'Reifen check',
  'Reifen check 24',
  'Reifen 24 check',
] as const

export const SITE_KEYWORDS = [
  ...CORE_KEYWORDS,
  'best reifen',
  'top reifen',
  'reifen versand deutschland',
  'reifen preis vergleichen',
  'reifen bewertung',
  'reifen ratgeber',
  'profiltiefe gesetz',
  'ganzjahresreifen test',
  'leise reifen',
  'kompletträder',
  'reifen händler vergleich',
  'reifen kaufen deutschland',
  'autoreifen günstig',
  'reifensuche',
] as const

export async function fetchProductSitemapMeta(): Promise<{
  total: number
  pages: number
}> {
  const apiBase = getApiBase()
  try {
    const res = await fetch(
      `${apiBase}/api/products/sitemap-slugs?page=1&limit=1`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return { total: 0, pages: 1 }
    const data = (await res.json()) as { total?: number; pages?: number }
    const total = Number(data.total) || 0
    // Always compute pages from chunk size — ignore API pages when probing with limit=1
    const pages = Math.max(1, Math.ceil(total / PRODUCT_SITEMAP_CHUNK_SIZE) || 1)
    return { total, pages }
  } catch {
    return { total: 0, pages: 1 }
  }
}

export function organizationJsonLd() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#org`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/logo.png`,
    },
    sameAs: [...SOCIAL_PROFILES],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@reifexa.de',
      availableLanguage: ['German', 'de'],
    },
  }
}

export function websiteJsonLd() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    inLanguage: 'de-DE',
    publisher: { '@id': `${SITE_URL}/#org` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/produkte?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
