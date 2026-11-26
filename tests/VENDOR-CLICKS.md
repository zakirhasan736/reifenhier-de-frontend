# Product offer checks

Use Node 22.6+ for the unit suite. From the frontend checkout:

```sh
node --experimental-strip-types --test tests/vendor-exit.test.mjs
python -m pip install "playwright>=1.49,<2"
python -m playwright install chromium webkit
python tests/vendor_clicks.py "https://YOUR-PREVIEW/produkte/YOUR-PRODUCT" --repeat 5 --headed
```

Use a preview with the changes deployed and a product with an in-stock offer, image and payment icons. The runner checks desktop Chromium and iPhone-sized WebKit. It clicks and returns with Back between repetitions. It checks the best-offer token for the title, main image, payment icon and floating button, then checks each offer row against its own button. It fails on a new tab, wrong handoff URL or uncaught page error. It intercepts the /to request before the affiliate redirect. For a final merchant landing check use a staging offer with a test affiliate destination and open it once manually, including Back. Confirm the final merchant and product.

## Error reporting

On the frontend, set NEXT_PUBLIC_SENTRY_LOADER_KEY to the public key from your browser project's JavaScript Loader snippet and rebuild. Use the error-only loader, with replay and performance monitoring disabled. The loader is requested after analytics consent. On the API, set SENTRY_DSN for the existing backend integration and restart the API and cron services. On staging, verify a browser exception after consent and an API exception appear in their respective Sentry projects. Match the timestamp, page and error message to the Clarity recording.
