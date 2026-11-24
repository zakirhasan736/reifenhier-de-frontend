import React from 'react';
import type { Metadata } from 'next';
import NewArticlesWrapper from '@/components/homepage/Blogs';
import JsonLd from '@/components/seo/JsonLd';
import LegalShell from '@/components/legal/LegalShell';
import { CalendarDays, ListOrdered } from 'lucide-react';

const TOC = [
  { id: '1', text: 'Geltungsbereich, Änderungen der Nutzungsbedingungen' },
  { id: '2', text: 'Leistungsbeschreibung, Vertragsverhältnisse' },
  { id: '3', text: 'Haftungsausschluss' },
  { id: '4', text: 'Pflichten des Nutzers' },
  { id: '5', text: 'Datenschutz' },
  { id: '6', text: 'Schlussbestimmungen' },
];

export const metadata: Metadata = {
  title: { absolute: 'Allgemeine Geschäftsbedingungen (AGB) | Reifexa.de' },
  description:
    'AGB für Reifexa.de (Preisvergleich & Informationen zu Reifenangeboten). Geltungsbereich, Leistungen, Haftung, Pflichten der Nutzer, Datenschutz & Schlussbestimmungen.',
  alternates: { canonical: 'https://www.reifexa.de/AGB' },
  openGraph: {
    title: 'Allgemeine Geschäftsbedingungen (AGB) – Reifexa.de',
    description:
      'AGB für Reifexa.de (Preisvergleich & Informationen zu Reifenangeboten).',
    type: 'article',
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <LegalShell
        current="agb"
        title="Allgemeine Geschäftsbedingungen (AGB) für Reifexa.de"
        intro="Die Regeln für die Nutzung unseres Reifen-Preisvergleichs – kurz, klar und in sechs Abschnitten."
        meta={[
          { icon: <CalendarDays size={14} />, label: <>Zuletzt aktualisiert: {new Date().toLocaleDateString('de-DE')}</> },
          { icon: <ListOrdered size={14} />, label: `${TOC.length} Abschnitte` },
        ]}
        note={<p>Für die Reifexa Auto-API gelten zusätzlich die <a href="/auto-api/bedingungen">API-Nutzungsbedingungen</a> und die <a href="/auto-api/preise-und-zahlung">Preis- und Zahlungsbedingungen</a>.</p>}
        toc={TOC}
      >
        <section id="1">
          <h2 className="text-2xl font-semibold  text-secondary-100">
            1. Geltungsbereich, Änderungen der Nutzungsbedingungen
          </h2>
          <p className="mt-3">
            1.1 Diese AGB gelten für die Nutzung der Webseite{' '}
            <strong>Reifexa.de</strong>, betrieben von{' '}
            <strong>Jens Kippels</strong>. Mit Nutzung der Plattform akzeptieren
            Sie diese AGB in ihrer jeweils aktuellen Fassung.
          </p>
          <p className="mt-3">
            1.2 Der Betreiber behält sich das Recht vor, diese AGB jederzeit zu
            ändern. Maßgeblich sind die AGB, die zum Zeitpunkt der Nutzung auf
            der Webseite veröffentlicht sind.
          </p>
        </section>

        <section id="2">
          <h2 className="text-2xl font-semibold  text-secondary-100">
            2. Leistungsbeschreibung, Vertragsverhältnisse
          </h2>
          <p className="mt-3">
            2.1 Die Plattform bietet den Nutzern kostenfreie Preisvergleiche und
            Informationen zu Reifenangeboten, die von verschiedenen Online-Shops
            bereitgestellt werden. Die bereitgestellten Informationen erfolgen
            weitgehend automatisiert und können Fehler oder Abweichungen
            aufweisen.
          </p>
          <p className="mt-3">
            2.2 Der Betreiber ist kein Verkäufer oder Vermittler der
            dargestellten Produkte. Kaufverträge werden ausschließlich zwischen
            dem Nutzer und dem jeweiligen Online-Shop geschlossen. Für diese
            Verträge gelten die AGB und Datenschutzbestimmungen der jeweiligen
            Anbieter.
          </p>
          <p className="mt-3">
            2.3 Der Betreiber übernimmt keine Gewähr für die Richtigkeit,
            Vollständigkeit oder Aktualität der dargestellten Informationen.
            Änderungen der Preise, Verfügbarkeit und Produktdetails unterliegen
            der Verantwortung der Online-Shops.
          </p>
          <p className="mt-3">
            2.4 Der Betreiber kann einzelne Angebote jederzeit und ohne
            vorherige Ankündigung von der Plattform entfernen oder ändern.
          </p>
        </section>

        <section id="3">
          <h2 className="text-2xl font-semibold  text-secondary-100">3. Haftungsausschluss</h2>
          <p className="mt-3">
            3.1 Die Nutzung der Plattform erfolgt auf eigenes Risiko des
            Nutzers. Der Betreiber übernimmt keine Gewährleistung für die
            Verfügbarkeit, Fehlerfreiheit oder Funktionalität der Plattform und
            der bereitgestellten Informationen.
          </p>
          <p className="mt-3">
            3.2 Der Betreiber haftet unbeschränkt bei Schäden aus der Verletzung
            des Lebens, des Körpers oder der Gesundheit, die auf einer
            vorsätzlichen oder grob fahrlässigen Pflichtverletzung des
            Betreibers oder seiner Erfüllungsgehilfen beruhen.
          </p>
          <p className="mt-3">
            3.3 Für sonstige Schäden haftet der Betreiber nur, sofern diese auf
            grobe Fahrlässigkeit oder Vorsatz zurückzuführen sind, und nur im
            Rahmen des vorhersehbaren, vertragstypischen Schadens. Eine
            weitergehende Haftung des Betreibers, insbesondere für indirekte
            Schäden oder entgangenen Gewinn, ist ausgeschlossen.
          </p>
          <p className="mt-3">
            3.4 Der Betreiber haftet nicht für die Richtigkeit, Verfügbarkeit
            oder Aktualität der von Dritten bereitgestellten Informationen. Die
            Haftung für Inhalte externer Webseiten, auf die durch Links
            verwiesen wird, ist ausgeschlossen.
          </p>
          <p className="mt-3">
            3.5 Soweit die Haftung des Betreibers ausgeschlossen oder beschränkt
            ist, gilt dies auch für die persönliche Haftung seiner Mitarbeiter,
            Vertreter und Erfüllungsgehilfen.
          </p>
        </section>

        <section id="4">
          <h2 className="text-2xl font-semibold  text-secondary-100">4. Pflichten des Nutzers</h2>
          <p className="mt-3">
            4.1 Der Nutzer verpflichtet sich, Handlungen zu unterlassen, die die
            Funktionalität der Plattform beeinträchtigen könnten. Dies umfasst
            insbesondere den Einsatz von automatisierten Systemen wie „Bots“,
            „Spiders“ oder ähnlichen Techniken, um Informationen von der
            Plattform zu extrahieren.
          </p>
          <p className="mt-3">
            4.2 Der Nutzer darf die Plattform nicht für rechtswidrige Zwecke
            oder zur Schädigung Dritter nutzen. Ein Verstoß berechtigt den
            Betreiber zur sofortigen Sperrung des Nutzerkontos und zur
            Einleitung weiterer rechtlicher Schritte.
          </p>
        </section>

        <section id="5">
          <h2 className="text-2xl font-semibold  text-secondary-100">5. Datenschutz</h2>
          <p className="mt-3">
            Die Erhebung und Verarbeitung personenbezogener Daten erfolgt nach
            den in der Datenschutzerklärung festgelegten Bestimmungen.
          </p>
        </section>

        <section id="6">
          <h2 className="text-2xl font-semibold  text-secondary-100">6. Schlussbestimmungen</h2>
          <p className="mt-3">
            6.1 Es gilt das Recht der Bundesrepublik Deutschland unter
            Ausschluss des UN-Kaufrechts.
          </p>
          <p className="mt-3">
            6.2 Sollte eine Bestimmung dieser AGB unwirksam sein, bleibt die
            Gültigkeit der übrigen Bestimmungen unberührt. Anstelle der
            unwirksamen Bestimmung tritt eine Regelung, die dem wirtschaftlichen
            Zweck der unwirksamen Bestimmung möglichst nahekommt.
          </p>
          <p className="mt-3">
            6.3 Gerichtsstand für alle Streitigkeiten aus diesen AGB ist der
            Sitz des Betreibers.
          </p>
        </section>

        <div className="rx-legal-foot">
          <p>
            Betreiber: <strong>Jens Kippels</strong> · Plattform:{' '}
            <strong>Reifexa.de</strong>
          </p>
          <p className="mt-2">
            Hinweis: Diese AGB dienen als Vorlage. Lassen Sie die Inhalte ggf.
            rechtlich prüfen.
          </p>
        </div>
      </LegalShell>
      <JsonLd id="ld-agb" data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://www.reifexa.de/AGB#webpage',
          url: 'https://www.reifexa.de/AGB',
          name: 'Allgemeine Geschäftsbedingungen (AGB) – Reifexa.de',
          description:
            'AGB für Reifexa.de (Preisvergleich & Informationen zu Reifenangeboten).',
          inLanguage: 'de-DE',
          isPartOf: { '@id': 'https://www.reifexa.de/#website' },
          about: { '@id': 'https://www.reifexa.de/#org' },
        }} />
      <NewArticlesWrapper limit={8} />
    </>
  );
}
