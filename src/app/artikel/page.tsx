import { use } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import BlogPage from '@/components/blogpage/BlogPage';
import { CORE_KEYWORDS, SITE_URL } from '@/libs/seo/site';

const WP_API = 'https://wp.reifexa.de/wp-json/wp/v2';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Reifen Ratgeber & Artikel | Reifexa.de',
  description:
    'Aktuelle Ratgeber, Tests und Tipps zu Sommerreifen, Winterreifen, Ganzjahresreifen und Reifenkauf auf Reifexa.de.',
  alternates: { canonical: `${SITE_URL}/artikel` },
  keywords: [
    ...CORE_KEYWORDS,
    'Reifen Artikel',
    'Reifen Blogs',
    'Reifen Ratgeber',
    'Autoreifen Tipps',
    'Winterreifen Sommerreifen Artikel',
    'Reifenpflege und Sicherheit',
    'EU Reifenlabel erklärt',
  ],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: `${SITE_URL}/artikel`,
    siteName: 'Reifexa.de',
    title: 'Reifen Ratgeber & Artikel | Reifexa.de',
    description:
      'Lesen Sie Ratgeber und News rund um Reifenkauf, Größen und EU-Label auf Reifexa.de.',
    images: [
      {
        url: `${SITE_URL}/images/blog-og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Reifexa Artikel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reifen Ratgeber & Artikel | Reifexa.de',
    description:
      'Ratgeber und News zu Sommer-, Winter- und Ganzjahresreifen.',
    images: [`${SITE_URL}/images/blog-og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
      '@type': 'CollectionPage',
      '@id': 'https://www.reifexa.de/artikel#collection',
      url: 'https://www.reifexa.de/artikel',
      name: 'Reifexa Artikel',
      description:
        'Reifexa.de Artikel – Tipps, Ratgeber und aktuelle News rund um Reifen, Autos und Fahrsicherheit.',
      inLanguage: 'de-DE',
      isPartOf: { '@id': 'https://www.reifexa.de/#website' },
      publisher: { '@id': 'https://www.reifexa.de/#org' },
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