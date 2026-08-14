'use client'

import { useEffect, useState } from 'react'
import { Bell, Check } from 'lucide-react'
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
      className={`inline-flex h-[28px] items-center justify-center gap-1 rounded-full border px-2.5 text-[12px] font-medium leading-none whitespace-nowrap transition ${
        enabled
          ? 'border-primary-100 bg-primary-100 text-white hover:bg-primary-100'
          : 'border-[#D6D9E0] bg-white text-[#1F2937] hover:bg-[#F5F7FF]'
      } ${className}`}
      aria-pressed={enabled}
    >
      {enabled ? (
        <Check size={14} strokeWidth={2.5} className="text-white" />
      ) : (
        <Bell size={14} />
      )}
      <span>Price alert</span>
    </button>
  )
}
