import { expect, type BrowserContext, type Page, type TestInfo } from '@playwright/test'

/** LIVE_CLICKS=1 lets clicks reach the real shop. That creates real AWIN clicks — only for a final manual check. */
export const LIVE = process.env.LIVE_CLICKS === '1'

/** Every shop link on the product page, by the `from` value it sends to /to. */
export const PRODUCT_TARGETS = [
  { name: 'Produkttitel', from: 'product-details-title' },
  { name: 'Produktbild', from: 'product-details-image' },
  { name: 'Bester Preis', from: 'product-details-price' },
  { name: 'Shop-Logo', from: 'product-details-vendor-logo' },
  { name: 'Zum Angebot (Hauptbutton)', from: 'product-details-page' },
  { name: 'Zahlungsarten-Icons', from: 'product-details-payment' },
  { name: 'Angebotsliste', from: 'product-offer-card' },
  { name: 'Schwebender Zum-Angebot-Balken', from: 'product-details-sticky-bar' },
] as const

export const STUB_TITLE = 'Shop (Test-Stub)'

/** Answer /to with a stub page and swallow tracking pings, so tests never touch AWIN or the stats. */
export async function stubExits(context: BrowserContext) {
  const exits: string[] = []
  await context.route(/\/to\?/, async route => {
    exits.push(route.request().url())
    if (LIVE) return route.continue()
    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: `<!doctype html><meta charset="utf-8"><title>${STUB_TITLE}</title><h1>${STUB_TITLE}</h1>`,
    })
  })
  if (!LIVE) {
    await context.route(/\/api\/(v1\/e|push\/interest)(\?|$)/, r => r.fulfill({ status: 204, body: '' }))
  }
  return exits
}

export type ErrorLog = { page: string[]; console: string[] }

/** pageerror = uncaught exception or unhandled rejection: what Clarity reports as a JavaScript error. */
export function watchErrors(context: BrowserContext): ErrorLog {
  const log: ErrorLog = { page: [], console: [] }
  const attach = (p: Page) => {
    p.on('pageerror', e => log.page.push(`${p.url()} → ${e.name}: ${e.message}`))
    p.on('console', m => {
      if (m.type() === 'error') log.console.push(`${p.url()} → ${m.text()}`)
    })
  }
  context.pages().forEach(attach)
  context.on('page', attach)
  return log
}

export async function reportErrors(log: ErrorLog, info: TestInfo) {
  if (log.console.length) {
    await info.attach('console-errors.txt', { body: log.console.join('\n'), contentType: 'text/plain' })
  }
  expect(log.page, 'JavaScript errors on the page').toEqual([])
}

function cookieButton(page: Page) {
  const choice = (process.env.COOKIES || 'accept').toLowerCase()
  const label = choice === 'reject' ? /Alle ablehnen|Nur notwendige/i : /Alle akzeptieren/i
  return page.getByRole('button', { name: label }).first()
}

/** The banner loads a moment after the page; wait for it once, then answer it. */
export async function handleCookies(page: Page, waitMs = 10_000) {
  const btn = cookieButton(page)
  try {
    await btn.waitFor({ state: 'visible', timeout: waitMs })
    await btn.click()
    await page.locator('.rx-ck-shade').waitFor({ state: 'detached', timeout: 3000 }).catch(() => undefined)
  } catch {
    // banner not shown (choice stored already)
  }
}

/** Right before a click: answer the banner if it showed up late. */
export async function clearBanner(page: Page) {
  if (await cookieButton(page).isVisible().catch(() => false)) await handleCookies(page, 1000)
}

let cachedPath = process.env.PRODUCT_PATH || ''

/** A product page with offers: PRODUCT_PATH, or the first product on /produkte. */
export async function productPath(page: Page) {
  if (cachedPath) return cachedPath
  await page.goto('/produkte', { waitUntil: 'domcontentloaded' })
  const href = await page
    .locator('a[href^="/produkte/"]')
    .evaluateAll(links =>
      links.map(a => a.getAttribute('href') || '').find(h => /^\/produkte\/[^/?#]+$/.test(h)),
    )
  if (!href) throw new Error('No product link on /produkte – set PRODUCT_PATH=/produkte/<slug>')
  cachedPath = href
  return href
}

export async function openProduct(page: Page) {
  const path = await productPath(page)
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  await handleCookies(page)
  await expect(page.locator('#pdp-main-cta')).toBeVisible()
  return path
}

export function exitLink(page: Page, from: string) {
  return page.locator(`a[href*="from=${from}"]:visible`).first()
}

/** Bring the sticky bar in by scrolling the main button out of view. */
export async function revealStickyBar(page: Page) {
  await page.evaluate(() => {
    const cta = document.getElementById('pdp-main-cta')
    const y = cta ? cta.getBoundingClientRect().bottom + window.scrollY + 400 : 1500
    window.scrollTo(0, y)
  })
  await expect(page.locator('.pdp-sticky-bar[aria-hidden="false"]')).toBeVisible()
  await page.waitForTimeout(400) // slide-in transition
}

export function isPhone(info: TestInfo) {
  return info.project.name !== 'desktop-chrome'
}
