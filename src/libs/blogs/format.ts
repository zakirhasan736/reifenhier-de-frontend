import type { ContentBlock } from './mongo'

/** WordPress titles/excerpts come as HTML — plain text for cards and alt text. */
export function stripHtml(html?: string): string {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&hellip;|&#8230;/g, '…')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, '’')
    .replace(/\s+/g, ' ')
    .trim()
}

export function formatBlogDate(d?: string): string {
  if (!d) return ''
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** ~200 words per minute, at least 1 minute. */
export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/** Total time readers spent on an article: 4500 → "1 Std. 15 Min." */
export function formatReadTotal(seconds?: number): string {
  const totalMinutes = Math.floor((Number(seconds) || 0) / 60)
  if (totalMinutes < 1) return ''
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours < 1) return `${minutes} Min.`
  const h = hours.toLocaleString('de-DE')
  return minutes ? `${h} Std. ${minutes} Min.` : `${h} Std.`
}

export function blocksText(groups?: ContentBlock[][]): string {
  return (groups || [])
    .flat()
    .map(b => [b?.text, ...(b?.items || [])].filter(Boolean).join(' '))
    .join(' ')
}

/** Stable anchor id for a heading: "Was ist das EU-Label?" → "was-ist-das-eu-label" */
export function headingId(text?: string): string {
  return String(text || '')
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** h2 headings of a Mongo article, for the table of contents. */
export function tocFromBlocks(groups?: ContentBlock[][]) {
  return normalizeBlockHeadings(groups)
    .flat()
    .filter(b => b?.type === 'heading' && b.level === 'h2' && b.text)
    .map(b => ({ id: headingId(b.text), text: String(b.text) }))
}

type HLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

/**
 * Clean heading outline under the page's single <h1>: the levels an article
 * actually uses are ranked (shallowest → h2, next → h3 …) and no heading may
 * skip a level (h2 → h4 becomes h2 → h3). Fixes "poor heading hierarchy"
 * for content authored as h3/h5 without touching the stored article.
 */
export function normalizeLevels(levels: number[]): number[] {
  const used = Array.from(new Set(levels)).sort((a, b) => a - b)
  let prev = 1
  return levels.map(l => {
    const ranked = 2 + used.indexOf(l)
    const out = Math.min(ranked, prev + 1, 6)
    prev = out
    return out
  })
}

export function normalizeBlockHeadings(groups?: ContentBlock[][]): ContentBlock[][] {
  const list = groups || []
  const heads = list.flat().filter(b => b?.type === 'heading')
  const levels = heads.map(b => Number(String(b.level || 'h3').slice(1)) || 3)
  const norm = normalizeLevels(levels)
  const map = new Map<ContentBlock, number>(heads.map((b, i) => [b, norm[i]]))
  return list.map(g =>
    (g || []).map(b => (map.has(b) ? ({ ...b, level: `h${map.get(b)}` as HLevel } as ContentBlock) : b))
  )
}

/** Same for WordPress HTML: rewrites <hN> tags; an <h1> in the body counts as a heading too. */
export function normalizeHtmlHeadings(html: string): string {
  const rx = /<(\/?)h([1-6])(\b[^>]*)>/gi
  const opens = [...html.matchAll(rx)].filter(m => !m[1]).map(m => Number(m[2]))
  const out = normalizeLevels(opens)
  let i = 0
  const stack: number[] = []
  return html.replace(rx, (_f, close: string, _lvl: string, attrs: string) => {
    if (!close) {
      const l = out[i++]
      stack.push(l)
      return `<h${l}${attrs}>`
    }
    return `</h${stack.pop() ?? _lvl}>`
  })
}
