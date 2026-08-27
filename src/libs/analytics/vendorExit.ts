import { getOrCreateUuid } from '@/utils/uuid'
import { trackProductInterest } from '@/libs/push/priceAlerts'

const API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')

export type VendorExitParams = {
  token: string
  productId?: string
  uuid?: string
  from?: string
  vendor?: string
  vendorId?: string
  brand?: string
  /** CTA / button label stored as instruction */
  instruction?: string
  behavior?: string
}

/** Same-origin bounce path — avoids adblock lists that kill /out/ and "affiliate". */
export function buildVendorExitUrl(params: VendorExitParams): string {
  const token = (params.token || '').trim()
  if (!token) return '#'

  const q = new URLSearchParams()
  q.set('t', token)
  if (params.productId) q.set('product', params.productId)
  q.set('uuid', params.uuid || getOrCreateUuid())
  if (params.from) q.set('from', params.from)
  if (params.vendor) q.set('vendor', params.vendor)
  if (params.vendorId) q.set('vendorId', params.vendorId)
  if (params.brand) q.set('brand', params.brand)
  if (params.instruction) q.set('instruction', params.instruction)
  q.set('behavior', params.behavior || 'vendor_exit')

  return `/to?${q.toString()}`
}

/** Fire-and-forget behavior ping (does not block navigation). */
export function trackBehavior(payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify({
      uuid: getOrCreateUuid(),
      ...payload,
    })
    if (typeof navigator !== 'undefined' && navigator.sendBeacon && API) {
      const blob = new Blob([body], { type: 'text/plain' })
      navigator.sendBeacon(`${API}/api/v1/e`, blob)
      return
    }
    if (API) {
      void fetch(`${API}/api/v1/e`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      })
    }
  } catch {
    // ignore
  }
}

export function onVendorExitClick(opts: {
  productId?: string
  productName?: string
  brandName?: string
  vendor?: string
  vendorId?: string
  source?: string
  instruction?: string
  page?: string
  vendorPrice?: number
}) {
  trackBehavior({
    type: 'vendor_exit',
    action: 'open_vendor',
    page:
      opts.page ||
      (typeof window !== 'undefined' ? window.location.pathname : '/'),
    instruction: opts.instruction || opts.source || 'Zum Angebot',
    productId: opts.productId,
    vendor: opts.vendor,
    vendorId: opts.vendorId,
    meta: {
      productName: opts.productName,
      brandName: opts.brandName,
      source: opts.source,
    },
  })

  if (opts.productId) {
    const isPurchase = /angebot|kaufen|shop/i.test(opts.instruction || '')
    trackProductInterest({
      productId: opts.productId,
      source: isPurchase ? 'purchase_intent' : 'vendor_click',
      vendor: opts.vendor,
      vendorId: opts.vendorId,
      vendorPrice: opts.vendorPrice,
      notifyEnabled: true,
    })
  }
}
