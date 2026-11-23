'use client'

import { Eye, ShoppingBag, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')

type Counts = { views: number; buyers: number; sales: number }
type Place = { country: string; city: string; count: number }
type Detail = { viewPlaces: Place[]; buyerPlaces: Place[]; sales: number }

const countsCache = new Map<string, Counts>()
const pending = new Map<string, { id: string; slug: string; resolve: (row: Counts) => void }>()
let flushTimer = 0

const regionNames = typeof Intl !== 'undefined' && 'DisplayNames' in Intl
  ? new Intl.DisplayNames(['de'], { type: 'region' })
  : null

function countryName(code: string) {
  if (!code || code === 'unknown') return 'Unbekannt'
  try {
    return regionNames?.of(code) || code
  } catch {
    return code
  }
}

function placeLabel(place: Place) {
  const country = countryName(place.country)
  return place.city ? `${place.city}, ${country}` : country
}

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

export default function ProductProof({
  productId,
  slug,
  compact = false,
}: {
  productId: string
  slug: string
  compact?: boolean
}) {
  const [counts, setCounts] = useState<Counts | null>(countsCache.get(productId) || null)
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<Detail | null>(null)

  useEffect(() => {
    let cancelled = false
    loadCounts(productId, slug).then((row) => {
      if (!cancelled) setCounts(row)
    })
    return () => {
      cancelled = true
    }
  }, [productId, slug])

  const openShowcase = () => {
    setOpen(true)
    if (detail || !API) return
    fetch(`${API}/api/v1/proof/${encodeURIComponent(productId)}?slug=${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Detail | null) => {
        if (data) setDetail(data)
      })
      .catch(() => undefined)
  }

  if (!counts) return null

  const views = counts.views
  const buyers = counts.buyers
  const sales = counts.sales
  const showViews = views > 0
  const showBuyers = buyers > 0 || sales > 0
  const purchaseCount = sales > 0 ? sales : buyers
  const purchaseLabel = sales > 0 ? 'Käufe' : 'Käufer'

  if (!showViews && !showBuyers) {
    return (
      <div className={compact ? '' : 'mt-3'}>
        <span
          className="tooltip tooltip-top inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-2 py-1 text-[12px] font-semibold text-primary-100"
          data-tip="Neue Ergänzung. Noch ohne Aufrufe und Käufe."
        >
          <Sparkles size={13} aria-hidden />
          Neu
        </span>
      </div>
    )
  }

  return (
    <>
      <div className={`flex flex-wrap items-center gap-1.5 ${compact ? '' : 'mt-3'}`}>
        {showViews ? (
          <button
            type="button"
            onClick={openShowcase}
            className="tooltip tooltip-top inline-flex items-center gap-1 rounded-full border border-[#E4E7EE] bg-white px-2 py-1 text-[12px] font-semibold text-[#404042] cursor-pointer"
            data-tip="Aufrufe in den letzten 90 Tagen. Klicken für Länder und Orte."
          >
            <Eye size={13} aria-hidden />
            <span className="tabular-nums">{views.toLocaleString('de-DE')}</span>
            <span>Aufrufe</span>
          </button>
        ) : null}
        {showBuyers ? (
          <button
            type="button"
            onClick={openShowcase}
            className="tooltip tooltip-top inline-flex items-center gap-1 rounded-full border border-[#E4E7EE] bg-white px-2 py-1 text-[12px] font-semibold text-[#404042] cursor-pointer"
            data-tip="Käufe in den letzten 90 Tagen. Klicken für Länder und Orte."
          >
            <ShoppingBag size={13} aria-hidden />
            <span className="tabular-nums">{purchaseCount.toLocaleString('de-DE')}</span>
            <span>{purchaseLabel}</span>
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#16171A]/45 p-3 sm:items-center" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-labelledby="product-proof-title"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 text-[#16171A] shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id="product-proof-title" className="text-[18px] font-semibold">Aufrufe und Käufe</h2>
              <button type="button" aria-label="Schließen" className="grid h-9 w-9 place-items-center rounded-full border" onClick={() => setOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <p className="mt-1 text-[13px] text-[#6B6E76]">Zahlen der letzten 90 Tage.</p>
            <div className={`mt-4 grid gap-4 ${showViews && showBuyers ? 'sm:grid-cols-2' : ''}`}>
              {showViews ? <PlaceList title="Aufrufe nach Ort" rows={detail?.viewPlaces} /> : null}
              {showBuyers ? <PlaceList title="Käufe nach Ort" rows={detail?.buyerPlaces} /> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function PlaceList({ title, rows }: { title: string; rows?: Place[] }) {
  if (rows && rows.length === 0) return null
  return (
    <section>
      <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[#6B6E76]">{title}</h3>
      {!rows ? (
        <p className="mt-2 text-[13px] text-[#6B6E76]">Wird geladen …</p>
      ) : (
        <ul className="mt-2 flex flex-col gap-1.5">
          {rows.map((place) => (
            <li key={`${place.country}-${place.city}`} className="flex items-center justify-between gap-3 text-[14px]">
              <span>{placeLabel(place)}</span>
              <span className="font-semibold tabular-nums">{place.count.toLocaleString('de-DE')}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
