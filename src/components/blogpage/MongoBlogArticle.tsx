import Link from 'next/link'
import Script from 'next/script'
import ContentBlocks from '@/components/blogpage/ContentBlocks'
import BlogTyreCalculator from '@/components/blogpage/BlogTyreCalculator'
import BlogCoverImage from '@/components/blogpage/BlogCoverImage'
import {
  blogCoverSrc,
  type MongoBlog,
} from '@/libs/blogs/mongo'
import { SITE_URL } from '@/libs/seo/site'
import { buildArticleKeywords } from '@/libs/seo/blogKeywords'

const CALCULATOR_SLUG =
  'reifenrechner-2026-preise-vergleichen-modelle-pruefen-und-die-richtige-reifengroesse-finden'

export default function MongoBlogArticle({
  blog,
  related,
}: {
  blog: MongoBlog
  related: MongoBlog[]
}) {
  const featured = blogCoverSrc(blog.coverImage)
  const date = new Date(blog.createdAt).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const showCalculator =
    blog.slug === CALCULATOR_SLUG ||
    (blog.tags || []).some(t =>
      t.toLowerCase().includes('reifenrechner')
    )
  const tags = (blog.tags || []).map(t => t.trim()).filter(Boolean)
  const canonical = `${SITE_URL}/artikel/${blog.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.metaDescription || blog.title,
    keywords: buildArticleKeywords({ title: blog.title, tags }),
    image: featured
      ? featured.startsWith('http')
        ? featured
        : `${SITE_URL}${featured}`
      : `${SITE_URL}/images/logo.png`,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      '@type': 'Organization',
      name: 'Reifexa.de',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Reifexa.de',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    inLanguage: 'de-DE',
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Startseite',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'News & Testberichte',
        item: `${SITE_URL}/artikel`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.title,
        item: canonical,
      },
    ],
  }

  return (
    <>
      <section className="blog-details-page">
        <div className="custom-container pt-12 pb-10">
          <nav
            aria-label="Breadcrumb"
            className="text-sm mb-5 text-gray-500 flex gap-2 flex-wrap"
          >
            <Link href="/" className="hover:text-primary-100 underline">
              Startseite
            </Link>
            <span>/</span>
            <Link href="/artikel" className="hover:text-primary-100 underline">
              News & Testberichte
            </Link>
            <span>/</span>
            <span className="text-gray-700">{blog.title}</span>
          </nav>

          <article className="md:max-w-full w-full mx-auto">
            <h1 className="text-[26px] md:text-3xl font-semibold mb-2 text-[#16171A]">
              {blog.title}
            </h1>
            <p className="text-gray-600 mb-4">{date}</p>
            {featured ? (
              <BlogCoverImage
                src={featured}
                alt={blog.title}
                width={848}
                height={558}
                className="mb-6 h-auto w-full rounded-xl object-cover md:h-[558px]"
                priority
              />
            ) : null}

            {showCalculator && <BlogTyreCalculator />}

            <ContentBlocks groups={blog.contentBlocks} />

            {showCalculator && (
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/"
                  className="text-center rounded-full bg-primary-100 text-white font-semibold px-6 py-3 hover:bg-primary-90 transition"
                >
                  Zum Reifenrechner auf der Startseite
                </Link>
                <Link
                  href="/produkte?kategorie=Sommerreifen&width=205&height=55&diameter=16"
                  className="text-center rounded-full border border-primary-100 text-primary-100 font-semibold px-6 py-3 hover:bg-primary-100 hover:text-white transition"
                >
                  Beispiel: 205/55 R16 vergleichen
                </Link>
              </div>
            )}
          </article>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="custom-container">
            <h2 className="text-2xl font-semibold mb-8">Ähnliche Artikel</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 min-[1100px]:grid-cols-4">
              {related.map(post => (
                <Link key={post._id} href={`/artikel/${post.slug}`}>
                  <div className="news-item relative cursor-pointer overflow-hidden rounded-2xl border border-[#F0F0F2] bg-mono-0">
                    <BlogCoverImage
                      src={blogCoverSrc(post.coverImage)}
                      alt={post.title}
                      className="h-[200px] w-full object-cover"
                      width={1024}
                      height={200}
                    />
                    <div className="news-item-content relative p-4 pt-5">
                      <h3 className="text-[#404042] font-medium h6 font-primary">
                        {post.title}
                      </h3>
                      <p className="text-[#404042] text-[12px] font-medium font-primary mt-2">
                        {new Date(post.createdAt).toLocaleDateString('de-DE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <span className="text-primary-100 underline hover:text-primary-90 transition text-[14px] font-medium font-secondary mt-3 block">
                        Mehr lesen
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Script id="blog-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
      <Script id="blog-breadcrumb-jsonld" type="application/ld+json">
        {JSON.stringify(breadcrumbLd)}
      </Script>
    </>
  )
}
