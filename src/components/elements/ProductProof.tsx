'use client'

import { useEffect, useState } from 'react'

const API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')

type Counts = { views: number; buyers: number; sales: number }
type Badge = 'bestseller' | 'beliebt'

const countsCache = new Map<string, Counts>()
const pending = new Map<string, { id: string; slug: string; resolve: (row: Counts) => void }>()
let flushTimer = 0

function flushProof() {
  const batch = [...pending.values()]
  pending.clear()
  if (!batch.length || !API) {
    batch.forEach((item) => item.resolve({ views: 0, buyers: 0, sales: 0 }))
    return
  }
  const items = batch.map(({ id, slug }) => ({ id, slug }))
  fetch(`${API}/api/v1/proof`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
    .then((res) => (res.ok ? res.json() : { items: [] }))
    .then((data: { items?: (Counts & { id: string })[] }) => {
      const byId = new Map((data.items || []).map((row) => [row.id, row]))
      batch.forEach((item) => {
        const row = byId.get(item.id) || { views: 0, buyers: 0, sales: 0 }
        const counts = { views: row.views || 0, buyers: row.buyers || 0, sales: row.sales || 0 }
        countsCache.set(item.id, counts)
        item.resolve(counts)
      })
    })
    .catch(() => {
      batch.forEach((item) => item.resolve({ views: 0, buyers: 0, sales: 0 }))
    })
}

function loadCounts(id: string, slug: string) {
  const cached = countsCache.get(id)
  if (cached) return Promise.resolve(cached)
  return new Promise<Counts>((resolve) => {
    pending.set(id, { id, slug, resolve })
    window.clearTimeout(flushTimer)
    flushTimer = window.setTimeout(flushProof, 40)
  })
}

/** Confirmed sales outrank shop clicks. Quiet products stay unmarked. */
function badgeFor(counts: Counts): Badge | null {
  if (counts.sales >= 1) return 'bestseller'
  if (counts.buyers >= 2) return 'beliebt'
  return null
}

const BADGE = {
  bestseller: {
    label: 'Bestseller',
    tip: 'Häufig verkauft',
    className: 'bg-[#f5b602] text-[#1C1400]',
  },
  beliebt: {
    label: 'Beliebt',
    tip: 'Oft zum Angebot geklickt',
    className: 'bg-[#3A64F6] text-white',
  },
} as const

export default function ProductProof({
  productId,
  slug,
  className = '',
}: {
  productId: string
  slug: string
  className?: string
}) {
  const [counts, setCounts] = useState<Counts | null>(countsCache.get(productId) || null)

  useEffect(() => {
    let cancelled = false
    loadCounts(productId, slug).then((row) => {
      if (!cancelled) setCounts(row)
    })
    return () => {
      cancelled = true
    }
  }, [productId, slug])

  const kind = counts ? badgeFor(counts) : null
  if (!kind) return null
  const badge = BADGE[kind]

  return (
    <span
      className={`tooltip tooltip-top pointer-events-none inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold leading-none shadow-[0_1px_3px_rgba(16,24,40,0.12)] ${badge.className} ${className}`}
      data-tip={badge.tip}
    >
      {badge.label}
    </span>
  )
}
