import EuTyreLabelSvg from '@/components/productpage/EuTyreLabelSvg'
import {
  resolveEuLabelData,
  type EuLabelProduct,
} from '@/utils/euTyreLabel'

export default function EuTyreLabelSection({
  product,
  pageUrl,
}: {
  product: EuLabelProduct
  pageUrl?: string
}) {
  const data = resolveEuLabelData(product, pageUrl)

  return (
    <section
      id="eu-reifenlabel"
      className="eu-tyre-label-section bg-mono-0 py-10 md:py-14 scroll-mt-24"
      aria-labelledby="eu-reifenlabel-title"
    >
      <div className="custom-container">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-12 items-start">
          <div className="mx-auto lg:mx-0 w-full max-w-[240px] rounded-[4px] border border-[#E4E5EA] bg-white p-2 shadow-sm">
            <EuTyreLabelSvg data={data} />
          </div>

          <div className="eu-label-copy text-[#404042]">
            <h2
              id="eu-reifenlabel-title"
              className="flex items-center gap-2 text-[22px] md:text-[26px] font-semibold text-[#16171A] mb-4"
            >
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1B75BB] text-white text-[13px] font-bold"
                aria-hidden
              >
                i
              </span>
              EU-Reifenlabel / Effizienzklassen
            </h2>

            <div className="space-y-4 text-[14px] md:text-[16px] leading-[160%] font-secondary">
              <p>
                Die Europäische Union hat mit der Verordnung (EG) Nr. 1222/2009
                das EU-Reifenlabel für alle Mitgliedstaaten verbindlich und
                einheitlich eingeführt. Es gilt für Pkw-Reifen,
                leichte Nutzfahrzeugreifen und schwere Nutzfahrzeugreifen, die
                nach dem 1. Juli 2012 hergestellt wurden. Seit der Verordnung
                (EU) 2020/740 erscheint das Label in der aktuellen Form mit
                QR-Code und den Klassen A–E.
              </p>
              <p>
                Geprüft werden drei Bereiche:{' '}
                <strong className="text-[#16171A]">Rollwiderstand</strong>{' '}
                (Kraftstoffeffizienz),{' '}
                <strong className="text-[#16171A]">Nasshaftung</strong>{' '}
                (Bremsweg auf nasser Fahrbahn) und das{' '}
                <strong className="text-[#16171A]">externe Rollgeräusch</strong>{' '}
                in Dezibel sowie Klasse A, B oder C.
              </p>
              <p>
                Vom EU-Reifenlabel ausgenommen sind unter anderem runderneuerte
                Reifen, professionelle Offroad-Reifen, Rennreifen, Reifen mit
                zusätzlichen Traktionshilfen wie Spikes, T-Typ-Ersatzreifen,
                Sonderreifen für Fahrzeuge mit Erstzulassung vor dem 1. Oktober
                1990, Reifen mit einer zulässigen Höchstgeschwindigkeit von
                80 km/h sowie Reifen für Felgen mit einem Nenndurchmesser von
                höchstens 254 mm oder mindestens 635 mm.
              </p>
              <p>
                Ziel der Regelung ist mehr wirtschaftliche und ökologische
                Effizienz im Straßenverkehr, mehr Fahrsicherheit und eine
                transparente Entscheidungshilfe für Verbraucherinnen und
                Verbraucher.
              </p>
              <p>
                Fachleute kritisieren, dass das Label nur einen Teil der
                relevanten Eigenschaften abbildet. Aquaplaning, Fahrstabilität,
                Laufleistung, Trockenbremsen und das Verhalten im Winter sind
                nicht enthalten. Unabhängige Tests von Institutionen und
                Fachzeitschriften bleiben deshalb eine wichtige Ergänzung zum
                EU-Reifenlabel.
              </p>
              {(data.fuel || data.wet || data.noiseDb) && (
                <p className="rounded-lg bg-[#F5F5F7] px-4 py-3 text-[14px] text-[#16171A]">
                  Dieses Modell:{' '}
                  {data.fuel ? (
                    <>
                      Kraftstoffeffizienz <strong>{data.fuel}</strong>
                    </>
                  ) : null}
                  {data.fuel && data.wet ? ', ' : null}
                  {data.wet ? (
                    <>
                      Nasshaftung <strong>{data.wet}</strong>
                    </>
                  ) : null}
                  {(data.fuel || data.wet) && data.noiseDb ? ', ' : null}
                  {data.noiseDb ? (
                    <>
                      Rollgeräusch <strong>{data.noiseDb} dB</strong>
                      {data.noiseClass ? ` (Klasse ${data.noiseClass})` : ''}
                    </>
                  ) : null}
                  .
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
