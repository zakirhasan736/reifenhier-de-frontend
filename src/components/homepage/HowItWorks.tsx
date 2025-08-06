import React from 'react';
import Image from 'next/image';

const HowItWorks: React.FC = () => {
    return (
      <section className="how-it-works-section !bg-transparent !py-0">
        <div className="custom-container">
          <div className="how-it-works-content">
            <div className="how-it-works-right-content w-full">
              <ul className="work-process-lists lg:gap-6 grid md:grid-cols-4 grid-cols-2 gap-4">
                <li className="work-process-item  border border-[#F0F0F2] rounded-[10px] w-full max-md:flex-col max-md:w-full flex flex-col gap-0 items-center justify-center text-center px-[10px] py-[30px]">
                  <div className="icons-item mb-5">
                    <Image
                      src="/images/icons/shipping-icons.svg"
                      alt="Fast Shipping Icon"
                      className="lg:w-[59px] w-[45px]"
                      width={59}
                      height={48}
                      loading="lazy"
                    />
                  </div>
                  <div className="content-area w-full max-md:justify-center  max-md:items-center flex justify-start flex-col items-start">
                    <h2 className="work-process-title w-full lg:text-[20px] text-[16px] text[#404042] font-medium font-primary text-center mb-2">
                      Schneller Versand
                    </h2>
                    <p className="work-process-text lg:h-full h-9 w-full lg:text-[16px] text-[12px] text-center text-[#86878A] font-normal font-secondary">
                      In ganz Deutschland
                    </p>
                  </div>
                </li>
                <li className="work-process-item  border border-[#F0F0F2] rounded-[10px] w-full max-md:flex-col max-md:w-full flex flex-col gap-0 items-center justify-center text-center px-[10px] py-[30px]">
                  <div className="icons-item mb-5">
                    <Image
                      src="/images/icons/trust-icons.svg"
                      alt="Trust Icon"
                      className="lg:w-[59px] w-[45px]"
                      width={59}
                      height={48}
                      loading="lazy"
                    />
                  </div>
                  <div className="content-area w-full max-md:justify-center  max-md:items-center flex justify-start flex-col items-start">
                    <h2 className="work-process-title w-full lg:text-[20px] text-[16px] text[#404042] font-medium font-primary text-center mb-2">
                      Vertrauenswürdiges Produkt
                    </h2>
                    <p className="work-process-text lg:h-full h-9 w-full lg:text-[16px] text-[12px] text-center text-[#86878A] font-normal font-secondary">
                      Nur Teile von vertrauenswürdigen Marken
                    </p>
                  </div>
                </li>
                <li className="work-process-item  border border-[#F0F0F2] rounded-[10px] w-full max-md:flex-col max-md:w-full flex flex-col gap-0 items-center justify-center text-center px-[10px] py-[30px]">
                  <div className="icons-item mb-5">
                    <Image
                      src="/images/icons/best-price-icon.svg"
                      alt="Best Price Icon"
                      className="lg:w-[59px] w-[45px]"
                      width={59}
                      height={48}
                      loading="lazy"
                    />
                  </div>
                  <div className="content-area w-full max-md:justify-center  max-md:items-center flex justify-start flex-col items-start">
                    <h2 className="work-process-title w-full lg:text-[20px] text-[16px] text[#404042] font-medium font-primary text-center mb-2">
                      Bester Preis
                    </h2>
                    <p className="work-process-text lg:h-full h-9 w-full lg:text-[16px] text-[12px] text-center text-[#86878A] font-normal font-secondary">
                      Wir vergleichen die besten Preise
                    </p>
                  </div>
                </li>
                <li className="work-process-item  border border-[#F0F0F2] rounded-[10px] w-full max-md:flex-col max-md:w-full flex flex-col gap-0 items-center justify-center text-center px-[10px] py-[30px]">
                  <div className="icons-item mb-5">
                    <Image
                      src="/images/icons/group-9.svg"
                      alt="Easy Return Icon"
                      className="lg:w-[59px] w-[45px]"
                      width={59}
                      height={48}
                      loading="lazy"
                    />
                  </div>
                  <div className="content-area w-full max-md:justify-center  max-md:items-center flex justify-center flex-col items-center">
                    <h2 className="work-process-title w-full lg:text-[20px] text-[16px] text[#404042] font-medium font-primary text-center mb-2">
                      Einfache Rückgabe
                    </h2>
                    <p className="work-process-text lg:h-full h-9 w-full lg:text-[16px] text-[12px] text-center text-[#86878A] font-normal font-secondary">
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