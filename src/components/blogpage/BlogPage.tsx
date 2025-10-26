'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  metaDescription: string;
  createdAt: string;
}

interface BlogPageProps {
  blogs: Blog[];
  total: number;
  currentPage: number;
}

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:8001';

export default function BlogPage({
  blogs: initialBlogs,
  total: initialTotal,
  currentPage,
}: BlogPageProps) {
  const router = useRouter();
  const limit = 6;
  const totalPages = Math.ceil(initialTotal / limit);

  const [search, setSearch] = useState('');
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  // 🔹 Client-side search with debounce
  useEffect(() => {
    const timeout = setTimeout(async () => {
      // If search is empty → revert to SSR blogs
      if (search.trim() === '') {
        setBlogs(initialBlogs);
        setTotal(initialTotal);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`${apiUrl}/api/blogs/list`, {
          params: { search },
        });
        setBlogs(res.data.blogs);
        setTotal(res.data.blogs.length);
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    }, 400); // debounce delay

    return () => clearTimeout(timeout);
  }, [search, initialBlogs, initialTotal]);

  // 🔹 Pagination (SSR navigation)
  const handlePageChange = (newPage: number) => {
    router.push(`/blogs?page=${newPage}`);
  };

  return (
    <section className="blogs-page">
      <div className="blog-page-wrapper bg-mono-0 py-9">
        <div className="custom-container">
          <div className="mx-auto p-6">
            <h1 className="text-2xl font-bold mb-5 text-secondary-100">News & Artikels</h1>

            {/* 🔍 Search */}
            <div className="blog-search-box relative mb-9">
              <input
                type="text"
                placeholder="Blogs durchsuchen..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="max-w-[380px]  text-secondary-100 !rounded-full placeholder:text-secondary-100  focus-visible:!rounded-full focus:!rounded-full focus-within:!rounded-full !outline-none w-full !bg-mono-0 !shadow-none !border !border-secondary-100/40 text-[14px] font-normal bg-primary-color-70 pr-2 pl-11 py-[11.5px] text-primary-color-100 leading-[150%] font-secondary"
              />
              <Image
                src="/images/icons/search-norma2.svg"
                alt="Search"
                width={16}
                height={16}
                className="absolute top-[14px] left-4"
              />
            </div>

            {/* 📰 Blog Grid */}
            <div
              className={`grid ${
                blogs.length === 1
                  ? 'grid-cols-1 justify-center'
                  : 'grid-cols-1 md:grid-cols-3 gap-6'
              }`}
            >
              {loading ? (
                // Skeleton loading state
                Array.from({ length: 3 }).map((_, idx) => (
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
              ) : blogs.length === 0 ? (
                <p className="text-gray-500 text-center col-span-3">
                  Keine Blogartikel gefunden.
                </p>
              ) : (
                blogs.map(blog => (
                  <Link key={blog._id} href={`/blogs/${blog.slug}`}>
                    <div className="news-item max-w-[368px] bg-mono-0 relative rounded-[4px] cursor-pointer">
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-[200px] object-cover rounded-[10px]"
                        width={1024}
                        height={200}
                        sizes="(max-width: 768px) 100vw, 800px"
                        priority
                      />
                      <div className="news-item-content relative pt-5">
                        <h2 className="text-[#404042] font-medium h6 font-primary">
                          {blog.title}
                        </h2>
                        <p className="text-[#89898B] text-[12px] font-medium font-primary mt-2">
                          {new Date(blog.createdAt).toLocaleDateString(
                            'de-DE',
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
                ))
              )}
            </div>

            {/* ✅ Pagination (SSR only) */}
            {search.trim() === '' && total > limit && (
              <div className="mt-8 flex justify-center gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
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

                <span className="text-sm text-gray-500 self-center">
                  Seite {currentPage} von {totalPages}
                </span>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  <Image
                    src="/images/icons/right-arrow-svgrepo-com.svg"
                    alt="Next"
                    width={16}
                    height={16}
                    loading="lazy"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
