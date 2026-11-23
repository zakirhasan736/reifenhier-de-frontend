'use client'

import { useRef, useState, type ReactNode } from 'react'
import FingerHand from '@/components/elements/FingerHand'

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

/**
 * Shop exit link. The href is the navigation — tracking and the spinner never
 * call preventDefault, so a click cannot drop the target URL or block other buttons.
 */
export default function VendorExitLink({ href, className, id, title, tabIndex, hand = false, onExit, children }: Props) {
  const [pending, setPending] = useState(false)
  const timer = useRef(0)

  const arm = () => {
    setPending(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setPending(false), 2500)
  }

  return (
    <a
      id={id}
      title={title}
      href={href}
      tabIndex={tabIndex}
      target="_blank"
      rel="sponsored noopener"
      referrerPolicy="strict-origin-when-cross-origin"
      data-pending={pending ? '1' : '0'}
      aria-busy={pending}
      className={`vendor-exit-cue ${hand ? 'offer-pulse' : ''} ${className || ''}`}
      onClick={() => {
        arm()
        try {
          onExit?.()
        } catch {
          // A tracking error must not stop the browser following href.
        }
      }}
    >
      {hand ? <span className="offer-ping" aria-hidden /> : null}
      <span className="vendor-exit-spinner" aria-hidden />
      {children}
      {hand ? <FingerHand className="offer-hand" /> : null}
    </a>
  )
}
