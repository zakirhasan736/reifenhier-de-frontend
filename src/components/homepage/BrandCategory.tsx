
'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface BrandInfo {
  brand_name: string;
  brandLogo: string;
  count: number;
}

const BrandCategory = () => {
  const [brands, setBrands] = useState<BrandInfo[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/products/brand-summary`);
        if (Array.isArray(res.data.brands)) {
          setBrands(res.data.brands);
        } else {
          console.error('Invalid brand data format', res.data);
        }
      } catch (err) {
        console.error('Error fetching brand summary:', err);
      } 
    };
    fetchBrands();
  }, [apiUrl]);

  return (
    <section className="brand-category-section pt-10 pb-16 bg-mono-0">
      <div className="custom-container">
        <div className="brand-category-content">
          <div className="section-header text-left mb-9">
            <h2 className="h4 text-primary-70 font-secondary">Shop by Brand</h2>
            <p className="text-mono-100 font-medium text-[14px] font-primary">
              Discover tyres from top brands to ensure quality and performance.
            </p>
          </div>

          <div className="featured-product-list-area product-slides-area pr-[16px] pl-[10px] max-sm:pr-8 max-sm:pl-0 overflow-hidden">
            <Swiper
              spaceBetween={20}
              slidesPerView={2}
              navigation
              modules={[Navigation, Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 3, spaceBetween: 10 },
                768: { slidesPerView: 4, spaceBetween: 15 },
                1024: { slidesPerView: 5, spaceBetween: 20 },
              }}
            >
              {brands.length > 0
                ? brands.map((brandItem, index) => (
                    <SwiperSlide key={index}>
                      <Link
                        href={{
                          pathname: '/products',
                          query: { brand: brandItem.brand_name },
                        }}
                        passHref
                      >
                        <div className="brand-item cursor-pointer bg-mono-0 border border-border-100 rounded-[4px] px-4 pb-5 text-center transition ease-in-out duration-300 hover:shadow-md">
                          <div className="brand-image-box py-6">
                            {brandItem.brandLogo &&
                            brandItem.brandLogo !== 'no image' ? (
                              <Image
                                src={brandItem.brandLogo}
                                alt={brandItem.brand_name}
                                width={120}
                                height={35}
                                className="w-auto h-[35px] mx-auto"
                                priority
                              />
                            ) : (
                              <span className="text-primary-70 font-semibold h6 font-secondary">
                                {brandItem.brand_name}
                              </span>
                            )}
                          </div>
                          <h5 className="text-primary-70 font-semibold h6 font-secondary">
                            {brandItem.brand_name}
                          </h5>
                          <p className="number-of-products font-bold text-[12px] font-secondary mt-2">
                            {brandItem.count} Tyres
                          </p>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))
                : Array.from({ length: 5 }).map((_, index) => (
                    <SwiperSlide key={index}>
                      <div className="animate-pulse bg-mono-0 border border-border-100 rounded-[4px] px-4 pb-5 text-center">
                        <div className="brand-image-box py-6">
                          <div className="h-[35px] w-[120px] mx-auto bg-mono-40 bg-border-200 rounded"></div>
                        </div>
                        <div className="h-4 w-3/4 bg-border-200 bg-mono-40 rounded mx-auto mt-2 mb-1"></div>
                        <div className="h-3 w-1/2 bg-border-200 bg-mono-40 rounded mx-auto"></div>
                      </div>
                    </SwiperSlide>
                  ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCategory;
