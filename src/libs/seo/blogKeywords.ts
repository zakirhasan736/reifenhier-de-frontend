import { articleKeywords } from '@/libs/seo/keywords'

/**
 * Article keywords: the title, whole phrases from it, tags, topic long-tails
 * (Winterreifen 2026, Reifencheck, Reifengrößenrechner …) and a few defaults.
 * Phrases instead of single title words, max. 25 entries.
 */
export function buildArticleKeywords(opts: {
  title?: string
  tags?: string[]
  extra?: string[]
}): string[] {
  return articleKeywords(opts)
}
