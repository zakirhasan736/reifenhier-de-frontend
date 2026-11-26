'use client'

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import FingerHand from '@/components/elements/FingerHand'
import { exitTarget, markLeaving } from '@/libs/analytics/exitTarget'

type Props = {
  href: string
  className?: string
  id?: string
  title?: string
  tabIndex?: number
  /** Pulsing finger, only for the product-page Zum Angebot buttons. */
  hand?: boolean
  onExit?: () => void
  children: ReactNode
}

/** Repeat clicks inside this window are ignored: one shop visit, one click. */
const REPEAT_MS = 3000

function sourceOf(href: string) {
  const q = href.indexOf('?')
  if (q < 0) return undefined
  return new URLSearchParams(href.slice(q + 1)).get('from') || undefined
}

/**
 * Shop exit link. The href is the navigation. Tracking runs inside try/catch and
 * never cancels the first click, so a tracking error cannot block the way to the shop.
 *
 * - Phones, tablets and in-app browsers open the shop in the same tab (back button
 *   returns to Reifexa); desktop opens a new tab so the comparison stays open.
 * - Rage clicks (2nd, 3rd … click within 3 s) are swallowed: no second /to request,
 *   no aborted navigation, no double AWIN click.
 */
export default function VendorExitLink({ href, className, id, title, tabIndex, hand = false, onExit, children }: Props) {
  const [pending, setPending] = useState(false)
  const timer = useRef(0)
  const lastClick = useRef(0)

  // Back from the shop (bfcache restore): clear the spinner and allow a new click.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return
      lastClick.current = 0
      setPending(false)
    }
    window.addEventListener('pageshow', onShow)
    return () => {
      window.removeEventListener('pageshow', onShow)
      window.clearTimeout(timer.current)
    }
  }, [])

  if (!href || href === '#') return <span id={id} className={className} aria-disabled="true">{children}</span>

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Ctrl/Cmd/Shift/middle click: the browser opens its own tab. Track it, do not interfere.
    const own = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0
    const now = Date.now()
    if (!own && now - lastClick.current < REPEAT_MS) {
      e.preventDefault()
      return
    }
    lastClick.current = now
    try {
      if (!own) {
        const target = exitTarget()
        if (target === '_blank') e.currentTarget.target = '_blank'
        else {
          e.currentTarget.removeAttribute('target')
          markLeaving()
        }
      }
      setPending(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setPending(false), REPEAT_MS)
      onExit?.()
    } catch {
      // A tracking error must not stop the browser following href.
    }
  }

  return (
    <a
      id={id}
      title={title}
      href={href}
      tabIndex={tabIndex}
      rel="sponsored noopener"
      referrerPolicy="strict-origin-when-cross-origin"
      data-exit={sourceOf(href)}
      data-pending={pending ? '1' : '0'}
      aria-busy={pending}
      className={`vendor-exit-cue ${hand ? 'offer-pulse' : ''} ${className || ''}`}
      onClick={onClick}
    >
      {hand ? <span className="offer-ping" aria-hidden /> : null}
      <span className="vendor-exit-spinner" aria-hidden />
      {children}
      {hand ? <FingerHand className="offer-hand" /> : null}
    </a>
  )
}
