import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CalendarDays } from 'lucide-react';
import BlogCoverImage from '@/components/blogpage/BlogCoverImage';

interface WPBlog {
  id: number | string;
  title: string;
  slug: string;
  coverImage: string;
  date: string;
  excerpt?: string;
}

interface BlogProps {
  blogs: WPBlog[];
}

const stripHtml = (html?: string) =>
  String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&hellip;|&#8230;/g, '…')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

const formatDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

function FeaturedCard({ blog }: { blog: WPBlog }) {
  const excerpt = stripHtml(blog.excerpt);
  return (
    <Link
      href={`/artikel/${blog.slug}`}
      className="blog-card-featured group relative flex h-full min-h-[320px] md:min-h-[420px] w-full flex-col justify-end overflow-hidden rounded-[20px] bg-[#0F1E4D]"
    >
      <BlogCoverImage
        src={blog.coverImage}
        alt={stripHtml(blog.title)}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        width={1200}
        height={800}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1533]/95 via-[#0B1533]/45 to-transparent" />
      <div className="relative p-5 md:p-7">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-sm mb-3">
          <CalendarDays size={13} /> {formatDate(blog.date)}
        </span>
        <h3
          className="line-clamp-3 font-primary text-[20px] md:text-[26px] font-semibold leading-[125%] text-white mb-2"
          dangerouslySetInnerHTML={{ __html: blog.title }}
        />
        {excerpt && (
          <p className="line-clamp-2 !text-[14px] md:!text-[15px] !text-white/80 font-secondary mb-4 max-w-[560px]">
            {excerpt}
          </p>
        )}
        <span className="inline-flex items-center gap-2 rounded-[10px] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#0F1E4D] transition-colors group-hover:bg-[#EEF2FF]">
          Artikel lesen <ArrowRight size={16} strokeWidth={2.4} />
        </span>
      </div>
    </Link>
  );
}

function BlogCard({ blog }: { blog: WPBlog }) {
  const excerpt = stripHtml(blog.excerpt);
  return (
    <Link
      href={`/artikel/${blog.slug}`}
      className="blog-card-v2 group flex h-full w-full flex-col overflow-hidden rounded-[16px] border border-[#E9ECF3] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9D6FC] hover:shadow-[0_16px_32px_-18px_rgba(58,100,246,0.35)]"
    >
      <div className="relative overflow-hidden">
        <BlogCoverImage
          src={blog.coverImage}
          alt={stripHtml(blog.title)}
          className="aspect-[16/9] h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          width={640}
          height={360}
        />
        <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#16171A] opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
          <ArrowUpRight size={16} strokeWidth={2.4} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6B6E76] mb-1.5">
          <CalendarDays size={13} /> {formatDate(blog.date)}
        </span>
        <h3
          className="line-clamp-2 font-primary text-[15px] md:text-[16px] font-semibold leading-[135%] text-[#16171A] transition-colors group-hover:text-primary-100"
          dangerouslySetInnerHTML={{ __html: blog.title }}
        />
        {excerpt && (
          <p className="mt-1.5 line-clamp-2 !text-[13px] !leading-[150%] !tracking-normal text-[#6B6E76] font-secondary">
            {excerpt}
          </p>
        )}
        <span className="mt-auto pt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-primary-100">
          Mehr lesen <ArrowRight size={14} strokeWidth={2.4} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

const NewArticles: React.FC<BlogProps> = ({ blogs }) => {
  const items = Array.isArray(blogs) ? blogs.slice(0, 8) : [];
  if (items.length === 0) return null;

  const [featured, ...rest] = items;
  const side = rest.slice(0, 4);
  const more = rest.slice(4);

  return (
    <section className="news-section blogs-v2 bg-[#F6F8FC] py-14 lg:py-[80px]">
      <div className="custom-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
          <div className="max-w-[620px]">
            <span className="inline-block rounded-full bg-[#EEF2FF] text-primary-100 text-[12px] md:text-[13px] font-semibold tracking-[0.08em] uppercase px-3 py-1 mb-3">
              Ratgeber
            </span>
            <h2 className="h3 font-primary font-semibold text-[26px] md:text-[32px] lg:text-[40px] leading-[118%] tracking-[-0.01em] text-[#16171A] mb-2">
              News & Testberichte
            </h2>
            <p className="font-secondary md:!text-[17px] !text-[14px] text-[#6B6E76]">
              Bleiben Sie auf dem Laufenden mit den neuesten Erkenntnissen und
              Tipps zu Reifen.
            </p>
          </div>
          <Link
            href="/artikel"
            className="inline-flex self-start md:self-auto items-center gap-2 rounded-[10px] bg-primary-100 px-4 py-2.5 text-[14px] font-semibold text-white hover:opacity-90 transition"
          >
            Alle Artikel
            <ArrowRight size={16} strokeWidth={2.4} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          <div className="lg:col-span-6">
            <FeaturedCard blog={featured} />
          </div>
          {side.length > 0 && (
            <div className="lg:col-span-6 max-sm:flex max-sm:overflow-x-auto max-sm:snap-x max-sm:snap-mandatory max-sm:[scrollbar-width:none] sm:grid sm:grid-cols-2 gap-4 md:gap-5">
              {side.map(blog => (
                <div key={blog.id} className="max-sm:w-[78%] max-sm:shrink-0 max-sm:snap-start">
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>
          )}
        </div>

        {more.length > 0 && (
          <ul className="mt-4 md:mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {more.map(blog => (
              <li key={blog.id}>
                <Link
                  href={`/artikel/${blog.slug}`}
                  className="group flex items-center gap-3 rounded-[14px] border border-[#E9ECF3] bg-white p-2.5 transition-colors hover:border-[#C9D6FC]"
                >
                  <BlogCoverImage
                    src={blog.coverImage}
                    alt={stripHtml(blog.title)}
                    className="h-16 w-20 shrink-0 rounded-[10px] object-cover"
                    width={160}
                    height={128}
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className="line-clamp-2 text-[14px] font-semibold leading-snug text-[#16171A] group-hover:text-primary-100 transition-colors"
                      dangerouslySetInnerHTML={{ __html: blog.title }}
                    />
                    <span className="mt-0.5 block text-[12px] text-[#9AA0A8]">{formatDate(blog.date)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default NewArticles;
