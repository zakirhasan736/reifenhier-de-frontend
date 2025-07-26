import React from 'react';
import FilterForm from './BannerFilter';
import Image from 'next/image';

const BannerSection = () => {
 
  return (
    <section className="banner-section relative font-primary max-sm:h-auto">
      <Image
        className="banner-image-fill object-cover"
        fill
        priority
        fetchPriority="high"
        sizes="1080px"
        src="/images/banner-image.webp"
        alt="banner-image"
        // width={1920}
        // height={1080}
      />
      <div className="custom-container h-full">
        <div className="banner-content w-full lg:pt-[56px] md:pt-[42px]  lg:pb-[55px] md:pb-[36px] pt-5 pb-6 h-full">
          <div className="tyres-search-area w-full h-full flex items-end justify-center">
            <div className="tyres-search-content w-full relative">
              <div className="tyres-search-left-content lg:mb-10 md:mb-8 mb-6  relative">
                <h1 className="h2 text-mono-0 text-center mb-4 md:text-[38px] lg:text-[48px] leading-[115%] font-medium font-primary text-[26px]">
                  Find the Perfect Tyres <br /> For Your Vehicle
                </h1>
                <p className="text-[#FFFFFFCC] lg:text-[20px] md:text-[18px] text-[16px] text-center font-normal font-primary leading-[150%]">
                  Quickly get tyres suited to your vehicle and driving style.
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
