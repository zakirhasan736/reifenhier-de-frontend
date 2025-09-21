import React from 'react';
import Image from 'next/image';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

async function getFaqs(): Promise<FAQ[]> {
  try {
    const res = await fetch(`${apiUrl}/api/faq/faqs-lists`, {
      // Revalidate once per hour (3600s)
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error('Failed to fetch FAQs');

    return await res.json();
  } catch (error) {
    console.error('ISR FAQ fetch error:', error);
    return [];
  }
}


const FaqSection = async () => {
  const faqs = await getFaqs();
  
  return (
    <section className="FAQ-section lg:py-[70px] py-14">
      <div className="custom-container">
        <div className="faq-content-wrapper md:grid md:grid-cols-12 gap-6 flex flex-col  items-start">
          <div className="faq-left-cont col-span-5 flex flex-col justify-center">
            <div className="faq-model-image w-full">
              <Image
                src="/images/realistic-complete-set-car-wheels 1.png"
                alt="FAQ-Modell"
                width={419}
                height={397}
                loading="lazy"
              />
            </div>
          </div>
          <div className="faq-right-cont col-span-7">
            <div className="section-header text-left md:mb-8 mb-6">
              <h2 className="h3  md:text-[28px] text-[26px] lg:text-[36px] text-[#16171A] font-primary font-medium text-left leading-tight">
                Häufig gestellte Fragen
              </h2>
            </div>

            <div className="FAQ-list">
              {faqs.length === 0 ? (
                <p>Zurzeit sind keine FAQs verfügbar.</p>
              ) : (
                faqs.map((faq, index) => (
                  <div
                    key={faq._id}
                    className="collapse rounded-[12px] bg-[#F5F5F7] collapse-plus mb-2"
                  >
                    <label
                      htmlFor="faq-accordion"
                      className="cursor-pointer"
                    ></label>
                    <input
                      type="radio"
                      name="faq-accordion"
                      defaultChecked={index === 0}
                    />
                    <div className="collapse-title max-sm:text-[16px] text-[#404042] font-primary font-medium text-[20px] leading-[130%]">
                      {faq.question}
                    </div>
                    <div className="collapse-content max-sm:text-[14px] font-secondary font-normal text-[16px] text-left text-[#16171A] leading-[150%]">
                      {faq.answer}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

