/** A blocked analytics endpoint must never produce an unhandled rejection on exit. */
export async function sendBehavior(url: string, body: string) {
  try {
    if (navigator.sendBeacon?.(url, new Blob([body], { type: 'text/plain' }))) return
  } catch {
    // The browser may reject a beacon even when the API exists.
  }
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    })
  } catch {
    // Best effort. The ordinary vendor link handles navigation independently.
  }
}
