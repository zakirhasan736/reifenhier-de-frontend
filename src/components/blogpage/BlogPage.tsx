'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { blogCoverSrc, BLOGS_PER_PAGE } from '@/libs/blogs/mongo';
import { ArticleCard, FeaturedArticleCard } from '@/components/blogpage/ArticleCard';

export interface BlogCard {
  id: string;
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  excerpt?: string;
  tags?: string[];
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

/** Page numbers with gaps: 1 … 4 5 6 … 12 */
function pageList(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, current - 1, current, current + 1]);
  const pages = [...set].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - (pages[i - 1] as number) > 1) out.push('…');
    out.push(p);
  });
  return out;
}

export default function BlogPage({
  blogs: initialBlogs,
  total: initialTotal,
  currentPage,
  parentSlug,
  subSlug,
}: BlogPageProps) {
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
              metaDescription?: string;
              tags?: string[];
            }) => ({
              id: blog._id,
              slug: blog.slug,
              title: blog.title,
              date: blog.createdAt,
              coverImage: blogCoverSrc(blog.coverImage),
              excerpt: blog.metaDescription || '',
              tags: blog.tags || [],
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

  const pageHref = (page: number) => {
    const query = new URLSearchParams();
    if (parentSlug) query.set('kategorie', parentSlug);
    if (subSlug) query.set('subkategorie', subSlug);
    if (page > 1) query.set('page', page.toString());
    const qs = query.toString();
    return qs ? `/artikel?${qs}` : '/artikel';
  };

  const dynamicTitle = (() => {
    if (parentSlug && subSlug) return `${parentSlug} – ${subSlug}`;
    if (parentSlug) return parentSlug;
    return 'News & Testberichte';
  })();

  const searching = search.trim() !== '';
  const showFeatured =
    !searching && currentPage === 1 && !parentSlug && !subSlug && blogs.length > 1;
  const [featured, ...rest] = blogs;
  const gridBlogs = showFeatured ? rest : blogs;

  return (
    <section className="blogs-page blogs-page-v2 bg-[#F6F8FC] pb-16">
      {/* ---------- Header band ---------- */}
      <div className="border-b border-[#E9ECF3] bg-white">
        <div className="custom-container py-8 md:py-12">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-[13px] text-[#6B6E76]">
            <Link href="/" className="hover:text-primary-100">Startseite</Link>
            <ChevronRight size={14} className="text-[#C0C4CC]" />
            <Link href="/artikel" className="hover:text-primary-100">News &amp; Testberichte</Link>
            {parentSlug && (
              <>
                <ChevronRight size={14} className="text-[#C0C4CC]" />
                <span className="capitalize text-[#16171A]">{parentSlug}</span>
              </>
            )}
            {subSlug && (
              <>
                <ChevronRight size={14} className="text-[#C0C4CC]" />
                <span className="capitalize text-[#16171A]">{subSlug}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[640px]">
              <span className="mb-3 inline-block rounded-full bg-[#EEF2FF] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-primary-100">
                Ratgeber
              </span>
              <h1 className="mb-2 text-[30px] md:text-[40px] font-semibold capitalize leading-[115%] tracking-[-0.01em] text-[#16171A]">
                {dynamicTitle}
              </h1>
              <p className="md:!text-[17px] !text-[15px] text-[#6B6E76]">
                Tests, Kaufberatung und Tipps rund um Sommer-, Winter- und
                Ganzjahresreifen.
                {initialTotal > 0 ? ` ${initialTotal} Artikel.` : ''}
              </p>
            </div>

            <div className="relative w-full lg:max-w-[380px]">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA0A8]" />
              <input
                type="search"
                aria-label="Artikel suchen"
                placeholder="Artikel suchen …"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-12 w-full rounded-[12px] border border-[#E4E7EE] bg-[#F7F8FB] pl-11 pr-10 text-[15px] text-[#16171A] outline-none transition focus:border-primary-100 focus:bg-white focus:ring-2 focus:ring-[#3a63f623]"
              />
              {searching && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Suche löschen"
                  className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full text-[#6B6E76] hover:bg-[#EEF0F4] cursor-pointer"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="custom-container pt-8 md:pt-10">
        {searching && !loading && (
          <p className="mb-5 text-[14px] text-[#6B6E76]">
            {total} {total === 1 ? 'Ergebnis' : 'Ergebnisse'} für „{search.trim()}“
          </p>
        )}

        {showFeatured && featured && !loading && (
          <div className="mb-6 md:mb-8">
            <FeaturedArticleCard blog={featured} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="animate-pulse overflow-hidden rounded-[16px] border border-[#E9ECF3] bg-white">
                <div className="aspect-[16/9] w-full bg-[#EEF0F4]" />
                <div className="p-4">
                  <div className="mb-2 h-3 w-1/3 rounded bg-[#EEF0F4]" />
                  <div className="mb-2 h-4 w-5/6 rounded bg-[#EEF0F4]" />
                  <div className="h-4 w-2/3 rounded bg-[#EEF0F4]" />
                </div>
              </div>
            ))
          ) : gridBlogs.length === 0 && !(showFeatured && featured) ? (
            <div className="col-span-full rounded-[16px] border border-dashed border-[#D0D5DD] bg-white px-6 py-14 text-center">
              <p className="text-[16px] font-semibold text-[#16171A]">Keine Artikel gefunden</p>
              <p className="mt-1 !text-[14px] text-[#6B6E76]">Versuchen Sie einen anderen Suchbegriff.</p>
            </div>
          ) : (
            gridBlogs.map(blog => <ArticleCard key={blog.id} blog={blog} headingLevel="h2" />)
          )}
        </div>

        {!searching && totalPages > 1 && (
          <nav aria-label="Seiten" className="mt-10 flex items-center justify-center gap-1.5">
            {currentPage > 1 ? (
              <Link
                href={pageHref(currentPage - 1)}
                aria-label="Vorherige Seite"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E4E7EE] bg-white text-[#404042] hover:border-primary-100 hover:text-primary-100"
              >
                <ChevronLeft size={18} />
              </Link>
            ) : (
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#EEF0F4] text-[#C0C4CC]">
                <ChevronLeft size={18} />
              </span>
            )}
            {pageList(currentPage, totalPages).map((p, i) =>
              p === '…' ? (
                <span key={`gap-${i}`} className="px-1 text-[#9AA0A8]">…</span>
              ) : (
                <Link
                  key={p}
                  href={pageHref(p)}
                  aria-current={p === currentPage ? 'page' : undefined}
                  className={`inline-flex h-10 min-w-10 items-center justify-center rounded-[10px] px-3 text-[14px] font-semibold ${
                    p === currentPage
                      ? 'bg-primary-100 text-white'
                      : 'border border-[#E4E7EE] bg-white text-[#404042] hover:border-primary-100 hover:text-primary-100'
                  }`}
                >
                  {p}
                </Link>
              )
            )}
            {currentPage < totalPages ? (
              <Link
                href={pageHref(currentPage + 1)}
                aria-label="Nächste Seite"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E4E7EE] bg-white text-[#404042] hover:border-primary-100 hover:text-primary-100"
              >
                <ChevronRight size={18} />
              </Link>
            ) : (
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#EEF0F4] text-[#C0C4CC]">
                <ChevronRight size={18} />
              </span>
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
