'use client';
import React from 'react';
import ProductCard from '@/components/elements/cards/ProductCard';
import ProductSkeletonCard from '@/components/elements/cards/productskeletonCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Product } from '@/types/product';

interface RelatedProductsProps {
  relatedProductData: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ relatedProductData }) => {

  return (
    <section className="featured-product lg:py-[70px] py-[50px]">
      <div className="custom-container">
        <div className="featured-product-content flex justify-between items-end mb-9">
          <div className="featured-product-left-content w-full">
            <h2 className="h3 text-primary-70  md:text-[28px] text-[26px] lg:text-[36px] font-secondary text-center">
              Related products
            </h2>
            <p className="text-mono-100 text-center font-medium lg:text-[18px] text-[14px] font-primary">
              Quickly get tyres suited to your vehicle and driving style.
            </p>
          </div>
        </div>
      </div>

      <div className="custom-container">
        <div className="featured-product-list-area product-slides-area lg:pr-[16px] md:pl-[10px] pr-14 pl-0 overflow-hidden">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            navigation
            modules={[Navigation, Autoplay]}
            autoplay={{ delay: 3900, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 10 },
              768: { slidesPerView: 2, spaceBetween: 15 },
              1024: { slidesPerView: 4, spaceBetween: 19 },
            }}
          >
            {relatedProductData.length === 0
              ? Array.from({ length: 5 }).map((_, index) => (
                  <SwiperSlide key={`skeleton-${index}`}>
                    <ProductSkeletonCard />
                  </SwiperSlide>
                ))
              : relatedProductData.map((product, index) => (
                  <SwiperSlide key={product.dimensions || index}>
                    <ProductCard {...product} showCompareButton={true} />
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
    
export default RelatedProducts;
