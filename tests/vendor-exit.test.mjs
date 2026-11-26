import test from 'node:test'
import assert from 'node:assert/strict'
import { sendBehavior } from '../src/libs/analytics/sendBehavior.ts'

for (const outcome of ['accepted', 'refused', 'throws', 'unavailable']) {
  test(`analytics transport: ${outcome}`, async t => {
    if (outcome !== 'unavailable') {
      Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value() {
        if (outcome === 'throws') throw Error('blocked')
        return outcome === 'accepted'
      } })
      t.after(() => { delete navigator.sendBeacon })
    }
    const fallback = t.mock.method(globalThis, 'fetch', async () => { throw Error('offline') })
    await sendBehavior('https://api.example.test/e', '{}')
    assert.equal(fallback.mock.callCount(), outcome === 'accepted' ? 0 : 1)
  })
}
