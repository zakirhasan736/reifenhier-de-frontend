'use client';

import { useEffect } from 'react';

const API = (process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de').replace(/\/$/, '');
const KEY = 'rx_src';

type Src = { source: string; channel: string };

function readSrc(): Src | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Src) : null;
  } catch {
    return null;
  }
}

/**
 * Records where a visit came from (ChatGPT, Perplexity, Google, Bing, …) once per
 * browser session and tags shop clicks with it, so the owner page can show
 * "AI assistants sent X visitors and Y shop clicks".
 * Cookieless and anonymous: only referrer host, UTM tags and the landing path are
 * sent; the result lives in sessionStorage for this tab session only.
 */
export default function TrafficSource() {
  useEffect(() => {
    if (!readSrc()) {
      const params = new URLSearchParams(location.search);
      let referrer = document.referrer || '';
      try {
        if (referrer && new URL(referrer).host === location.host) referrer = '';
      } catch {
        referrer = '';
      }
      // New tab opened from our own site without UTM: not a new visit.
      const internalNav = !referrer && !params.get('utm_source') && Boolean(document.referrer);
      if (!internalNav) {
        fetch(`${API}/api/traffic/visit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            referrer,
            landing: location.pathname + location.search,
            utm_source: params.get('utm_source') || '',
            utm_medium: params.get('utm_medium') || '',
            utm_campaign: params.get('utm_campaign') || '',
          }),
        })
          .then(r => (r.ok ? r.json() : null))
          .then(d => {
            if (d?.source) {
              try {
                sessionStorage.setItem(KEY, JSON.stringify({ source: d.source, channel: d.channel }));
              } catch {
                /* storage blocked */
              }
            }
          })
          .catch(() => {});
      }
    }

    // Tag shop exits (/to?…) with the visit source right before the browser follows them.
    const tag = (e: Event) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="/to?"]') as HTMLAnchorElement | null;
      const src = readSrc();
      if (!a || !src) return;
      try {
        const u = new URL(a.getAttribute('href') || '', location.origin);
        if (u.searchParams.get('src') === src.source) return;
        u.searchParams.set('src', src.source);
        u.searchParams.set('ch', src.channel);
        a.setAttribute('href', u.pathname + u.search);
      } catch {
        /* ignore */
      }
    };
    document.addEventListener('pointerdown', tag, true);
    document.addEventListener('click', tag, true);
    document.addEventListener('keydown', tag, true);
    return () => {
      document.removeEventListener('pointerdown', tag, true);
      document.removeEventListener('click', tag, true);
      document.removeEventListener('keydown', tag, true);
    };
  }, []);

  return null;
}
