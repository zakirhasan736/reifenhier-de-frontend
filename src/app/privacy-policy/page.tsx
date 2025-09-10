import React from 'react';
import Head from 'next/head';
import NewArticlesWrapper from '@/components/homepage/Blogs';
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Datenschutzerklärung – Reifencheck.de',
    description:
        'Datenschutzerklärung von Reifencheck.de (Jens Kippels) – Verantwortlicher, Verarbeitungszwecke, Rechtsgrundlagen, Cookies, Webanalyse, Onlinemarketing u.v.m.',
    openGraph: {
        title: 'Datenschutzerklärung – Reifencheck.de',
        description:
            'Datenschutzerklärung von Reifencheck.de (Jens Kippels) – Verantwortlicher, Verarbeitungszwecke, Rechtsgrundlagen, Cookies, Webanalyse, Onlinemarketing u.v.m.',
        type: 'article',
    },
    robots: { index: true, follow: true },
};
const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Head>
        <title>Datenschutzerklärung – Reifencheck.de</title>
        <meta
          name="description"
          content="Datenschutzerklärung von Reifencheck.de (Jens Kippels) – Verantwortlicher, Verarbeitungszwecke, Rechtsgrundlagen, Cookies, Webanalyse, Onlinemarketing u.v.m."
        />
        <meta name="robots" content="index,follow" />
      </Head>

      <main className="mx-auto max-w-full md:max-w-4xl px-6 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Datenschutzerklärung</h1>
          <p className="mt-2 text-sm text-gray-500">August 9, 2025</p>
        </header>

        {/* Verantwortlicher */}
        <section>
          <h2 className="text-xl font-semibold mt-6">Verantwortlicher</h2>
          <p className="mt-2">
            Reifencheck.de
            <br />
            Jens Kippels (Einzelunternehmen)
            <br />
            Hammerwiese 2<br />
            51766 Engelskirchen
            <br />
            E-Mail:{' '}
            <a className="underline" href="mailto:info@Reifencheck.de">
              info@Reifencheck.de
            </a>
          </p>
        </section>

        {/* Übersicht der Verarbeitungen */}
        <section>
          <h2 className="text-xl font-semibold mt-6">
            Übersicht der Verarbeitungen
          </h2>
          <p className="mt-2">
            Nachfolgend finden Sie eine Übersicht der Arten verarbeiteter Daten,
            der betroffenen Personen und der Zwecke der Verarbeitung.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <h3 className="font-medium">Arten der verarbeiteten Daten</h3>
              <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
                <li>Bestandsdaten</li>
                <li>Kontaktdaten</li>
                <li>Inhaltsdaten</li>
                <li>Vertragsdaten</li>
                <li>Nutzungsdaten</li>
                <li>Meta-, Kommunikations- und Verfahrensdaten</li>
                <li>Standortdaten</li>
                <li>Protokolldaten</li>
              </ul>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <h3 className="font-medium">Kategorien betroffener Personen</h3>
              <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
                <li>Nutzer (Webseitenbesucher)</li>
                <li>Kommunikationspartner</li>
                <li>Interessenten</li>
                <li>Leistungsempfänger und Auftraggeber</li>
              </ul>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 md:col-span-2">
              <h3 className="font-medium">Zwecke der Verarbeitung</h3>
              <ul className="mt-2 list-disc pl-5 text-sm columns-1 md:columns-2 space-y-1">
                <li>
                  Bereitstellung des Onlineangebotes & Nutzerfreundlichkeit
                </li>
                <li>
                  Informationstechnische Infrastruktur & Sicherheitsmaßnahmen
                </li>
                <li>Kommunikation & Feedback</li>
                <li>Direktmarketing</li>
                <li>Reichweitenmessung, Tracking & Zielgruppenbildung</li>
                <li>Affiliate‑Nachverfolgung</li>
                <li>Organisations- und Verwaltungsverfahren</li>
                <li>Öffentlichkeitsarbeit</li>
                <li>Profile mit nutzerbezogenen Informationen</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Rechtsgrundlagen */}
        <section>
          <h2 className="text-xl font-semibold mt-6">
            Maßgebliche Rechtsgrundlagen
          </h2>
          <p className="mt-2">
            Wir verarbeiten personenbezogene Daten auf Basis der DSGVO,
            insbesondere Art. 6 Abs. 1 S. 1 lit. a (Einwilligung), lit. b
            (Vertrag/Anbahnung) und lit. f (berechtigte Interessen). Zusätzlich
            gelten die nationalen Datenschutzvorgaben in Deutschland (insb.
            BDSG). Hinweise zum Schweizer DSG sind – soweit einschlägig – in
            diese Erklärung integriert.
          </p>
        </section>

        {/* Sicherheitsmaßnahmen */}
        <section>
          <h2 className="text-xl font-semibold mt-6">Sicherheitsmaßnahmen</h2>
          <p className="mt-2">
            Wir treffen geeignete technische und organisatorische Maßnahmen
            (TOM), um ein dem Risiko angemessenes Schutzniveau zu gewährleisten
            – u. a. Zugangskontrollen, Trennung von Daten, Verfahren zur
            Wahrnehmung von Betroffenenrechten und datenschutzfreundliche
            Voreinstellungen.
          </p>
        </section>

        {/* Übermittlung von personenbezogenen Daten */}
        <section>
          <h2 className="text-xl font-semibold mt-6">
            Übermittlung von personenbezogenen Daten
          </h2>
          <p className="mt-2">
            Eine Übermittlung an andere Stellen, Dienstleister oder Anbieter
            erfolgt auf Grundlage gesetzlicher Vorgaben. Mit Empfängern werden
            geeignete Verträge zum Schutz Ihrer Daten geschlossen (z. B.
            Auftragsverarbeitung).
          </p>
        </section>

        {/* Internationale Datentransfers */}
        <section>
          <h2 className="text-xl font-semibold mt-6">
            Internationale Datentransfers
          </h2>
          <p className="mt-2">
            Übermittlungen in Drittländer erfolgen nur auf Basis eines
            Angemessenheitsbeschlusses (Art. 45 DSGVO), geeigneter Garantien
            (insb. Standardvertragsklauseln, Art. 46 DSGVO) oder ausdrücklicher
            Einwilligung. Hinweise zum EU‑US Data Privacy Framework (DPF) finden
            Sie bei den jeweils eingesetzten Anbietern.
          </p>
        </section>

        {/* Speicherung & Löschung */}
        <section>
          <h2 className="text-xl font-semibold mt-6">
            Allgemeine Informationen zur Datenspeicherung und Löschung
          </h2>
          <p className="mt-2">
            Personenbezogene Daten werden gelöscht, sobald Einwilligungen
            widerrufen werden oder keine Rechtsgrundlagen mehr bestehen.
            Gesetzliche Aufbewahrungsfristen (u. a. nach HGB, AO, UStG) bleiben
            unberührt. Bei mehreren Fristen gilt die längste. Daten, die nur
            noch aus gesetzlichen Gründen aufbewahrt werden, verarbeiten wir
            ausschließlich zu diesen Zwecken.
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            <li>
              10 Jahre: z. B. Bücher, Aufzeichnungen, Buchungsbelege (§ 147 AO;
              § 257 HGB; § 14b UStG)
            </li>
            <li>6 Jahre: sonstige Geschäftsunterlagen (§ 147 AO; § 257 HGB)</li>
            <li>
              3 Jahre: Verjährungsfristen für zivilrechtliche Ansprüche
              (§§ 195, 199 BGB)
            </li>
          </ul>
        </section>

        {/* Rechte der betroffenen Personen */}
        <section>
          <h2 className="text-xl font-semibold mt-6">
            Rechte der betroffenen Personen
          </h2>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            <li>
              Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung
            </li>
            <li>Datenübertragbarkeit</li>
            <li>
              Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1
              lit. e/f DSGVO, einschließlich Profiling
            </li>
            <li>
              Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft
            </li>
            <li>Beschwerde bei einer Aufsichtsbehörde</li>
          </ul>
        </section>

        {/* Bereitstellung & Webhosting */}
        <section>
          <h2 className="text-xl font-semibold mt-6">
            Bereitstellung des Onlineangebotes und Webhosting
          </h2>
          <p className="mt-2">
            Zur Bereitstellung unserer Website verarbeiten wir u. a. IP‑Adresse
            und Protokolldaten (Server‑Logfiles). Diese werden zu
            Sicherheitszwecken und zur Sicherstellung der Stabilität verarbeitet
            und i. d. R. max. 30 Tage gespeichert.
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-xl font-semibold mt-6">Einsatz von Cookies</h2>
          <p className="mt-2">
            Wir setzen Cookies und ähnliche Technologien ein. Soweit rechtlich
            erforderlich, holen wir Ihre Einwilligung vorab über ein
            Consent‑Banner ein. Sie können Einwilligungen jederzeit widerrufen
            und Cookies über die Einstellungen Ihres Browsers löschen.
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            <li>
              Session‑Cookies: werden beim Schließen des Browsers gelöscht
            </li>
            <li>
              Permanente Cookies: bleiben bis zu 24 Monate gespeichert (sofern
              nicht anders angegeben)
            </li>
          </ul>
        </section>

        {/* Blogs & Publikationsmedien */}
        <section>
          <h2 className="text-xl font-semibold mt-6">
            Blogs und Publikationsmedien
          </h2>
          <p className="mt-2">
            Sofern Kommentare oder Beiträge ermöglicht werden, können wir
            IP‑Adressen zur Missbrauchs‑/Spam‑Abwehr speichern. Inhalte und
            Metadaten werden bis zum Widerspruch der Nutzer gespeichert.
          </p>
        </section>

        {/* Kontakt- und Anfrageverwaltung */}
        <section>
          <h2 className="text-xl font-semibold mt-6">
            Kontakt- und Anfrageverwaltung
          </h2>
          <p className="mt-2">
            Bei Kontaktaufnahme verarbeiten wir die mitgeteilten Daten (z. B.
            Name, E‑Mail, Inhalte der Anfrage) zur Bearbeitung Ihres Anliegens
            auf Grundlage von Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO.
          </p>
        </section>

        {/* Newsletter */}
        <section>
          <h2 className="text-xl font-semibold mt-6">
            Newsletter und elektronische Benachrichtigungen
          </h2>
          <p className="mt-2">
            Versand nur mit Einwilligung oder gesetzlicher Erlaubnis.
            Austragungen werden protokolliert. Abmeldung jederzeit über Link in
            der E‑Mail möglich.
          </p>
        </section>

        {/* Webanalyse */}
        <section>
          <h2 className="text-xl font-semibold mt-6">
            Webanalyse, Monitoring und Optimierung
          </h2>
          <p className="mt-2">
            Zur Reichweitenmessung und Optimierung können Test‑ und
            Analyseverfahren eingesetzt werden. Es werden pseudonyme Profile
            gebildet; IP‑Adressen werden gekürzt (IP‑Masking), sofern technisch
            möglich.
          </p>
          <h3 className="mt-4 font-medium">Google Analytics</h3>
          <p className="mt-2 text-sm">
            Dienstanbieter: Google Ireland Limited, Gordon House, Barrow Street,
            Dublin 4, Irland. Verarbeitung auf Basis Ihrer Einwilligung.
            IP‑Adressen werden bei EU‑Traffic nicht gespeichert; es werden grobe
            Standortdaten abgeleitet. Opt‑Out‑Optionen bietet Google u. a. über
            Browser‑Add‑on.
          </p>
        </section>

        {/* Onlinemarketing */}
        <section>
          <h2 className="text-xl font-semibold mt-6">Onlinemarketing</h2>
          <p className="mt-2">
            Für die Vermarktung von Inhalten können Cookies/Profiling eingesetzt
            werden. Es werden pseudonyme Profile verwendet; IP‑Adressen werden –
            soweit möglich – gekürzt. Opt‑Out‑Möglichkeiten finden Sie in den
            Datenschutzhinweisen der jeweiligen Anbieter oder über branchenweite
            Opt‑Out‑Seiten.
          </p>
        </section>

        {/* Affiliate */}
        <section>
          <h2 className="text-xl font-semibold mt-6">
            Affiliate-Programme und Affiliate-Links
          </h2>
          <p className="mt-2">
            Bei Nutzung von Affiliate‑Links können Drittanbieter nachvollziehen,
            ob ein Angebot über unsere Seite wahrgenommen wurde
            (Provisionsabrechnung). Hierzu können Cookies und Kennungen
            eingesetzt werden.
          </p>
        </section>

        {/* Bewertungen */}
        <section>
          <h2 className="text-xl font-semibold mt-6">
            Kundenrezensionen und Bewertungsverfahren
          </h2>
          <p className="mt-2">
            Zur Verifizierung echter Erfahrungen können wir mit Ihrer
            Einwilligung Daten (z. B. Name, E‑Mail, Bestell‑/Artikelnummer) an
            Bewertungsdienste übermitteln.
          </p>
        </section>

        {/* Social Media */}
        <section>
          <h2 className="text-xl font-semibold mt-6">
            Präsenzen in sozialen Netzwerken (Social Media)
          </h2>
          <p className="mt-2">
            Wir betreiben Profile auf Plattformen wie Facebook, Instagram,
            LinkedIn, Pinterest, X/Twitter oder Xing. Die Verarbeitung kann auch
            außerhalb der EU erfolgen. Betroffenenrechte sind am effektivsten
            direkt bei den Plattformen geltend zu machen.
          </p>
        </section>

        {/* Plug-ins */}
        <section>
          <h2 className="text-xl font-semibold mt-6">
            Plug-ins und eingebettete Funktionen sowie Inhalte
          </h2>
          <p className="mt-2">
            Drittanbieter (z. B. Google Fonts, Google Maps, YouTube) erhalten
            zur Auslieferung von Inhalten Ihre IP‑Adresse. Es können Cookies und
            Pixel‑Tags verwendet werden. Rechtsgrundlage ist i. d. R. Ihre
            Einwilligung oder unsere berechtigten Interessen.
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            <li>
              <strong>Google Fonts (Serverbezug):</strong> Einbindung zur
              einheitlichen Darstellung. Anbieter: Google Ireland Limited.
            </li>
            <li>
              <strong>Google Maps:</strong> Kartendienst von Google; Einbindung
              grundsätzlich nur mit Einwilligung.
            </li>
            <li>
              <strong>YouTube‑Videos:</strong> Videoplattform von Google;
              Einbindung grundsätzlich nur mit Einwilligung.
            </li>
          </ul>
        </section>

        {/* Cookie Consent Tool */}
        <section>
          <h2 className="text-xl font-semibold mt-6">Cookie Consent Tool</h2>
          <p className="mt-2">
            Zur Verwaltung von Einwilligungen setzen wir{' '}
            <em>Real Cookie Banner</em> (devowl.io) ein. Rechtsgrundlagen:
            Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung) und Art. 6
            Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Verwaltung von
            Einwilligungen).
          </p>
        </section>

        <footer className="mt-12 border-t pt-6 text-sm text-gray-500">
          <p>
            Diese Datenschutzerklärung fasst die wesentlichen Punkte unserer
            Datenverarbeitung zusammen. Je nach eingesetzten Diensten können
            zusätzliche Hinweise an den jeweiligen Stellen erfolgen.
          </p>
        </footer>
      </main>
      <NewArticlesWrapper />
    </>
  );
};

export default PrivacyPolicy;
