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

const { exitTargetFor } = await import('../src/libs/analytics/exitTarget.ts')
const DESKTOP = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36'
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile Safari/604.1'
const INSTAGRAM = IPHONE + ' Instagram 350.0.0'

for (const [name, env, want] of [
  ['desktop mouse', { ua: DESKTOP, coarse: false, width: 1440 }, '_blank'],
  ['small desktop window', { ua: DESKTOP, coarse: false, width: 900 }, '_self'],
  ['iPhone', { ua: IPHONE, coarse: true, width: 390 }, '_self'],
  ['iPad landscape', { ua: IPHONE, coarse: true, width: 1180 }, '_self'],
  ['Instagram in-app on wide screen', { ua: INSTAGRAM, coarse: false, width: 1280 }, '_self'],
  ['forced same', { mode: 'same', ua: DESKTOP, coarse: false, width: 1440 }, '_self'],
  ['forced new', { mode: 'new', ua: IPHONE, coarse: true, width: 390 }, '_blank'],
]) {
  test(`exit target: ${name}`, () => assert.equal(exitTargetFor(env), want))
}
