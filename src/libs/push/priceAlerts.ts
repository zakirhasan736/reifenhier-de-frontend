import { getOrCreateUuid } from '@/utils/uuid'

const API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function pushSupported() {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

export async function registerPushWorker() {
  if (!pushSupported()) return null
  return navigator.serviceWorker.register('/sw.js', { scope: '/' })
}

async function fetchVapidPublicKey(): Promise<string | null> {
  if (!API) return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || null
  try {
    const res = await fetch(`${API}/api/push/vapid-public-key`, {
      cache: 'no-store',
    })
    if (!res.ok) return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || null
    const data = await res.json()
    return data.publicKey || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || null
  } catch {
    return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || null
  }
}

/** Request permission, subscribe, and store on backend. */
export async function enablePriceAlerts(): Promise<{
  ok: boolean
  reason?: string
}> {
  if (!pushSupported()) return { ok: false, reason: 'unsupported' }
  if (!API) return { ok: false, reason: 'no_api' }

  const uuid = getOrCreateUuid()
  if (!uuid) return { ok: false, reason: 'no_uuid' }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return { ok: false, reason: 'denied' }

  const registration = await registerPushWorker()
  if (!registration) return { ok: false, reason: 'sw_failed' }

  await navigator.serviceWorker.ready
  const publicKey = await fetchVapidPublicKey()
  if (!publicKey) return { ok: false, reason: 'no_vapid' }

  let subscription = await registration.pushManager.getSubscription()
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    })
  }

  const res = await fetch(`${API}/api/push/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      uuid,
      subscription: subscription.toJSON(),
    }),
  })

  if (!res.ok) return { ok: false, reason: 'subscribe_failed' }
  try {
    localStorage.setItem('reifexa_push_enabled', '1')
  } catch {
    // ignore
  }
  return { ok: true }
}

export async function disablePriceAlerts(): Promise<void> {
  if (!pushSupported() || !API) return
  const uuid = getOrCreateUuid()
  const registration = await navigator.serviceWorker.getRegistration()
  const subscription = await registration?.pushManager.getSubscription()
  if (subscription) {
    const endpoint = subscription.endpoint
    await subscription.unsubscribe().catch(() => undefined)
    if (uuid) {
      await fetch(`${API}/api/push/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ uuid, endpoint }),
      }).catch(() => undefined)
    }
  }
  try {
    localStorage.removeItem('reifexa_push_enabled')
  } catch {
    // ignore
  }
}

export function isPriceAlertsEnabledLocally() {
  try {
    return localStorage.getItem('reifexa_push_enabled') === '1'
  } catch {
    return false
  }
}

/** Record product interest for later price alerts (view / click / purchase). */
export function trackProductInterest(payload: {
  productId: string
  source: 'view' | 'vendor_click' | 'purchase_intent' | 'wishlist'
  vendor?: string
  vendorId?: string
  vendorPrice?: number
  notifyEnabled?: boolean
}) {
  if (!API || !payload.productId) return
  const uuid = getOrCreateUuid()
  if (!uuid || uuid === 'guest') return

  const body = JSON.stringify({ uuid, ...payload })
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        `${API}/api/push/interest`,
        new Blob([body], { type: 'application/json' })
      )
      return
    }
  } catch {
    // fall through
  }
  void fetch(`${API}/api/push/interest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
    credentials: 'include',
  }).catch(() => undefined)
}
