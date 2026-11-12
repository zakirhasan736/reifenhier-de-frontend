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
  return (groups || [])
    .flat()
    .filter(b => b?.type === 'heading' && (b.level === 'h2' || b.level === 'h1') && b.text)
    .map(b => ({ id: headingId(b.text), text: String(b.text) }))
}
