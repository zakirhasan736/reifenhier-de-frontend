'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductSkeletonCard from '@/components/elements/cards/productskeletonCard';

interface WPBlog {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  date: string;
}

interface BlogProps {
  blogs: WPBlog[];
}

const NewArticles: React.FC<BlogProps> = ({ blogs }) => {
  const hasBlogs = Array.isArray(blogs) && blogs.length > 0;

  return (
    <section className="news-section lg:pb-[70px] pb-14 bg-mono-0">
      <div className="custom-container max-sm:pr-0">
        <div className="news-content">
          {/* Header */}
          <div className="section-header text-left md:mb-8 mb-6">
            <h2 className="h3 font-primary font-medium text-center text-[#16171A] mb-3">
              News & Artikel
            </h2>
            <p className="font-normal font-secondary text-[16px] text-center text-[#404042]">
              Bleiben Sie auf dem Laufenden mit den neuesten Erkenntnissen und
              Tipps zu Reifen.
            </p>
          </div>

          {/* Slider */}
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
                renderBullet: (index, className) =>
                  `<span class="${className}"></span>`,
              }}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 10 },
                768: { slidesPerView: 3, spaceBetween: 15 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
            >
              {hasBlogs
                ? blogs.map(blog => (
                    <SwiperSlide key={blog.id}>
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="max-w-[384px] w-full"
                      >
                        <div className="news-item bg-mono-0 relative rounded-[4px] cursor-pointer">
                          {/* Blog image */}
                          <Image
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-[200px] object-cover rounded-[10px]"
                            width={1024}
                            height={200}
                            loading="lazy"
                          />

                          {/* Content */}
                          <div className="news-item-content relative pt-5">
                            <h3
                              className="text-[#404042] font-medium h6 font-primary line-clamp-2"
                              dangerouslySetInnerHTML={{ __html: blog.title }}
                            />

                            <p className="text-[#404042] text-[12px] font-medium font-primary mt-2">
                              {new Date(blog.date).toLocaleDateString('de-DE', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
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

          {/* Pagination dots */}
          <div className="blogs-swiper-pagination flex justify-center mt-6"></div>

          {/* View all link */}
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
