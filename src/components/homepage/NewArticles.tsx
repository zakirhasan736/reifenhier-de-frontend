import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays } from 'lucide-react';
import BlogCoverImage from '@/components/blogpage/BlogCoverImage';
import { ArticleCard } from '@/components/blogpage/ArticleCard';
import { formatBlogDate, stripHtml } from '@/libs/blogs/format';

interface WPBlog {
  id: number | string;
  title: string;
  slug: string;
  coverImage: string;
  date: string;
  excerpt?: string;
  tags?: string[];
}

interface BlogProps {
  blogs: WPBlog[];
}

const firstTag = (b: WPBlog) => (b.tags || []).find(Boolean);

/** Big cover story with the title on the image. */
function FeaturedCard({ blog }: { blog: WPBlog }) {
  const excerpt = stripHtml(blog.excerpt);
  const tag = firstTag(blog);
  return (
    <Link
      href={`/artikel/${blog.slug}`}
      className="group relative flex h-full min-h-[380px] w-full flex-col justify-end overflow-hidden rounded-[26px] bg-[#0B1437] md:min-h-[520px]"
    >
      <BlogCoverImage
        src={blog.coverImage}
        alt={stripHtml(blog.title)}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        width={1200}
        height={900}
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1437] via-[#0B1437]/55 to-[#0B1437]/0" />
      <div className="absolute left-5 top-5 flex flex-wrap gap-2 md:left-7 md:top-7">
        <span className="sl-white rounded-full bg-gradient-to-r from-[#2F4FD8] to-[#5B7BFF] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] shadow-md">
          Neu
        </span>
        {tag && (
          <span className="sl-white rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] ring-1 ring-white/25 backdrop-blur">
            {tag}
          </span>
        )}
      </div>
      <div className="relative p-5 md:p-8">
        {blog.date && (
          <span className="sl-white mb-3 inline-flex items-center gap-1.5 text-[13px] opacity-80">
            <CalendarDays size={14} /> {formatBlogDate(blog.date)}
          </span>
        )}
        <h3
          className="sl-white line-clamp-3 font-primary text-[24px] font-bold leading-[120%] tracking-[-0.01em] md:text-[32px]"
          dangerouslySetInnerHTML={{ __html: blog.title }}
        />
        {excerpt && (
          <p className="sl-white mt-3 line-clamp-2 max-w-[560px] font-secondary !text-[14px] !leading-[160%] !tracking-normal opacity-80 md:!text-[16px]">
            {excerpt}
          </p>
        )}
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white py-2 pl-5 pr-2 text-[14px] font-semibold shadow-lg">
          <span className="!text-[#1B2A6B]">Artikel lesen</span>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1B2A6B] to-[#2F4FD8] transition-transform group-hover:translate-x-0.5">
            <ArrowRight size={15} strokeWidth={2.4} color="#fff" />
          </span>
        </span>
      </div>
    </Link>
  );
}

/** Compact row: thumbnail left, text right. */
function RowCard({ blog, n }: { blog: WPBlog; n: number }) {
  const tag = firstTag(blog);
  return (
    <Link
      href={`/artikel/${blog.slug}`}
      className="group flex items-center gap-4 rounded-[18px] p-2.5 transition-colors hover:bg-[#F6F8FC]"
    >
      <span className="relative shrink-0 overflow-hidden rounded-[14px]">
        <BlogCoverImage
          src={blog.coverImage}
          alt={stripHtml(blog.title)}
          className="h-[76px] w-[96px] object-cover sm:h-[88px] sm:w-[112px] transition-transform duration-500 group-hover:scale-[1.08] md:h-[96px] md:w-[128px]"
          width={256}
          height={192}
        />
        <span className="sl-white absolute left-1.5 top-1.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#0B1437]/75 px-1.5 text-[11px] font-bold backdrop-blur">
          {String(n).padStart(2, '0')}
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px]">
          {tag && <span className="font-bold uppercase tracking-[0.08em] !text-[#2F4FD8]">{tag}</span>}
          {tag && blog.date && <span className="hidden h-1 w-1 rounded-full bg-[#C9D2E8] sm:block" />}
          {blog.date && <span className="whitespace-nowrap !text-[#8A90A0]">{formatBlogDate(blog.date)}</span>}
        </span>
        <span
          className="mt-1 line-clamp-2 block font-primary text-[15px] font-bold leading-[135%] !text-[#16171A] transition-colors group-hover:!text-[#2F4FD8] md:text-[16px]"
          dangerouslySetInnerHTML={{ __html: blog.title }}
        />
      </span>
      <ArrowUpRight size={18} color="#9AA3B8" className="hidden shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block" />
    </Link>
  );
}

const NewArticles: React.FC<BlogProps> = ({ blogs }) => {
  const items = Array.isArray(blogs) ? blogs.slice(0, 8) : [];
  if (items.length === 0) return null;

  const [featured, ...rest] = items;
  const side = rest.slice(0, 3);
  const more = rest.slice(3, 7);

  return (
    <section className="news-section blogs-v3 relative overflow-hidden bg-[#F6F8FC] py-14 lg:py-[88px]">
      <span className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-[#DCE5FF] opacity-60 blur-[110px]" aria-hidden />
      <div className="custom-container relative">
        <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[640px]">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em] !text-[#2F4FD8] shadow-sm ring-1 ring-[#E4E7F0]">
              <BookOpen size={13} color="#2F4FD8" /> Ratgeber
            </span>
            <h2 className="font-primary text-[28px] font-bold leading-[115%] tracking-[-0.015em] !text-[#16171A] md:text-[36px] lg:text-[44px]">
              News &amp; Testberichte
            </h2>
            <p className="mt-3 font-secondary !text-[15px] !leading-[160%] !tracking-normal !text-[#5A6072] md:!text-[17px]">
              Bleiben Sie auf dem Laufenden mit den neuesten Erkenntnissen und Tipps zu Reifen.
            </p>
          </div>
          <Link
            href="/artikel"
            className="group inline-flex items-center gap-2 self-start rounded-full bg-white py-2 pl-5 pr-2 text-[14px] font-semibold shadow-sm ring-1 ring-[#E4E7F0] transition hover:ring-[#C9D6FC] md:self-auto"
          >
            <span className="!text-[#16171A]">Alle Artikel</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1B2A6B] to-[#2F4FD8] transition-transform group-hover:translate-x-0.5">
              <ArrowRight size={15} strokeWidth={2.4} color="#fff" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <FeaturedCard blog={featured} />
          </div>
          {side.length > 0 && (
            <div className="flex flex-col rounded-[26px] bg-white p-3 ring-1 ring-[#E4E7F0] md:p-4 lg:col-span-5">
              <p className="flex items-center justify-between px-2.5 pb-2 pt-1.5">
                <span className="text-[12px] font-bold uppercase tracking-[0.12em] !text-[#6B7280]">Weitere neue Artikel</span>
                <span className="h-px flex-1 ml-3 bg-[#EEF0F6]" />
              </p>
              <div className="flex flex-1 flex-col justify-between divide-y divide-[#EEF0F6]">
                {side.map((blog, i) => (
                  <div key={blog.id} className="py-1.5">
                    <RowCard blog={blog} n={i + 2} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {more.length > 0 && (
          <div className="mt-5 max-sm:-mx-4 max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:gap-4 max-sm:overflow-x-auto max-sm:px-4 max-sm:pb-2 max-sm:[scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {more.map(blog => (
              <div key={blog.id} className="max-sm:w-[80%] max-sm:shrink-0 max-sm:snap-start">
                <ArticleCard blog={blog} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArticles;
