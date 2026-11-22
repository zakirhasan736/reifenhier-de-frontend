import Link from 'next/link';

export const metadata = { title: 'Auto-API-Dokumentation | Reifexa' };

export default function ApiDocs() {
  const base = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de'}/api/fitment/v1`;
  return <main className="mx-auto max-w-4xl space-y-5 px-6 py-16">
    <h1 className="text-3xl font-bold">Auto-API-Dokumentation</h1>
    <p>Die Dokumentation ist öffentlich. API-Anfragen benötigen einen Bearer-Schlüssel und müssen von einer freigegebenen Server-IP kommen. Beantragen Sie den Zugriff über die <Link className="underline" href="/auto-api">Tarifseite</Link>. Bewahren Sie den Schlüssel serverseitig auf.</p>
    <h2 className="text-xl font-bold">Fahrzeuge und Reifengrößen abrufen</h2>
    <pre className="overflow-x-auto rounded bg-slate-100 p-4">{`curl -G '${base}/vehicles' \\\n  -H "Authorization: Bearer \$REIFEXA_API_KEY" \\\n  --data-urlencode 'size=205/55 R16' \\\n  --data-urlencode 'limit=25'`}</pre>
    <p><code>GET /vehicles</code> akzeptiert <code>size</code>, <code>make</code>, <code>model</code>, <code>year</code> (Baujahr, vierstellig), <code>offset</code> (Standard 0) und <code>limit</code> (1–100, Standard 25). Bei <code>model</code> ist <code>make</code> erforderlich. Mit <code>year</code> werden nur Zuordnungen für dieses Baujahr zurückgegeben. Ohne Filter liefert die API die Fahrzeugliste Ihres Tarifs.</p>
    <p>Jeder Eintrag in <code>vehicles</code> enthält <code>make</code>, <code>model</code>, <code>key</code> und <code>fitments</code>. Eine Zuordnung enthält Reifengröße, Variante, Baujahrbereich, Achse und Quelle. <code>total</code> ist die Zahl der Treffer innerhalb Ihres Tarifs. Tageskontingente beginnen um 00:00 Uhr UTC neu.</p>
    <p>HTTP 400 meldet ungültige Filter, 401 einen ungültigen Schlüssel, 403 eine abweichende IP und 429 ein ausgeschöpftes Kontingent oder eine zwischenzeitliche Zugangsänderung.</p>
    <p>Für die Montage gelten die Freigaben des konkreten Fahrzeugs in CoC und Fahrzeugunterlagen einschließlich Achse, Felge, Traglast und Geschwindigkeitsindex.</p>
  </main>;
}
