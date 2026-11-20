/**
 * Long-tail keyword sets per page type (German market).
 *
 * Google ignores <meta name="keywords">, so these lists matter for Bing, Yandex,
 * Ecosia, Qwant, Seznam and AI crawlers. For Google, the same phrases are used
 * in visible copy, link anchors and JSON-LD (see RelatedSearches and the
 * article/landing pages). Lists stay short and specific: 10–25 phrases per
 * page, de-duplicated case-insensitively.
 */
import { sizeLabel, type TyreSize } from './landing'

/** Comparison intent – German equivalents of "tire comparison tool/website". */
export const COMPARISON_KEYWORDS = [
  'Reifenvergleich',
  'Reifen Vergleich',
  'Reifen vergleichen',
  'Reifenpreisvergleich',
  'Reifen Preisvergleich',
  'Reifen Vergleichsportal',
  'bestes Reifen Vergleichsportal',
  'Reifen Vergleich Tool',
  'Reifen nebeneinander vergleichen',
  'Autoreifen Vergleich',
  'Autoreifen günstig',
  'Reifen Händler vergleichen',
  'Reifenpreise vergleichen',
] as const

/** Size intent – "tire size comparison chart side by side" & co. */
export const SIZE_TOOL_KEYWORDS = [
  'Reifengrößenrechner',
  'Reifengrößen vergleichen',
  'Reifengrößen Vergleich',
  'Reifengrößen Tabelle',
  'Reifengrößen Rechner Tacho',
  'Reifen Abrollumfang Rechner',
  'Reifendurchmesser berechnen',
  'Umrüstgrößen Reifen',
  'Alternative Reifengröße',
  'Felgen und Reifen vergleichen',
] as const

/** Brand & feature terms people search for Reifexa-type sites. */
export const BRAND_KEYWORDS = [
  'Reifexa',
  'reifexa.de',
  'Reifencheck',
  'Reifen Check',
  'Reifen Preisverlauf',
  'Reifen Preisalarm',
] as const

export function uniqKeywords(list: Array<string | false | null | undefined>, max = 40): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of list) {
    if (!raw) continue
    const k = String(raw).replace(/\s+/g, ' ').trim()
    const key = k.toLowerCase()
    if (!k || seen.has(key)) continue
    seen.add(key)
    out.push(k)
    if (out.length >= max) break
  }
  return out
}

/** "205/55 R16" plus the spellings people type: "205/55R16", "205 55 16". */
export function sizeSpellings(s: TyreSize): string[] {
  return [sizeLabel(s), `${s.width}/${s.height}R${s.diameter}`, `${s.width} ${s.height} R${s.diameter}`]
}

// ---------------------------------------------------------------- pages

export const HOME_KEYWORDS = uniqKeywords([
  ...COMPARISON_KEYWORDS,
  'Reifen günstig kaufen',
  'Reifen online kaufen',
  'Winterreifen günstig',
  'Sommerreifen günstig',
  'Ganzjahresreifen günstig',
  'Winterreifen 205/55 R16',
  'Ganzjahresreifen 205/55 R16',
  'Sommerreifen 225/45 R17',
  'Reifen Angebote',
  'Markenreifen günstig',
  ...SIZE_TOOL_KEYWORDS.slice(0, 3),
  ...BRAND_KEYWORDS,
])

export const ARTICLE_LIST_KEYWORDS = uniqKeywords([
  'Reifen Ratgeber',
  'Reifen Ratgeber 2026',
  'Reifentest 2026',
  'Winterreifen Test 2026',
  'Ganzjahresreifen Test 2026',
  'Sommerreifen Test 2026',
  'Reifentest Vergleich',
  'Reifen Leistung vergleichen',
  'Reifencheck',
  'Profiltiefe messen',
  'Reifenalter DOT',
  'EU-Reifenlabel erklärt',
  'Reifengröße ablesen',
  'Winterreifenpflicht Deutschland',
  'Reifen Kaufberatung',
  'Reifenpreisvergleich',
  'Reifexa',
])

export function listingKeywords(category?: string): string[] {
  if (category) {
    return uniqKeywords([
      `${category} günstig`,
      `${category} Angebote`,
      `${category} kaufen`,
      `${category} Preisvergleich`,
      `${category} online kaufen`,
      `${category} Vergleich`,
      `${category} 205/55 R16`,
      `${category} 225/45 R17`,
      `${category} Test 2026`,
      `Marken ${category} günstig`,
      'Reifenpreisvergleich',
      'Reifexa',
    ])
  }
  return uniqKeywords([
    'Reifen kaufen',
    'Reifen online kaufen',
    'Reifen günstig',
    'Reifen Angebote',
    'Reifenangebote',
    'Reifen nach Größe',
    'Reifen nach Marke',
    'Sommerreifen günstig',
    'Winterreifen günstig',
    'Ganzjahresreifen günstig',
    ...COMPARISON_KEYWORDS.slice(0, 6),
    'Reifexa',
  ])
}

export function seasonKeywords(label: string, short: string): string[] {
  return uniqKeywords([
    `${label} günstig`,
    `${label} günstig kaufen`,
    `${label} Preisvergleich`,
    `${label} Angebote`,
    `${label} Test 2026`,
    `${label} Vergleich`,
    `${label} online kaufen`,
    `${label} 205/55 R16`,
    `${label} 225/45 R17`,
    `${label} 195/65 R15`,
    `${short}reifen Marken`,
    `${label} Michelin`,
    `${label} Continental`,
    'Reifenpreisvergleich',
    'Reifexa',
  ])
}

export function sizeKeywords(s: TyreSize): string[] {
  const [label, compact, spaced] = sizeSpellings(s)
  return uniqKeywords([
    `${label} Reifen`,
    `${label} Reifen günstig`,
    `${label} Preisvergleich`,
    `Winterreifen ${label}`,
    `Sommerreifen ${label}`,
    `Ganzjahresreifen ${label}`,
    `Allwetterreifen ${label}`,
    `${label} Test`,
    `${compact}`,
    `${spaced}`,
    `${s.diameter} Zoll Reifen`,
    `Alternative Größe zu ${label}`,
    'Reifenpreisvergleich',
    'Reifexa',
  ])
}

export function brandKeywords(name: string): string[] {
  return uniqKeywords([
    `${name} Reifen`,
    `${name} Reifen günstig`,
    `${name} Reifen Preisvergleich`,
    `${name} Winterreifen`,
    `${name} Sommerreifen`,
    `${name} Ganzjahresreifen`,
    `${name} Reifen Test`,
    `${name} Reifen kaufen`,
    `${name} 205/55 R16`,
    `${name} Reifen Erfahrungen`,
    'Reifenmarken Vergleich',
    'Reifenpreisvergleich',
    'Reifexa',
  ])
}

export const SIZES_INDEX_KEYWORDS = uniqKeywords([
  'Reifengrößen',
  'Reifengrößen Tabelle',
  'Reifengrößen Übersicht',
  'Reifen nach Größe',
  'Reifengröße finden',
  'Reifengröße ablesen',
  ...SIZE_TOOL_KEYWORDS,
  'Reifenpreisvergleich',
  'Reifexa',
])

export const BRANDS_INDEX_KEYWORDS = uniqKeywords([
  'Reifenmarken',
  'Reifenmarken Übersicht',
  'Reifenmarken Vergleich',
  'beste Reifenmarken',
  'Premiumreifen',
  'Budgetreifen',
  'Michelin Reifen',
  'Continental Reifen',
  'Bridgestone Reifen',
  'Goodyear Reifen',
  'Pirelli Reifen',
  'Hankook Reifen',
  'Reifenpreisvergleich',
  'Reifexa',
])

// ---------------------------------------------------------------- articles

const ARTICLE_DEFAULTS = ['Reifen Ratgeber 2026', 'Reifenpreisvergleich', 'Reifen vergleichen', 'Reifexa']

/** Topic → long-tails that appear in the article body (keyword clusters). */
const ARTICLE_TOPICS: Array<{ test: RegExp; keywords: string[] }> = [
  { test: /winter/i, keywords: ['Winterreifen 2026', 'Winterreifen Test 2026', 'Winterreifen günstig', 'Winterreifenpflicht Deutschland', 'Alpine-Symbol'] },
  { test: /sommer/i, keywords: ['Sommerreifen 2026', 'Sommerreifen Test 2026', 'Sommerreifen günstig'] },
  { test: /ganzjahr|allwetter/i, keywords: ['Ganzjahresreifen 2026', 'Ganzjahresreifen Test 2026', 'Allwetterreifen Vergleich'] },
  { test: /preisvergleich|vergleich|günstig|sparen|preis/i, keywords: ['Reifenpreisvergleich', 'Reifen Vergleichsportal', 'Reifenpreise vergleichen', 'Reifen günstig kaufen'] },
  { test: /check|prüfen|profil|dot|alter|druck/i, keywords: ['Reifencheck', 'Reifen prüfen', 'Profiltiefe messen', 'Reifenalter DOT', 'Reifendruck prüfen'] },
  { test: /größe|groesse|rechner|zoll|felge/i, keywords: ['Reifengröße ablesen', 'Reifengrößenrechner', 'Reifengrößen vergleichen', 'Felgen und Reifen'] },
  { test: /label|nasshaftung|rollwiderstand|geräusch/i, keywords: ['EU-Reifenlabel', 'Nasshaftung', 'Rollwiderstand', 'Rollgeräusch dB'] },
  { test: /test|testsieger|bewertung/i, keywords: ['Reifentest 2026', 'Reifentest Vergleich', 'Reifen Leistung vergleichen', 'Testsieger Reifen'] },
  { test: /suv|e-auto|elektro|ev\b/i, keywords: ['SUV Reifen', 'Elektroauto Reifen', 'E-Auto Reifen'] },
  { test: /wechsel|montage|lager/i, keywords: ['Reifenwechsel', 'Reifenwechsel Kosten', 'Reifen einlagern'] },
]

/** Title phrase pieces ("Winterreifen 2026: Test & Kaufberatung" → whole phrases, not single words). */
function titlePhrases(title: string): string[] {
  return title
    .split(/\s*[|:–—?!]\s*|\s+-\s+/)
    .map(s => s.replace(/[„“"()]/g, '').trim())
    .filter(s => s.length >= 6 && s.split(/\s+/).length <= 7)
    .slice(0, 4)
}

export function articleKeywords(opts: { title?: string; tags?: string[]; extra?: string[] }): string[] {
  const title = String(opts.title || '')
  const haystack = [title, ...(opts.tags || [])].join(' ')
  const topical = ARTICLE_TOPICS.filter(t => t.test.test(haystack)).flatMap(t => t.keywords)
  return uniqKeywords(
    [title, ...titlePhrases(title), ...(opts.tags || []), ...topical, ...(opts.extra || []), ...ARTICLE_DEFAULTS],
    25
  )
}

/** Visible topic links under an article – landing pages only (no filter URLs). */
export function articleRelatedLinks(opts: { title?: string; tags?: string[] }): Array<{ label: string; href: string }> {
  const h = [opts.title || '', ...(opts.tags || [])].join(' ')
  const links: Array<{ label: string; href: string }> = []
  if (/winter/i.test(h)) links.push({ label: 'Winterreifen günstig vergleichen', href: '/winterreifen' })
  if (/sommer/i.test(h)) links.push({ label: 'Sommerreifen günstig vergleichen', href: '/sommerreifen' })
  if (/ganzjahr|allwetter/i.test(h)) links.push({ label: 'Ganzjahresreifen günstig vergleichen', href: '/ganzjahresreifen' })
  if (/größe|groesse|rechner|zoll|felge|umrüst/i.test(h)) links.push({ label: 'Reifengrößenrechner', href: '/reifengroessen-rechner' })
  if (/marke|test|testsieger|michelin|continental|premium|budget/i.test(h)) links.push({ label: 'Reifenmarken vergleichen', href: '/marken' })
  links.push({ label: 'Reifen nach Größe finden', href: '/reifen' })
  links.push({ label: 'Reifenpreisvergleich', href: '/reifenpreisvergleich' })
  if (!links.some(l => l.href === '/reifengroessen-rechner')) links.push({ label: 'Reifengrößen vergleichen', href: '/reifengroessen-rechner' })
  if (!/winter|sommer|ganzjahr|allwetter/i.test(h)) links.push({ label: 'Winterreifen im Preisvergleich', href: '/winterreifen' })
  return links.slice(0, 6)
}
