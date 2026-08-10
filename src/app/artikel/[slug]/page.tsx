import type { Metadata } from 'next';
import Script from 'next/script';
import Image from 'next/image';
import BlogRelated from '@/page-components/blogs/RelatedBlogsSectiob';
import Link from 'next/link';

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
  const blog = await fetchBlog(slug);

  if (!blog) {
    return {
      title: 'Artikel nicht gefunden | Reifexa.de',
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
  const titleWords = String(blog.title.rendered || '')
    .replace(/<[^>]+>/g, '')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 3)
    .slice(0, 8);

  /* --------------------------------------------
      2️⃣ Fallback Keywords (used when missing)
  --------------------------------------------- */
  const fallbackKeywords = [
    'Reifen',
    'Reifen test',
    'Reifen check',
    'Reifen check 24',
    'Reifen 24 check',
    'Reifen Preisvergleich',
    'Reifen Montage',
    'Auto Reifen Ratgeber',
    'Reifexa',
    'Reifexa.de',
    'PKW Reifen',
    'Felgen & Reifen Wissen',
  ];

  /* --------------------------------------------
      3️⃣ Merge + Deduplicate Keywords
  --------------------------------------------- */
  const mergedKeywords = Array.from(
    new Set([...wpTags, ...wpCats, ...titleWords, ...fallbackKeywords])
  );

  const title =
    blog.acf?.meta_title ||
    `${blog.title.rendered.replace(/<[^>]+>/g, '')} | Reifexa.de`;

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
    title,
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
  const blog = await fetchBlog(slug);

  if (!blog) {
    return (
      <main className="container mx-auto py-10">
        <h1 className="text-xl font-semibold mb-2">Blog nicht gefunden</h1>
        <p>Dieser Blogartikel ist nicht verfügbar.</p>
      </main>
    );
  }

  const featured =
    blog._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    `${process.env.NEXT_PUBLIC_SITE_URL}/images/blog-default.jpg`;

  const date = new Date(blog.date).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });


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

  /* --------------------------------------------
      2️⃣ Fallback Keywords (used when missing)
  --------------------------------------------- */
  const fallbackKeywords = [
    'Reifen',
    'Reifen test',
    'Reifen check',
    'Reifen check 24',
    'Reifen 24 check',
    'Reifen Preisvergleich',
    'Reifen Montage',
    'Auto Reifen Ratgeber',
    'Reifexa',
    'Reifexa.de',
    'PKW Reifen',
    'Felgen & Reifen Wissen',
  ];

  /* --------------------------------------------
      3️⃣ Merge + Deduplicate Keywords
  --------------------------------------------- */
  const mergedKeywords = Array.from(new Set([...wpTags, ...fallbackKeywords]));

  const parentCategory = getPrimaryCategory(blog);
  const plainTitle = blog.title.rendered.replace(/<[^>]+>/g, '');
  const breadcrumbItems = [
    { name: 'Startseite', url: `${SITE_URL}/` },
    { name: 'Artikel', url: `${SITE_URL}/artikel` },
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
  return (
    <>
      <section className="blog-details-page">
        <div className="custom-container pt-12">
          {/* here need a bradcrump */}
          {/* ---------------- BREADCRUMB ---------------- */}
          <nav
            aria-label="Breadcrumb"
            className="text-sm mb-5 text-gray-500 flex gap-2 flex-wrap"
          >
            <Link href="/" className="hover:text-primary-100 underline">
              Startseite
            </Link>
            <span>/</span>

            <Link href="/artikel" className="hover:text-primary-100 underline">
              Artikel
            </Link>

            {parentCategory && (
              <>
                <span>/</span>
                <Link
                  href={`/artikel?kategorie=${parentCategory.slug}`}
                  className="hover:text-primary-100 capitalize"
                >
                  {parentCategory.name}
                </Link>
              </>
            )}

            <span>/</span>
            <span className="text-gray-700">{plainTitle}</span>
          </nav>
          <article className="md:max-w-full w-full mx-auto">
            <h1
              className="text-[26px] md:text-3xl font-semibold mb-2 text-[#16171A]"
              dangerouslySetInnerHTML={{ __html: blog.title.rendered }}
            />

            <p className="text-gray-600 mb-4">{date}</p>
            {featured && (
              <Image
                src={featured}
                alt={blog.title.rendered}
                width={848}
                height={558}
                className="md:h-[558px] h-auto rounded-xl mb-6"
                priority
              />
            )}
            {/* Gutenberg Content (HTML) */}
            <div
              className="wp-content"
              dangerouslySetInnerHTML={{ __html: blog.content.rendered }}
            />
          </article>
        </div>
      </section>

      {/* RELATED POSTS */}
      <BlogRelated blog={blog} />

      <Script id="blog-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
      <Script id="blog-breadcrumb-jsonld" type="application/ld+json">
        {JSON.stringify(breadcrumbLd)}
      </Script>
      <Script
        src="/wp-calculator.js"
        strategy="lazyOnload"
        id="wp-calculator-script"
      />
    </>
  );
}
