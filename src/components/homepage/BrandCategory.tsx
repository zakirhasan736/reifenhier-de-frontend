import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { BrandHomeItem } from '@/libs/homeData';

const MAX_BRANDS = 11;

const BrandCategory = ({ brands = [] }: { brands?: BrandHomeItem[] }) => {
  const list = [...(brands ?? [])]
    .filter(b => b?.brand_name)
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, MAX_BRANDS);

  return (
    <section
      className="brand-category-section brand-grid-v2 lg:py-[80px] py-14 bg-mono-0"
      id="byBrand"
    >
      <div className="custom-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
          <div className="max-w-[620px]">
            <span className="inline-block rounded-full bg-[#EEF2FF] text-primary-100 text-[12px] md:text-[13px] font-semibold tracking-[0.08em] uppercase px-3 py-1 mb-3">
              Marken
            </span>
            <h2 className="h3 font-primary font-semibold text-[26px] md:text-[32px] lg:text-[40px] leading-[118%] tracking-[-0.01em] text-[#16171A] mb-2">
              Nach Marke einkaufen
            </h2>
            <p className="font-secondary md:!text-[17px] !text-[14px] text-[#6B6E76]">
              Entdecken Sie Reifen von Top-Marken, um Qualität und Leistung
              sicherzustellen.
            </p>
          </div>
          <Link
            href="/marken"
            className="hidden md:inline-flex items-center gap-2 rounded-[10px] border border-[#DCE3FB] px-4 py-2.5 text-[14px] font-semibold text-primary-100 hover:bg-[#F5F8FF] transition-colors"
          >
            Alle Marken
            <ArrowRight size={16} strokeWidth={2.4} />
          </Link>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {list.map((brandItem, index) => (
            <li key={`${brandItem.brand_name}-${index}`}>
              <Link
                href={{
                  pathname: '/produkte',
                  query: { brand: brandItem.brand_name },
                }}
                className="brand-item group flex h-full flex-col items-center justify-between rounded-[16px] border border-[#E9ECF3] bg-mono-0 p-3 md:p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-[#C9D6FC] hover:shadow-[0_16px_32px_-18px_rgba(58,100,246,0.35)]"
              >
                <div className="brand-image-box flex h-[52px] md:h-[72px] w-full items-center justify-center rounded-[12px] bg-[#F5F7FB] px-3 mb-3 transition-colors group-hover:bg-[#EEF2FF]">
                  {brandItem.brandLogo && brandItem.brandLogo !== 'no image' ? (
                    <Image
                      src={brandItem.brandLogo}
                      alt={brandItem.brand_name}
                      width={120}
                      height={27}
                      className="max-h-[30px] w-auto object-contain grayscale-[35%] transition group-hover:grayscale-0"
                      loading="lazy"
                    />
                  ) : (
                    <span className="font-semibold font-primary text-[16px] text-[#404042]">
                      {brandItem.brand_name}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold font-primary text-[15px] md:text-[16px] leading-tight text-[#16171A]">
                  {brandItem.brand_name}
                </h3>
                <p className="number-of-products text-[12px] md:text-[13px] font-secondary mt-1 text-[#6B6E76]">
                  {brandItem.count} Reifen
                </p>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/marken"
              className="group flex h-full min-h-[150px] flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-[#C9D6FC] bg-[#F5F8FF] p-4 text-center text-primary-100 transition-colors hover:bg-[#EEF2FF]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-mono-0 transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={18} strokeWidth={2.4} />
              </span>
              <span className="font-semibold text-[15px]">Alle Marken</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default BrandCategory;
