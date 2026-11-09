import { NextResponse, type NextRequest } from 'next/server'
import { SITE_URL, getApiBase } from '@/libs/seo/site'

/**
 * Legacy /go/<aw_product_id>?from=reifendb paths.
 *
 * The backend stores this path as an internal offer label; it was never a
 * working page, but Google found it in older page HTML and reports it as
 * "Not found (404)". This route resolves it cleanly:
 *   - product still exists → 301 to its product page (one canonical URL)
 *   - product gone         → 410 Gone, so Google drops the URL faster
 *
 * Deliberately NOT a vendor exit: it never sends anyone to a shop, so crawlers
 * hitting it can't create fake AWIN clicks. Real clicks keep using
 * /to?t=… → backend /r/:token, which is untouched.
 */
export const revalidate = 3600

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const awId = String(id || '').trim()

  if (/^\d{4,20}$/.test(awId)) {
    try {
      const res = await fetch(
        `${getApiBase()}/api/products/go-lookup/${encodeURIComponent(awId)}`,
        { next: { revalidate: 3600 } }
      )
      if (res.ok) {
        const data = (await res.json()) as { slug?: string }
        if (data?.slug) {
          return NextResponse.redirect(
            `${SITE_URL}/produkte/${encodeURIComponent(data.slug)}`,
            301
          )
        }
      } else if (res.status >= 500) {
        // API trouble: temporary answer, don't tell Google the page is gone.
        return new NextResponse('Vorübergehend nicht verfügbar', {
          status: 503,
          headers: { 'Retry-After': '3600', 'X-Robots-Tag': 'noindex' },
        })
      }
    } catch {
      return new NextResponse('Vorübergehend nicht verfügbar', {
        status: 503,
        headers: { 'Retry-After': '3600', 'X-Robots-Tag': 'noindex' },
      })
    }
  }

  return new NextResponse('Dieses Angebot ist nicht mehr verfügbar.', {
    status: 410,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
