// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import ProductCard from "@/components/elements/cards/ProductCard";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import ProductSkeletonCard from '@/components/elements/cards/productskeletonCard';

// interface Product {
//   brandLogo: string;
//   aw_image_url: string;
//   merchant_product_third_category: string;
//   brand_name: string;
//   search_price: string;
//   product_name: string;
//   dimensions: string;
//   custom_3: string;
//   custom_2: string;
//   custom_1: string;
//   showCompareButton?: boolean;
// }

// const FeaturedProducts: React.FC = () => {
//   const [productData, setProductData] = useState<Product[]>([]);
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
//   useEffect(() => {
//     const fetchFeaturedProducts = async () => {
//       try {
//         const res = await axios.get(`${apiUrl}/api/products/sessions-products`);
//         console.log('Received featured data:', res.data);
//         const featuredProducts = res.data.products;
//         setProductData(featuredProducts); // Set the featured products in state
//       } catch (err) {
//         console.error('Error fetching featured products:', err);
//       }
//     };
//     fetchFeaturedProducts();
//   }, []);
 

//   return (
//     <section className="featured-product pt-10  pb-10  bg-bg-opacity">
//       <div className="custom-container">
//         <div className="featured-product-content flex justify-between items-end mb-9">
//           <div className="featured-product-left-content w-full">
//             <h2 className="h3 text-primary-70 font-secondary">
//               Our recommendation: The best winter tires 2025
//             </h2>
//             <p className="text-mono-100 font-medium text-[14px] font-primary">
//               Quickly get tyres suited to your vehicle and driving style.
//             </p>
//           </div>
//           <div className="featured-product-right-content">
//             <a
//               href={{
//                 pathname: '/products',
//                 query: {
//                   category:
//                     productData[0]?.merchant_product_third_category ||
//                     'Winterreifen',
//                 },
//               }}
//               passHref
//               className="ml-auto block underline whitespace-nowrap rounded-full bg-transparent text-primary-70 font-semibold transition ease cursor-pointer py-2 px-6"
//             >
//               View all
//             </a>
//           </div>
//         </div>
//       </div>

//       <div className="custom-container">
//         <div className="featured-product-list-area product-slides-area pr-[16px] pl-[10px] max-sm:pr-8 max-sm:pl-0 overflow-hidden">
//           <Swiper
//             spaceBetween={20}
//             slidesPerView={2}
//             navigation
//             modules={[Navigation, Autoplay]}
//             autoplay={{ delay: 3900, disableOnInteraction: false }}
//             breakpoints={{
//               640: { slidesPerView: 2, spaceBetween: 10 },
//               768: { slidesPerView: 3, spaceBetween: 15 },
//               1024: { slidesPerView: 4, spaceBetween: 19 },
//             }}
//           >
//             {productData.length === 0
//               ? Array.from({ length: 5 }).map((_, index) => (
//                   <SwiperSlide key={`skeleton-${index}`}>
//                     <ProductSkeletonCard />
//                   </SwiperSlide>
//                 ))
//               : productData.map((product, index) => (
//                   <SwiperSlide key={index}>
//                     <ProductCard {...product} />
//                   </SwiperSlide>
//                 ))}
//           </Swiper>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedProducts;
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
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

const FeaturedProducts: React.FC = () => {
  const [productData, setProductData] = useState<Product[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/products/sessions-products`);
        const featuredProducts = res.data.products || [];
        setProductData(featuredProducts);
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
    <section className="featured-product pt-10 pb-10 bg-bg-opacity">
      <div className="custom-container">
        <div className="featured-product-content flex justify-between items-end mb-9">
          <div className="featured-product-left-content w-full">
            <h2 className="h3 text-primary-70 font-secondary">
              Our recommendation: The best winter tires 2025
            </h2>
            <p className="text-mono-100 font-medium text-[14px] font-primary">
              Quickly get tyres suited to your vehicle and driving style.
            </p>
          </div>
          <div className="featured-product-right-content max-md:hidden">
            <Link
              href={{
                pathname: '/products',
                query: { category: selectedCategory },
              }}
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
            autoplay={{ delay: 3900, disableOnInteraction: false }}
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
        <div className="featured-product-right-content max-md:flex justify-center mt-6 hidden">
          <Link
            href={{
              pathname: '/products',
              query: { category: selectedCategory },
            }}
            className="mx-auto block underline whitespace-nowrap rounded-full bg-transparent text-primary-70 font-semibold transition ease cursor-pointer py-2 px-6"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
