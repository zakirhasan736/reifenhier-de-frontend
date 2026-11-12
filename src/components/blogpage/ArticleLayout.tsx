import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, BookOpen, CalendarDays, ChevronRight, Clock, Eye, ListOrdered, RefreshCw } from 'lucide-react'
import BlogCoverImage from '@/components/blogpage/BlogCoverImage'
import { ArticleCard, type ArticleCardData } from '@/components/blogpage/ArticleCard'
import { formatBlogDate, formatReadTotal, stripHtml } from '@/libs/blogs/format'

type Crumb = { name: string; href?: string }

export default function ArticleLayout({
  titleHtml,
  intro,
  published,
  updated,
  minutes,
  views,
  readSeconds,
  tags = [],
  cover,
  crumbs = [],
  toc = [],
  related = [],
  children,
}: {
  titleHtml: string
  intro?: string
  published?: string
  updated?: string
  minutes?: number
  /** Total views of this article */
  views?: number
  /** Total seconds all readers spent on this article */
  readSeconds?: number
  tags?: string[]
  cover?: string
  crumbs?: Crumb[]
  toc?: { id: string; text: string }[]
  related?: ArticleCardData[]
  children: ReactNode
}) {
  const plainTitle = stripHtml(titleHtml)
  const showUpdated =
    updated && published && formatBlogDate(updated) !== formatBlogDate(published)
  const readTotal = formatReadTotal(readSeconds)

  return (
    <>
      <article className="blog-details-page article-v2 bg-white">
        {/* ---------- Hero ---------- */}
        <header className="bg-[#F6F8FC] border-b border-[#E9ECF3]">
          <div className="custom-container pt-8 md:pt-10 pb-28 md:pb-40">
            <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-[13px] text-[#6B6E76]">
              <Link href="/" className="hover:text-primary-100">Startseite</Link>
              <ChevronRight size={14} className="text-[#C0C4CC]" />
              <Link href="/artikel" className="hover:text-primary-100">News &amp; Testberichte</Link>
              {crumbs.map(c => (
                <span key={c.name} className="inline-flex items-center gap-1.5">
                  <ChevronRight size={14} className="text-[#C0C4CC]" />
                  {c.href ? (
                    <Link href={c.href} className="capitalize hover:text-primary-100">{c.name}</Link>
                  ) : (
                    <span className="capitalize">{c.name}</span>
                  )}
                </span>
              ))}
            </nav>

            <div className="max-w-[860px]">
              {tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {tags.slice(0, 4).map(t => (
                    <span key={t} className="rounded-full bg-[#EEF2FF] px-3 py-1 text-[12px] font-semibold text-primary-100">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <h1
                className="text-[28px] md:text-[40px] lg:text-[46px] font-semibold leading-[115%] tracking-[-0.015em] text-[#16171A]"
                dangerouslySetInnerHTML={{ __html: titleHtml }}
              />
              {intro && (
                <p className="mt-4 max-w-[720px] md:!text-[18px] !text-[16px] !leading-[160%] text-[#5B5D63]">
                  {intro}
                </p>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#6B6E76]">
                <span className="inline-flex items-center gap-2 font-semibold text-[#16171A]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-[12px] font-bold text-white">R</span>
                  Reifexa Redaktion
                </span>
                {published && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    <time dateTime={published}>{formatBlogDate(published)}</time>
                  </span>
                )}
                {showUpdated && (
                  <span className="inline-flex items-center gap-1.5">
                    <RefreshCw size={14} />
                    Aktualisiert <time dateTime={updated}>{formatBlogDate(updated)}</time>
                  </span>
                )}
                {minutes ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} /> {minutes} Min. Lesezeit
                  </span>
                ) : null}
                {views && views > 0 ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Eye size={14} /> {views.toLocaleString('de-DE')} {views === 1 ? 'Aufruf' : 'Aufrufe'}
                  </span>
                ) : null}
                {readTotal ? (
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen size={14} /> {readTotal} insgesamt gelesen
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        {/* ---------- Cover + body ---------- */}
        <div className="custom-container">
          {cover ? (
            <div className="-mt-20 md:-mt-32 overflow-hidden rounded-[20px] shadow-[0_30px_60px_-30px_rgba(15,30,77,0.45)]">
              <BlogCoverImage
                src={cover}
                alt={plainTitle}
                width={1400}
                height={700}
                className="aspect-[16/9] md:aspect-[21/9] h-auto w-full object-cover"
                priority
              />
            </div>
          ) : (
            <div className="-mt-20 md:-mt-32" />
          )}

          <div className="grid grid-cols-12 gap-y-8 lg:gap-x-12 pt-8 md:pt-12 pb-14">
            <div className="col-span-12 lg:col-span-8 min-w-0">
              {toc.length > 1 && (
                <details className="lg:hidden mb-6 rounded-[14px] border border-[#E9ECF3] bg-[#F7F8FB] p-4" open>
                  <summary className="flex cursor-pointer items-center gap-2 text-[15px] font-semibold text-[#16171A]">
                    <ListOrdered size={17} className="text-primary-100" /> Inhalt
                  </summary>
                  <ol className="mt-3 space-y-2 border-l-2 border-[#E4E7EE]">
                    {toc.map(t => (
                      <li key={t.id}>
                        <a href={`#${t.id}`} className="block pl-3 text-[14px] leading-snug text-[#404042] hover:text-primary-100">
                          {t.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </details>
              )}
              <div className="article-body max-w-[760px]">{children}</div>
            </div>

            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-28 flex flex-col gap-4">
                {toc.length > 1 && (
                  <nav aria-label="Inhaltsverzeichnis" className="hidden lg:block rounded-[16px] border border-[#E9ECF3] bg-white p-5">
                    <p className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-[#16171A]">
                      <ListOrdered size={17} className="text-primary-100" /> Inhalt
                    </p>
                    <ol className="space-y-2 border-l-2 border-[#EEF0F4]">
                      {toc.map(t => (
                        <li key={t.id}>
                          <a
                            href={`#${t.id}`}
                            className="-ml-[2px] block border-l-2 border-transparent pl-3 text-[14px] leading-snug text-[#5B5D63] hover:border-primary-100 hover:text-primary-100"
                          >
                            {t.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}

                <div className="relative overflow-hidden rounded-[16px] bg-[#0F1E4D] p-6 text-white">
                  <p className="mb-1 text-[18px] font-semibold !text-white">Reifen vergleichen</p>
                  <p className="mb-4 !text-[14px] !text-white/75">
                    Über 40.000 Reifen – Preise mehrmals täglich aktualisiert.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/produkte"
                      className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#0F1E4D] hover:bg-[#EEF2FF]"
                    >
                      Jetzt Preise vergleichen <ArrowRight size={16} strokeWidth={2.4} />
                    </Link>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        ['Sommer', '/sommerreifen'],
                        ['Winter', '/winterreifen'],
                        ['Ganzjahr', '/ganzjahresreifen'],
                      ].map(([label, href]) => (
                        <Link
                          key={href}
                          href={href}
                          className="rounded-[8px] border border-white/20 py-1.5 text-center text-[12px] font-semibold text-white hover:bg-white/10"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-[#F6F8FC] py-12 md:py-16" aria-labelledby="related-title">
          <div className="custom-container">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 id="related-title" className="text-[24px] md:text-[30px] font-semibold text-[#16171A]">
                Das könnte Sie auch interessieren
              </h2>
              <Link href="/artikel" className="hidden sm:inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary-100 hover:underline">
                Alle Artikel <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.slice(0, 4).map(r => (
                <ArticleCard key={r.id} blog={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
