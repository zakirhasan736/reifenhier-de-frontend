'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { blogCoverSrc, BLOGS_PER_PAGE } from '@/libs/blogs/mongo';
import BlogCoverImage from '@/components/blogpage/BlogCoverImage';

export interface BlogCard {
  id: string;
  slug: string;
  title: string;
  date: string;
  coverImage: string;
}

interface BlogPageProps {
  blogs: BlogCard[];
  total: number;
  currentPage: number;
  parentSlug: string | null;
  subSlug: string | null;
}

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:8001';

export default function BlogPage({
  blogs: initialBlogs,
  total: initialTotal,
  currentPage,
  parentSlug,
  subSlug,
}: BlogPageProps) {
  const router = useRouter();

  const limit = BLOGS_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(initialTotal / limit));

  const [search, setSearch] = useState('');
  const [blogs, setBlogs] = useState(initialBlogs);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBlogs(initialBlogs);
    setTotal(initialTotal);
  }, [initialBlogs, initialTotal]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!search.trim()) {
        setBlogs(initialBlogs);
        setTotal(initialTotal);
        return;
      }

      setLoading(true);

      try {
        const res = await axios.get(`${apiUrl}/api/blogs/list`, {
          params: { search: search.trim(), page: 1, limit: 20 },
        });
        const found = Array.isArray(res.data?.blogs) ? res.data.blogs : [];
        setBlogs(
          found.map(
            (blog: {
              _id: string;
              slug: string;
              title: string;
              createdAt: string;
              coverImage?: string;
            }) => ({
              id: blog._id,
              slug: blog.slug,
              title: blog.title,
              date: blog.createdAt,
              coverImage: blogCoverSrc(blog.coverImage),
            })
          )
        );
        setTotal(Number(res.data?.total) || found.length);
      } catch (err) {
        console.error('Search Error:', err);
      }

      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, initialBlogs, initialTotal]);

  const handlePageChange = (page: number) => {
    const query = new URLSearchParams();

    if (parentSlug) query.set('kategorie', parentSlug);
    if (subSlug) query.set('subkategorie', subSlug);

    query.set('page', page.toString());

    router.push(`/artikel?${query.toString()}`);
  };

  const dynamicTitle = (() => {
    if (parentSlug && subSlug) return `${parentSlug} – ${subSlug}`;
    if (parentSlug) return parentSlug;
    return 'News & Testberichte';
  })();

  return (
    <section className="blogs-page">
      <div className="blog-page-wrapper bg-mono-0 py-9">
        <div className="custom-container mx-auto p-6">
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap gap-2 text-sm text-gray-500"
          >
            <Link href="/" className="hover:text-primary-100">
              Startseite
            </Link>
            <span>/</span>

            <Link href="/artikel" className="hover:text-primary-100">
              News & Testberichte
            </Link>

            {parentSlug && (
              <>
                <span>/</span>
                <span className="capitalize text-gray-700">{parentSlug}</span>
              </>
            )}

            {subSlug && (
              <>
                <span>/</span>
                <span className="capitalize text-gray-700">{subSlug}</span>
              </>
            )}
          </nav>

          <h1 className="mb-5 text-2xl font-bold capitalize text-secondary-100">
            {dynamicTitle}
          </h1>

          <div className="blog-search-box relative mb-9 max-w-[380px] w-full overflow-hidden rounded-full border border-secondary-100/40">
            <input
              type="text"
              placeholder="Artikel suchen ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-[380px] rounded-full bg-mono-0 py-[9px] pl-11 text-secondary-100 focus:outline-none lg:py-[11.5px]"
            />

            <Image
              src="/images/icons/search-norma2.svg"
              alt="Search"
              width={16}
              height={16}
              className="absolute top-[13px] left-4 lg:top-[16px]"
            />
          </div>

          <div
            className={`grid gap-6 ${
              blogs.length === 1
                ? 'grid-cols-1 justify-center'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 min-[1100px]:grid-cols-4'
            }`}
          >
            {loading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="news-item animate-pulse">
                  <div className="h-[200px] w-full rounded-lg bg-gray-300" />
                  <div className="pt-5">
                    <div className="mb-2 h-5 w-3/4 rounded bg-gray-300" />
                    <div className="mb-4 h-4 w-1/2 rounded bg-gray-300" />
                    <div className="h-4 w-1/4 rounded bg-gray-300" />
                  </div>
                </div>
              ))
            ) : blogs.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                Keine Blogartikel gefunden.
              </p>
            ) : (
              blogs.map(blog => {
                return (
                  <Link
                    key={blog.id}
                    href={`/artikel/${blog.slug}`}
                    className="group w-full"
                  >
                    <div className="news-item h-full overflow-hidden rounded-2xl border border-[#F0F0F2] bg-mono-0 transition hover:border-primary-100/30 hover:shadow-[0_8px_24px_rgba(13,1,19,0.08)]">
                      <BlogCoverImage
                        src={blog.coverImage}
                        alt={blog.title}
                        width={1024}
                        height={200}
                        className="h-[200px] w-full object-cover"
                      />

                      <div className="p-4 pt-5">
                        <h2
                          className="h6 font-medium text-[#404042] group-hover:text-primary-100"
                          dangerouslySetInnerHTML={{
                            __html: blog.title,
                          }}
                        />

                        <p className="mt-2 text-[12px] text-[#89898B]">
                          {blog.date
                            ? new Date(blog.date).toLocaleDateString('de-DE', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : ''}
                        </p>

                        <span className="mt-3 block text-primary-100 underline">
                          Mehr lesen
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {search.trim() === '' && total > limit && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="rounded border px-4 py-2 disabled:opacity-50"
              >
                <Image
                  src="/images/icons/left-arrow-svgrepo-com.svg"
                  alt="Previous"
                  width={16}
                  height={16}
                />
              </button>

              <span className="self-center text-sm text-gray-500">
                Seite {currentPage} von {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="rounded border px-4 py-2 disabled:opacity-50"
              >
                <Image
                  src="/images/icons/right-arrow-svgrepo-com.svg"
                  alt="Next"
                  width={16}
                  height={16}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
