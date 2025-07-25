
'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useGetBrandSummaryQuery } from '@/store/api/brandApi';


const BrandCategory = () => {
   const { data, isLoading, error } = useGetBrandSummaryQuery();
   const brands = data?.brands || [];

  return (
    <section className="brand-category-section lg:pb-[70] pb-14 bg-mono-0">
      <div className="custom-container">
        <div className="brand-category-content">
          <div className="section-header text-center mb-9">
            <h2 className="h3 font-primary font-medium  md:text-[28px] text-[26px] lg:text-[36px] text-center text-[#16171A] mb-3">
              Shop by Brand
            </h2>
            <p className="font-normal font-secondary text-center lg:text-[18px] text-[14px] leading-[140%] text-[#89898B]">
              Discover tyres from top brands to ensure quality and performance.
            </p>
          </div>
        </div>
      </div>

      <div className="featured-product-list-area product-slides-area md:pr-24 md:pl-24 pr-14 pl-0 overflow-hidden">
        <Swiper
          spaceBetween={8}
          slidesPerView={3}
          navigation
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 8 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            1024: { slidesPerView: 6, spaceBetween: 24 },
            1500: { slidesPerView: 8, spaceBetween: 24 },
          }}
        >
          {isLoading || error
            ? Array.from({ length: 5 }).map((_, index) => (
                <SwiperSlide key={index}>
                  <div className="animate-pulse bg-mono-0 border border-border-100 rounded-[4px] px-4 pb-5 text-center">
                    <div className="brand-image-box py-6">
                      <div className="h-[35px] w-[120px] mx-auto bg-mono-40 bg-border-200 rounded"></div>
                    </div>
                    <div className="h-4 w-3/4 bg-border-200 bg-mono-40 rounded mx-auto mt-2 mb-1"></div>
                    <div className="h-3 w-1/2 bg-border-200 bg-mono-40 rounded mx-auto"></div>
                  </div>
                </SwiperSlide>
              ))
            : brands.map((brandItem, index) => (
                <SwiperSlide key={index}>
                  <Link
                    href={{
                      pathname: '/products',
                      query: { brand: brandItem.brand_name },
                    }}
                    passHref
                  >
                    <div className="brand-item cursor-pointer text-center transition ease-in-out duration-300 hover:shadow-md">
                      <div className="brand-image-box flex items-center justify-center md:p-4 p-2 md:w-[180px] md:h-[180px] w-[90px] h-[90px] bg-[#F5F5F7] rounded-full mx-auto mb-5 border border-[#F0F0F2]">
                        {brandItem.brandLogo &&
                        brandItem.brandLogo !== 'no image' ? (
                          <Image
                            src={brandItem.brandLogo}
                            alt={brandItem.brand_name}
                            width={120}
                            height={27}
                            className="w-auto md:h-[27px] mx-auto"
                            priority
                          />
                        ) : (
                          <span className="font-medium font-primary text-center md:text-[20px] text-[16px] leading-[140%] text-[#404042]">
                            {brandItem.brand_name}
                          </span>
                        )}
                      </div>
                      <h5 className="font-medium font-primary text-center md:text-[20px] text-[16px] leading-[140%] text-[#404042]">
                        {brandItem.brand_name}
                      </h5>
                      <p className="number-of-products md:text-[16px] text-[12px] text-center font-medium font-secondary md:mt-2 mt-1 text-[#86878A]">
                        {brandItem.count} Tyres
                      </p>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BrandCategory;
