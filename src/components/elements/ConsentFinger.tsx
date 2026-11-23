'use client'

import { useEffect } from 'react'
import FingerHand from '@/components/elements/FingerHand'
import { createRoot, type Root } from 'react-dom/client'

/** Finger and pulse once, only on the cookie "Alle akzeptieren" button. */
export default function ConsentFinger() {
  useEffect(() => {
    let root: Root | null = null
    let host: HTMLSpanElement | null = null
    let done = false
    let tries = 0
    let timer = 0

    const attach = () => {
      if (done) return
      const button = document.querySelector<HTMLButtonElement>('#silktide-banner button.accept-all')
      if (!button || button.dataset.hand === '1') return
      done = true
      window.clearInterval(timer)
      button.dataset.hand = '1'
      button.classList.add('offer-pulse')
      if (!button.querySelector('.offer-ping')) {
        const ping = document.createElement('span')
        ping.className = 'offer-ping'
        ping.setAttribute('aria-hidden', 'true')
        button.prepend(ping)
      }
      host = document.createElement('span')
      button.appendChild(host)
      root = createRoot(host)
      root.render(<FingerHand className="offer-hand" />)
    }

    attach()
    timer = window.setInterval(() => {
      tries += 1
      attach()
      if (done || tries >= 40) window.clearInterval(timer)
    }, 300)

    return () => {
      window.clearInterval(timer)
      root?.unmount()
      host?.remove()
    }
  }, [])

  return null
}
