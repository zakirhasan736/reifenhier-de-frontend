/**
 * Server-side error reporting for the Next.js app (SSR pages, route handlers
 * such as /to, server actions). Does nothing until SENTRY_DSN is set.
 * Browser errors are reported by the Sentry loader in layout.tsx (after consent).
 */
type SentryNode = typeof import('@sentry/node')

let sentry: SentryNode | null = null

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || !process.env.SENTRY_DSN) return
  sentry = await import('@sentry/node')
  sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'production',
    release: process.env.SENTRY_RELEASE || undefined,
    tracesSampleRate: 0,
    initialScope: { tags: { app: 'frontend' } },
  })
}

export async function onRequestError(
  error: unknown,
  request: { path: string; method: string },
  context: { routerKind: string; routePath: string; routeType: string },
) {
  if (!sentry) return
  try {
    sentry.withScope(scope => {
      scope.setTag('route', context.routePath)
      scope.setTag('route_type', context.routeType)
      scope.setContext('request', { method: request.method, path: request.path.split('?')[0] })
      sentry!.captureException(error)
    })
  } catch {
    // never let reporting break a response
  }
}
