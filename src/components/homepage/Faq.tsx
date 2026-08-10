import React from 'react';
import Image from 'next/image';
import Script from 'next/script';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

async function getFaqs(): Promise<FAQ[]> {
  try {
    const res = await fetch(`${apiUrl}/api/faq/faqs-lists`, {
      next: { revalidate: 50 },
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

  const faqJsonLd =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer.replace(/<[^>]+>/g, ''),
            },
          })),
        }
      : null;

  return (
    <section className="FAQ-section lg:py-[70px] py-14 bg-[#F7F8FA]">
      <div className="custom-container">
        <div className="faq-content-wrapper md:grid md:grid-cols-12 gap-6 flex flex-col  items-start">
          <div className="faq-left-cont col-span-5 flex flex-col justify-center">
            <div className="faq-model-image w-full rounded-[12px] overflow-hidden">
              <Image
                src="/images/realistic-complete-set-car-wheels-2.png"
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
                    className="collapse rounded-[12px] bg-[#FFFFFF] collapse-plus mb-2"
                  >
                    <label htmlFor={faq._id} className="cursor-pointer"></label>
                    <input
                      type="radio"
                      id={faq._id}
                      name="faq-accordion"
                      defaultChecked={index === 0}
                      aria-label={faq.question}
                    />
                    <div className="collapse-title max-sm:text-[16px] text-[#404042] font-primary font-medium text-[20px] leading-[130%]">
                      {faq.question}
                    </div>
                    <div className="collapse-content max-sm:text-[14px] font-secondary font-normal text-[16px] text-left text-[#404042] leading-[150%]">
                      {faq.answer}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {faqJsonLd && (
        <Script
          id="ld-faq"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(faqJsonLd)}
        </Script>
      )}
    </section>
  );
};

export default FaqSection;
