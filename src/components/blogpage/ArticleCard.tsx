import Link from 'next/link'
import { ArrowRight, CalendarDays } from 'lucide-react'
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
      className="article-card group flex h-full w-full flex-col overflow-hidden rounded-[16px] border border-[#E9ECF3] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9D6FC] hover:shadow-[0_16px_32px_-18px_rgba(58,100,246,0.35)]"
    >
      <div className="relative overflow-hidden">
        <BlogCoverImage
          src={blog.coverImage}
          alt={stripHtml(blog.title)}
          className="aspect-[16/9] h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          width={640}
          height={360}
        />
        {tag && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-primary-100 shadow-sm">
            {tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        {blog.date && (
          <span className="mb-1.5 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6B6E76]">
            <CalendarDays size={13} /> {formatBlogDate(blog.date)}
          </span>
        )}
        <H
          className="line-clamp-2 font-primary text-[16px] font-semibold leading-[135%] text-[#16171A] transition-colors group-hover:text-primary-100"
          dangerouslySetInnerHTML={{ __html: blog.title }}
        />
        {excerpt && (
          <p className="mt-1.5 line-clamp-2 !text-[13px] !leading-[155%] !tracking-normal text-[#6B6E76] font-secondary">
            {excerpt}
          </p>
        )}
        <span className="mt-auto pt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-primary-100">
          Mehr lesen
          <ArrowRight size={14} strokeWidth={2.4} className="transition-transform group-hover:translate-x-0.5" />
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
