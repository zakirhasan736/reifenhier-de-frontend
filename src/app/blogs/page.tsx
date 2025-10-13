import type { Metadata } from 'next';
import Script from 'next/script';
import BlogPage from '@/components/blogpage/BlogPage';

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:8001';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  metaDescription: string;
  createdAt: string;
}

// 🔹 SSR Fetch: get page number from URL
async function getBlogs(page = 1): Promise<{ blogs: Blog[]; total: number }> {
  try {
    const res = await fetch(`${apiUrl}/api/blogs/list?page=${page}&limit=6`, {
      next: { revalidate: 1800 }, // ISR: revalidate every 30min
    });
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
  } catch {
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

interface BlogListPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogListPage({
  searchParams,
}: BlogListPageProps) {
  // ✅ await the promise
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page ?? '1');
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
