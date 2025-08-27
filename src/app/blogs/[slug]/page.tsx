'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import type { JSX } from 'react';
import { useGetBlogsQuery } from '@/store/api/blogApi';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import NewArticles from '@/components/homepage/NewArticles';
import Loading from '@/app/loading';

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:8001';

type ContentBlock =
  | {
      type: 'heading';
      level: string;
      text: string;
    }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; style: 'ul' | 'ol'; items: string[] };

interface Blog {
  title: string;
  slug: string;
  coverImage?: string;
  metaDescription: string;
  contentBlocks: ContentBlock[][]; // nested array support
  createdAt: string;
}

const BlogDetailPage = () => {
  const { slug } = useParams() as { slug: string };
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);
 const { data: blogsData } = useGetBlogsQuery({ page: 1, limit: 6 });
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/blogs/slug/${slug}`);
        setBlog(res.data);
        setError(null);
      } catch  {
        console.error('Fehler beim Abrufen des Blogs:');
        setError('Fehler beim Laden des Blogs.');
        setBlog(null);
      }
    };

    fetchBlog();
  }, [slug]);

  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!blog) return <div className="p-6 text-center"><Loading /></div>;

  return (
    <>
      <section className="blog-details-page">
        <div className="blog-details-banner hidden  bg-mono-0 py-8 max-sm:py-5">
          <div className="custom-container">
            <div className="product-banner-wrapper flex flex-col items-center justify-center">
              <ul className="breadcrumb-area flex items-center gap-[10px]">
                <li className="breadcrumb-item body-caption prev-pages flex items-center gap-[10px]">
                  <Link
                    className="body-caption text-mono-100"
                    href="/"
                    passHref
                  >
                    Heim
                  </Link>
                  <span className="angle">&gt;</span>
                </li>
                <li className="breadcrumb-item body-caption capitalize text-mono-70">
                  Blogs
                </li>
              </ul>
              <h4 className="h6 current-category-title capitalize mt-[15px] max-md:mt-2">
                Blog Details
              </h4>
            </div>
          </div>
        </div>
        <div className="custom-container">
          <div className="blog-details-wrapper bg-bg-opacity pt-12">
            <div className="blog-dtails-right-cont">
              <div className="md:max-w-4xl w-full mx-auto">
                <h1 className="text-[24px] md:text-[28px] lg:text-[36px] font-medium font-primary text-[#404042] mb-2">
                  {blog.title}
                </h1>
                <p className="text-gray-600 mb-4">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                {blog.coverImage && (
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full rounded mb-6"
                    width={848}
                    priority
                    fetchPriority="high"
                    height={558}
                  />
                )}
                <div className="blog-details-tabs-link"></div>
                {blog.contentBlocks?.map((group, gIdx) => (
                  <div key={gIdx} className="mb-6 blog-details-content-block">
                    {group.map((block, idx) => {
                      if (block.type === 'heading') {
                        const Tag = block.level as keyof JSX.IntrinsicElements;
                        return (
                          <Tag
                            key={idx}
                            className="text-xl font-semibold mt-6 mb-2"
                          >
                            {block.text}
                          </Tag>
                        );
                      } else if (block.type === 'paragraph') {
                        return (
                          <p key={idx} className="mb-4">
                            {block.text}
                          </p>
                        );
                      } else if (block.type === 'list') {
                        const ListTag = block.style === 'ol' ? 'ol' : 'ul';
                        return (
                          <ListTag key={idx} className="mb-4 list-disc pl-6">
                            {block.items.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ListTag>
                        );
                      }
                      return null;
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <NewArticles blogs={blogsData?.blogs || []} />
    </>
  );
};

export default BlogDetailPage;
