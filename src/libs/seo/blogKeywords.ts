import { CORE_KEYWORDS } from '@/libs/seo/site'

const ARTICLE_CORE = [
  'Reifenpreisvergleich',
  'Reifen vergleichen',
  'Reifen online kaufen',
  'günstige Reifen',
  'Reifen Test 2026',
  'Sommerreifen 2026',
  'Winterreifen 2026',
  'Ganzjahresreifen 2026',
  'EU-Reifenlabel',
  'Reifenrechner',
  'Reifengröße finden',
  'Reifen Händler vergleichen',
  'Reifen kaufen Deutschland',
  'Reifexa',
  'reifenhier',
  'reifencheck',
]

export function buildArticleKeywords(opts: {
  title?: string
  tags?: string[]
  extra?: string[]
}): string[] {
  const titleTerms = String(opts.title || '')
    .replace(/[|:–—]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 3 && !/^\d+$/.test(w))
    .slice(0, 10)

  return Array.from(
    new Set(
      [
        ...(opts.tags || []),
        ...titleTerms,
        ...ARTICLE_CORE,
        ...(opts.extra || []),
        ...CORE_KEYWORDS.slice(0, 12),
      ]
        .map(k => String(k || '').replace(/\s+/g, ' ').trim())
        .filter(Boolean)
    )
  )
}
