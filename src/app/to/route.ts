import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function apiBase() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    'https://api.reifexa.de'
  ).replace(/\/$/, '')
}

/**
 * Same-origin vendor bounce — ad blockers often block API paths like /out/.
 * Users hit www.reifexa.de/to?... then we 302 via backend /r/:token (neutral).
 */
async function bounce(req: NextRequest, method: 'GET' | 'POST') {
  const url = new URL(req.url)
  let token = url.searchParams.get('t') || url.searchParams.get('token') || ''

  const params = new URLSearchParams(url.searchParams)

  if (method === 'POST') {
    try {
      const contentType = req.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const body = await req.json()
        token = String(body.t || body.token || token || '')
        Object.entries(body).forEach(([k, v]) => {
          if (v != null && k !== 't' && k !== 'token') {
            params.set(k, String(v))
          }
        })
      } else {
        const form = await req.formData()
        token = String(form.get('t') || form.get('token') || token || '')
        form.forEach((v, k) => {
          if (k !== 't' && k !== 'token') params.set(k, String(v))
        })
      }
    } catch {
      // ignore body parse errors
    }
  }

  if (!token) {
    return NextResponse.redirect(new URL('/produkte', req.url), 302)
  }

  params.delete('t')
  params.delete('token')

  const upstream = `${apiBase()}/r/${encodeURIComponent(token)}${
    params.toString() ? `?${params.toString()}` : ''
  }`

  const forwardHeaders: HeadersInit = {
    'user-agent': req.headers.get('user-agent') || 'Reifexa-Bounce',
    accept: 'text/html,application/xhtml+xml',
    'x-forwarded-for':
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      '',
    'cf-connecting-ip': req.headers.get('cf-connecting-ip') || '',
    'cf-ipcountry': req.headers.get('cf-ipcountry') || '',
    referer: req.headers.get('referer') || '',
  }

  try {
    const res = await fetch(upstream, {
      method: 'GET',
      redirect: 'manual',
      headers: forwardHeaders,
      cache: 'no-store',
    })

    const location = res.headers.get('location')
    if (location) {
      const redirect = NextResponse.redirect(location, 302)
      redirect.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      redirect.headers.set('X-Robots-Tag', 'noindex, nofollow')
      redirect.headers.set('Referrer-Policy', 'no-referrer')
      return redirect
    }

    // Fallback: send browser directly to backend /r (still better than /out)
    return NextResponse.redirect(upstream, 302)
  } catch {
    return NextResponse.redirect(upstream, 302)
  }
}

export async function GET(req: NextRequest) {
  return bounce(req, 'GET')
}

export async function POST(req: NextRequest) {
  return bounce(req, 'POST')
}
