/** Report a handled server error (no-op without SENTRY_DSN). */
export async function captureServer(error: unknown, tags: Record<string, string> = {}) {
  if (!process.env.SENTRY_DSN) return
  try {
    const sentry = await import('@sentry/node')
    sentry.withScope(scope => {
      for (const [k, v] of Object.entries(tags)) scope.setTag(k, v)
      sentry.captureException(error)
    })
  } catch {
    // ignore
  }
}
