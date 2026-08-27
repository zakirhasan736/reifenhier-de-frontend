export const PRODUCT_IMAGE_FALLBACK =
  '/images/realistic-complete-set-car-wheels-2.png'

const PLACEHOLDER_HINTS = [
  'realistic-complete-set-car-wheels',
  'product-placeholder',
  '/images/placeholder',
]

function normalizeImageUrl(value?: string | null) {
  const raw = String(value || '').trim()
  if (!raw || raw === '0' || raw === 'null' || raw === 'undefined') return ''
  if (raw.startsWith('http://')) return `https://${raw.slice(7)}`
  return raw
}

function isPlaceholder(url: string) {
  const lower = url.toLowerCase()
  return PLACEHOLDER_HINTS.some(hint => lower.includes(hint))
}

function isUsableImage(url: string) {
  return Boolean(url) && !isPlaceholder(url)
}

export function productImageSrc(
  productImage?: string | string[] | null,
  awinImageUrl?: string | null,
  extra: Array<string | null | undefined> = []
) {
  const fromProduct = (Array.isArray(productImage) ? productImage : [productImage])
    .map(v => normalizeImageUrl(String(v || '')))
    .filter(isUsableImage)

  const remotes = [awinImageUrl, ...extra]
    .map(v => normalizeImageUrl(v))
    .filter(url => isUsableImage(url) && /^https?:\/\//i.test(url))

  const locals = fromProduct.filter(url => !/^https?:\/\//i.test(url))
  const productRemotes = fromProduct.filter(url => /^https?:\/\//i.test(url))

  // Prefer merchant/AWIN remotes so listing and product page show the same image
  // instead of a missing local file falling back to the default wheel.
  const src =
    remotes[0] || productRemotes[0] || locals[0] || PRODUCT_IMAGE_FALLBACK

  const fallbacks = [...new Set([...remotes, ...productRemotes, ...locals, PRODUCT_IMAGE_FALLBACK])]
    .filter(url => url && url !== src)

  return { src, fallbacks }
}
