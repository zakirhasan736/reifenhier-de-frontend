'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  disablePriceAlerts,
  enablePriceAlerts,
  isPriceAlertsEnabledLocally,
  pushSupported,
  trackProductInterest,
} from '@/libs/push/priceAlerts'

type Props = {
  productId?: string
  className?: string
}

export default function PriceAlertToggle({ productId, className = '' }: Props) {
  const [supported, setSupported] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setSupported(pushSupported())
    setEnabled(isPriceAlertsEnabledLocally())
  }, [])

  useEffect(() => {
    if (!productId || !enabled) return
    trackProductInterest({ productId, source: 'view', notifyEnabled: true })
  }, [productId, enabled])

  if (!supported) return null

  const onToggle = async () => {
    if (busy) return
    setBusy(true)
    try {
      if (enabled) {
        await disablePriceAlerts()
        setEnabled(false)
        toast.success('Preisalarme deaktiviert')
      } else {
        const result = await enablePriceAlerts()
        if (!result.ok) {
          if (result.reason === 'denied') {
            toast.error('Benachrichtigungen wurden blockiert')
          } else if (result.reason === 'no_vapid') {
            toast.error('Push ist noch nicht konfiguriert')
          } else {
            toast.error('Preisalarme konnten nicht aktiviert werden')
          }
          return
        }
        setEnabled(true)
        if (productId) {
          trackProductInterest({
            productId,
            source: 'view',
            notifyEnabled: true,
          })
        }
        toast.success(
          'Preisalarme aktiv — Sie erhalten Updates zu diesem Produkt'
        )
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={busy}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
        enabled
          ? 'border-primary-100 bg-primary-100 text-white'
          : 'border-primary-100 bg-white text-primary-100 hover:bg-[#F5F7FF]'
      } ${className}`}
      aria-pressed={enabled}
    >
      <span aria-hidden className="text-base leading-none">
        {enabled ? '●' : '○'}
      </span>
      {enabled ? 'Preisalarm an' : 'Preisalarm aktivieren'}
    </button>
  )
}
