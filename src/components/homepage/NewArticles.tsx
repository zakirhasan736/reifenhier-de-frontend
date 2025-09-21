'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductSkeletonCard from '@/components/elements/cards/productskeletonCard';


interface Blog {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  metaDescription: string;
  createdAt: string;
}

interface BlogProps {
  blogs: Blog[];
}
const NewArticles: React.FC<BlogProps> = ({ blogs}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="custom-container max-sm:pr-0">
        <div className="news-content">
          <div className="section-header text-left md:mb-8 mb-6">
            <h2 className="h3 font-primary font-medium text-center text-[#16171A] mb-3">
              News & Articles
            </h2>
            <p className="font-normal font-secondary text-center text-[#89898B]">
              Stay updated with the latest insights and tips about tires.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <ProductSkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const hasBlogs = Array.isArray(blogs) && blogs.length > 0;

  return (
    <section className="news-section lg:pb-[70] pb-14 bg-mono-0">
      <div className="custom-container max-sm:pr-0">
        <div className="news-content">
          <div className="section-header text-left md:mb-8 mb-6">
            <h2 className="h3 font-primary font-medium text-center text-[#16171A] mb-3">
              News & Artikel
            </h2>
            <p className="font-normal font-secondary text-[16px] text-center text-[#404042]">
              Bleiben Sie auf dem Laufenden mit den neuesten Erkenntnissen und
              Tipps zu Reifen.
            </p>
          </div>

          <div className="news-list blogs-slides-area md:pr-[16px] md:pl-[10px] pr-10 pl-0 overflow-hidden">
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              navigation
              modules={[Navigation, Autoplay, Pagination]}
              autoplay={{ delay: 3900, disableOnInteraction: false }}
              pagination={{
                el: '.blogs-swiper-pagination',
                clickable: true,
                renderBullet: (index, className) => {
                  return `<span class="${className}"></span>`;
                },
              }}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 10 },
                768: { slidesPerView: 3, spaceBetween: 15 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
            >
              {hasBlogs
                ? blogs.map((blog, index) => (
                    <SwiperSlide key={index}>
                      <Link href={`/blogs/${blog.slug}`}>
                        <div className="news-item bg-mono-0 relative rounded-[4px] cursor-pointer">
                          <Image
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-[200px] object-cover rounded-[10px]"
                            width={1024}
                            height={200}
                            loading="lazy"
                          />
                          <div className="news-item-content relative pt-5">
                            <h3 className="text-[#404042] font-medium h6 font-primary">
                              {blog.title}
                            </h3>
                            <p className="text-[#16171A] text-[12px] font-medium font-primary mt-2">
                              {new Date(blog.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }
                              )}
                            </p>
                            <span className="text-primary-100 underline hover:text-primary-90 transition text-[14px] font-medium font-secondary mt-3 block">
                              Mehr lesen
                            </span>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))
                : Array.from({ length: 3 }).map((_, index) => (
                    <SwiperSlide key={`skeleton-${index}`}>
                      <ProductSkeletonCard />
                    </SwiperSlide>
                  ))}
            </Swiper>
          </div>

          <div className="blogs-swiper-pagination flex justify-center mt-6"></div>

          <Link
            href="/blogs"
            className="mx-auto block text-center underline whitespace-nowrap rounded-full bg-transparent text-primary-70 font-semibold transition ease cursor-pointer py-2 px-6"
          >
            Alle anzeigen
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArticles;
