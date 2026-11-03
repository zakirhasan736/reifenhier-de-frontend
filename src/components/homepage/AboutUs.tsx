import React from 'react';
import Image from 'next/image';
import { Leaf, Scale, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: Scale,
    title: 'Transparenter Vergleich',
    text: 'Aktuelle Preise, Verfügbarkeit und EU-Label vieler Händler auf einen Blick – neutral und kostenlos.',
  },
  {
    icon: Zap,
    title: 'Fokus auf EV & Hybrid',
    text: 'Wir zeigen, welche Reifen für Elektro- und Hybridfahrzeuge optimal geeignet sind.',
  },
  {
    icon: Leaf,
    title: 'Nachhaltig unterwegs',
    text: 'ECO-Reifen mit niedrigem Rollwiderstand schonen Umwelt und Geldbeutel gleichermaßen.',
  },
];

const STATS = [
  { value: '40.000+', label: 'Reifen im Vergleich' },
  { value: 'Mehrmals', label: 'täglich aktualisiert' },
  { value: '100 %', label: 'kostenlos' },
];

const AboutUs = () => {
  return (
    <section className="about-section about-v2 lg:py-[90px] py-14">
      <div className="custom-container">
        <div className="grid grid-cols-12 gap-y-10 lg:gap-x-16 items-center">
          {/* ---- Image column ---- */}
          <div className="col-span-12 lg:col-span-5 relative">
            <div className="about-v2-image relative rounded-[24px] overflow-hidden aspect-[4/4.4] max-lg:aspect-[16/10] w-full">
              <Image
                alt="Über Reifexa.de"
                src="/images/car-mechanic-changing-wheels-car-1.png"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                loading="lazy"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1533]/55 via-transparent to-transparent" />
            </div>

            {/* floating stat card */}
            <div className="about-v2-badge absolute -bottom-6 left-4 md:left-8 right-4 md:right-auto md:max-w-[340px] rounded-[16px] bg-mono-0 p-4 md:p-5">
              <div className="grid grid-cols-3 gap-3 divide-x divide-[#EEF0F4]">
                {STATS.map(s => (
                  <div key={s.label} className="text-center px-1">
                    <div className="text-[16px] md:text-[18px] font-semibold text-primary-100 font-primary leading-tight">
                      {s.value}
                    </div>
                    <div className="text-[11px] md:text-[12px] text-[#6B6E76] font-secondary leading-tight mt-1">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ---- Text column ---- */}
          <div className="col-span-12 lg:col-span-7 max-lg:pt-4">
            <span className="inline-block rounded-full bg-[#EEF2FF] text-primary-100 text-[12px] md:text-[13px] font-semibold tracking-[0.08em] uppercase px-3 py-1 mb-4">
              Über uns
            </span>
            <h2 className="h3 about-sec-title text-[26px] md:text-[32px] lg:text-[40px] font-primary font-semibold leading-[118%] tracking-[-0.01em] text-[#16171A] mb-5">
              Willkommen bei Reifexa.de –{' '}
              <span className="text-primary-100">
                Reifenvergleich mit Weitblick
              </span>
            </h2>

            <p className="about-sec-desc md:text-[17px] text-[15px] font-secondary text-[#404042] mb-3">
              Ihre zentrale Plattform für den umfassenden Reifenvergleich mit
              einem besonderen Fokus auf Nachhaltigkeit und die Mobilität der
              Zukunft. Wir helfen Ihnen nicht nur, die besten Reifen für Ihr
              Fahrzeug zu finden, sondern auch diejenigen, die die Umwelt
              schonen und optimal für Elektrofahrzeuge und Hybride geeignet
              sind.
            </p>
            <p className="about-sec-desc md:text-[16px] text-[14px] font-secondary text-[#6B6E76] mb-8">
              Unser Team aus Auto- und Umweltenthusiasten verfolgt laufend die
              neuesten Entwicklungen der Reifenindustrie – und unser Blog
              beschäftigt sich intensiv mit EV- und ECO-Reifen. Mit Reifexa.de
              setzen Sie auf Expertise, Transparenz und Nachhaltigkeit.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="about-v2-feature group rounded-[16px] border border-[#EEF0F4] bg-mono-0 p-4 md:p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#DCE3FB]"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EEF2FF] text-primary-100 mb-3 transition-colors group-hover:bg-primary-100 group-hover:text-mono-0">
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  <h3 className="text-[15px] md:text-[16px] font-semibold text-[#16171A] font-primary mb-1.5">
                    {title}
                  </h3>
                  <p className="!text-[13px] md:!text-[14px] !leading-[150%] !tracking-normal text-[#6B6E76] font-secondary">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
