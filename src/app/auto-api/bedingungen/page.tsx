import Link from 'next/link';

export const metadata = { title: 'API-Bedingungen | Reifexa' };

export default function ApiTerms() {
  return <main className="mx-auto max-w-3xl space-y-5 px-6 py-16">
    <h1 className="text-3xl font-bold">Bedingungen für den API-Zugang</h1>
    <p>Stand 22. November 2026</p>
    <p>Der API-Zugang richtet sich an Unternehmen. Eine Anfrage ist unverbindlich. Leistungsumfang, Nettopreis, Abrechnungszeitraum, Kündigung und Freischaltung eines kostenpflichtigen Tarifs werden im individuellen Angebot vereinbart.</p>
    <p>Der vereinbarte Tarif bestimmt die verfügbare Anzahl von Modellfamilien, das tägliche Anfragekontingent und die Zahl registrierter Server-IP-Adressen. Bewahren Sie Zugangsschlüssel vertraulich auf und melden Sie Änderungen der Server-IP-Adressen vorab.</p>
    <p>Die Fahrzeugdaten dienen der Suche und dem Vergleich. Die Zuordnung hängt von Variante, Baujahr und Achse ab. Vor Bestellung oder Montage müssen die fahrzeugspezifischen Freigaben sowie Felgenmaße, Traglast und Geschwindigkeitsindex anhand der Fahrzeugunterlagen geprüft werden.</p>
    <p>Die Nutzung für eigene Fahrzeugfilter und Reifenvergleiche richtet sich nach dem vereinbarten Tarif. Die Weitergabe von Schlüsseln und der Weiterverkauf der Daten als eigenständiger Datensatz erfordern eine gesonderte Vereinbarung.</p>
    <p>Zur Bearbeitung der Zugangsanfrage werden die geschäftliche E-Mail-Adresse, der Tarif und die angegebenen Server-IP-Adressen gespeichert. Weitere Informationen finden Sie unter <Link className="underline" href="/impressum-datenschutz">Datenschutz</Link>.</p>
    <Link className="underline" href="/auto-api">Zur Auto-API</Link>
  </main>;
}
