import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import BlogRelated from '@/page-components/blogs/RelatedBlogsSectiob';
import LatestBlogs from '@/components/homepage/Blogs';
import MongoBlogArticle from '@/components/blogpage/MongoBlogArticle';
import ArticleLayout from '@/components/blogpage/ArticleLayout';
import { headingId, readingMinutes, stripHtml } from '@/libs/blogs/format';
import {
  blogCoverSrc,
  fetchMongoBlogBySlug,
  fetchMongoBlogs,
} from '@/libs/blogs/mongo';
import { buildArticleKeywords } from '@/libs/seo/blogKeywords';
import JsonLd from '@/components/seo/JsonLd';

/* ------------------------------------------
   WORDPRESS API TYPES
------------------------------------------- */

export interface WPTag {
  id: number;
  slug: string;
  name: string;
  taxonomy: string;
}

export interface WPCategory {
  id: number;
  slug: string;
  name: string;
  parent: number;
}

export interface WPFeaturedMedia {
  id: number;
  source_url?: string;
}

export interface WPBlog {
  id: number;
  slug: string;
  date: string;
  modified?: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  yoast_head_json?: { description?: string };
  acf?: {
    meta_title?: string;
    meta_description?: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: WPFeaturedMedia[];
    "wp:term"?: [WPCategory[], WPTag[]];
  };
}

const SITE_URL = 'https://www.reifexa.de';
const WP_API = 'https://wp.reifexa.de/wp-json/wp/v2';


// -------------------------------
// Fetch WordPress Post
// -------------------------------
async function fetchBlog(slug: string) {
  try {
    const res = await fetch(`${WP_API}/posts?slug=${slug}&_embed`, {
      cache: 'no-store',
    });
    const data = await res.json();
    console.log('Fetched blog data:', data);
    return data[0] || null;
  } catch (e) {
    console.error('WP Fetch error:', e);
    return null;
  }
}

// -------------------------------
// Dynamic Metadata
// -------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mongoBlog = await fetchMongoBlogBySlug(slug);

  if (mongoBlog) {
    const title = `${mongoBlog.title} | Reifexa`;
    const description = (mongoBlog.metaDescription || mongoBlog.title).slice(
      0,
      155
    );
    const featured = mongoBlog.coverImage
      ? blogCoverSrc(mongoBlog.coverImage).startsWith('http')
        ? blogCoverSrc(mongoBlog.coverImage)
        : `${SITE_URL}${blogCoverSrc(mongoBlog.coverImage)}`
      : `${SITE_URL}/images/blog-og-image.jpg`;
    const canonical = `${SITE_URL}/artikel/${slug}`;
    const keywords = buildArticleKeywords({
      title: mongoBlog.title,
      tags: mongoBlog.tags,
      extra: ['Reifen Ratgeber 2026', 'Reifen Kaufberatung'],
    });

    return {
      metadataBase: new URL(SITE_URL),
      title: { absolute: title },
      description,
      alternates: { canonical },
      keywords,
      robots: { index: true, follow: true },
      openGraph: {
        type: 'article',
        locale: 'de_DE',
        url: canonical,
        siteName: 'Reifexa.de',
        title,
        description,
        publishedTime: mongoBlog.createdAt,
        modifiedTime: mongoBlog.updatedAt || mongoBlog.createdAt,
        images: [{ url: featured, width: 1200, height: 630, alt: mongoBlog.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [featured],
      },
    };
  }

  const blog = await fetchBlog(slug);

  if (!blog) {
    return {
      title: { absolute: 'Artikel nicht gefunden | Reifexa' },
      description: 'Dieser Artikel ist nicht verfügbar.',
      robots: { index: false, follow: true },
      alternates: { canonical: `${SITE_URL}/artikel/${slug}` },
    };
  }
  /* --------------------------------------------
      1️⃣ Extract WordPress Tags (Schlagwörter)
  --------------------------------------------- */
function getTags(blog: WPBlog): string[] {
  const tagGroup = blog._embedded?.['wp:term']?.[1] || [];
  return tagGroup.map((t: WPTag) => t.name.trim()).filter(Boolean);
}

function getCategories(blog: WPBlog): string[] {
  const cats = blog._embedded?.['wp:term']?.[0] || [];
  return cats.map((c: WPCategory) => c.name.trim()).filter(Boolean);
}

  const wpTags = getTags(blog);
  const wpCats = getCategories(blog);
  const mergedKeywords = buildArticleKeywords({
    title: String(blog.title.rendered || '').replace(/<[^>]+>/g, ''),
    tags: [...wpTags, ...wpCats],
  });

  const title =
    blog.acf?.meta_title ||
    `${blog.title.rendered.replace(/<[^>]+>/g, '')} | Reifexa`;

  const excerpt =
    blog.acf?.meta_description ||
    blog.yoast_head_json?.description ||
    blog.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 155);

  const featured =
    blog._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    `${SITE_URL}/images/blog-og-image.jpg`;

  const canonical = `${SITE_URL}/artikel/${slug}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description: excerpt,
    alternates: { canonical },
    keywords: mergedKeywords,
    robots: { index: true, follow: true },
    openGraph: {
      type: 'article',
      locale: 'de_DE',
      url: canonical,
      siteName: 'Reifexa.de',
      title,
      description: excerpt,
      publishedTime: blog.date,
      modifiedTime: blog.modified || blog.date,
      images: [
        {
          url: featured,
          width: 1200,
          height: 630,
          alt: blog.title.rendered.replace(/<[^>]+>/g, ''),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: excerpt,
      images: [featured],
    },
  };
}

// -------------------------------
// PAGE RENDER
// -------------------------------
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mongoBlog = await fetchMongoBlogBySlug(slug);

  if (mongoBlog) {
    const { blogs: relatedAll } = await fetchMongoBlogs({ page: 1, limit: 12 });
    const related = relatedAll.filter(b => b.slug !== slug).slice(0, 8);
    return <MongoBlogArticle blog={mongoBlog} related={related} />;
  }

  const blog = await fetchBlog(slug);

  if (!blog) notFound();

  const featured =
    blog._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    `${process.env.NEXT_PUBLIC_SITE_URL}/images/blog-default.jpg`;



  /* Helper: find parent category */
  function getPrimaryCategory(
    blog: WPBlog
  ): { slug: string; name: string } | null {
    const categories = blog._embedded?.['wp:term']?.[0] || [];
    const parent = categories.find((c: WPCategory) => c.parent === 0);
    return parent ? { slug: parent.slug, name: parent.name } : null;
  }
  /* --------------------------------------------
      1️⃣ Extract WordPress Tags (Schlagwörter)
  --------------------------------------------- */
  function getTags(blog: WPBlog): string[] {
    const tagGroup = blog._embedded?.['wp:term']?.[1] || [];
    return tagGroup.map((t: WPTag) => t.name.trim());
  }

  const wpTags = getTags(blog);
  const parentCategory = getPrimaryCategory(blog);
  const plainTitle = blog.title.rendered.replace(/<[^>]+>/g, '');
  const mergedKeywords = buildArticleKeywords({
    title: plainTitle,
    tags: wpTags,
  });
  const breadcrumbItems = [
    { name: 'Startseite', url: `${SITE_URL}/` },
    { name: 'News & Testberichte', url: `${SITE_URL}/artikel` },
    ...(parentCategory
      ? [
          {
            name: parentCategory.name,
            url: `${SITE_URL}/artikel?kategorie=${parentCategory.slug}`,
          },
        ]
      : []),
    {
      name: plainTitle,
      url: `${SITE_URL}/artikel/${slug}`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: plainTitle,
    description:
      blog.yoast_head_json?.description ||
      blog.excerpt.rendered.replace(/<[^>]+>/g, ''),
    keywords: mergedKeywords,
    ...(featured && {
      image: featured,
    }),
    datePublished: blog.date,
    dateModified: blog.modified || blog.date,
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
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/artikel/${slug}`,
    },
    inLanguage: 'de-DE',
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  // Anchor ids on h2s → table of contents
  const toc: { id: string; text: string }[] = [];
  const contentHtml = String(blog.content.rendered || '').replace(
    /<h2([^>]*)>([\s\S]*?)<\/h2>/gi,
    (full, attrs: string, inner: string) => {
      const text = stripHtml(inner);
      if (!text) return full;
      const existing = /\sid=["']([^"']+)["']/i.exec(attrs)?.[1];
      const id = existing || headingId(text);
      toc.push({ id, text });
      return existing ? full : `<h2${attrs} id="${id}">${inner}</h2>`;
    }
  );
  const intro =
    blog.yoast_head_json?.description ||
    stripHtml(blog.excerpt.rendered).slice(0, 220);

  return (
    <>
      <ArticleLayout
        titleHtml={blog.title.rendered}
        intro={intro}
        published={blog.date}
        updated={blog.modified}
        minutes={readingMinutes(stripHtml(contentHtml))}
        tags={wpTags.filter(Boolean)}
        cover={blog._embedded?.['wp:featuredmedia']?.[0]?.source_url || ''}
        crumbs={
          parentCategory
            ? [{ name: parentCategory.name, href: `/artikel?kategorie=${parentCategory.slug}` }]
            : []
        }
        toc={toc}
      >
        <div
          className="wp-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </ArticleLayout>

      {/* RELATED POSTS */}
      <BlogRelated blog={blog} />
      <LatestBlogs limit={8} />

      <JsonLd id="blog-jsonld" data={jsonLd} />
      <JsonLd id="blog-breadcrumb-jsonld" data={breadcrumbLd} />
      <Script
        src="/wp-calculator.js"
        strategy="lazyOnload"
        id="wp-calculator-script"
      />
    </>
  );
}
