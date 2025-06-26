import React from 'react';
import Image from 'next/image';

const AboutUs = () => {
    return (
      <section className="about-section pt-16 pb-16">
        <div className="custom-container">
          <div className="about-sec-wrapper grid grid-cols-12 max-md:gap-6 gap-12 max-md:grid-cols-full">
            <div className="about-sec-info-cont px-4 max-md:col-span-full col-span-6 max-md:order-2 order-1">
              <h3 className="h3 about-sec-title max-w-[540px] max-md:max-w-full mb-6">
                Willkommen bei Reifenhier.de
              </h3>
              <p className="about-sec-desc body-regular mb-2">
                Ihrer zentralen Plattform für den umfassenden Reifenvergleich
                mit einem besonderen Fokus auf Nachhaltigkeit und die Mobilität
                der Zukunft.
              </p>
              <p className="about-sec-desc body-regular mb-2">
                Unser Ziel ist es, Ihnen nicht nur dabei zu helfen, die besten
                Reifen für Ihr Fahrzeug zu finden, sondern auch diejenigen, die
                unsere Umwelt schonen und optimal für Elektrofahrzeuge
                (EVs)/Hybrid geeignet sind.
              </p>
              <p className="about-sec-desc body-regular mb-2">
                Bei Reifenhier.de vergleichen wir eine Vielzahl von
                Reifenmodellen und bieten Ihnen aktuelle Informationen über
                Preise, Verfügbarkeit und Leistung. Besonders stolz sind wir auf
                unseren Blog, der sich intensiv mit Reifen für Elektrofahrzeuge
                und ECO-Reifen auseinandersetzt.
              </p>
              <p className="about-sec-desc body-regular mb-2">
                Unser Team aus Auto- und Umweltenthusiasten arbeitet
                kontinuierlich daran, die neuesten Entwicklungen in der
                Reifenindustrie zu verfolgen und Ihnen fundierte Empfehlungen zu
                geben. Wir glauben fest daran, dass die Zukunft der Mobilität
                grün ist, und möchten Ihnen helfen, eine kluge und nachhaltige
                Entscheidung für Ihr Fahrzeug zu treffen.
              </p>
              <p className="about-sec-desc body-regular">
                Mit Reifenhier.de setzen Sie auf Expertise, Transparenz und
                Nachhaltigkeit. Lassen Sie uns gemeinsam den Weg in eine
                umweltbewusste und sichere Mobilität gestalten.
              </p>
            </div>
            <div className="about-sec-modal-img max-md:col-span-full col-span-6 pl-[54px] max-md:pl-10 max-sm:pl-0 laptop-m:pl-0 max-md:order-1 order-2">
              <Image
                alt="About Reifenhier.de"
                src="/images/new_tyres.jpg"
                width={635}
                height={385}
                loading="lazy"
                className="w-full h-full max-md:h-[385px] max-md:w-[635px] max-sm:h-full max-sm:w-full"
              />
            </div>
          </div>
        </div>
      </section>
    );
};

export default AboutUs;
