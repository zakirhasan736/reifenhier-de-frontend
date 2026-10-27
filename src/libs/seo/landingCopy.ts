import { euro, sizeLabel, type TyreSize } from '@/libs/seo/landing';
import type { Faq } from '@/components/seo/LandingPage';

/**
 * Unique, factual German copy for landing pages, built from live numbers
 * (count, lowest price, top brands). No filler — every sentence carries a
 * fact that differs per page, so pages don't look like duplicates.
 */

const listDe = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} und ${items[items.length - 1]}`;

export function sizeIntro(
  size: TyreSize,
  total: number,
  minPrice: number,
  topBrands: string[],
  seasons: string[]
) {
  const label = sizeLabel(size);
  const sidewall = Math.round((Number(size.width) * Number(size.height)) / 100);
  const outer = Math.round(Number(size.diameter) * 25.4 + 2 * (Number(size.width) * Number(size.height)) / 100);
  return [
    `Reifen in der Größe ${label} im Preisvergleich: Reifexa vergleicht aktuell ${total.toLocaleString('de-DE')} Modelle${
      minPrice ? ` ab ${euro(minPrice)} € pro Reifen` : ''
    } bei mehreren Online-Händlern${topBrands.length ? ` – unter anderem von ${listDe(topBrands.slice(0, 4))}` : ''}.`,
    `${label} bedeutet: ${size.width} mm Reifenbreite, eine Flankenhöhe von ${size.height} % der Breite (rund ${sidewall} mm), Radialbauweise (R) und ${size.diameter} Zoll Felgendurchmesser. Der Gesamtdurchmesser liegt bei etwa ${outer} mm.${
      seasons.length ? ` Erhältlich als ${listDe(seasons)}.` : ''
    }`,
  ];
}

export function sizeFaqs(size: TyreSize, total: number, minPrice: number, cheapestName?: string): Faq[] {
  const label = sizeLabel(size);
  return [
    {
      q: `Was kosten ${label} Reifen?`,
      a: minPrice
        ? `Der günstigste ${label} Reifen kostet bei Reifexa derzeit ${euro(minPrice)} € pro Stück${
            cheapestName ? ` (${cheapestName})` : ''
          }. Insgesamt vergleichen wir ${total.toLocaleString('de-DE')} Modelle; die Preise werden mehrmals täglich aktualisiert.`
        : `Wir vergleichen ${total.toLocaleString('de-DE')} Modelle in ${label}; die Preise werden mehrmals täglich aktualisiert.`,
    },
    {
      q: `Was bedeutet die Reifengröße ${label}?`,
      a: `${size.width} ist die Reifenbreite in Millimetern, ${size.height} das Verhältnis von Flankenhöhe zu Breite in Prozent, R steht für Radialreifen und ${size.diameter} für den Felgendurchmesser in Zoll.`,
    },
    {
      q: `Auf welche Felge passt ein ${label} Reifen?`,
      a: `Auf eine ${size.diameter}-Zoll-Felge. Welche Felgenbreite zulässig ist, steht in der Zulassungsbescheinigung Teil I bzw. im CoC-Papier Ihres Fahrzeugs.`,
    },
    {
      q: 'Welchen Last- und Geschwindigkeitsindex brauche ich?',
      a: 'Mindestens die Werte aus Ihren Fahrzeugpapieren. Ein höherer Lastindex oder Geschwindigkeitsindex ist erlaubt, ein niedrigerer nicht (Ausnahme: Winterreifen mit Hinweisaufkleber im Sichtfeld).',
    },
  ];
}

export function brandIntro(brand: string, total: number, minPrice: number, topSizes: string[], seasons: string[]) {
  return [
    `${brand} Reifen im Preisvergleich: ${total.toLocaleString('de-DE')} ${brand}-Modelle${
      minPrice ? ` ab ${euro(minPrice)} € pro Reifen` : ''
    }, Preise mehrerer Online-Shops nebeneinander.`,
    [
      seasons.length ? `Im Sortiment: ${listDe(seasons)}.` : '',
      topSizes.length ? `Häufig gesuchte Größen: ${listDe(topSizes.slice(0, 5))}.` : '',
      'Vergleichen Sie EU-Reifenlabel (Rollwiderstand, Nasshaftung, Geräusch) und kaufen Sie direkt beim günstigsten Händler.',
    ]
      .filter(Boolean)
      .join(' '),
  ];
}

export function brandFaqs(brand: string, total: number, minPrice: number): Faq[] {
  return [
    {
      q: `Wo kaufe ich ${brand} Reifen am günstigsten?`,
      a: `Reifexa vergleicht ${total.toLocaleString('de-DE')} ${brand}-Reifen bei mehreren Online-Händlern${
        minPrice ? `; aktuell ab ${euro(minPrice)} € pro Stück` : ''
      }. Mit einem Klick auf „Zum Angebot“ gelangen Sie direkt zum günstigsten Shop.`,
    },
    {
      q: `Wie finde ich die passende ${brand} Reifengröße?`,
      a: 'Die Größe steht auf der Reifenflanke (z. B. 205/55 R16 91V) und in der Zulassungsbescheinigung Teil I. Wählen Sie unten Ihre Größe, um nur passende Modelle zu sehen.',
    },
  ];
}

export const SEASON_COPY: Record<
  string,
  { intro: (total: number, minPrice: number) => string[]; faqs: (minPrice: number) => Faq[]; title: string }
> = {
  winterreifen: {
    title: 'Winterreifen günstig kaufen – Preisvergleich',
    intro: (total, minPrice) => [
      `Winterreifen im Preisvergleich: ${total.toLocaleString('de-DE')} Modelle${
        minPrice ? ` ab ${euro(minPrice)} € pro Reifen` : ''
      } von Marken- und Budget-Herstellern, Preise mehrerer Online-Shops auf einen Blick.`,
      'In Deutschland gilt die situative Winterreifenpflicht: Bei Glatteis, Schneeglätte, Schneematsch, Eis- oder Reifglätte sind Reifen mit Alpine-Symbol (Bergpiktogramm mit Schneeflocke) vorgeschrieben. Reine M+S-Reifen ohne dieses Symbol reichen seit dem 1. Oktober 2024 nicht mehr aus.',
    ],
    faqs: minPrice => [
      {
        q: 'Ab wann brauche ich Winterreifen?',
        a: 'Es gibt kein festes Datum, sondern eine situative Pflicht bei winterlichen Straßenverhältnissen. Als Faustregel gilt „von O bis O“ – von Oktober bis Ostern.',
      },
      {
        q: 'Welche Profiltiefe sollten Winterreifen haben?',
        a: 'Gesetzlich vorgeschrieben sind 1,6 mm. Für gute Haftung auf Schnee empfehlen Experten mindestens 4 mm.',
      },
      {
        q: 'Was kosten Winterreifen?',
        a: minPrice
          ? `Die günstigsten Winterreifen gibt es bei Reifexa derzeit ab ${euro(minPrice)} € pro Stück. Der Preis hängt stark von Größe und Marke ab – wählen Sie unten Ihre Reifengröße.`
          : 'Der Preis hängt stark von Größe und Marke ab – wählen Sie unten Ihre Reifengröße.',
      },
      {
        q: 'Was droht ohne Winterreifen bei Glätte?',
        a: 'Ein Bußgeld ab 60 € und ein Punkt in Flensburg; bei Behinderung oder Gefährdung anderer mehr. Auch der Versicherungsschutz kann bei einem Unfall eingeschränkt sein.',
      },
    ],
  },
  sommerreifen: {
    title: 'Sommerreifen günstig kaufen – Preisvergleich',
    intro: (total, minPrice) => [
      `Sommerreifen im Preisvergleich: ${total.toLocaleString('de-DE')} Modelle${
        minPrice ? ` ab ${euro(minPrice)} € pro Reifen` : ''
      }, Preise mehrerer Online-Shops nebeneinander.`,
      'Sommerreifen haben eine härtere Gummimischung als Winterreifen und bieten bei Temperaturen über etwa 7 °C kürzere Bremswege auf trockener und nasser Straße sowie geringeren Verbrauch. Gewechselt wird nach der Faustregel „von O bis O“ meist um Ostern.',
    ],
    faqs: minPrice => [
      {
        q: 'Wann sollte ich auf Sommerreifen wechseln?',
        a: 'Wenn kein Frost mehr zu erwarten ist und die Temperaturen dauerhaft über etwa 7 °C liegen – nach der Faustregel ab Ostern.',
      },
      {
        q: 'Wie viel Profil brauchen Sommerreifen?',
        a: 'Gesetzlich mindestens 1,6 mm. Experten empfehlen den Wechsel ab etwa 3 mm, weil der Bremsweg auf nasser Straße danach deutlich länger wird.',
      },
      {
        q: 'Was kosten Sommerreifen?',
        a: minPrice
          ? `Bei Reifexa gibt es Sommerreifen derzeit ab ${euro(minPrice)} € pro Stück. Wählen Sie unten Ihre Größe für den passenden Preisvergleich.`
          : 'Wählen Sie unten Ihre Größe für den passenden Preisvergleich.',
      },
    ],
  },
  ganzjahresreifen: {
    title: 'Ganzjahresreifen günstig kaufen – Preisvergleich',
    intro: (total, minPrice) => [
      `Ganzjahresreifen (Allwetterreifen) im Preisvergleich: ${total.toLocaleString('de-DE')} Modelle${
        minPrice ? ` ab ${euro(minPrice)} € pro Reifen` : ''
      }, Preise mehrerer Online-Shops nebeneinander.`,
      'Ganzjahresreifen mit Alpine-Symbol erfüllen die situative Winterreifenpflicht und sparen den halbjährlichen Reifenwechsel. Sie eignen sich vor allem für Wenigfahrer in Regionen mit milden Wintern.',
    ],
    faqs: minPrice => [
      {
        q: 'Sind Ganzjahresreifen bei Schnee erlaubt?',
        a: 'Ja, wenn sie das Alpine-Symbol (Bergpiktogramm mit Schneeflocke) tragen. Reifen nur mit M+S-Kennung genügen seit dem 1. Oktober 2024 nicht mehr.',
      },
      {
        q: 'Für wen lohnen sich Ganzjahresreifen?',
        a: 'Für Fahrer mit eher geringer Jahresfahrleistung, überwiegend Stadtverkehr und ohne regelmäßige Fahrten in schneereiche Regionen.',
      },
      {
        q: 'Was kosten Ganzjahresreifen?',
        a: minPrice
          ? `Bei Reifexa gibt es Ganzjahresreifen derzeit ab ${euro(minPrice)} € pro Stück.`
          : 'Der Preis hängt von Größe und Marke ab – wählen Sie unten Ihre Größe.',
      },
    ],
  },
};
