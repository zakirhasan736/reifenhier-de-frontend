'use client';
import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/elements/cards/ProductCard';
import ProductSkeletonCard from '@/components/elements/cards/productskeletonCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useGetFeaturedProductsQuery } from '@/store/api/featuredProductApi';

const FeaturedProducts: React.FC = () => {
const { data, isLoading } = useGetFeaturedProductsQuery(undefined, {
  refetchOnMountOrArgChange: false,
});

const title = data?.title || 'Our recommendation';
const category = data?.category || 'Winterreifen';
const productData = data?.products || [];

  return (
    <section className="featured-product pt-5  lg:pb-[70] pb-14">
      <div className="custom-container">
        <div className="featured-product-content flex justify-between items-end mb-8">
          <div className="featured-product-left-content w-full">
            <h2 className="h3 font-primary font-medium md:text-[28px] text-[26px] lg:text-[36px] text-center text-[#16171A] mb-3 leading-[120%]">
              {title}
            </h2>
            <p className="font-normal font-secondary text-center lg:text-[18px] text-[16px] leading-[140%] text-[#16171A]">
              Erhalten Sie schnell die passenden Reifen für Ihr Fahrzeug und
              Ihren Fahrstil.
            </p>
          </div>
        </div>
      </div>

      <div className="custom-container max-sm:pr-0">
        <div className="featured-product-list-area product-slides-area md:pr-[16px] md:pl-[10px] pr-10 pl-0 overflow-hidden">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            navigation
            modules={[Navigation, Autoplay, Pagination]}
            autoplay={{ delay: 3900, disableOnInteraction: false }}
            pagination={{
              el: '.custom-swiper-pagination',
              clickable: true,
              renderBullet: (index, className) => {
                return `<span class="${className}"></span>`;
              },
            }}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 10 },
              768: { slidesPerView: 2, spaceBetween: 15 },
              1024: { slidesPerView: 3, spaceBetween: 19 },
              1100: { slidesPerView: 4, spaceBetween: 19 },
            }}
          >
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <SwiperSlide key={`skeleton-${index}`}>
                    <ProductSkeletonCard />
                  </SwiperSlide>
                ))
              : productData.map((product, index) => (
                  <SwiperSlide key={index}>
                    <ProductCard {...product} />
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
        <div className="custom-swiper-pagination  md:hidden flex justify-center mt-6"></div>
        <div className="featured-product-right-content max-md:flex justify-center mt-5 mx-auto w-full">
          <Link
            href={{
              pathname: '/products',
              query: { category },
            }}
            className="mx-auto block text-center underline whitespace-nowrap rounded-full bg-transparent text-primary-70 font-semibold transition ease cursor-pointer py-2 px-6"
          >
            Alle ansehen
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
