import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/libs/seo/site';

export const metadata: Metadata = {
  title: { absolute: 'Reifenpreisvergleich: Angebote richtig vergleichen | Reifexa.de' },
  description: 'Reifenpreise für Deutschland vergleichen: Reifengröße, Saison, Händlerangebote, Versandkosten und EU-Reifenlabel prüfen. So finden Sie ein passendes Angebot.',
  alternates: { canonical: `${SITE_URL}/reifenpreisvergleich` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Reifenpreisvergleich – Preis, Händler und EU-Label | Reifexa.de',
    description: 'So vergleichen Sie Reifenangebote in Deutschland transparent nach Reifengröße, Preis, Versand und Eigenschaften.',
    url: `${SITE_URL}/reifenpreisvergleich`,
    locale: 'de_DE',
    type: 'article',
  },
};

const steps = [
  { title: 'Reifengröße prüfen', body: 'Die zulässige Größe finden Sie in Ihren Fahrzeugunterlagen oder auf dem bisherigen Reifen, zum Beispiel 205/55 R16. Achten Sie zusätzlich auf Last- und Geschwindigkeitsindex.' },
  { title: 'Sommer-, Winter- oder Ganzjahresreifen wählen', body: 'Wählen Sie eine Reifenart, die zu Ihrem Fahrzeug, Ihren Fahrbedingungen und den in Deutschland geltenden Anforderungen passt. Bei winterlichen Straßenverhältnissen ist die vorgeschriebene Wintertauglichkeit entscheidend.' },
  { title: 'Preise und Händler vergleichen', body: 'Vergleichen Sie die angezeigten Reifenpreise mit möglichen Versandkosten, Lieferzeiten und Händlerbedingungen. Der günstigste ausgewiesene Artikelpreis muss nicht der günstigste Gesamtpreis sein.' },
  { title: 'EU-Reifenlabel verstehen', body: 'Vergleichen Sie Rollwiderstand, Nasshaftung und externes Rollgeräusch. Das Label ist eine wichtige Vergleichshilfe, ersetzt aber keine vollständige Beurteilung der Reifenleistung.' },
  { title: 'Beim Händler kaufen', body: 'Reifexa ist ein Preisvergleichsportal. Beim Klick auf ein Angebot gelangen Sie zum jeweiligen Anbieter. Preis und Verfügbarkeit sind dort vor dem Kauf erneut zu prüfen.' },
];

export default function ReifenpreisvergleichPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm"><Link href="/" className="underline">Startseite</Link> / Reifenpreisvergleich</nav>
      <h1 className="text-3xl font-bold">Reifenpreisvergleich: passende Reifen und Angebote finden</h1>
      <p className="mt-5 text-lg">Reifexa.de hilft Ihnen, Reifenangebote unterschiedlicher Händler zu vergleichen. Suchen Sie nach Größe, Saison und Marke, prüfen Sie das EU-Reifenlabel und berücksichtigen Sie mögliche Versandkosten. Die Angebote stammen von Händlern; Preis und Verfügbarkeit können sich ändern.</p>
      <Link href="/produkte" className="mt-6 inline-block rounded bg-black px-6 py-3 text-white">Jetzt Reifenangebote vergleichen</Link>
      <h2 className="mb-4 mt-12 text-2xl font-semibold">So funktioniert der Reifenpreisvergleich</h2>
      <ol className="list-decimal space-y-7 pl-6">{steps.map(s => <li key={s.title}><h3 className="font-semibold">{s.title}</h3><p className="mt-1">{s.body}</p></li>)}</ol>
      <h2 className="mb-4 mt-12 text-2xl font-semibold">Häufige Fragen zum Reifenvergleich</h2>
      <section className="space-y-6">
        <div><h3 className="font-semibold">Kann ich Reifen direkt bei Reifexa kaufen?</h3><p>Reifexa vergleicht Angebote. Der Kauf wird beim jeweiligen Händler abgeschlossen.</p></div>
        <div><h3 className="font-semibold">Warum unterscheiden sich Reifenpreise?</h3><p>Händler können unterschiedliche Preise, Lieferkonditionen und Verfügbarkeiten anbieten. Vergleichen Sie daher immer den endgültigen Gesamtpreis.</p></div>
        <div><h3 className="font-semibold">Sind die niedrigsten angezeigten Preise garantiert?</h3><p>Nein. Händlerangebote können sich jederzeit ändern. Maßgeblich ist der Preis beim Anbieter zum Zeitpunkt des Kaufs.</p></div>
      </section>
      <div className="mt-10"><Link href="/sommerreifen" className="mr-5 underline">Sommerreifen</Link><Link href="/winterreifen" className="mr-5 underline">Winterreifen</Link><Link href="/ganzjahresreifen" className="underline">Ganzjahresreifen</Link></div>
    </main>
  );
}
