import type { Metadata } from 'next';
import Script from 'next/script';
import Image from 'next/image';
import BlogRelated from '@/page-components/blogs/RelatedBlogsSectiob';

const SITE_URL = 'https://www.reifencheck.de';
const WP_API = 'https://wp.reifencheck.de/wp-json/wp/v2';

// -------------------------------
// Fetch WordPress Post
// -------------------------------
async function fetchBlog(slug: string) {
  try {
    const res = await fetch(`${WP_API}/posts?slug=${slug}&_embed`, {
      cache: 'no-store',
    });
    const data = await res.json();
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
      title: 'Artikel nicht gefunden | Reifencheck.de',
      description: 'Dieser Artikel ist nicht verfügbar.',
    };
  }

  const title = `${blog.title.rendered} | Reifencheck.de`;
  const excerpt =
    blog.yoast_head_json?.description ||
    blog.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 155);

  const featured =
    blog._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    '/images/blog-og-image.jpg';

  return {
    title,
    description: excerpt,
    alternates: { canonical: `${SITE_URL}/artikel/${slug}` },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/artikel/${slug}`,
      title,
      description: excerpt,
      images: [
        {
          url: featured,
          width: 1200,
          height: 630,
          alt: blog.title.rendered,
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
    '/images/blog-default.jpg';

  const date = new Date(blog.date).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title.rendered,
    description:
      blog.yoast_head_json?.description ||
      blog.excerpt.rendered.replace(/<[^>]+>/g, ''),
    image: featured,
    datePublished: blog.date,
    author: { '@type': 'Organization', name: 'Reifencheck.de' },
    mainEntityOfPage: `${SITE_URL}/artikel/${slug}`,
  };

  return (
    <>
      <section className="blog-details-page">
        <div className="custom-container pt-12">
          <article className="md:max-w-4xl w-full mx-auto">
            <h1
              className="text-3xl font-semibold mb-2 text-[#16171A]"
              dangerouslySetInnerHTML={{ __html: blog.title.rendered }}
            />

            <p className="text-gray-600 mb-4">{date}</p>

            <Image
              src={featured}
              alt={blog.title.rendered}
              width={848}
              height={558}
              className="w-full rounded-xl mb-6"
              priority
            />

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
    </>
  );
}
