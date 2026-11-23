'use client'

import { useEffect } from 'react'
import { playTapHand } from '@/components/elements/FingerHand'

function allowButton() {
  const named = document.querySelector<HTMLButtonElement>('#silktide-banner button.accept-all, #silktide-banner button.st-button--primary')
  if (named && /akzeptieren/i.test(named.textContent || '')) return named
  return [...document.querySelectorAll<HTMLButtonElement>('#silktide-banner button, #silktide-modal button')].find((button) =>
    /alle akzeptieren/i.test(button.textContent || '')
  ) || null
}

/** Finger and pulse on the cookie "Alle akzeptieren" button, on its right side. */
export default function ConsentFinger() {
  useEffect(() => {
    let host: HTMLSpanElement | null = null
    let animation: { destroy: () => void } | null = null

    const attach = () => {
      const button = allowButton()
      if (!button || button.dataset.hand === '1') return
      button.dataset.hand = '1'
      button.classList.add('offer-pulse')
      button.style.position = 'relative'
      button.style.overflow = 'visible'
      button.style.paddingRight = '48px'
      const banner = document.getElementById('silktide-banner')
      if (banner) banner.style.overflow = 'visible'
      if (!button.querySelector('.offer-ping')) {
        const ping = document.createElement('span')
        ping.className = 'offer-ping'
        ping.setAttribute('aria-hidden', 'true')
        button.prepend(ping)
      }
      animation?.destroy()
      host?.remove()
      host = document.createElement('span')
      host.className = 'offer-hand'
      host.setAttribute('aria-hidden', 'true')
      host.style.cssText = 'position:absolute;right:2px;top:50%;width:44px;height:44px;margin-top:-22px;pointer-events:none;z-index:6;'
      button.appendChild(host)
      void playTapHand(host).then((item) => {
        animation = item
      })
    }

    attach()
    const timer = window.setInterval(attach, 400)
    const observer = new MutationObserver(attach)
    observer.observe(document.body, { childList: true, subtree: true })
    const stop = window.setTimeout(() => {
      window.clearInterval(timer)
      observer.disconnect()
    }, 20000)

    return () => {
      window.clearInterval(timer)
      window.clearTimeout(stop)
      observer.disconnect()
      animation?.destroy()
      host?.remove()
    }
  }, [])

  return null
}
