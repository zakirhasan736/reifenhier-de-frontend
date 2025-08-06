import React from 'react';
import Image from 'next/image';

const AboutUs = () => {
    return (
      <section className="about-section lg:pb-[70] pb-14">
        <div className="custom-container">
          <div className="about-sec-wrapper grid grid-cols-12 md:gap-0 gap-6 lg:gap-12 max-md:grid-cols-full">
            <div className="about-sec-info-cont  md:py-7 max-md:col-span-full col-span-6 max-md:order-2 order-1">
              <h2 className="h3 about-sec-title  md:text-[28px] text-[26px] lg:text-[34px] text-left font-primary leading-[120%] font-medium text-[#16171A] lg:max-w-[586px] max-w-full mb-5">
                Willkommen bei Reifencheck.de
              </h2>
              <p className="about-sec-desc md:text-[16px] text-[14px] text-left font-normal font-secondary text-[#89898B] md:mb-3 mb-2">
                Ihrer zentralen Plattform für den umfassenden Reifenvergleich
                mit einem besonderen Fokus auf Nachhaltigkeit und die Mobilität
                der Zukunft.
              </p>
              <p className="about-sec-desc md:text-[16px] text-[14px] text-left font-normal font-secondary text-[#89898B] md:mb-3 mb-2">
                Unser Ziel ist es, Ihnen nicht nur dabei zu helfen, die besten
                Reifen für Ihr Fahrzeug zu finden, sondern auch diejenigen, die
                unsere Umwelt schonen und optimal für Elektrofahrzeuge
                (EVs)/Hybrid geeignet sind.
              </p>
              <p className="about-sec-desc md:text-[16px] text-[14px] text-left font-normal font-secondary text-[#89898B] md:mb-3 mb-2">
                Bei Reifenhier.de vergleichen wir eine Vielzahl von
                Reifenmodellen und bieten Ihnen aktuelle Informationen über
                Preise, Verfügbarkeit und Leistung. Besonders stolz sind wir auf
                unseren Blog, der sich intensiv mit Reifen für Elektrofahrzeuge
                und ECO-Reifen auseinandersetzt.
              </p>
              <p className="about-sec-desc md:text-[16px] text-[14px] text-left font-normal font-secondary text-[#89898B] md:mb-3 mb-2">
                Unser Team aus Auto- und Umweltenthusiasten arbeitet
                kontinuierlich daran, die neuesten Entwicklungen in der
                Reifenindustrie zu verfolgen und Ihnen fundierte Empfehlungen zu
                geben. Wir glauben fest daran, dass die Zukunft der Mobilität
                grün ist, und möchten Ihnen helfen, eine kluge und nachhaltige
                Entscheidung für Ihr Fahrzeug zu treffen.
              </p>
              <p className="about-sec-desc md:text-[16px] text-[14px] text-left font-normal font-secondary text-[#89898B]">
                3 Mit Reifenhier.de setzen Sie auf Expertise, Transparenz und
                Nachhaltigkeit. Lassen Sie uns gemeinsam den Weg in eine
                umweltbewusste und sichere Mobilität gestalten.
              </p>
            </div>
            <div className="about-sec-modal-img lg:relative md:sticky max-sm:relative lg:h-full md:h-[385px] max-sm:h-full top-0 flex justify-end max-md:col-span-full col-span-6 lg:pl-[54px] pl-10 max-sm:pl-0 laptop-m:pl-0 max-md:order-1 order-2">
              <Image
                alt="About Reifenhier.de"
                src="/images/car-mechanic-changing-wheels-car.png"
                width={474}
                height={541}
                loading="lazy"
                className="lg:w-[474px] lg:h-auto md:h-[385px] md:w-[635px] h-full"
              />
            </div>
          </div>
        </div>
      </section>
    );
};

export default AboutUs;
