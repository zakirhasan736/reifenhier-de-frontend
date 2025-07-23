'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import ProductCard from '@/components/elements/cards/ProductCard';
import ProductSkeletonCard from '@/components/elements/cards/productskeletonCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Product } from '@/types/product';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const FeaturedProducts: React.FC = () => {
  const [productData, setProductData] = useState<Product[]>([]);
  const [title, setTitle] = useState('Our recommendation');
  const [category, setCategory] = useState('Winterreifen');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/products/sessions-products`);
        const { products, title, category } = res.data;
        setProductData(products || []);
        if (title) setTitle(title);
        if (category) setCategory(category);
      } catch (err) {
        console.error('Error fetching featured products:', err);
      }
    };

    fetchFeaturedProducts();
  }, [apiUrl]);

  const selectedCategory =
    productData[0]?.merchant_product_third_category || 'Winterreifen';
    console.log('Selected category:', selectedCategory);

  return (
    <section className="featured-product pt-5  lg:pb-[70] pb-14">
      <div className="custom-container">
        <div className="featured-product-content flex justify-between items-end mb-8">
          <div className="featured-product-left-content w-full">
            <h2 className="h3 font-primary font-medium md:text-[28px] text-[26px] lg:text-[36px] text-center text-[#16171A] mb-3 leading-[120%]">
              {title}
            </h2>
            <p className="font-normal font-secondary text-center lg:text-[18px] text-[14px] leading-[140%] text-[#89898B]">
              Quickly get tyres suited to your vehicle and driving style.
            </p>
          </div>
        </div>
      </div>

      <div className="custom-container">
        <div className="featured-product-list-area product-slides-area md:pr-[16px] md:pl-[10px] pr-14 pl-0 overflow-hidden">
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
              1024: { slidesPerView: 4, spaceBetween: 19 },
            }}
          >
            {productData.length === 0
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
            View all
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
