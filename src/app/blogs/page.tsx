import type { Metadata } from 'next';
import Script from 'next/script';
import BlogPage from '@/components/blogpage/BlogPage';

const WP_API = 'https://wp.reifencheck.de/wp-json/wp/v2';

// WordPress Server Fetch (SSR)
async function getBlogs(page = 1) {
  try {
    const perPage = 6;

    const res = await fetch(
      `${WP_API}/posts?page=${page}&per_page=${perPage}&_embed`,
      {
        next: { revalidate: 500 }, // ISR every 30 minutes
      }
    );

    if (!res.ok) throw new Error('Failed to fetch WP posts');

    const blogs = await res.json();
    const total = Number(res.headers.get('X-WP-Total'));

    return { blogs, total };
  } catch (err) {
    console.error('WP Fetch Error:', err);
    return { blogs: [], total: 0 };
  }
}

export const metadata: Metadata = {
  title: 'Reifencheck Blog | Reifencheck.de',
  description:
    'Entdecken Sie aktuelle Blogartikel rund um Reifen, Autos und Tipps für Ihren Reifencheck auf Reifencheck.de.',
  alternates: { canonical: 'https://www.reifencheck.de/blogs' },
  keywords: [
    'Reifen Blog',
    'Reifencheck Tipps',
    'Autoreifen Ratgeber',
    'Winterreifen Sommerreifen Blog',
    'Reifenpflege und Sicherheit',
  ],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://www.reifencheck.de/blogs',
    siteName: 'Reifencheck.de',
    title: 'Reifencheck Blog | Reifencheck.de',
    description:
      'Lesen Sie spannende Beiträge und erhalten Sie wertvolle Informationen zum Thema Reifencheck.',
    images: [
      {
        url: '/images/blog-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Reifencheck Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reifencheck Blog | Reifencheck.de',
    description:
      'Lesen Sie spannende Beiträge und erhalten Sie wertvolle Informationen zum Thema Reifencheck.',
    images: ['/images/blog-og-image.jpg'],
  },
  robots: { index: true, follow: true },
};

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? '1');

  const { blogs, total } = await getBlogs(page);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://www.reifencheck.de/blogs#blog',
    url: 'https://www.reifencheck.de/blogs',
    name: 'Reifencheck Blog',
    description:
      'Reifencheck.de Blog – Tipps, Ratgeber und aktuelle News rund um Reifen, Autos und Fahrsicherheit.',
    inLanguage: 'de-DE',
  };

  return (
    <>
      <BlogPage blogs={blogs} total={total} currentPage={page} />

      <Script
        id="ld-blog"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(jsonLd)}
      </Script>
    </>
  );
}
