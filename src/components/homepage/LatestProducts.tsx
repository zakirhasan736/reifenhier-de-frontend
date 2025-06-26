
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/elements/cards/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductSkeletonCard from '@/components/elements/cards/productskeletonCard';
import Link from "next/link";

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

const LatestProducts: React.FC = () => {
  const [productData, setProductData] = useState<Product[]>([]);

  useEffect(() => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const fetchLatestProducts = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/products/latest-products`);
        console.log('Received data:', res.data);
        const latestProducts = res.data.products;
        setProductData(latestProducts); // Set the latest products in state
      } catch (err) {
        console.error('Error fetching latest products:', err);
      }
    };
    fetchLatestProducts();
  }, []);


  return (
    <section className="featured-product pt-[120px] max-sm:pt-[150px] pb-10 bg-bg-opacity">
      <div className="custom-container">
        <div className="featured-product-content flex justify-between items-end mb-9">
          <div className="featured-product-left-content w-full">
            <h2 className="h3 text-primary-70 font-secondary"> 
              Latest products
            </h2>
            <p className="text-mono-100 font-medium text-[14px] font-primary">
              Quickly get tyres suited to your vehicle and driving style.
            </p>
          </div>
          <div className="featured-product-right-content hidden">
            <Link
              href="/products"
              className="ml-auto block underline whitespace-nowrap rounded-full bg-transparent text-primary-70 font-semibold transition ease cursor-pointer py-2 px-6"
            >
              View all
            </Link>
          </div>
        </div>
      </div>

      <div className="custom-container">
        <div className="featured-product-list-area product-slides-area pr-[16px] pl-[10px] max-sm:pr-8 max-sm:pl-0 overflow-hidden">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            navigation
            modules={[Navigation, Autoplay]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
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
                  <SwiperSlide key={product._id || index}>
                    <ProductCard {...product} />
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
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
