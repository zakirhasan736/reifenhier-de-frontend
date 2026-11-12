'use client'

import { useEffect } from 'react'
import { getApiBase } from '@/libs/seo/site'

const MAX_SECONDS_PER_VISIT = 1200 // 20 min, same cap as the backend
const MIN_SECONDS_TO_SEND = 5

/**
 * Counts one view per browser session and the time the article was actually
 * visible on screen. Sends both to POST /api/blogs/track/:slug.
 * Renders nothing.
 */
export default function BlogStatsTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return
    const url = `${getApiBase()}/api/blogs/track/${encodeURIComponent(slug)}`

    const send = (body: { view?: true; seconds?: number }) => {
      try {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          keepalive: true,
        }).catch(() => {})
      } catch {
        /* tracking must never break the page */
      }
    }

    // One view per article per browser session (a reload does not count twice)
    const key = `blog-viewed:${slug}`
    let alreadyCounted = false
    try {
      alreadyCounted = sessionStorage.getItem(key) === '1'
      if (!alreadyCounted) sessionStorage.setItem(key, '1')
    } catch {
      /* private mode: count the view anyway */
    }
    if (!alreadyCounted) send({ view: true })

    // Read time: only while the tab is visible
    let visibleSince: number | null = document.visibilityState === 'visible' ? Date.now() : null
    let sentTotal = 0

    const flush = () => {
      if (visibleSince === null) return
      const seconds = Math.round((Date.now() - visibleSince) / 1000)
      visibleSince = null
      const allowed = Math.min(seconds, MAX_SECONDS_PER_VISIT - sentTotal)
      if (allowed < MIN_SECONDS_TO_SEND) return
      sentTotal += allowed
      send({ seconds: allowed })
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush()
      else if (visibleSince === null) visibleSince = Date.now()
    }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', flush)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [slug])

  return null
}
