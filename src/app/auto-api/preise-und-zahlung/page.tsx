import Link from 'next/link';
import type { Metadata } from 'next';
import LegalPage from '@/components/autoApi/LegalPage';
import { eur, fetchPlanCatalog, PLAN_IDS } from '@/libs/autoApi';
import { SITE_URL } from '@/libs/seo/site';

export const revalidate = 300;
export const metadata: Metadata = {
  title: { absolute: 'Preis- und Zahlungsbedingungen der Reifexa Auto-API' },
  description: 'Preise, Abrechnung, Zahlung, Laufzeit, Kündigung und Tarifwechsel der Reifexa Auto-API (Free, Pro, Advanced).',
  alternates: { canonical: `${SITE_URL}/auto-api/preise-und-zahlung` },
};

export default async function PriceTerms() {
  const { plans } = await fetchPlanCatalog();
  return (
    <LegalPage
      title="Preis- und Zahlungsbedingungen"
      version="25. November 2026"
      intro="Diese Bedingungen regeln Preise, Abrechnung und Laufzeit der Bezahltarife der Reifexa Auto-API. Ergänzend gelten die API-Nutzungsbedingungen."
      other={{ href: '/auto-api/bedingungen', label: 'API-Nutzungsbedingungen' }}
      sections={[
        { id: 'preise', title: 'Preise', paras: [
          <>Es gelten die Preise zum Zeitpunkt der Bestellung, wie auf der <Link href="/auto-api#tarife" className="underline">Tarifseite</Link> angegeben. Derzeit:{' '}
            {PLAN_IDS.map(id => `${plans[id].name} ${plans[id].price ? `${eur(plans[id].price)} pro Monat oder ${eur(plans[id].priceYearly)} pro Jahr` : 'kostenlos'}`).join('; ')}.</>,
          'Alle Preise sind Nettopreise zuzüglich der gesetzlichen Umsatzsteuer. Bei Kunden mit gültiger USt-IdNr. in einem anderen EU-Mitgliedstaat kann die Steuerschuld auf den Kunden übergehen (Reverse-Charge); dies wird auf der Rechnung ausgewiesen.',
          'Individuelle Vereinbarungen (z. B. höhere Kontingente oder weitere IP-Adressen) gehen diesen Bedingungen vor.',
        ] },
        { id: 'abrechnung', title: 'Abrechnung und Zahlung', paras: [
          'Die Vergütung wird für den gewählten Abrechnungszeitraum (monatlich oder jährlich) im Voraus per Rechnung abgerechnet. Rechnungen werden per E-Mail versandt.',
          'Rechnungen sind innerhalb von 14 Tagen nach Rechnungsdatum ohne Abzug zu zahlen. Die erste Freischaltung erfolgt in der Regel nach Zahlungseingang.',
          'Gerät der Kunde mit einer Zahlung in Verzug, kann Reifexa den Zugang nach erfolgloser Mahnung bis zum Zahlungseingang sperren. Die API antwortet dann mit dem Status 402. Gesetzliche Verzugszinsen bleiben vorbehalten.',
        ] },
        { id: 'laufzeit', title: 'Laufzeit und Kündigung', paras: [
          'Der Vertrag läuft für den gewählten Abrechnungszeitraum und verlängert sich jeweils um einen weiteren Zeitraum gleicher Länge, wenn er nicht gekündigt wird.',
          'Monatliche Tarife können jederzeit zum Ende des laufenden Monats gekündigt werden, jährliche Tarife mit einer Frist von einem Monat zum Ende des Vertragsjahres. Die Kündigung per E-Mail genügt.',
          'Bereits gezahlte Beträge für den laufenden Zeitraum werden bei ordentlicher Kündigung nicht anteilig erstattet.',
        ] },
        { id: 'wechsel', title: 'Tarifwechsel', paras: [
          'Ein Wechsel in einen höheren Tarif ist jederzeit möglich. Der Differenzbetrag für den restlichen Abrechnungszeitraum wird anteilig berechnet; die neuen Leistungen stehen nach der Umstellung zur Verfügung.',
          'Ein Wechsel in einen niedrigeren Tarif wird zum Beginn des nächsten Abrechnungszeitraums wirksam.',
        ] },
        { id: 'aenderung', title: 'Preisänderungen', paras: [
          'Reifexa kann die Preise mit einer Frist von sechs Wochen zum Beginn eines neuen Abrechnungszeitraums ändern. Die Änderung wird per E-Mail mitgeteilt. Der Kunde kann in diesem Fall zum Wirksamwerden der Änderung kündigen; darauf wird in der Mitteilung hingewiesen.',
        ] },
        { id: 'free', title: 'Free-Tarif', paras: [
          'Der Free-Tarif ist kostenlos und nur für Tests und nicht-kommerzielle Projekte bestimmt. Reifexa kann Umfang und Kontingente des Free-Tarifs ändern oder den Tarif einstellen.',
        ] },
      ]}
    />
  );
}
