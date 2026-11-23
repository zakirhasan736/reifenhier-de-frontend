'use client'

import { useEffect, useRef } from 'react'

type TapAnimation = { destroy: () => void }

/** Plays the original hand-tap Lottie. The file is already white with a dark blue outline. */
export function playTapHand(container: HTMLElement): Promise<TapAnimation | null> {
    return import('lottie-web/build/player/lottie_light')
    .then((mod) => {
      const lottie = mod.default
      return lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/lottie/hand-tap.json',
      })
    })
    .catch(() => null)
}

export default function FingerHand({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    let animation: TapAnimation | null = null
    let cancelled = false
    playTapHand(node).then((item) => {
      if (cancelled) item?.destroy()
      else animation = item
    })
    return () => {
      cancelled = true
      animation?.destroy()
    }
  }, [])

  return <span ref={ref} className={className} aria-hidden />
}
