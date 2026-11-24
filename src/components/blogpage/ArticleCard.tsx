import Link from 'next/link'
import { ArrowRight, ArrowUpRight, CalendarDays } from 'lucide-react'
import BlogCoverImage from '@/components/blogpage/BlogCoverImage'
import { formatBlogDate, stripHtml } from '@/libs/blogs/format'

export type ArticleCardData = {
  id: string | number
  slug: string
  title: string
  date?: string
  coverImage?: string
  excerpt?: string
  tags?: string[]
}

/** Shared article card for the blog list, related articles and the homepage. */
export function ArticleCard({
  blog,
  headingLevel = 'h3',
}: {
  blog: ArticleCardData
  headingLevel?: 'h2' | 'h3'
}) {
  const H = headingLevel
  const excerpt = stripHtml(blog.excerpt)
  const tag = (blog.tags || []).find(Boolean)
  return (
    <Link
      href={`/artikel/${blog.slug}`}
      className="article-card group flex h-full w-full flex-col rounded-[22px] bg-white p-2 ring-1 ring-[#E4E7F0] transition-all duration-300 hover:-translate-y-1 hover:ring-[#C9D6FC] hover:shadow-[0_24px_48px_-28px_rgba(27,42,107,0.45)]"
    >
      <div className="relative overflow-hidden rounded-[16px]">
        <BlogCoverImage
          src={blog.coverImage}
          alt={stripHtml(blog.title)}
          className="aspect-[16/10] h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          width={640}
          height={400}
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1437]/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {tag && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] !text-[#2F4FD8] shadow-sm backdrop-blur">
            {tag}
          </span>
        )}
        <span className="absolute bottom-3 right-3 inline-flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={17} strokeWidth={2.4} color="#1B2A6B" />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-3 pb-2 pt-4">
        <div className="mb-4">
        {blog.date && (
          <span className="mb-2 inline-flex items-center gap-1.5 text-[12px] font-medium !text-[#6B7280]">
            <CalendarDays size={13} color="#8A90A0" /> {formatBlogDate(blog.date)}
          </span>
        )}
        <H
          className="line-clamp-2 font-primary text-[16px] md:text-[17px] font-bold leading-[135%] !text-[#16171A] transition-colors group-hover:!text-[#2F4FD8]"
          dangerouslySetInnerHTML={{ __html: blog.title }}
        />
        {excerpt && (
          <p className="mt-2 line-clamp-2 !text-[13.5px] !leading-[160%] !tracking-normal !text-[#5A6072] font-secondary">
            {excerpt}
          </p>
        )}
        </div>
        <span className="mt-auto flex items-center justify-between border-t border-[#EEF0F6] pt-3">
          <span className="text-[13px] font-semibold !text-[#2F4FD8]">Weiterlesen</span>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] transition-colors group-hover:bg-[#2F4FD8]">
            <ArrowRight size={15} strokeWidth={2.4} className="!text-[#2F4FD8] transition-colors group-hover:!text-white" />
          </span>
        </span>
      </div>
    </Link>
  )
}

/** Wide card for the newest article on the list page. */
export function FeaturedArticleCard({ blog }: { blog: ArticleCardData }) {
  const excerpt = stripHtml(blog.excerpt)
  const tag = (blog.tags || []).find(Boolean)
  return (
    <Link
      href={`/artikel/${blog.slug}`}
      className="group grid overflow-hidden rounded-[20px] border border-[#E9ECF3] bg-white transition-all hover:border-[#C9D6FC] hover:shadow-[0_20px_40px_-24px_rgba(58,100,246,0.45)] md:grid-cols-2"
    >
      <div className="relative overflow-hidden">
        <BlogCoverImage
          src={blog.coverImage}
          alt={stripHtml(blog.title)}
          className="aspect-[16/10] md:aspect-auto md:h-full h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          width={960}
          height={600}
          priority
        />
      </div>
      <div className="flex flex-col justify-center gap-3 p-5 md:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary-100 px-2.5 py-1 text-[11px] font-semibold text-white">
            Neu
          </span>
          {tag && (
            <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[11px] font-semibold text-primary-100">
              {tag}
            </span>
          )}
          {blog.date && (
            <span className="inline-flex items-center gap-1.5 text-[12px] text-[#6B6E76]">
              <CalendarDays size={13} /> {formatBlogDate(blog.date)}
            </span>
          )}
        </div>
        <h2
          className="font-primary text-[22px] md:text-[28px] font-semibold leading-[122%] tracking-[-0.01em] text-[#16171A] transition-colors group-hover:text-primary-100"
          dangerouslySetInnerHTML={{ __html: blog.title }}
        />
        {excerpt && (
          <p className="line-clamp-3 md:!text-[16px] !text-[14px] text-[#6B6E76] font-secondary">
            {excerpt}
          </p>
        )}
        <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-[10px] bg-primary-100 px-4 py-2.5 text-[14px] font-semibold text-white">
          Artikel lesen <ArrowRight size={16} strokeWidth={2.4} />
        </span>
      </div>
    </Link>
  )
}
