"""Run against a product with a valid offer and payment icons on the PR build."""
import argparse
import re
from urllib.parse import parse_qs, urljoin, urlsplit

from playwright.sync_api import expect, sync_playwright


def run(browser, profile, url, repeat, state):
    context = browser.new_context(**profile, storage_state=state, service_workers="block")
    errors = []
    context.on("weberror", lambda event: errors.append(str(event.error)))
    page = context.new_page()
    dismiss = page.get_by_role("button", name="Alle ablehnen", exact=True)
    page.add_locator_handler(dismiss, lambda: dismiss.click())
    # Isolate click behavior without billing an affiliate click or counting a test visitor's exit.
    context.route("**/to?*", lambda route: route.fulfill(status=200, content_type="text/html", body="<title>Mock handoff</title>"))
    context.route("**/api/v1/e", lambda route: route.abort())
    context.route("**/api/push/interest", lambda route: route.abort())
    context.add_init_script("Object.defineProperty(navigator, 'sendBeacon', {value: undefined})")
    try:
        page.goto(url, wait_until="domcontentloaded")
        main = page.locator("#pdp-main-cta")
        expect(main).to_have_attribute("href", re.compile(r"^/to\?"))
        def token(href):
            return parse_qs(urlsplit(href).query)["t"][0]

        best = token(main.get_attribute("href"))
        targets = [
            ("main", "#pdp-main-cta", best),
            ("title", "h1 a", best),
            ("image", ".product-image-gallery .slide-view-item img", best),
            ("payment", "a .payment-method-list img", best),
            ("sticky", ".pdp-sticky-bar .offer-pulse", best),
        ]
        rows = page.locator("#angebote .offer-product-card-item")
        assert rows.count(), "Select a product with offers"
        for index in range(rows.count()):
            row = rows.nth(index)
            cta = row.locator("a.cta-button-shop")
            if not cta.count():
                continue
            expected = token(cta.get_attribute("href"))
            prefix = f"#angebote .offer-product-card-item >> nth={index} >> "
            targets.append((f"offer {index+1}", prefix + "a.cta-button-shop", expected))
            if row.locator(".payment-methods-list img").count():
                targets.append((f"offer {index+1} payment", prefix + ".payment-methods-list img", expected))

        for name, selector, expected in targets:
            for _ in range(repeat):
                if name == "sticky":
                    page.locator("#angebote").scroll_into_view_if_needed()
                    expect(page.locator(".pdp-sticky-bar")).to_have_attribute("aria-hidden", "false")
                item = page.locator(selector).first
                link = item.locator("xpath=ancestor-or-self::a[1]")
                href = link.get_attribute("href")
                assert token(href) == expected, (name, href)
                destination = urljoin(page.url, href)
                item.click(timeout=10000)
                expect(page).to_have_url(destination)
                assert len(context.pages) == 1, f"{name} opened another tab"
                page.go_back(wait_until="domcontentloaded")
                expect(main).to_be_visible()
                assert not errors, errors
            print(f"PASS {name}: {repeat} same-tab clicks")
    finally:
        context.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url")
    parser.add_argument("--repeat", type=int, choices=range(1, 11), default=5)
    parser.add_argument("--headed", action="store_true")
    parser.add_argument("--storage-state", help="Playwright state with cookie-banner choice saved")
    parser.add_argument("--chromium-path", help="Optional installed Chromium executable")
    options = parser.parse_args()
    with sync_playwright() as pw:
        for engine, profile in [(pw.chromium, {"viewport": {"width": 1440, "height": 900}}),
                                (pw.webkit, pw.devices["iPhone 13"])]:
            browser = engine.launch(headless=not options.headed,
                                    executable_path=options.chromium_path if engine == pw.chromium else None)
            try:
                print(engine.name)
                run(browser, profile, options.url, options.repeat, options.storage_state)
            finally:
                browser.close()
