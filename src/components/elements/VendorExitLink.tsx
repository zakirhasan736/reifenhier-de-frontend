'use client'

import { useRef, useState, type ReactNode } from 'react'

type Props = {
  href: string
  className?: string
  id?: string
  title?: string
  tabIndex?: number
  onExit?: () => void
  children: ReactNode
}

/**
 * Shop exit link. The href is the navigation — tracking and the spinner never
 * call preventDefault, so a click cannot drop the target URL or block other buttons.
 */
export default function VendorExitLink({ href, className, id, title, tabIndex, onExit, children }: Props) {
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
      className={`vendor-exit-cue ${className || ''}`}
      onClick={() => {
        arm()
        try {
          onExit?.()
        } catch {
          // A tracking error must not stop the browser following href.
        }
      }}
    >
      <span className="vendor-exit-spinner" aria-hidden />
      {children}
      <span className="vendor-exit-cursor" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" focusable="false">
          <path
            d="M5.2 2.8 18.4 12l-5.3 1.1 2.4 6.3-2.2 1-2.4-6.4-4.2 2.6V2.8Z"
            fill="#16171A"
            stroke="#fff"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  )
}
