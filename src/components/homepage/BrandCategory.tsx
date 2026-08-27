import Image from 'next/image';
import Link from 'next/link';
import SsrCarousel from '@/components/elements/SsrCarousel';
import type { BrandHomeItem } from '@/libs/homeData';

const BrandCategory = ({ brands = [] }: { brands?: BrandHomeItem[] }) => {
  return (
    <section
      className="brand-category-section lg:pb-[70] pb-14 bg-mono-0"
      id="byBrand"
    >
      <div className="custom-container">
        <div className="brand-category-content">
          <div className="section-header text-center mb-9">
            <h2 className="h3 font-primary font-medium md:text-[28px] text-[26px] lg:text-[36px] text-center text-[#16171A] mb-3">
              Nach Marke einkaufen
            </h2>
            <p className="font-normal font-secondary text-center lg:text-[18px] text-[14px] leading-[140%] text-[#404042]">
              Entdecken Sie Reifen von Top-Marken, um Qualität und Leistung
              sicherzustellen.
            </p>
          </div>
        </div>
      </div>

      <div className="brand-slides-area relative w-full overflow-hidden px-3 sm:px-4 md:px-6">
        <SsrCarousel
          variant="brands"
          autoplayMs={3000}
          ariaLabel="Reifenmarken"
          slidesToScroll={2}
          arrowAlign="container"
          showDots={false}
        >
          {(brands ?? []).map((brandItem, index) => (
            <Link
              key={`${brandItem.brand_name}-${index}`}
              href={{
                pathname: '/produkte',
                query: { brand: brandItem.brand_name },
              }}
            >
              <div className="brand-item cursor-pointer text-center transition ease-in-out duration-300 hover:shadow-md">
                <div className="brand-image-box flex items-center justify-center md:p-4 p-2 md:w-[180px] md:h-[180px] w-[90px] h-[90px] bg-[#F5F5F7] rounded-full mx-auto mb-5 border border-[#F0F0F2]">
                  {brandItem.brandLogo && brandItem.brandLogo !== 'no image' ? (
                    <Image
                      src={brandItem.brandLogo}
                      alt={brandItem.brand_name}
                      width={120}
                      height={27}
                      className="w-auto md:h-[27px] mx-auto"
                      loading="lazy"
                    />
                  ) : (
                    <span className="font-medium font-primary text-center md:text-[20px] text-[16px] leading-[140%] text-[#404042]">
                      {brandItem.brand_name}
                    </span>
                  )}
                </div>
                <h3 className="font-medium font-primary text-center md:text-[20px] text-[16px] leading-[140%] text-[#404042]">
                  {brandItem.brand_name}
                </h3>
                <p className="number-of-products md:text-[16px] text-[12px] text-center font-medium font-secondary md:mt-2 mt-1 text-[#404042]">
                  {brandItem.count} Reifen
                </p>
              </div>
            </Link>
          ))}
        </SsrCarousel>
      </div>
    </section>
  );
};

export default BrandCategory;
