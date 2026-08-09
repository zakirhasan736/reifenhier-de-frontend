import { use } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import BlogPage from '@/components/blogpage/BlogPage';

const WP_API = 'https://wp.reifexa.de/wp-json/wp/v2';

export const metadata: Metadata = {
  title: 'Reifexa Artikel | Reifexa.de',
  description:
    'Entdecken Sie aktuelle Artikel rund um Reifen, Autos und Tipps für Ihren Reifenkauf auf Reifexa.de.',
  alternates: { canonical: 'https://www.reifexa.de/artikel' },
  keywords: [
    'Reifen Artikel',
    'Reifen Blogs',
    'Reifexa Tipps',
    'reifexa',
    'reifexa.de',
    'Reifen check',
    'Reifen check 24',
    'Reifen 24 check',
    'Autoreifen Ratgeber',
    'Winterreifen Sommerreifen Artikel',
    'Winterreifen Sommerreifen Blogs',
    'Reifenpflege und Sicherheit',
  ],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://www.reifexa.de/artikel',
    siteName: 'Reifexa.de',
    title: 'Reifexa Artikel | Reifexa.de',
    description:
      'Lesen Sie spannende Beiträge und erhalten Sie wertvolle Informationen rund um Reifen auf Reifexa.de.',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/blog-og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Reifexa Artikel image',
      },
    ],
  },
};

/* Helpers */
async function getCategoryIdBySlug(slug: string) {
  const res = await fetch(`${WP_API}/categories?slug=${slug}`);
  const data = await res.json();
  return data[0]?.id ?? null;
}

async function getBlogs(
  page: number,
  parentSlug: string | null,
  subSlug: string | null
) {
  const perPage = 6;
  let filter = '';

  if (subSlug) {
    const id = await getCategoryIdBySlug(subSlug);
    if (id) filter = `&categories=${id}`;
  }

  const url = `${WP_API}/posts?page=${page}&per_page=${perPage}&_embed${filter}`;
  const res = await fetch(url, { next: { revalidate: 60 } });

  return {
    blogs: await res.json(),
    total: Number(res.headers.get('X-WP-Total')),
  };
}

export default function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = use(searchParams);

  const page = Number(params.page ?? '1');
  const parentSlug = params.kategorie ?? null;
  const subSlug = params.subkategorie ?? null;

  return (
    <ServerContent page={page} parentSlug={parentSlug} subSlug={subSlug} />
  );
}

async function ServerContent({
  page,
  parentSlug,
  subSlug,
}: {
  page: number;
  parentSlug: string | null;
  subSlug: string | null;
}) {
  const { blogs, total } = await getBlogs(page, parentSlug, subSlug);
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Artikel',
      '@id': 'https://www.reifexa.de/artikel#artikel',
      url: 'https://www.reifexa.de/artikel',
      name: 'Reifexa Artikel',
      description:
        'Reifexa.de Artikel – Tipps, Ratgeber und aktuelle News rund um Reifen, Autos und Fahrsicherheit.',
      inLanguage: 'de-DE',
    };
  return (
    <>
      <BlogPage
        blogs={blogs}
        total={total}
        currentPage={page}
        parentSlug={parentSlug}
        subSlug={subSlug}
      />
      
      <Script id="ld-artikel" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
    </>
  );
}