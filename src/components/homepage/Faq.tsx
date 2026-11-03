import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageCircleQuestion, Plus } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';

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
    <section className="FAQ-section faq-v2 lg:py-[90px] py-14 bg-[#F6F8FC]">
      <div className="custom-container">
        <div className="grid grid-cols-12 gap-y-8 lg:gap-x-14 items-start">
          {/* ---- Intro / contact column ---- */}
          <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-28">
            <span className="inline-block rounded-full bg-[#EEF2FF] text-primary-100 text-[12px] md:text-[13px] font-semibold tracking-[0.08em] uppercase px-3 py-1 mb-4">
              FAQ
            </span>
            <h2 className="h3 text-[26px] md:text-[32px] lg:text-[40px] text-[#16171A] font-primary font-semibold leading-[118%] tracking-[-0.01em] mb-4">
              Häufig gestellte Fragen
            </h2>
            <p className="md:!text-[16px] !text-[14px] text-[#6B6E76] font-secondary mb-6 lg:mb-8">
              Alles Wichtige rund um Reifenvergleich, Reifengrößen und den
              Kauf beim passenden Händler – kurz und verständlich erklärt.
            </p>

            <div className="faq-v2-help hidden lg:block relative overflow-hidden rounded-[20px] bg-[#0F1E4D] p-6">
              <Image
                src="/images/realistic-complete-set-car-wheels-2.png"
                alt=""
                aria-hidden
                width={419}
                height={397}
                loading="lazy"
                className="absolute -right-16 -bottom-14 w-[220px] h-auto opacity-30 pointer-events-none"
              />
              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/10 text-white mb-4">
                <MessageCircleQuestion size={20} strokeWidth={2} />
              </span>
              <h3 className="relative text-[18px] font-semibold text-white font-primary mb-2">
                Frage nicht dabei?
              </h3>
              <p className="relative !text-[14px] !text-white/75 font-secondary mb-5 max-w-[240px]">
                In unserem Ratgeber finden Sie ausführliche Artikel rund um
                Reifen.
              </p>
              <Link
                href="/artikel"
                className="relative inline-flex items-center gap-2 rounded-[10px] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#0F1E4D] hover:bg-white/90 transition-colors"
              >
                Zum Ratgeber
                <ArrowRight size={16} strokeWidth={2.4} />
              </Link>
            </div>
          </div>

          {/* ---- Accordion ---- */}
          <div className="col-span-12 lg:col-span-8">
            <div className="FAQ-list flex flex-col gap-3">
              {faqs.length === 0 ? (
                <p>Zurzeit sind keine FAQs verfügbar.</p>
              ) : (
                faqs.map((faq, index) => (
                  <details
                    key={faq._id}
                    name="faq-accordion"
                    open={index === 0}
                    className="faq-v2-item group rounded-[16px] bg-mono-0 border border-[#E9ECF3] transition-all duration-200 open:border-[#C9D6FC] open:shadow-[0_10px_30px_-12px_rgba(58,100,246,0.25)]"
                  >
                    <summary className="flex items-start gap-4 cursor-pointer list-none select-none p-4 md:p-6 [&::-webkit-details-marker]:hidden">
                      <span className="faq-v2-num shrink-0 inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-[10px] bg-[#F2F4F8] text-[13px] md:text-[14px] font-semibold text-[#6B6E76] font-primary tabular-nums transition-colors group-open:bg-primary-100 group-open:text-mono-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 pt-1 text-[15px] md:text-[18px] font-medium font-primary leading-[135%] text-[#16171A]">
                        {faq.question}
                      </span>
                      <span className="shrink-0 mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E9ECF3] text-[#404042] transition-all duration-200 group-open:rotate-45 group-open:border-primary-100 group-open:bg-primary-100 group-open:text-mono-0">
                        <Plus size={16} strokeWidth={2.4} />
                      </span>
                    </summary>
                    <div className="faq-v2-answer px-4 md:px-6 pb-5 md:pb-6 md:pl-[76px] pl-16 -mt-1">
                      <p className="md:!text-[16px] !text-[14px] font-secondary !leading-[165%] text-[#5B5D63]">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {faqJsonLd && <JsonLd id="ld-faq" data={faqJsonLd} />}
    </section>
  );
};

export default FaqSection;
