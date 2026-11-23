'use client'

import { useEffect } from 'react'
import FingerHand from '@/components/elements/FingerHand'
import { createRoot, type Root } from 'react-dom/client'

/** Finger and pulse only on the cookie "Alle akzeptieren" button. */
export default function ConsentFinger() {
  useEffect(() => {
    let root: Root | null = null
    let host: HTMLSpanElement | null = null

    const attach = () => {
      const button = document.querySelector<HTMLButtonElement>('#silktide-banner button.accept-all')
      if (!button || button.querySelector('.offer-hand')) return
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
    const observer = new MutationObserver(attach)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      root?.unmount()
      host?.remove()
    }
  }, [])

  return null
}
