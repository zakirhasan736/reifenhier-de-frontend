'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
interface WPBlog {
  id: number;
  title: { rendered: string } | string;
  slug: string;
  coverImage?: string;
  date: string;
  categories?: number[];
  _embedded?: {
    'wp:featuredmedia'?: { source_url?: string }[];
  };
}
const WP_API = 'https://wp.reifencheck.de/wp-json/wp/v2';

export default function BlogRelated({ blog }: { blog: WPBlog }) {
  const [related, setRelated] = useState<WPBlog[]>([]);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const categoryId = blog.categories?.[0];
        if (!categoryId) return;

        const res = await fetch(
          `${WP_API}/posts?categories=${categoryId}&exclude=${blog.id}&per_page=3&_embed`
        );
        const data = await res.json();
        setRelated(data);
      } catch (e) {
        console.log('Related fetch error:', e);
      }
    }

    fetchRelated();
  }, [blog]);

  if (!related.length) return null;

  return (
    <section className="bg-gray-50 py-12">
      <div className="custom-container">
        <h2 className="text-2xl font-semibold mb-8">Ähnliche Artikel</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((post: WPBlog) => {
            const media =
              post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
              '/images/blog-default.jpg';

            const titleHtml =
              typeof post.title === 'string'
                ? post.title
                : post.title?.rendered || '';

            return (
              <Link key={post.id} href={`/artikel/${post.slug}`}>
                <div className="news-item bg-mono-0 relative rounded-[4px] cursor-pointer">
                  <Image
                    src={media}
                    alt={
                      typeof post.title === 'string'
                        ? post.title
                        : post.title?.rendered || ''
                    }
                    className="w-full h-[200px] object-cover rounded-[10px]"
                    width={1024}
                    height={200}
                    loading="lazy"
                  />
                  <div className="news-item-content relative pt-5">
                    <h3
                      className="text-[#404042] font-medium h6 font-primary"
                      dangerouslySetInnerHTML={{
                        __html: titleHtml,
                      }}
                    />
                    <p className="text-[#404042] text-[12px] font-medium font-primary mt-2">
                      {new Date(post.date).toLocaleDateString('de-DE', {
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
