import React from 'react';
import FilterForm from './BannerFilter';
import Image from 'next/image';

const BannerSection = () => {
 
  return (
    <section className="banner-section relative font-primary max-sm:h-auto">
      <Image
        className="banner-image-fill object-cover"
        src="/images/banner-image.webp" // Prefer a ~150–250 KB file
        alt="Bannerbild Reifencheck.de"
        // Use fill for full-bleed hero
        fill
        //  Make the chosen intrinsic size match the viewport width
        //    (your previous '1080px' made some browsers pick larger files)
        sizes="100vw"
        //  Keep the preload hint for real LCP
        priority
        fetchPriority="high"
        //  Lower quality a bit to reduce bytes (tune 50–70)
        quality={60}
        // Optional: show a quick blur while decoding; doesn't change LCP,
        // but improves perceived UX.
        placeholder="empty"
      />
      <div className="custom-container h-full">
        <div className="banner-content w-full lg:pt-[56px] md:pt-[42px]  lg:pb-[55px] md:pb-[36px] pt-10 pb-6 h-full">
          <div className="tyres-search-area w-full h-full flex items-end justify-center">
            <div className="tyres-search-content w-full relative">
              <div className="tyres-search-left-content lg:mb-10 md:mb-8 mb-7  relative">
                <h1 className="h2 text-mono-0 text-center mb-2 md:mb-4 md:!text-[38px] lg:!text-[48px] leading-[115%] font-medium font-primary !text-[26px]">
                  Finden Sie die perfekten Reifen{' '}
                  <br className="max-sm:hidden" />
                  für Ihr Fahrzeug
                </h1>
                <p className="text-[#FFFFFFCC] lg:text-[20px] md:text-[18px] text-[16px] text-center font-normal font-primary leading-[150%]">
                  Sorgen Sie schnell für Reifen, die zu Ihrem Fahrzeug und
                  Fahrstil passen.
                </p>
              </div>
              <FilterForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
