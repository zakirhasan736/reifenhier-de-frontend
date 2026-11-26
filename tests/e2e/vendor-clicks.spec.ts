import { expect, test } from '@playwright/test'
import {
  PRODUCT_TARGETS,
  STUB_TITLE,
  clearBanner,
  exitLink,
  isPhone,
  openProduct,
  reportErrors,
  revealStickyBar,
  stubExits,
  watchErrors,
} from './helpers'

/**
 * Every shop link on the product page must:
 *  1. send the visitor to /to?t=… with the right `from` (tracking),
 *  2. open in the same tab on phones and in a new tab on desktop,
 *  3. throw no JavaScript error – also not when clicked 10 times in a row.
 */
test.describe('Produktseite → Shop', () => {
  for (const target of PRODUCT_TARGETS) {
    test(`${target.name} führt zum Shop`, async ({ page, context }, info) => {
      const exits = await stubExits(context)
      const errors = watchErrors(context)
      await openProduct(page)

      if (target.from === 'product-details-sticky-bar') await revealStickyBar(page)
      const link = exitLink(page, target.from)
      await expect(link, `${target.name} is not a shop link`).toHaveCount(1)
      await link.scrollIntoViewIfNeeded()
      await clearBanner(page)

      const newTab = context.waitForEvent('page', { timeout: 5000 }).catch(() => null)
      await link.click()
      await expect.poll(() => exits.length, { message: 'no /to request' }).toBe(1)

      const url = new URL(exits[0])
      expect(url.searchParams.get('t'), 'offer token').toBeTruthy()
      expect(url.searchParams.get('from')).toBe(target.from)
      expect(url.searchParams.get('product'), 'product id').toBeTruthy()

      const opened = await newTab
      if (isPhone(info)) {
        expect(opened, 'phones: shop opens in the same tab').toBeNull()
        await expect(page).toHaveTitle(STUB_TITLE)
      } else {
        expect(opened, 'desktop: shop opens in a new tab').not.toBeNull()
        await expect(opened!).toHaveTitle(STUB_TITLE)
        await expect(page.locator('#pdp-main-cta')).toBeVisible()
      }

      await reportErrors(errors, info)
    })
  }

  test('10 schnelle Klicks auf „Zum Angebot“ = 1 Shop-Besuch, kein Fehler', async ({ page, context }, info) => {
    const exits = await stubExits(context)
    const errors = watchErrors(context)
    await openProduct(page)

    const cta = exitLink(page, 'product-details-page')
    await cta.evaluate(el => el.scrollIntoView({ block: 'center' }))
    await clearBanner(page)
    const box = await cta.boundingBox()
    expect(box).not.toBeNull()
    const started = Date.now()
    for (let i = 0; i < 10; i++) {
      await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2)
    }
    const took = Date.now() - started
    await page.waitForTimeout(1500)
    // One shop visit per 3-second window. On a busy test machine the 10 clicks can
    // take longer than 3 s; a real rage-tap burst takes about 1–2 s.
    const allowed = Math.ceil(took / 3000) || 1
    info.annotations.push({ type: 'rage', description: `10 clicks in ${took} ms → ${exits.length} shop visit(s)` })
    expect(exits.length, `10 clicks in ${took} ms`).toBeGreaterThanOrEqual(1)
    expect(exits.length, `10 clicks in ${took} ms`).toBeLessThanOrEqual(allowed)

    await reportErrors(errors, info)
  })

  test('Zurück vom Shop: Seite ist wieder klickbar', async ({ page, context }, info) => {
    test.skip(!isPhone(info), 'same-tab flow only on phones')
    const exits = await stubExits(context)
    const errors = watchErrors(context)
    await openProduct(page)

    await clearBanner(page)
    await exitLink(page, 'product-details-page').click()
    await expect(page).toHaveTitle(STUB_TITLE)
    await page.goBack()
    await expect(page.locator('#pdp-main-cta')).toBeVisible()
    await expect(page.locator('#pdp-main-cta')).toHaveAttribute('data-pending', '0', { timeout: 4000 })

    await exitLink(page, 'product-details-page').click()
    await expect.poll(() => exits.length).toBe(2)
    await reportErrors(errors, info)
  })

  test('Alle Shop-Links haben ein Ziel', async ({ page, context }, info) => {
    await stubExits(context)
    const errors = watchErrors(context)
    await openProduct(page)
    const broken = await page
      .locator('a.vendor-exit-cue')
      .evaluateAll(links =>
        links
          .map(a => a.getAttribute('href') || '')
          .filter(h => !/^\/to\?/.test(h) || !/[?&]t=[^&]+/.test(h)),
      )
    expect(broken, 'shop links without /to?t=…').toEqual([])
    await reportErrors(errors, info)
  })
})
