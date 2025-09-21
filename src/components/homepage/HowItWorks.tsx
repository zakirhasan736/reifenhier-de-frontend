import React from 'react';
import Image from 'next/image';

const HowItWorks: React.FC = () => {
    return (
      <section className="how-it-works-section !bg-transparent !py-0">
        <div className="custom-container">
          <div className="how-it-works-content">
            <div className="how-it-works-right-content w-full">
              <ul className="work-process-lists lg:gap-6 grid md:grid-cols-2 grid-cols-2 gap-4">
                <li className="work-process-item  border border-[#F0F0F2] rounded-[10px] w-full max-md:flex-col max-md:w-full flex flex-col gap-0 items-center justify-start text-center px-[10px] py-[30px]">
                  <div className="icons-item relative mb-5 lg:w-[59px] h-12 w-[45px]">
                    <Image
                      src="/images/icons/shipping-icons.svg"
                      alt="Symbol für schnellen Versand"
                      fill
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="content-area w-full max-md:justify-center  max-md:items-center flex justify-start flex-col items-start">
                    <h2 className="work-process-title w-full lg:text-[20px] text-[16px] text[#404042] font-medium font-primary text-center mb-2">
                      Schneller Versand
                    </h2>
                    <p className="work-process-text lg:h-full h-9 w-full lg:text-[16px] text-[12px] text-center text-[#16171A] font-normal font-secondary">
                      In ganz Deutschland
                    </p>
                  </div>
                </li>
                <li className="work-process-item hidden border border-[#F0F0F2] rounded-[10px] w-full max-md:flex-col max-md:w-full flex-col gap-0 items-center  justify-start text-center px-[10px] py-[30px]">
                  <div className="icons-item relative mb-5 lg:w-[59px] h-12 w-[45px]">
                    <Image
                      src="/images/icons/trust-icons.svg"
                      alt="Symbol für Vertrauen"
                      fill
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="content-area w-full max-md:justify-center  max-md:items-center flex justify-start flex-col items-start">
                    <h2 className="work-process-title w-full lg:text-[20px] text-[16px] text[#404042] font-medium font-primary text-center mb-2">
                      zuverlässig Produkt
                    </h2>
                    <p className="work-process-text lg:h-full h-9 w-full lg:text-[16px] text-[12px] text-center text-[#16171A] font-normal font-secondary">
                      Nur Teile von zuverlässig Marken
                    </p>
                  </div>
                </li>
                <li className="work-process-item  border border-[#F0F0F2] rounded-[10px] w-full max-md:flex-col max-md:w-full flex flex-col gap-0 items-center  justify-start text-center px-[10px] py-[30px]">
                  <div className="icons-item relative mb-5 lg:w-[59px] h-12 w-[45px]">
                    <Image
                      src="/images/icons/best-price-icon.svg"
                      alt="Symbol für besten Preis"
                      fill
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="content-area w-full max-md:justify-center  max-md:items-center flex justify-start flex-col items-start">
                    <h2 className="work-process-title w-full lg:text-[20px] text-[16px] text[#404042] font-medium font-primary text-center mb-2">
                      Bester Preis
                    </h2>
                    <p className="work-process-text lg:h-full h-9 w-full lg:text-[16px] text-[12px] text-center text-[#16171A] font-normal font-secondary">
                      Wir vergleichen die besten Preise
                    </p>
                  </div>
                </li>
                <li className="work-process-item hidden  border border-[#F0F0F2] rounded-[10px] w-full max-md:flex-col max-md:w-full  flex-col gap-0 items-center justify-start text-center px-[10px] py-[30px]">
                  <div className="icons-item relative mb-5 lg:w-[59px] h-12 w-[45px]">
                    <Image
                      src="/images/icons/group-9.svg"
                      alt="Symbol für einfache Rückgabe"
                      fill
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="content-area w-full max-md:justify-center  max-md:items-center flex justify-center flex-col items-center">
                    <h2 className="work-process-title w-full lg:text-[20px] text-[16px] text[#404042] font-medium font-primary text-center mb-2">
                      Einfache Rückgabe
                    </h2>
                    <p className="work-process-text lg:h-full h-9 w-full lg:text-[16px] text-[12px] text-center text-[#16171A] font-normal font-secondary">
                      Einfache Rückgabebedingungen
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
};

export default HowItWorks;