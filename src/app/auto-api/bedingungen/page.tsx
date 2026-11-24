import Link from 'next/link';
import type { Metadata } from 'next';
import LegalPage from '@/components/autoApi/LegalPage';
import { SITE_URL } from '@/libs/seo/site';

export const metadata: Metadata = {
  title: { absolute: 'API-Nutzungsbedingungen der Reifexa Auto-API' },
  description: 'Nutzungsbedingungen für die Reifexa Auto-API: Vertragsschluss, Leistungen, Datenqualität, Nutzungsrechte, Schlüssel und IP-Freigabe, Haftung, Laufzeit.',
  alternates: { canonical: `${SITE_URL}/auto-api/bedingungen` },
};

export default function ApiTerms() {
  return (
    <LegalPage
      title="API-Nutzungsbedingungen"
      version="25. November 2026"
      intro="Diese Bedingungen gelten für die Nutzung der Reifexa Auto-API (Fahrzeug- und Reifengrößendaten) in allen Tarifen. Ergänzend gelten die Preis- und Zahlungsbedingungen."
      other={{ href: '/auto-api/preise-und-zahlung', label: 'Preis- und Zahlungsbedingungen' }}
      sections={[
        { id: 'geltung', title: 'Anbieter, Geltungsbereich', paras: [
          <>Anbieter der Auto-API ist der im <Link href="/impressum-datenschutz" className="underline">Impressum</Link> genannte Betreiber von Reifexa.de („Reifexa“).</>,
          'Die API richtet sich ausschließlich an Unternehmer im Sinne von § 14 BGB sowie an Entwickler, die die API für eigene, nicht-kommerzielle Projekte testen (Free-Tarif). Verbraucherverträge werden nicht geschlossen.',
          'Abweichende Bedingungen des Kunden gelten nur, wenn Reifexa ihnen ausdrücklich schriftlich zustimmt.',
        ] },
        { id: 'vertrag', title: 'Vertragsschluss und Freischaltung', paras: [
          'Mit dem Absenden des Bestellformulars gibt der Kunde ein Angebot zum Abschluss eines Nutzungsvertrags für den gewählten Tarif ab. Reifexa prüft die Angaben, insbesondere die angegebenen Server-IP-Adressen.',
          'Der Vertrag kommt mit der Freischaltung des API-Schlüssels oder einer ausdrücklichen Annahmeerklärung per E-Mail zustande. Bei Bezahltarifen erfolgt die Freischaltung in der Regel nach Eingang der ersten Zahlung. Ein Anspruch auf Annahme besteht nicht.',
        ] },
        { id: 'leistung', title: 'Leistungen', paras: [
          'Reifexa stellt über eine REST-Schnittstelle Fahrzeugdaten (Marke, Modell, Generation, Baujahre) und zugeordnete Reifengrößen je Achse bereit; je nach Tarif zusätzlich die Suche nach Reifengröße sowie Last- und Geschwindigkeitsindex. Umfang, Tageskontingent und Zahl der freigegebenen IP-Adressen ergeben sich aus dem gewählten Tarif.',
          'Die Tarife enthalten die jeweils angegebene Zahl der in Deutschland häufigsten Modellfamilien nach Einschätzung von Reifexa. Der Datenbestand wird laufend erweitert und korrigiert; ein Anspruch auf bestimmte Fahrzeuge besteht nicht.',
          'Reifexa bemüht sich um eine hohe Verfügbarkeit, schuldet aber keine bestimmte Verfügbarkeit, sofern nicht individuell vereinbart. Wartungsarbeiten werden nach Möglichkeit angekündigt. Reifexa darf die API technisch weiterentwickeln; wesentliche, nicht abwärtskompatible Änderungen werden mit angemessener Frist angekündigt.',
        ] },
        { id: 'daten', title: 'Datenqualität, keine Montagefreigabe', paras: [
          'Datensätze, die Reifexa geprüft hat, sind mit „verified: true“ gekennzeichnet. Weitere Datensätze sind KI-gestützt erstellte Vorschläge, die noch nicht geprüft wurden („verified: false“). Der Kunde entscheidet selbst, ob und wie er diese Datensätze verwendet und kennzeichnet.',
          'Die Daten dienen der Suche, Vorauswahl und dem Vergleich. Sie ersetzen nicht die Prüfung der zulässigen Bereifung des konkreten Fahrzeugs. Vor Verkauf, Bestellung oder Montage sind Freigabe, Achse, Felgenmaß, Traglast und Geschwindigkeitsindex anhand der Fahrzeugpapiere (CoC, Zulassungsbescheinigung Teil I) oder der Herstellerangaben zu prüfen. Der Kunde weist seine Endkunden in geeigneter Form darauf hin.',
          'Fehler im Datenbestand meldet der Kunde an Reifexa; Reifexa korrigiert gemeldete Fehler in angemessener Frist.',
        ] },
        { id: 'rechte', title: 'Nutzungsrechte', paras: [
          'Reifexa räumt dem Kunden für die Vertragslaufzeit ein einfaches, nicht übertragbares Recht ein, die abgerufenen Daten in eigenen Websites, Shops, Apps und internen Systemen anzuzeigen und zu verarbeiten. Im Free-Tarif ist nur eine nicht-kommerzielle Nutzung erlaubt.',
          'Nicht erlaubt sind insbesondere: der Weiterverkauf oder die Weitergabe der Daten als eigenständiger Datensatz oder über eine eigene Schnittstelle, das systematische Herunterladen des gesamten Datenbestands, die Umgehung von Kontingenten (z. B. durch mehrere Zugänge) sowie die Weitergabe von Schlüsseln an Dritte.',
          'Abgerufene Daten dürfen zur Beschleunigung zwischengespeichert werden, höchstens jedoch für 30 Tage; danach sind sie neu abzurufen oder zu löschen. Nach Vertragsende sind gespeicherte Daten zu löschen.',
        ] },
        { id: 'zugang', title: 'API-Schlüssel und IP-Freigabe', paras: [
          'Der Zugriff erfolgt nur mit dem API-Schlüssel und nur von den durch Reifexa freigegebenen öffentlichen Server-IP-Adressen. Der Kunde hält den Schlüssel geheim, speichert ihn nur serverseitig und informiert Reifexa unverzüglich, wenn er Dritten bekannt geworden sein könnte.',
          'Änderungen der Server-IP-Adressen teilt der Kunde Reifexa vorab per E-Mail mit. Reifexa kann einen Schlüssel sperren oder ersetzen, wenn ein Missbrauch zu befürchten ist.',
        ] },
        { id: 'pflichten', title: 'Pflichten des Kunden', paras: [
          'Der Kunde nutzt die API nur im Rahmen seines Tarifs und dieser Bedingungen und belastet sie nicht übermäßig (z. B. durch unnötig häufige gleiche Anfragen).',
          'Bei schwerwiegenden oder wiederholten Verstößen kann Reifexa den Zugang vorübergehend sperren oder den Vertrag aus wichtigem Grund kündigen.',
        ] },
        { id: 'haftung', title: 'Haftung', paras: [
          'Reifexa haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei Verletzung von Leben, Körper oder Gesundheit sowie nach dem Produkthaftungsgesetz.',
          'Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt, höchstens jedoch auf die vom Kunden in den letzten zwölf Monaten gezahlte Vergütung. Im Übrigen ist die Haftung für leichte Fahrlässigkeit ausgeschlossen. Im Free-Tarif haftet Reifexa nur für Vorsatz und grobe Fahrlässigkeit sowie in den Fällen von Satz 1.',
          'Für Schäden, die daraus entstehen, dass der Kunde Daten ohne die Prüfung nach § 4 Abs. 2 verwendet, haftet Reifexa nicht, soweit gesetzlich zulässig.',
        ] },
        { id: 'laufzeit', title: 'Laufzeit und Kündigung', paras: [
          'Laufzeit, Verlängerung und Kündigungsfristen der Bezahltarife regeln die Preis- und Zahlungsbedingungen. Der Free-Tarif kann von beiden Seiten jederzeit beendet werden.',
          'Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.',
        ] },
        { id: 'datenschutz', title: 'Datenschutz', paras: [
          <>Zur Bearbeitung der Bestellung und zur Vertragsdurchführung verarbeitet Reifexa Kontakt- und Rechnungsdaten, die angegebenen IP-Adressen sowie Nutzungsdaten (Zahl der Anfragen pro Tag). Einzelheiten in der <Link href="/impressum-datenschutz" className="underline">Datenschutzerklärung</Link>.</>,
        ] },
        { id: 'schluss', title: 'Änderungen, Schlussbestimmungen', paras: [
          'Reifexa kann diese Bedingungen mit einer Frist von sechs Wochen ändern. Die Änderung wird per E-Mail mitgeteilt; widerspricht der Kunde nicht innerhalb der Frist, gilt sie als angenommen. Auf diese Folge wird in der Mitteilung hingewiesen. Bei Widerspruch kann jede Partei zum Änderungszeitpunkt kündigen.',
          'Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Ist der Kunde Kaufmann, ist Gerichtsstand – soweit zulässig – der Sitz von Reifexa.',
          'Sollte eine Bestimmung unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.',
        ] },
      ]}
    />
  );
}
