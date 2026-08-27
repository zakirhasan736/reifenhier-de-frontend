export const PRODUCT_IMAGE_FALLBACK =
  '/images/realistic-complete-set-car-wheels-2.png'

export function productImageSrc(
  productImage?: string | string[] | null,
  awinImageUrl?: string | null
) {
  const primary = Array.isArray(productImage)
    ? String(productImage[0] || '').trim()
    : String(productImage || '').trim()
  const awin = String(awinImageUrl || '').trim()
  const src = primary || awin || PRODUCT_IMAGE_FALLBACK
  const fallbacks = [awin, PRODUCT_IMAGE_FALLBACK].filter(
    url => url && url !== src
  )
  return { src, fallbacks }
}
