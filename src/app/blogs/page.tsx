'use client';

import {  useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:8001';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  metaDescription: string;
  createdAt: string;
}

const BlogListPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/api/blogs/list`, {
          params: { page, limit: 6, search },
        });
        setBlogs(res.data.blogs);
        setTotal(res.data.total);
      } catch  {
        // Optionally handle error here
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [page, search]);

  return (
    <section className="blogs-page">
      <div className="blog-page-wrapper bg-mono-0 py-9">
        <div className="custom-container ">
          <div className="mx-auto p-6 ">
            <div className="blog-search-box relative">
              <input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border max-w-[350px] rounded-full border-border-100 text-[14px] font-medium font-secondary text-[#86878A] pr-6 pl-9 py-3 w-full mb-6"
              />
              <Image
                src="/images/icons/search-normal.svg"
                alt="Search"
                width={16}
                height={16}
                loading="lazy"
                className="absolute top-4 left-3"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.length === 0 || !blogs || loading
                ? Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="news-item bg-mono-0 relative rounded-[4px] animate-pulse"
                    >
                      <div className="w-full h-[200px] bg-gray-200 rounded-[10px]" />
                      <div className="news-item-content relative pt-5">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                  ))
                : blogs.map(blog => (
                    <Link key={blog._id} href={`/blogs/${blog.slug}`}>
                      <div className="news-item bg-mono-0 relative rounded-[4px] cursor-pointer">
                        <Image
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-[200px] object-cover rounded-[10px]"
                          width={1024}
                          height={200}
                          sizes="(max-width: 768px) 100vw, 800px"
                          priority
                          fetchPriority="high"
                        />
                        <div className="news-item-content relative pt-5">
                          <h5 className="text-[#404042] font-medium h6 font-primary">
                            {blog.title}
                          </h5>
                          <p className="text-[#89898B] text-[12px] font-medium font-primary mt-2">
                            {new Date(blog.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )}
                          </p>
                          <Link
                            href={`/blogs/${blog.slug}`}
                            className="text-primary-100 underline hover:text-primary-90 transition text-[14px] font-medium font-secondary mt-3 block"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                <Image
                  src="/images/icons/left-arrow-svgrepo-com.svg"
                  alt="Previous"
                  width={16}
                  height={16}
                  loading="lazy"
                />
              </button>
              <button
                disabled={page * 6 >= total}
                onClick={() => setPage(prev => prev + 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                <Image
                  src="/images/icons/right-arrow-svgrepo-com.svg"
                  alt="Previous"
                  width={16}
                  height={16}
                  loading="lazy"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogListPage;
