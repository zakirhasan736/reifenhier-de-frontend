import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from '@/utils/Provider';
import Script from 'next/script';
import { Poppins } from 'next/font/google';
import Header from '@/components/shared/header/Header';
import Footer from '@/components/shared/footer/Footer';
import { SITE_KEYWORDS, SITE_URL, SOCIAL_PROFILES } from '@/libs/seo/site';
import JsonLd from '@/components/seo/JsonLd';
import TrafficSource from '@/components/analytics/TrafficSource';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Reifexa.de – Reifenpreisvergleich & günstige Reifen',
    template: '%s | Reifexa.de',
  },
  description:
    'Vergleichen Sie Reifenpreise in Sekunden. Sommer-, Winter- & Ganzjahresreifen günstig finden und direkt beim Händler kaufen. Unabhängiger Reifenpreisvergleich für Deutschland.',
  applicationName: 'Reifexa.de',
  authors: [{ name: 'Reifexa.de', url: SITE_URL }],
  creator: 'Reifexa.de',
  publisher: 'Reifexa.de',
  category: 'shopping',
  classification: 'Reifenpreisvergleich, Automotive, E-Commerce Affiliate',
  keywords: [...SITE_KEYWORDS],
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/favicon.png',
    shortcut: '/images/favicon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: `${SITE_URL}/`,
    types: {
      'application/xml': [
        { url: '/sitemaps.xml', title: 'Sitemap Index' },
        { url: '/sitemap.xml', title: 'Main Sitemap' },
      ],
      'text/plain': [
        { url: '/llms.txt', title: 'LLMs' },
        { url: '/ai.txt', title: 'AI Policy' },
      ],
    },
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: `${SITE_URL}/`,
    siteName: 'Reifexa.de',
    title: 'Reifenpreisvergleich & günstige Reifen | Reifexa.de',
    description:
      'Markenreifen vergleichen, Angebote finden und beim besten Händler kaufen. Sommer-, Winter- und Ganzjahresreifen.',
    images: [
      {
        url: '/images/banner-og-image.png',
        width: 1200,
        height: 630,
        alt: 'Reifenpreisvergleich bei Reifexa.de',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reifenpreisvergleich & günstige Reifen | Reifexa.de',
    description:
      'Sommer-, Winter- & Ganzjahresreifen im Preisvergleich. Jetzt sparen.',
    images: ['/images/banner-og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      'ENyxcjXAGQNkGU6EMokliGlZyh8nL8ShVPvB6UvtXF0',
    other: {
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? {
            'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
          }
        : {}),
      ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
        ? {
            'yandex-verification': process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
          }
        : {}),
    },
  },
  other: {
    'ai-content-declaration': 'human-and-data-driven-catalog',
    'format-detection': 'telephone=no',
    rating: 'general',
    distribution: 'global',
    coverage: 'Germany',
    'geo.region': 'DE',
    'geo.placename': 'Germany',
    language: 'German',
    revisitefter: '1 days',
    'og:see_also': SOCIAL_PROFILES.join(','),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const h = use(headers());
  // const url = h.get('x-url') ?? '';
  // const category = new URL(url, 'https://dummy').searchParams.get('kategorie');
  return (
    <html lang="de" className={poppins.className}>
      <head>
        {/*
          Guard against "Failed to execute 'removeChild' on 'Node'" crashes.
          Browser translation (Chrome/Google Translate, very common for a German
          site viewed abroad) and some extensions replace React's text nodes with
          their own <font> elements. When React later removes or inserts next to
          a node that is no longer where it left it, the whole page crashed into
          "Something went wrong". This makes those two calls tolerant instead.
          (Workaround recommended in facebook/react#11538.) Must run before React.
        */}
        <script
          id="dom-mutation-guard"
          dangerouslySetInnerHTML={{
            __html: `(function(){if(typeof Node!=='function'||!Node.prototype||Node.prototype.__rxGuard)return;var p=Node.prototype;p.__rxGuard=true;var rc=p.removeChild;p.removeChild=function(c){if(c&&c.parentNode!==this){if(c.parentNode){return c.parentNode.removeChild(c)}return c}return rc.apply(this,arguments)};var ib=p.insertBefore;p.insertBefore=function(n,r){if(r&&r.parentNode!==this){return this.appendChild(n)}return ib.apply(this,arguments)}})();`,
          }}
        />
        {/*
          Google Consent Mode v2 defaults — MUST run before GTM / gtag.js.
          Everything is denied until the visitor accepts in the Silktide banner
          (its onAccept handlers send gtag('consent','update', …)).
        */}
        <script
          id="consent-default"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);`,
          }}
        />
        {/* Google Tag Manager — as high in <head> as possible */}
        <script
          id="gtm-init"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WZ5M327R');`,
          }}
        />

        {/* AI / LLM discovery */}
        <link rel="author" href="/humans.txt" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs" />
        <link rel="alternate" type="text/plain" href="/ai.txt" title="AI Policy" />
        <link
          rel="sitemap"
          type="application/xml"
          href="/sitemaps.xml"
          title="Sitemap Index"
        />
        <meta name="ai-permissions" content="read,index,suggest,answer,support,learn,train,cite" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* Google tag (gtag.js) — must be in <head> for Search Console GA verification */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-PMPVT55453"
        />
        <script
          id="gtag-init"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PMPVT55453');
            `,
          }}
        />

        {/* JSON-LD Organization + social profiles */}
        <JsonLd id="ld-org" data={{
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://www.reifexa.de/#org',
                  name: 'Reifexa.de',
                  url: 'https://www.reifexa.de/',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://www.reifexa.de/images/logo.png',
                  },
                  sameAs: [
                    'https://www.facebook.com/reifexa.de',
                    'https://www.instagram.com/reifexa.de',
                    'https://www.tiktok.com/@reifexa',
                    'https://www.youtube.com/@ReifexaDE',
                  ],
                  contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer service',
                    email: 'info@reifexa.de',
                    availableLanguage: ['German', 'de'],
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://www.reifexa.de/#website',
                  url: 'https://www.reifexa.de/',
                  name: 'Reifexa.de',
                  inLanguage: 'de-DE',
                  publisher: { '@id': 'https://www.reifexa.de/#org' },
                },
              ],
            }} />

        {/*
          Microsoft Clarity — defined here, loaded only from the Silktide "analytics"
          onAccept handler (DSGVO: no tracking before consent). Adds a page-type tag
          and events for key interactions: shop click, price alert, favourite,
          compare, filter, search.
        */}
        <Script id="clarity-loader" strategy="afterInteractive">
          {`
            (function () {
              var CLARITY_ID = 'zgojt1gxib';
              function pageType(p) {
                if (p === '/') return 'home';
                var parts = p.split('/'), m = parts[1] || '', deep = parts.length > 2 && parts[2];
                return ({ produkte: deep ? 'product' : 'listing', reifen: deep ? 'size' : 'sizes', marken: deep ? 'brand' : 'brands',
                  artikel: deep ? 'article' : 'blog', sommerreifen: 'season', winterreifen: 'season',
                  ganzjahresreifen: 'season', reifenpreisvergleich: 'comparison', 'reifengroessen-rechner': 'size-tool',
                  favoriten: 'favorites' })[m] || m || 'other';
              }
              function tagPage() {
                if (typeof window.clarity === 'function') window.clarity('set', 'page_type', pageType(location.pathname));
              }
              function track(name) { if (typeof window.clarity === 'function') window.clarity('event', name); }
              window.reifexaLoadClarity = function () {
                if (window.__reifexaClarity) return;
                window.__reifexaClarity = true;
                (function (c, l, a, r, i, t, y) {
                  c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
                  t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
                  y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
                })(window, document, 'clarity', 'script', CLARITY_ID);
                window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
                tagPage();
                var push = history.pushState;
                history.pushState = function () { var r = push.apply(this, arguments); setTimeout(tagPage, 0); return r; };
                window.addEventListener('popstate', function () { setTimeout(tagPage, 0); });
                document.addEventListener('click', function (e) {
                  var el = e.target && e.target.closest ? e.target.closest('a,button') : null;
                  if (!el) return;
                  var href = el.getAttribute('href') || '';
                  var label = ((el.getAttribute('aria-label') || '') + ' ' + (el.textContent || '')).toLowerCase();
                  if (href.indexOf('/to?') === 0 || href.indexOf('/to/') === 0) track('shop_click');
                  else if (label.indexOf('preisalarm') > -1) track('price_alert_click');
                  else if (label.indexOf('favorit') > -1 || label.indexOf('merken') > -1) track('favorite_click');
                  else if (label.indexOf('vergleich') > -1 && el.tagName === 'BUTTON') track('compare_click');
                  else if (label.indexOf('filter') > -1) track('filter_click');
                }, true);
                document.addEventListener('submit', function (e) {
                  var f = e.target;
                  if (f && f.querySelector && f.querySelector('input[type="search"],input[name="q"],input[name="search"]')) track('search_submit');
                }, true);
              };
            })();
          `}
        </Script>

        {/* Silktide Cookie Manager */}
        {/* Banner CSS is loaded by the init script below (not render-blocking). */}
        <Script
          src="/cookie-banner/silktide-consent-manager.min.js?v=1.0.1"
          strategy="afterInteractive"
          defer
        />

        {/* Safe Silktide Init */}
        <Script id="silktide-init" strategy="afterInteractive">
          {`
            (function initSilktide() {
              var cssReady = false;
              if (!document.getElementById('silktide-consent-manager-css')) {
                var l = document.createElement('link');
                l.rel = 'stylesheet';
                l.id = 'silktide-consent-manager-css';
                l.href = '/cookie-banner/silktide-consent-manager.min.css?v=1.0.1';
                l.onload = l.onerror = function () { cssReady = true; };
                document.head.appendChild(l);
              } else {
                cssReady = true;
              }
              function setupSilktide() {
                if (!cssReady) return false;
                if (typeof window.silktideCookieBannerManager === 'undefined') {
                  return false;
                }

                window.silktideCookieBannerManager.updateCookieBannerConfig({
                  background: { showBackground: true },
                  cookieIcon: { position: "bottomLeft" },
                  cookieTypes: [
                    {
                      id: "necessary",
                      name: "Notwendig",
                      description: "<p>Für die Funktionalität der Website sind unbedingt erforderliche Cookies erforderlich.</p>",
                      required: true
                    },
                    {
                      id: "analytics",
                      name: "Analyse",
                      description: "<p>Hilft uns zu verstehen, wie Besucher die Website nutzen.</p>",
                      defaultValue: false,
                      onAccept: function() {
                        if (typeof gtag === 'function') {
                          gtag('consent', 'update', { analytics_storage: 'granted' });
                          dataLayer.push({ event: 'consent_accepted_analytics' });
                        }
                        // Microsoft Clarity (heatmaps, session recordings) — only after analytics consent
                        if (typeof window.reifexaLoadClarity === 'function') window.reifexaLoadClarity();
                      },
                      onReject: function() {
                        if (typeof gtag === 'function') {
                          gtag('consent', 'update', { analytics_storage: 'denied' });
                        }
                        if (typeof window.clarity === 'function') {
                          window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
                          window.clarity('consent', false);
                        }
                      }
                    },
                    {
                      id: "advertising",
                      name: "Werbung",
                      description: "<p>Ermöglicht Personalisierung und Werbung.</p>",
                      onAccept: function() {
                        if (typeof gtag === 'function') {
                          gtag('consent', 'update', {
                            ad_storage: 'granted',
                            ad_user_data: 'granted',
                            ad_personalization: 'granted',
                          });
                          dataLayer.push({ event: 'consent_accepted_advertising' });
                        }
                        // AWIN publisher MasterTag (incl. Convert-a-Link) only after
                        // advertising consent. (Not needed for sale tracking — our /to
                        // links are already AWIN click links.) Loaded from AWIN's own
                        // server so the advertiser list Convert-a-Link uses stays current;
                        // the bundled copy is only a fallback if dwin2.com is unreachable.
                        if (!document.getElementById('awin-mastertag')) {
                          var aw = document.createElement('script');
                          aw.id = 'awin-mastertag';
                          aw.async = true;
                          aw.src = 'https://www.dwin2.com/pub.2985775.min.js';
                          aw.onerror = function() {
                            var fb = document.createElement('script');
                            fb.id = 'awin-mastertag-fallback';
                            fb.async = true;
                            fb.src = '/pub.2985775.min.js';
                            document.body.appendChild(fb);
                          };
                          document.body.appendChild(aw);
                        }
                      },
                      onReject: function() {
                        if (typeof gtag === 'function') {
                          gtag('consent', 'update', {
                            ad_storage: 'denied',
                            ad_user_data: 'denied',
                            ad_personalization: 'denied',
                          });
                        }
                      }
                    }
                  ],
                  text: {
                    banner: {
                      description: "<p>Hiermit informieren wir Sie darüber, dass auf dieser Website Cookies verwendet werden. <a href='/impressum-datenschutz' target='_blank'>Datenschutzerklärung</a></p>",
                      acceptAllButtonText: "Alle akzeptieren",
                      rejectNonEssentialButtonText: "Alle ablehnen",
                      preferencesButtonText: "Einstellungen"
                    },
                    preferences: {
                      title: "Passen Sie Ihre Cookie-Einstellungen an",
                      description: "<p>Wählen Sie aus, welche Cookies Sie zulassen möchten.</p>"
                    }
                  }
                });
                return true;
              }

              // Check every 100ms until script is ready
              const interval = setInterval(() => {
                if (setupSilktide()) clearInterval(interval);
              }, 100);
            })();
          `}
        </Script>
      </head>

      <body className="angelpage-body-wrapper-area">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WZ5M327R"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <main className="angelpage-main-wrapper">
          <ClientProviders>
            {/* <Suspense
              fallback={<Loading />}
            > */}
            <TrafficSource />
            <Header />
            {children}
            <Footer />
            {/* </Suspense> */}
          </ClientProviders>
        </main>
        {/* AWIN publisher MasterTag is injected by the Silktide "advertising"
            onAccept handler above — never before consent. */}
      </body>
    </html>
  );
}
