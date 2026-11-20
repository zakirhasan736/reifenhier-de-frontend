import Link from 'next/link'
import ContentBlocks from '@/components/blogpage/ContentBlocks'
import BlogTyreCalculator from '@/components/blogpage/BlogTyreCalculator'
import ArticleLayout from '@/components/blogpage/ArticleLayout'
import BlogStatsTracker from '@/components/blogpage/BlogStatsTracker'
import { blocksText, readingMinutes, tocFromBlocks } from '@/libs/blogs/format'
import {
  blogCoverSrc,
  type MongoBlog,
} from '@/libs/blogs/mongo'
import { SITE_URL } from '@/libs/seo/site'
import { buildArticleKeywords } from '@/libs/seo/blogKeywords'
import JsonLd from '@/components/seo/JsonLd';
import RelatedSearches from '@/components/seo/RelatedSearches'
import { articleRelatedLinks } from '@/libs/seo/keywords'

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
      <ArticleLayout
        titleHtml={blog.title.replace(/</g, '&lt;')}
        intro={blog.metaDescription}
        published={blog.createdAt}
        updated={blog.updatedAt}
        minutes={readingMinutes(blocksText(blog.contentBlocks))}
        views={blog.views}
        readSeconds={blog.readSeconds}
        tags={tags}
        cover={featured}
        toc={tocFromBlocks(blog.contentBlocks)}
        related={related.map(post => ({
          id: post._id,
          slug: post.slug,
          title: post.title.replace(/</g, '&lt;'),
          date: post.createdAt,
          coverImage: blogCoverSrc(post.coverImage),
          excerpt: post.metaDescription,
          tags: post.tags,
        }))}
      >
        {showCalculator && <BlogTyreCalculator />}

        <ContentBlocks groups={blog.contentBlocks} />

        <RelatedSearches
          contained={false}
          className="mt-10 rounded-[16px] border border-[#E9ECF3] bg-[#F6F8FC] p-5 md:p-6"
          title="Passend zum Thema"
          links={articleRelatedLinks({ title: blog.title, tags })}
        />

        {showCalculator && (
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="text-center rounded-[10px] bg-primary-100 text-white font-semibold px-6 py-3 hover:opacity-90 transition"
            >
              Zum Reifenrechner auf der Startseite
            </Link>
            <Link
              href="/reifen/205-55-r16"
              className="text-center rounded-[10px] border border-primary-100 text-primary-100 font-semibold px-6 py-3 hover:bg-primary-100 hover:text-white transition"
            >
              Beispiel: 205/55 R16 vergleichen
            </Link>
          </div>
        )}
      </ArticleLayout>

      <BlogStatsTracker slug={blog.slug} />
      <JsonLd id="blog-jsonld" data={jsonLd} />
      <JsonLd id="blog-breadcrumb-jsonld" data={breadcrumbLd} />
    </>
  )
}
