# Shop-link tests (Zum Angebot, title, image, payment icons, offer list, sticky bar)

## One-time setup

```sh
npm ci
npm run test:clicks:install      # downloads Chromium + WebKit (iPhone Safari engine)
```

## Run

```sh
npm test                                   # unit tests (tracking transport, same tab / new tab rule)
npm run test:clicks                        # live site www.reifexa.de, desktop + Android + iPhone
npm run test:clicks -- --headed            # watch the browser do it
npm run test:clicks -- --project=iphone-safari
PRODUCT_PATH=/produkte/<slug> npm run test:clicks
BASE_URL=http://localhost:3000 npm run test:clicks     # your local build
npx playwright show-report                 # screenshots, video and trace of any failure
```

Safe by default: the `/to?…` redirect is answered by the test with a stub page,
and tracking pings are swallowed — **no AWIN clicks, no clicks in your stats**.
`LIVE_CLICKS=1` lets them through to the real shop (real AWIN clicks — only for a
final manual check). `COOKIES=reject` runs with "Nur notwendige" instead of
"Alle akzeptieren" (default: accept, so Clarity, GTM and AWIN load like for real visitors).

## What is checked

For every shop link on the product page — title, image, best price, shop logo,
main "Zum Angebot", payment icons, every offer in the list, the floating bar:

1. the click goes to `/to?t=<token>&from=<source>&product=<id>` (tracked);
2. phones open the shop in the same tab, desktop in a new tab;
3. no JavaScript error (uncaught exception or unhandled promise rejection —
   exactly what Clarity reports). Console errors are attached to the report.

Plus: 10 fast clicks on "Zum Angebot" = 1 shop visit and no error; Back from the
shop on a phone gives a working page again; no shop link without a target.

## Error reporting (Sentry)

| Where | Variable | Notes |
|---|---|---|
| Browser | `NEXT_PUBLIC_SENTRY_DSN` (or `NEXT_PUBLIC_SENTRY_LOADER_KEY`) | Loaded only after analytics consent; no replay, no PII. Rebuild after setting. |
| Next.js server (SSR, `/to`) | `SENTRY_DSN` | Restart `next start`. |
| API + cron | `SENTRY_DSN` in the backend `.env` | Already built in (backend PR #49). |

Same-tab exits cancel requests still running on the page; those
"Failed to fetch" / "Load failed" rejections are dropped for 15 s after the
visitor leaves (`leave-noise-guard` in `layout.tsx`), so neither Clarity nor
Sentry counts them as errors.

`NEXT_PUBLIC_VENDOR_EXIT_TARGET=same|new|auto` (default `auto`) forces one
link behaviour everywhere if you want to A/B test it.
