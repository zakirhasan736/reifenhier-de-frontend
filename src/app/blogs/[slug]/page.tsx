// app/blogs/[slug]/page.tsx
import type { Metadata } from 'next';
import type { JSX } from 'react';
import React from 'react';
import Script from 'next/script';
import Image from 'next/image';
import BlogSidebar from '@/page-components/blogs/RelatedBlogsSectiob';

const SITE_URL = 'https://www.reifencheck.de';
const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'https://api.reifencheck.de';

type ContentBlock =
  | { type: 'heading'; level?: string; text?: string }
  | { type: 'paragraph'; text?: string }
  | { type: 'list'; style?: 'ul' | 'ol'; items?: string[] };

interface Blog {
  title: string;
  slug: string;
  coverImage?: string;
  metaDescription?: string;
  contentBlocks?: ContentBlock[][];
  createdAt: string;
  updatedAt?: string;
}

// ---- Server fetch ----
async function fetchBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/blogs/slug/${encodeURIComponent(slug)}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    return (await res.json()) as Blog;
  } catch {
    return null;
  }
}

// ---- Utilities (type-safe rendering) ----
const allowedHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
type AllowedHeading = (typeof allowedHeadings)[number];

function resolveHeadingTag(level?: string): AllowedHeading {
  const lower = (level ?? '').toLowerCase();
  return (allowedHeadings as readonly string[]).includes(lower)
    ? (lower as AllowedHeading)
    : 'h2';
}

function renderBlock(block: ContentBlock, key: number): React.ReactNode {
  if (block.type === 'heading') {
    const Tag = resolveHeadingTag(block.level);
    const text = block.text ?? '';
    return React.createElement(
      Tag,
      { key, className: 'text-xl font-semibold mt-6 mb-2' },
      text
    );
  }

  if (block.type === 'paragraph') {
    return (
      <p key={key} className="mb-4">
        {block.text ?? ''}
      </p>
    );
  }

  if (block.type === 'list') {
    const style: 'ul' | 'ol' = block.style === 'ol' ? 'ol' : 'ul';
    const ListTag: keyof JSX.IntrinsicElements = style;
    const cls = style === 'ol' ? 'list-decimal' : 'list-disc';
    return React.createElement(
      ListTag,
      { key, className: `mb-4 ${cls} pl-6` },
      (block.items ?? []).map((item, i) => <li key={i}>{item}</li>)
    );
  }

  return null;
}

// ---- Metadata ----
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlog(slug);

  if (!blog) {
    return {
      title: 'Blog nicht gefunden | Reifencheck.de',
      description: 'Dieser Blogartikel ist nicht verfügbar.',
      robots: { index: false, follow: true },
      alternates: { canonical: `${SITE_URL}/blogs/${slug}` },
    };
  }

  const title = `${blog.title} | Reifencheck.de`;
  const description =
    blog.metaDescription?.slice(0, 155) ||
    `Lesen Sie den Blogartikel „${blog.title}“ auf Reifencheck.de.`;
  const canonical = `${SITE_URL}/blogs/${blog.slug}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      'reifencheck blog',
      'autoreifen tipps',
      'reifenratgeber',
      blog.title,
    ],
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'de_DE',
      url: canonical,
      siteName: 'Reifencheck.de',
      title,
      description,
      images: [
        {
          url: blog.coverImage || '/images/blog-og-image.jpg',
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [blog.coverImage || '/images/blog-og-image.jpg'],
    },
    robots: { index: true, follow: true },
  };
}

// ---- Page (await params) ----
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

  const date = new Date(blog.createdAt).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_URL}/blogs/${blog.slug}#article`,
    headline: blog.title,
    description: blog.metaDescription || blog.title,
    image: blog.coverImage ? [blog.coverImage] : undefined,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: { '@type': 'Organization', name: 'Reifencheck.de' },
    publisher: {
      '@type': 'Organization',
      name: 'Reifencheck.de',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
    },
    mainEntityOfPage: `${SITE_URL}/blogs/${blog.slug}`,
  };

  return (
    <>
      <section className="blog-details-page">
        <div className="custom-container pt-12">
          <article className="md:max-w-4xl w-full mx-auto">
            <h1 className="text-3xl font-semibold mb-2">{blog.title}</h1>
            <p className="text-gray-600 mb-4">{date}</p>

            {blog.coverImage && (
              <Image
                src={blog.coverImage}
                alt={blog.title}
                className="w-full rounded mb-6"
                width={848}
                height={558}
                priority
                sizes="(max-width: 900px) 100vw, 848px"
              />
            )}

            {blog.contentBlocks?.map((group, gIdx) => (
              <div key={gIdx} className="mb-6">
                {group.map((block, idx) => renderBlock(block, idx))}
              </div>
            ))}
          </article>
        </div>
      </section>

      {/* Client-side related blogs (RTK/Redux handled inside) */}
      <BlogSidebar />

      <Script
        id="ld-blog-article"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(jsonLd)}
      </Script>
    </>
  );
}
