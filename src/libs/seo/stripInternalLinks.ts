/**
 * The backend stores an internal label like "/go/<aw_product_id>?from=reifendb"
 * in offer fields (aw_deep_link, product_url, zum_angebot_url). Nothing on the
 * site links to it — vendor clicks go /to?t=… → backend /r/:token → AWIN —
 * but when product data is passed to client components Next embeds it in the
 * page HTML, Googlebot picks the path up and crawls www.reifexa.de/go/…
 * (Search Console "Not found (404)").
 *
 * This removes ONLY string values that start with "/go/". Real affiliate URLs,
 * cloak tokens, prices and every other field pass through untouched, and the
 * values stored in the database are not changed.
 */
const INTERNAL_GO_LINK = /^\/go\//

export function stripInternalLinks<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripInternalLinks(v)) as unknown as T
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      if (typeof v === 'string' && INTERNAL_GO_LINK.test(v)) continue
      out[key] = stripInternalLinks(v)
    }
    return out as T
  }
  return value
}
