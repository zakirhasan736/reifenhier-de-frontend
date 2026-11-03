import React from 'react';
import { BadgePercent, RefreshCw, ShieldCheck, Truck } from 'lucide-react';

const BENEFITS = [
  {
    icon: Truck,
    title: 'Schneller Versand',
    text: 'In ganz Deutschland',
    tint: 'bg-[#EEF2FF] text-primary-100',
  },
  {
    icon: BadgePercent,
    title: 'Bester Preis',
    text: 'Wir vergleichen die besten Preise',
    tint: 'bg-[#E7F7F1] text-[#0F8A6B]',
  },
  {
    icon: RefreshCw,
    title: 'Immer aktuell',
    text: 'Preise mehrmals täglich aktualisiert',
    tint: 'bg-[#FFF4E5] text-[#D97706]',
  },
  {
    icon: ShieldCheck,
    title: '100 % kostenlos',
    text: 'Vergleichen ohne Anmeldung',
    tint: 'bg-[#F3EEFF] text-[#7C3AED]',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="how-it-works-section benefits-v2 !bg-transparent !pt-0 pb-12 lg:pb-14">
      <div className="custom-container">
        <ul className="work-process-lists grid grid-cols-2 lg:grid-cols-4 rounded-[20px] border border-[#E9ECF3] bg-mono-0 overflow-hidden">
          {BENEFITS.map(({ icon: Icon, title, text, tint }, i) => (
            <li
              key={title}
              className={`work-process-item group flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 p-4 md:p-6 transition-colors hover:bg-[#F8FAFF] ${
                i % 2 === 1 ? 'border-l border-[#EEF0F4]' : ''
              } ${i >= 2 ? 'max-lg:border-t border-[#EEF0F4]' : ''} ${
                i === 2 ? 'lg:border-l' : ''
              }`}
            >
              <span
                className={`inline-flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-[14px] transition-transform group-hover:scale-105 ${tint}`}
              >
                <Icon size={22} strokeWidth={2} />
              </span>
              <span className="min-w-0">
                <span className="work-process-title block text-[14px] md:text-[16px] font-semibold font-primary text-[#16171A] leading-tight">
                  {title}
                </span>
                <span className="work-process-text block mt-0.5 text-[12px] md:text-[14px] font-secondary text-[#6B6E76] leading-snug">
                  {text}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HowItWorks;
