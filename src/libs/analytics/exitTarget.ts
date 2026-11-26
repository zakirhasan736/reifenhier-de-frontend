/**
 * Where a shop link opens.
 *
 * auto (default): same tab on phones, tablets and in-app browsers (Instagram,
 *   Facebook, TikTok, Google app, Android WebView), a new tab on desktop.
 * same / new: force one behaviour everywhere (NEXT_PUBLIC_VENDOR_EXIT_TARGET).
 */
export type ExitMode = 'auto' | 'same' | 'new'

const MODE = (process.env.NEXT_PUBLIC_VENDOR_EXIT_TARGET || 'auto').toLowerCase() as ExitMode

const IN_APP = /FBAN|FBAV|FB_IAB|Instagram|TikTok|musical_ly|Snapchat|Pinterest|LinkedInApp|Line\/|GSA\/|; wv\)/i

export function exitTargetFor(env: { mode?: ExitMode; ua: string; coarse: boolean; width: number }): '_self' | '_blank' {
  const mode = env.mode || 'auto'
  if (mode === 'same') return '_self'
  if (mode === 'new') return '_blank'
  if (IN_APP.test(env.ua)) return '_self'
  if (env.coarse || env.width < 1024) return '_self'
  return '_blank'
}

export function exitTarget(): '_self' | '_blank' {
  if (typeof window === 'undefined') return '_self'
  let coarse = false
  try {
    coarse = window.matchMedia('(pointer: coarse)').matches
  } catch {
    // old browsers: decide by width only
  }
  return exitTargetFor({ mode: MODE, ua: navigator.userAgent || '', coarse, width: window.innerWidth })
}

/**
 * Same-tab exit: requests still running on this page are cancelled by the
 * browser. Mark the moment so the error filter in layout.tsx can drop those
 * "Failed to fetch" / "Load failed" rejections — they are not real errors.
 */
export function markLeaving() {
  try {
    ;(window as Window & { __rxLeaving?: number }).__rxLeaving = Date.now()
  } catch {
    // ignore
  }
}
