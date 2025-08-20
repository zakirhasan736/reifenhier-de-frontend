'use client';
import React from 'react';
import ProductCard from '@/components/elements/cards/ProductCard';
import ProductSkeletonCard from '@/components/elements/cards/productskeletonCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Product } from '@/types/product';
import Link from 'next/link';

interface RelatedProductsProps {
  relatedProductData: Product[];
  loading: boolean;
}
 
const RelatedProducts: React.FC<RelatedProductsProps> = ({ relatedProductData, loading }) => {

  return (
    <section className="featured-product lg:py-[70px] py-[50px]">
      <div className="custom-container">
        <div className="featured-product-content flex justify-between items-end mb-9">
          <div className="featured-product-left-content w-full">
            <h2 className="h3 text-primary-70  md:text-[28px] text-[26px] lg:text-[36px] font-secondary text-center">
              Ähnliche Produkte
            </h2>
            <p className="text-mono-100 text-center font-medium lg:text-[18px] text-[14px] font-primary">
              Erhalten Sie schnell die passenden Reifen für Ihr Fahrzeug und
              Ihren Fahrstil.
            </p>
          </div>
        </div>
      </div>

      <div className="custom-container">
        {relatedProductData.length === 0 ? (
          <div className="not-found-wrapper py-12">
            <div className="custom-container h-full">
              <div className="not-found-cont flex flex-col justify-center items-center h-full">
                <h4 className="text-center max-sm:text-[20px]">
                  Keine ähnlichen Produkte
                </h4>
                <p className="text-center max-sm:text-[14px]">
                  Wir konnten keine ähnlichen Produkte für Ihre Auswahl finden.
                </p>
                <Link
                  href="/products"
                  className="primary-btn btn-styles mt-6 mx-auto block"
                >
                  Alle Produkte durchsuchen
                </Link>
              </div>
            </div>
          </div>
        ) : (
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
                1024: { slidesPerView: 3, spaceBetween: 19 },
                1100: { slidesPerView: 4, spaceBetween: 19 },
              }}
            >
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <SwiperSlide key={`skeleton-${index}`}>
                      <ProductSkeletonCard />
                    </SwiperSlide>
                  ))
                : relatedProductData.map((product, index) => (
                    <SwiperSlide key={product._id || index}>
                      <ProductCard {...product} showCompareButton={true} />
                    </SwiperSlide>
                  ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
};
    
export default RelatedProducts;
