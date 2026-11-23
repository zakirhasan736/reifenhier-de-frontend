'use client'

import { useEffect } from 'react'
import { HAND_SVG } from '@/components/elements/FingerHand'

/** Finger and pulse once, only on the cookie "Alle akzeptieren" button. */
export default function ConsentFinger() {
  useEffect(() => {
    let host: HTMLSpanElement | null = null
    let tries = 0
    let timer = 0

    const attach = () => {
      const button = document.querySelector<HTMLButtonElement>('#silktide-banner button.accept-all')
      if (!button || button.dataset.hand === '1') return
      button.dataset.hand = '1'
      button.classList.add('offer-pulse')
      if (!button.querySelector('.offer-ping')) {
        const ping = document.createElement('span')
        ping.className = 'offer-ping'
        ping.setAttribute('aria-hidden', 'true')
        button.prepend(ping)
      }
      host?.remove()
      host = document.createElement('span')
      host.className = 'offer-hand'
      host.setAttribute('aria-hidden', 'true')
      host.innerHTML = HAND_SVG
      button.appendChild(host)
    }

    attach()
    timer = window.setInterval(() => {
      tries += 1
      attach()
      if (tries >= 40) window.clearInterval(timer)
    }, 300)

    return () => {
      window.clearInterval(timer)
      host?.remove()
    }
  }, [])

  return null
}
