import React from 'react';
import type { Metadata } from 'next';
import NewArticlesWrapper from '@/components/homepage/Blogs';

export const metadata: Metadata = {
  title: 'Allgemeine Geschäftsbedingungen (AGB) – Reifencheck.de',
  description:
    'AGB für Reifencheck.de (Preisvergleich & Informationen zu Reifenangeboten). Geltungsbereich, Leistungen, Haftung, Pflichten der Nutzer, Datenschutz & Schlussbestimmungen.',
  alternates: { canonical: 'https://www.reifencheck.de/AGB' },
  openGraph: {
    title: 'Allgemeine Geschäftsbedingungen (AGB) – Reifencheck.de',
    description:
      'AGB für Reifencheck.de (Preisvergleich & Informationen zu Reifenangeboten).',
    type: 'article',
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <div className="mx-auto max-w-full md:max-w-4xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Allgemeine Geschäftsbedingungen (AGB) für Reifencheck.de
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Zuletzt aktualisiert: {new Date().toLocaleDateString('de-DE')}
          </p>
        </div>

        <nav
          aria-label="Inhaltsverzeichnis"
          className="mb-8 rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-200"
        >
          <h2 className="text-base font-semibold">Inhaltsverzeichnis</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-6 text-sm">
            <li>
              <a href="#1" className="underline hover:no-underline">
                Geltungsbereich, Änderungen der Nutzungsbedingungen
              </a>
            </li>
            <li>
              <a href="#2" className="underline hover:no-underline">
                Leistungsbeschreibung, Vertragsverhältnisse
              </a>
            </li>
            <li>
              <a href="#3" className="underline hover:no-underline">
                Haftungsausschluss
              </a>
            </li>
            <li>
              <a href="#4" className="underline hover:no-underline">
                Pflichten des Nutzers
              </a>
            </li>
            <li>
              <a href="#5" className="underline hover:no-underline">
                Datenschutz
              </a>
            </li>
            <li>
              <a href="#6" className="underline hover:no-underline">
                Schlussbestimmungen
              </a>
            </li>
          </ol>
        </nav>

        <div id="1" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold">
            1. Geltungsbereich, Änderungen der Nutzungsbedingungen
          </h2>
          <p className="mt-3">
            1.1 Diese AGB gelten für die Nutzung der Webseite{' '}
            <strong>Reifencheck.de</strong>, betrieben von{' '}
            <strong>Jens Kippels</strong>. Mit Nutzung der Plattform akzeptieren
            Sie diese AGB in ihrer jeweils aktuellen Fassung.
          </p>
          <p className="mt-3">
            1.2 Der Betreiber behält sich das Recht vor, diese AGB jederzeit zu
            ändern. Maßgeblich sind die AGB, die zum Zeitpunkt der Nutzung auf
            der Webseite veröffentlicht sind.
          </p>
        </div>

        <div id="2" className="mt-10 scroll-mt-20">
          <h2 className="text-2xl font-semibold">
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
        </div>

        <div id="3" className="mt-10 scroll-mt-20">
          <h2 className="text-2xl font-semibold">3. Haftungsausschluss</h2>
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
        </div>

        <div id="4" className="mt-10 scroll-mt-20">
          <h2 className="text-2xl font-semibold">4. Pflichten des Nutzers</h2>
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
        </div>

        <div id="5" className="mt-10 scroll-mt-20">
          <h2 className="text-2xl font-semibold">5. Datenschutz</h2>
          <p className="mt-3">
            Die Erhebung und Verarbeitung personenbezogener Daten erfolgt nach
            den in der Datenschutzerklärung festgelegten Bestimmungen.
          </p>
        </div>

        <div id="6" className="mt-10 scroll-mt-20">
          <h2 className="text-2xl font-semibold">6. Schlussbestimmungen</h2>
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
        </div>

        <div className="mt-12 border-t pt-6 text-sm text-gray-500">
          <p>
            Betreiber: <strong>Jens Kippels</strong> · Plattform:{' '}
            <strong>Reifencheck.de</strong>
          </p>
          <p className="mt-2">
            Hinweis: Diese AGB dienen als Vorlage. Lassen Sie die Inhalte ggf.
            rechtlich prüfen.
          </p>
        </div>
      </div>
      <NewArticlesWrapper />
    </>
  );
}
