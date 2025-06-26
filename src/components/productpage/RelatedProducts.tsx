'use client';
import React from 'react';
import ProductCard from '@/components/elements/cards/ProductCard';
import ProductSkeletonCard from '@/components/elements/cards/productskeletonCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface Product {
  _id: string;
  brand_logo: string;
  product_image: string;
  merchant_product_third_category: string;
  brand_name: string;
  search_price: number;
  product_name: string;
  dimensions: string;
  fuel_class: string;
  wet_grip: string;
  noise_class: string;
  showCompareButton?: boolean;
}
interface RelatedProductsProps {
  relatedProductData: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ relatedProductData }) => {


  return (
    <section className="featured-product pt-10 pb-10 bg-bg-opacity">
      <div className="custom-container">
        <div className="featured-product-content flex justify-between items-end mb-9">
          <div className="featured-product-left-content w-full">
            <h2 className="h3 text-primary-70 font-secondary">
              Related products
            </h2>
            <p className="text-mono-100 font-medium text-[14px] font-primary">
              Quickly get tyres suited to your vehicle and driving style.
            </p>
          </div>
          {/* <div className="featured-product-right-content max-sm:hidden">
            <a
              href="./products"
              className="ml-auto block underline whitespace-nowrap rounded-full bg-transparent text-primary-70 font-semibold transition ease cursor-pointer py-2 px-6"
            >
              View all
            </a>
          </div> */}
        </div>
      </div>

      <div className="custom-container">
        <div className="featured-product-list-area product-slides-area pr-[16px] pl-[10px] max-sm:pr-8 max-sm:pl-0 overflow-hidden">
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
        {/* <div className="featured-product-right-content max-sm:justify-center max-sm:items-center mt-6 hidden max-sm:flex">
          <a
            href="./products"
            className="mx-auto block underline whitespace-nowrap rounded-full bg-transparent text-primary-70 font-semibold transition ease cursor-pointer py-2 px-6"
          >
            View all
          </a>
        </div> */}
      </div>
    </section>
  );
};
    
export default RelatedProducts;
