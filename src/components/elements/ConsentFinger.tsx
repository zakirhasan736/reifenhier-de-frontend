'use client'

import { useEffect } from 'react'
import { playTapHand } from '@/components/elements/FingerHand'

type Lottie = { destroy: () => void; pause?: () => void; play?: () => void }

const HAND = 150
// where the finger tip sits inside the hand animation box (share of width / height)
const TIP_X = 0.42
const TIP_Y = 0.32

function allowButton() {
  const named = document.querySelector<HTMLButtonElement>('#silktide-banner button.accept-all')
  if (named) return named
  return (
    [...document.querySelectorAll<HTMLButtonElement>('#silktide-banner button')].find((button) => /alle akzeptieren/i.test(button.textContent || '')) || null
  )
}

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Cookie banner guide: a big hand appears in the middle of the screen tilted
 * 45°, glides to "Alle akzeptieren" while turning upright, then taps it with a
 * pulsing ring. Clicking anywhere on the dark page behind the banner plays it
 * again, shakes the banner and shows a hint – so nobody is left wondering why
 * the page does not react.
 */
export default function ConsentFinger() {
  useEffect(() => {
    let shade: HTMLDivElement | null = null
    let hand: HTMLSpanElement | null = null
    let ring: HTMLSpanElement | null = null
    let lottie: Lottie | null = null
    let move: Animation | null = null
    let started = false
    let backdropBound: HTMLElement | null = null

    const target = () => {
      const button = allowButton()
      if (!button) return null
      const r = button.getBoundingClientRect()
      if (!r.width) return null
      return { button, r }
    }

    /** Hand position so the finger tip touches the button's right third. */
    const handAt = (r: DOMRect) => ({
      x: r.left + r.width * 0.72 - HAND * TIP_X,
      y: r.top + r.height * 0.55 - HAND * TIP_Y,
    })

    const placeRing = (r: DOMRect) => {
      if (!ring) return
      Object.assign(ring.style, { left: `${r.left - 4}px`, top: `${r.top - 4}px`, width: `${r.width + 8}px`, height: `${r.height + 8}px` })
    }

    const settle = () => {
      const t = target()
      if (!t || !hand) return
      const { x, y } = handAt(t.r)
      hand.style.transform = `translate(${x}px, ${y}px) rotate(0deg)`
      placeRing(t.r)
    }

    /** Fly from the middle of the screen (45°) to the button (upright), then tap. */
    const guide = () => {
      const t = target()
      if (!t || !hand) return
      move?.cancel()
      lottie?.pause?.()
      ring?.classList.remove('on')
      const end = handAt(t.r)
      placeRing(t.r)
      const sx = window.innerWidth / 2 - HAND / 2
      const sy = Math.max(80, Math.min(window.innerHeight * 0.42, t.r.top - 200))
      if (reduced()) {
        settle()
        hand.style.opacity = '1'
        ring?.classList.add('on')
        return
      }
      move = hand.animate(
        [
          { transform: `translate(${sx}px, ${sy}px) rotate(45deg) scale(0.6)`, opacity: 0 },
          { transform: `translate(${sx}px, ${sy}px) rotate(45deg) scale(1)`, opacity: 1, offset: 0.18 },
          { transform: `translate(${(sx + end.x) / 2}px, ${(sy + end.y) / 2 - 30}px) rotate(20deg) scale(1)`, opacity: 1, offset: 0.6 },
          { transform: `translate(${end.x}px, ${end.y}px) rotate(0deg) scale(1)`, opacity: 1 },
        ],
        { duration: 1500, easing: 'cubic-bezier(.45,.05,.25,1)', fill: 'forwards' }
      )
      move.onfinish = () => {
        settle()
        if (hand) hand.style.opacity = '1'
        move?.cancel() // inline styles take over, so resize/scroll can move the hand
        lottie?.play?.()
        ring?.classList.add('on')
        t.button.classList.add('offer-pulse')
      }
    }

    const nudge = () => {
      const banner = document.getElementById('silktide-banner')
      if (!banner) return
      if (!banner.querySelector('.rx-ck-hint')) {
        const hint = document.createElement('p')
        hint.className = 'rx-ck-hint'
        hint.textContent = '👆 Bitte zuerst hier eine Auswahl treffen – danach können Sie die Seite nutzen.'
        banner.appendChild(hint)
      }
      banner.classList.remove('rx-ck-shake')
      void banner.offsetWidth // restart the shake animation
      banner.classList.add('rx-ck-nudge', 'rx-ck-shake')
      guide()
    }

    const cleanup = () => {
      move?.cancel()
      lottie?.destroy()
      lottie = null
      hand?.remove()
      ring?.remove()
      shade?.remove()
      hand = null
      ring = null
      shade = null
      document.documentElement.classList.remove('rx-ck-open')
      started = false
      backdropBound?.removeEventListener('pointerdown', onBackdrop)
      backdropBound = null
    }

    function onBackdrop(e: Event) {
      e.preventDefault()
      e.stopPropagation()
      nudge()
    }

    const check = () => {
      const t = target()
      if (!t) {
        // "Einstellungen" open: keep the dark layer, hide the hand
        const modal = document.getElementById('silktide-modal')
        const modalOpen = !!modal && getComputedStyle(modal).display !== 'none'
        if (started && modalOpen) {
          if (hand) hand.style.opacity = '0'
          ring?.classList.remove('on')
          return
        }
        if (started) cleanup()
        return
      }
      const backdrop = document.getElementById('silktide-backdrop')
      if (backdrop && backdrop !== backdropBound) {
        backdropBound?.removeEventListener('pointerdown', onBackdrop)
        backdrop.addEventListener('pointerdown', onBackdrop)
        backdropBound = backdrop
      }
      if (started) return
      started = true
      // our own dark layer: the page behind is dimmed and a click there shows the way
      shade = document.createElement('div')
      shade.className = 'rx-ck-shade'
      shade.setAttribute('aria-hidden', 'true')
      shade.addEventListener('pointerdown', onBackdrop)
      document.body.appendChild(shade)
      document.documentElement.classList.add('rx-ck-open')
      hand = document.createElement('span')
      hand.className = 'rx-ck-hand'
      hand.setAttribute('aria-hidden', 'true')
      hand.style.opacity = '0'
      ring = document.createElement('span')
      ring.className = 'rx-ck-ring'
      ring.setAttribute('aria-hidden', 'true')
      document.body.append(ring, hand)
      void playTapHand(hand).then((item) => {
        if (!hand) {
          item?.destroy()
          return
        }
        lottie = item as Lottie | null
        lottie?.pause?.()
        // let the banner finish sliding in, then show the way
        window.setTimeout(guide, 350)
      })
    }

    check()
    const timer = window.setInterval(check, 150)
    const observer = new MutationObserver(check)
    observer.observe(document.body, { childList: true, subtree: true })
    const onResize = () => started && settle()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, { passive: true })
    // replay every 9 s while nobody has chosen yet
    const replay = window.setInterval(() => started && document.visibilityState === 'visible' && guide(), 9000)
    // stop polling after a while; the observer keeps watching for the banner closing
    const stop = window.setTimeout(() => window.clearInterval(timer), 30000)

    return () => {
      window.clearInterval(timer)
      window.clearInterval(replay)
      window.clearTimeout(stop)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize)
      cleanup()
    }
  }, [])

  return null
}
