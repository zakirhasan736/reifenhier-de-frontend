import Link from 'next/link';
import type { Metadata } from 'next';
import { Download, KeyRound, ShieldAlert } from 'lucide-react';
import { API_BASE, FITMENT_V1, fetchPlanCatalog, PLAN_IDS } from '@/libs/autoApi';
import { SITE_URL } from '@/libs/seo/site';

export const revalidate = 300;
export const metadata: Metadata = {
  title: { absolute: 'Auto-API Dokumentation – Endpunkte, Beispiele, Fehlercodes | Reifexa' },
  description: 'Öffentliche Dokumentation der Reifexa Auto-API: Authentifizierung mit Schlüssel und IP-Freigabe, Endpunkte, Parameter, Beispiele in curl, JavaScript, PHP und Python, OpenAPI-Datei.',
  alternates: { canonical: `${SITE_URL}/auto-api/dokumentation` },
};

const SECTIONS = [
  ['start', 'Schnellstart'],
  ['auth', 'Schlüssel & IP-Freigabe'],
  ['vehicles', 'GET /vehicles'],
  ['usage', 'GET /usage'],
  ['response', 'Antwortformat'],
  ['errors', 'Fehlercodes'],
  ['limits', 'Tarife & Limits'],
  ['openapi', 'OpenAPI'],
];

function Code({ children, title }: { children: string; title?: string }) {
  return (
    <div className="overflow-hidden rounded-[14px] bg-[#0B1020] ring-1 ring-[#1E2640]">
      {title ? <div className="border-b border-white/10 px-4 py-2 font-mono text-[12px] text-[#94A3B8]">{title}</div> : null}
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-[165%] text-[#E2E8F0]">{children}</pre>
    </div>
  );
}

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="scroll-mt-24 border-t border-[#E4E7F0] pt-10 text-[24px] font-bold text-[#16171A]">
    {children}
  </h2>
);

export default async function ApiDocs() {
  const catalog = await fetchPlanCatalog();
  const base = FITMENT_V1;
  const params: [string, string, string][] = [
    ['make', 'Marke, z. B. VW, BMW, Mercedes, Skoda', 'VW'],
    ['model', 'Modellfamilie (nur mit make). „Golf 7“ findet auch Golf', 'Golf'],
    ['year', 'Baujahr (4-stellig): nur Generationen, die in diesem Jahr gebaut wurden', '2018'],
    ['size', 'Reifengröße – Rückwärtssuche (Pro & Advanced)', '205/55 R16'],
    ['offset', 'Einträge überspringen (Standard 0)', '0'],
    ['limit', 'Anzahl Fahrzeuge, 1–100 (Standard 25)', '25'],
  ];
  const errors: [string, string, string][] = [
    ['400', 'invalid_query', 'Ungültiger Filter (z. B. model ohne make, Jahr nicht 4-stellig, limit > 100)'],
    ['401', 'invalid_key', 'Kein oder unbekannter Schlüssel, oder Zugang widerrufen'],
    ['402', 'payment_required', 'Abonnement abgelaufen – bitte verlängern'],
    ['403', 'ip_not_allowed', 'Die Anfrage kommt nicht von einer freigegebenen Server-IP'],
    ['403', 'plan_upgrade_required', 'Suche nach Reifengröße ist in Pro und Advanced enthalten'],
    ['429', 'access_changed_or_daily_limit', 'Tageskontingent ausgeschöpft (Neustart 00:00 UTC) oder Zugang geändert'],
  ];

  return (
    <main className="bg-[#F6F8FC] pb-20">
      <div className="custom-container grid gap-10 pt-10 lg:grid-cols-[220px_1fr]">
        <nav className="hidden lg:block" aria-label="Inhalt">
          <div className="sticky top-24 space-y-1 text-[14px]">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[#6B7280]">Dokumentation</p>
            {SECTIONS.map(([id, t]) => (
              <a key={id} href={`#${id}`} className="block rounded-[8px] px-3 py-1.5 text-[#404042] hover:bg-white hover:text-[#3A64F6]">
                {t}
              </a>
            ))}
            <Link href="/auto-api#tarife" className="sl-white mt-4 block rounded-[10px] bg-[#3A64F6] px-3 py-2 text-center font-semibold">
              Zugang bestellen
            </Link>
          </div>
        </nav>

        <article className="min-w-0 max-w-3xl space-y-6 text-[15px] leading-[165%] text-[#2B3040]">
          <header>
            <p className="text-[13px] font-semibold uppercase tracking-wider text-[#3A64F6]">Reifexa Auto-API · v1</p>
            <h1 className="mt-2 text-[32px] font-bold text-[#16171A] md:text-[38px]">Dokumentation</h1>
            <p className="mt-3 text-[16px] text-[#5A6072]">
              REST-API mit JSON-Antworten: Fahrzeuge (Marke, Modell, Generation, Baujahre) mit ihren Werks-Reifengrößen je Achse – und die Suche
              in die andere Richtung, von der Reifengröße zu den Fahrzeugen. Die Dokumentation ist öffentlich; für Anfragen brauchen Sie einen Schlüssel
              und eine freigegebene Server-IP.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[13px]">
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-[#E4E7F0]">Basis-URL <code className="font-semibold">{base}</code></span>
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-[#E4E7F0]">JSON · UTF-8</span>
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-[#E4E7F0]">HTTPS only</span>
            </div>
          </header>

          <H2 id="start">Schnellstart</H2>
          <p>Ersetzen Sie <code>$REIFEXA_API_KEY</code> durch Ihren Schlüssel und rufen Sie die API von einem freigegebenen Server auf:</p>
          <Code title="curl">{`curl -G '${base}/vehicles' \\
  -H "Authorization: Bearer $REIFEXA_API_KEY" \\
  --data-urlencode 'make=VW' \\
  --data-urlencode 'model=Golf' \\
  --data-urlencode 'year=2018'`}</Code>
          <div className="grid gap-4 md:grid-cols-2">
            <Code title="JavaScript (Node 18+)">{`const r = await fetch(
  '${base}/vehicles?size=' +
    encodeURIComponent('205/55 R16'),
  { headers: { Authorization:
      \`Bearer \${process.env.REIFEXA_API_KEY}\` } }
);
const { vehicles, total } = await r.json();`}</Code>
            <Code title="PHP">{`$ch = curl_init('${base}/vehicles?' .
  http_build_query(['make' => 'BMW',
                    'model' => '3er']));
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => ['Authorization: Bearer '
    . getenv('REIFEXA_API_KEY')],
]);
$data = json_decode(curl_exec($ch), true);`}</Code>
          </div>
          <Code title="Python">{`import os, requests
r = requests.get("${base}/vehicles",
    params={"make": "Audi", "model": "A4", "year": 2019},
    headers={"Authorization": f"Bearer {os.environ['REIFEXA_API_KEY']}"},
    timeout=10)
for v in r.json()["vehicles"]:
    for f in v["fitments"]:
        print(v["make"], v["model"], f["variant"], f["size"], f["axle"])`}</Code>

          <H2 id="auth">Schlüssel & IP-Freigabe</H2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[16px] bg-white p-5 ring-1 ring-[#E4E7F0]">
              <KeyRound size={22} color="#3A64F6" />
              <h3 className="mt-2 font-semibold text-[#16171A]">Bearer-Schlüssel</h3>
              <p className="mt-1 text-[14px]">Header <code>Authorization: Bearer rfx_…</code>. Der Schlüssel wird nur einmal angezeigt und bei uns nur als Hash gespeichert. Bewahren Sie ihn serverseitig auf – nie im Browser oder in einer App.</p>
            </div>
            <div className="rounded-[16px] bg-white p-5 ring-1 ring-[#E4E7F0]">
              <ShieldAlert size={22} color="#E11D48" />
              <h3 className="mt-2 font-semibold text-[#16171A]">Nur von freigegebenen IPs</h3>
              <p className="mt-1 text-[14px]">Jede Anfrage muss von einer öffentlichen Server-IP kommen, die wir für Ihren Schlüssel freigegeben haben. Sonst antwortet die API mit 403 <code>ip_not_allowed</code>. Neue IPs teilen Sie uns vorab per E-Mail mit.</p>
            </div>
          </div>

          <H2 id="vehicles">GET /vehicles</H2>
          <p>Fahrzeuge Ihres Tarifs mit ihren Reifengrößen. Alle Filter sind optional und kombinierbar. Ohne Filter erhalten Sie die Fahrzeugliste Ihres Tarifs, die häufigsten Modelle zuerst.</p>
          <div className="overflow-x-auto rounded-[14px] bg-white ring-1 ring-[#E4E7F0]">
            <table className="w-full min-w-[560px] text-left text-[14px]">
              <thead className="bg-[#F8F9FC] text-[13px] text-[#5A6072]"><tr><th className="p-3">Parameter</th><th className="p-3">Bedeutung</th><th className="p-3">Beispiel</th></tr></thead>
              <tbody>
                {params.map(([n, d, e]) => (
                  <tr key={n} className="border-t border-[#F0F2F6]"><td className="p-3 font-mono font-semibold">{n}</td><td className="p-3">{d}</td><td className="p-3 font-mono text-[13px]">{e}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>Beispiele: <code>?make=VW&amp;model=Golf&amp;year=2016</code> · <code>?size=225/45 R17&amp;year=2020</code> · <code>?make=BMW&amp;offset=25</code></p>

          <H2 id="usage">GET /usage</H2>
          <p>Ihr Tarif, die heutigen Anfragen und die freigegebenen IPs. Zählt nicht zum Kontingent.</p>
          <Code title="Antwort">{`{ "plan": "pro", "daily": 2500, "usedToday": 312, "remainingToday": 2188,
  "models": 500, "allowedIps": ["203.0.113.10"], "paidUntil": "2027-01-31T00:00:00.000Z" }`}</Code>

          <H2 id="response">Antwortformat</H2>
          <Code title="200 OK – GET /vehicles?make=VW&model=Golf&year=2016">{`{
  "vehicles": [
    {
      "make": "VW",
      "model": "Golf",
      "key": "vw:golf",
      "verified": true,
      "fitments": [
        { "variant": "Golf 7 (5G)", "yearFrom": 2012, "yearTo": 2020,
          "size": "205/55 R16", "axle": "both",
          "loadIndex": "91", "speedIndex": "V",
          "source": "Geprüft von Reifexa (2026-11-25)" },
        { "variant": "Golf 7 (5G)", "yearFrom": 2012, "yearTo": 2020,
          "size": "225/45 R17", "axle": "both",
          "loadIndex": "91", "speedIndex": "W",
          "source": "Geprüft von Reifexa (2026-11-25)" }
      ]
    }
  ],
  "total": 1, "offset": 0, "limit": 25, "plan": "pro"
}`}</Code>
          <ul className="list-disc space-y-1.5 pl-5">
            <li><code>verified</code>: <strong>true</strong> = von Reifexa geprüft. <strong>false</strong> = KI-gestützter Vorschlag, noch nicht geprüft (<code>source</code> „reifexa (KI, ungeprüft)“). Sie entscheiden, ob Sie ungeprüfte Einträge anzeigen.</li>
            <li><code>axle</code>: <code>both</code> (beide Achsen), <code>front</code> oder <code>rear</code> bei Mischbereifung.</li>
            <li><code>loadIndex</code>, <code>speedIndex</code>: nur in Pro und Advanced.</li>
            <li>Antwort-Header <code>X-RateLimit-Limit</code> und <code>X-RateLimit-Remaining</code> zeigen Ihr Tageskontingent.</li>
          </ul>
          <p className="rounded-[14px] bg-[#FFFBEB] p-4 text-[14px] ring-1 ring-[#FDE68A]">
            <strong>Wichtig:</strong> Die zulässige Bereifung hängt vom konkreten Fahrzeug ab. Vor Bestellung oder Montage müssen Freigabe, Achse, Felge, Traglast und Geschwindigkeitsindex anhand
            der Fahrzeugpapiere (CoC, Zulassungsbescheinigung Teil I) geprüft werden.
          </p>

          <H2 id="errors">Fehlercodes</H2>
          <div className="overflow-x-auto rounded-[14px] bg-white ring-1 ring-[#E4E7F0]">
            <table className="w-full min-w-[560px] text-left text-[14px]">
              <thead className="bg-[#F8F9FC] text-[13px] text-[#5A6072]"><tr><th className="p-3">HTTP</th><th className="p-3">error</th><th className="p-3">Bedeutung</th></tr></thead>
              <tbody>
                {errors.map(([c, e, d]) => (
                  <tr key={e} className="border-t border-[#F0F2F6]"><td className="p-3 font-mono font-semibold">{c}</td><td className="p-3 font-mono text-[13px]">{e}</td><td className="p-3">{d}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <H2 id="limits">Tarife & Limits</H2>
          <div className="overflow-x-auto rounded-[14px] bg-white ring-1 ring-[#E4E7F0]">
            <table className="w-full min-w-[560px] text-left text-[14px]">
              <thead className="bg-[#F8F9FC] text-[13px] text-[#5A6072]"><tr><th className="p-3">Tarif</th><th className="p-3">Modelle</th><th className="p-3">Anfragen/Tag</th><th className="p-3">IPs</th><th className="p-3">Größensuche</th></tr></thead>
              <tbody>
                {PLAN_IDS.map(id => {
                  const p = catalog.plans[id];
                  return (
                    <tr key={id} className="border-t border-[#F0F2F6]">
                      <td className="p-3 font-semibold">{p.name}</td>
                      <td className="p-3">{p.models ? `Top ${p.models.toLocaleString('de-DE')}` : 'alle'}</td>
                      <td className="p-3">{p.daily.toLocaleString('de-DE')}</td>
                      <td className="p-3">{p.ips}</td>
                      <td className="p-3">{p.bySize ? 'ja' : '–'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p>„Top N“ = die N häufigsten Modellfamilien in Deutschland, jeweils mit allen Generationen. Kontingente beginnen täglich um 00:00 Uhr UTC neu.</p>

          <H2 id="openapi">OpenAPI</H2>
          <p>Die maschinenlesbare Beschreibung (OpenAPI 3) können Sie in Postman, Insomnia oder einen Code-Generator importieren:</p>
          <a
            href={`${API_BASE}/api/fitment/openapi.json`}
            className="inline-flex items-center gap-2 rounded-[12px] bg-white px-4 py-2.5 font-semibold text-[#3A64F6] ring-1 ring-[#DDE2EE] hover:bg-[#F1F4FF]"
          >
            <Download size={17} /> openapi.json
          </a>
          <p className="pt-6 text-[13.5px] text-[#6B7280]">
            Es gelten die <Link href="/auto-api/bedingungen" className="underline">API-Nutzungsbedingungen</Link> und die{' '}
            <Link href="/auto-api/preise-und-zahlung" className="underline">Preis- und Zahlungsbedingungen</Link>.
          </p>
        </article>
      </div>
    </main>
  );
}
