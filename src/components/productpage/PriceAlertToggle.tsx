'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  enablePriceAlerts,
  fetchProductAlertEnabled,
  pushSupported,
  setProductPriceAlert,
} from '@/libs/push/priceAlerts'
import styles from './PriceAlertToggle.module.css'

const CONSENT_KEY = 'silktideCookieBanner_InitialChoice'
const PROMPT_KEY = 'reifexa_price_prompt_shown'
const WATCH_PREFIX = 'reifexa_price_watch_'
let prompted = false

function read(storage: 'localStorage' | 'sessionStorage', key: string) {
  try { return window[storage].getItem(key) } catch { return null }
}

type Props = {
  productId: string
  productName: string
  price?: string
}

export default function PriceAlertToggle({ productId, productName, price }: Props) {
  const [supported, setSupported] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [busy, setBusy] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const watchKey = WATCH_PREFIX + productId

  useEffect(() => {
    const available = pushSupported()
    setSupported(available)
    const localOn = available && Notification.permission === 'granted' && read('localStorage', watchKey) === '1'
    setEnabled(localOn)
    if (!available || !productId) return
    let cancelled = false
    fetchProductAlertEnabled(productId).then((on) => {
      if (cancelled) return
      const active = on && Notification.permission === 'granted'
      setEnabled(active)
      try {
        if (active) localStorage.setItem(watchKey, '1')
        else localStorage.removeItem(watchKey)
      } catch { /* The button still follows the server answer for this product. */ }
    })
    return () => { cancelled = true }
  }, [watchKey, productId])

  useEffect(() => {
    if (!supported || enabled || !productId || Notification.permission === 'denied') return
    let seconds = 0
    const interval = window.setInterval(() => {
      if (prompted || read('sessionStorage', PROMPT_KEY)) {
        window.clearInterval(interval)
        return
      }
      if (document.visibilityState !== 'visible' || !read('localStorage', CONSENT_KEY) ||
          document.querySelector('dialog[open], [aria-modal="true"]')) return
      if (++seconds < 60) return
      dialog.current?.showModal()
      prompted = true
      try { sessionStorage.setItem(PROMPT_KEY, '1') } catch { /* Once per page session in memory. */ }
      window.clearInterval(interval)
    }, 1000)
    return () => window.clearInterval(interval)
  }, [supported, enabled, productId])

  if (!supported) return null

  function markPromptSeen() {
    prompted = true
    try { sessionStorage.setItem(PROMPT_KEY, '1') } catch { /* Browser storage may be unavailable. */ }
  }

  const onToggle = async () => {
    if (busy) return
    markPromptSeen()
    setBusy(true)
    try {
      if (!enabled) {
        const result = await enablePriceAlerts(productId)
        if (!result.ok) {
          toast.error(result.reason === 'denied'
            ? 'Benachrichtigungen sind in Ihrem Browser blockiert.'
            : 'Preisalarm konnte nicht eingerichtet werden.')
          return
        }
      }
      await setProductPriceAlert(productId, !enabled)
      try {
        if (enabled) localStorage.removeItem(watchKey)
        else localStorage.setItem(watchKey, '1')
      } catch { /* The server still stores the product preference. */ }
      setEnabled(!enabled)
      dialog.current?.close()
      toast.success(enabled ? 'Preisalarm für diesen Reifen deaktiviert.' : 'Preisalarm für diesen Reifen aktiv.')
    } catch {
      toast.error('Preisalarm konnte nicht gespeichert werden.')
    } finally {
      setBusy(false)
    }
  }

  return <>
    <button type="button" onClick={() => void onToggle()} disabled={busy} aria-pressed={enabled}
      className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-bold !text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BE185D] disabled:opacity-60 ${enabled ? 'border-[#9D174D] bg-[#9D174D]' : styles.heartbeat}`}>
      {enabled ? <Check size={16} aria-hidden /> : <Bell size={16} aria-hidden />}
      {enabled ? 'Preisalarm aktiv' : 'Preisalarm aktivieren'}
    </button>
    <dialog ref={dialog} aria-labelledby="product-price-alert-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white p-6 text-[#16171A] shadow-xl backdrop:bg-slate-950/50">
      <div className="flex items-center justify-between gap-3">
        <h2 id="product-price-alert-title" className="text-xl font-bold">Preisalarm für diesen Reifen</h2>
        <button type="button" autoFocus aria-label="Schließen" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border" onClick={() => dialog.current?.close()}><X size={18} /></button>
      </div>
      <p className="mt-2 font-semibold">{productName}</p>
      {price && <p className="text-sm">Aktuell ab {price} pro Reifen</p>}
      <p className="mt-3 text-sm">Die Erlaubnis gilt nur für diesen Reifen. Weitere Reifen können Sie einzeln auf deren Seite aktivieren.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" disabled={busy} className="rounded-full bg-[#BE185D] px-4 py-2 font-semibold !text-white" onClick={() => void onToggle()}>Preisalarm aktivieren</button>
        <button type="button" className="rounded-full border px-4 py-2" onClick={() => dialog.current?.close()}>Vielleicht später</button>
      </div>
    </dialog>
  </>
}
