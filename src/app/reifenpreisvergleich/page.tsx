import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/libs/seo/site';
import { COMPARISON_KEYWORDS, SIZE_TOOL_KEYWORDS, uniqKeywords } from '@/libs/seo/keywords';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: { absolute: 'Reifenpreisvergleich: das Reifen-Vergleichsportal | Reifexa' },
  description: 'So funktioniert der Reifenpreisvergleich: Reifengröße eingeben, Händlerpreise inkl. Versand vergleichen, Preisverlauf und EU-Label prüfen, Preisalarm setzen.',
  alternates: { canonical: `${SITE_URL}/reifenpreisvergleich` },
  keywords: uniqKeywords([...COMPARISON_KEYWORDS, 'Reifen Leistung vergleichen', 'Reifentest Vergleich', 'EU-Reifenlabel vergleichen', 'Kompletträder vergleichen', ...SIZE_TOOL_KEYWORDS.slice(0, 4), 'Reifen Preisverlauf', 'Reifen Preisalarm', 'Reifexa']),
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Reifenpreisvergleich – Preis, Händler und EU-Label | Reifexa.de',
    description: 'So vergleichen Sie Reifenangebote in Deutschland transparent nach Reifengröße, Preis, Versand und Eigenschaften.',
    url: `${SITE_URL}/reifenpreisvergleich`,
    locale: 'de_DE',
    type: 'article',
  },
};

const faqs = [
  { q: 'Kann ich Reifen direkt bei Reifexa kaufen?', a: 'Reifexa vergleicht Angebote. Der Kauf wird beim jeweiligen Händler abgeschlossen.' },
  { q: 'Warum unterscheiden sich Reifenpreise?', a: 'Händler können unterschiedliche Preise, Lieferkonditionen und Verfügbarkeiten anbieten. Vergleichen Sie daher immer den endgültigen Gesamtpreis.' },
  { q: 'Sind die niedrigsten angezeigten Preise garantiert?', a: 'Nein. Händlerangebote können sich jederzeit ändern. Maßgeblich ist der Preis beim Anbieter zum Zeitpunkt des Kaufs.' },
  { q: 'Woran erkenne ich ein gutes Reifen-Vergleichsportal?', a: 'Ein gutes Vergleichsportal zeigt mehrere Händler für exakt dieselbe Reifengröße inklusive Last- und Geschwindigkeitsindex, nennt Versandkosten, zeigt das EU-Reifenlabel und macht Preisänderungen über einen Preisverlauf sichtbar.' },
  { q: 'Kann ich zwei Reifen nebeneinander vergleichen?', a: 'Ja. Auf jeder Produktseite sehen Sie alle Händlerpreise untereinander, das EU-Label (Rollwiderstand, Nasshaftung, Rollgeräusch) und den Preisverlauf. Alternative Modelle in derselben Größe werden direkt darunter angezeigt.' },
  { q: 'Wie vergleiche ich zwei Reifengrößen?', a: 'Mit dem Reifengrößenrechner geben Sie zwei Größen ein und sehen Durchmesser, Abrollumfang, Flankenhöhe und die Tachoabweichung nebeneinander. Ob eine Größe für Ihr Fahrzeug zulässig ist, steht in den Fahrzeugpapieren (COC/Zulassungsbescheinigung).' },
];

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
      <ol className="list-decimal space-y-7 pl-6">{steps.map(s => <li key={s.title}><h3 className="text-lg leading-snug font-semibold">{s.title}</h3><p className="mt-1">{s.body}</p></li>)}</ol>
      <h2 className="mb-4 mt-12 text-2xl font-semibold">Reifen vergleichen: Preis, Leistung und Größe</h2>
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border p-5"><h3 className="text-lg leading-snug font-semibold">Preise nebeneinander</h3><p className="mt-1">Alle Händlerpreise für exakt denselben Reifen untereinander – inklusive Versand, Lieferzeit, Preisverlauf und Preisalarm.</p><Link href="/produkte" className="mt-2 inline-block underline">Reifenangebote vergleichen</Link></div>
        <div className="rounded-xl border p-5"><h3 className="text-lg leading-snug font-semibold">Leistung &amp; EU-Label</h3><p className="mt-1">Rollwiderstand, Nasshaftung und Rollgeräusch in dB vergleichen – nach Marke filtern und Premium- mit Budgetreifen abwägen.</p><Link href="/marken" className="mt-2 inline-block underline">Reifenmarken vergleichen</Link></div>
        <div className="rounded-xl border p-5"><h3 className="text-lg leading-snug font-semibold">Reifengrößen vergleichen</h3><p className="mt-1">Zwei Größen nebeneinander: Durchmesser, Abrollumfang und Tachoabweichung – ideal für Umrüstgrößen und Kompletträder.</p><Link href="/reifengroessen-rechner" className="mt-2 inline-block underline">Zum Reifengrößenrechner</Link></div>
      </div>
      <h2 className="mb-4 mt-12 text-2xl font-semibold">Häufige Fragen zum Reifenvergleich</h2>
      <section className="space-y-6">
        {faqs.map(f => <div key={f.q}><h3 className="text-lg leading-snug font-semibold">{f.q}</h3><p>{f.a}</p></div>)}
      </section>
      <JsonLd id="ld-faq" data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
      <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2"><Link href="/sommerreifen" className="underline">Sommerreifen</Link><Link href="/winterreifen" className="underline">Winterreifen</Link><Link href="/ganzjahresreifen" className="underline">Ganzjahresreifen</Link></div>
    </main>
  );
}
