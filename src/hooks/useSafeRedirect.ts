// hooks/useSafeRedirect.ts
export function getRedirectLink(
  offer: any,
  productId: string,
  uuid: string = 'guest'
) {
  const clickId = offer.original_affiliate_url?.split('p=')[1]?.split('&')[0];

  if (!clickId || !productId) return null;

  return `/out/${clickId}?product=${productId}&uuid=${uuid}&from=product-page`;
}
