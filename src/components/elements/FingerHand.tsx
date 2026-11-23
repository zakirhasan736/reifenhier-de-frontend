'use client'

import { useEffect, useRef } from 'react'

/** Tapping-hand Lottie. It never receives clicks. */
export default function FingerHand({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    let cancelled = false
    let animation: { destroy: () => void } | null = null
    import('lottie-web').then((mod) => {
      if (cancelled || !node) return
      animation = mod.default.loadAnimation({
        container: node,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/lottie/hand-tap.json',
      })
    }).catch(() => undefined)
    return () => {
      cancelled = true
      animation?.destroy()
    }
  }, [])

  return <span ref={ref} className={className} aria-hidden />
}
