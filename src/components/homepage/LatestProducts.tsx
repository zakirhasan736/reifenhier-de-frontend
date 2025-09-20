
"use client";
import React from "react";
import ProductCard from "@/components/elements/cards/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductSkeletonCard from '@/components/elements/cards/productskeletonCard';
import Link from "next/link";

import { useGetLatestProductsQuery } from '@/store/api/latestProductApi';
const LatestProducts: React.FC = () => {
const { data, isLoading } = useGetLatestProductsQuery(undefined, {
  refetchOnMountOrArgChange: false,
});

 const productData = data?.products || [];

  return (
    <section className="featured-product lg:py-[70px] py-14">
      <div className="custom-container">
        <div className="featured-product-content flex justify-between items-end lg:mb-8 mb-6">
          <div className="featured-product-left-content w-full">
            <h2 className="h3 font-primary font-medium md:text-[28px] text-[26px] lg:text-[36px] text-center text-[#16171A] mb-3 leading-[120%]">
              Neueste Produkte
            </h2>
            <p className="font-normal font-secondary text-center lg:text-[18px] text-[14px] leading-[140%] text-[#89898B]">
              Erhalten Sie schnell die passenden Reifen für Ihr Fahrzeug und
              Ihren Fahrstil.
            </p>
          </div>
          <div className="featured-product-right-content hidden">
            <Link
              href="/products"
              className="ml-auto block underline whitespace-nowrap rounded-full bg-transparent text-primary-70 font-semibold transition ease cursor-pointer py-2 px-6"
            >
              Alle ansehen
            </Link>
          </div>
        </div>
      </div>

      <div className="custom-container max-sm:pr-0">
        <div className="latest-product-list-area product-slides-area pr-4 pl-[10px] max-sm:pr-10 max-sm:pl-0 overflow-hidden">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            navigation
            modules={[Navigation, Autoplay, Pagination]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{
              el: '.latest-swiper-pagination',
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
                  <SwiperSlide key={product._id || index}>
                    <ProductCard {...product} />
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
        <div className="latest-swiper-pagination md:hidden flex justify-center mt-6"></div>
      </div>
      <div className="featured-product-right-content mt-6 hidden justify-center">
        <Link
          href="/products"
          className="mx-auto block underline whitespace-nowrap rounded-full bg-transparent text-primary-70 font-semibold transition ease cursor-pointer py-2 px-6"
        >
          View all
        </Link>
      </div>
    </section>
  );
};

export default LatestProducts;
