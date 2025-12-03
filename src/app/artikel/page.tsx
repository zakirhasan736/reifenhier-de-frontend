import { use } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import BlogPage from '@/components/blogpage/BlogPage';

const WP_API = 'https://wp.reifencheck.de/wp-json/wp/v2';

export const metadata: Metadata = {
  title: 'Reifencheck Artikel | Reifencheck.de',
  description:
    'Entdecken Sie aktuelle Artikel rund um Reifen, Autos und Tipps für Ihren Reifencheck auf Reifencheck.de.',
  alternates: { canonical: 'https://www.reifencheck.de/artikel' },
  keywords: [
    'Reifen Artikel',
    'Reifen Blogs',
    'Reifencheck Tipps',
    'Autoreifen Ratgeber',
    'Winterreifen Sommerreifen Artikel',
    'Winterreifen Sommerreifen Blogs',
    'Reifenpflege und Sicherheit',
  ],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://www.reifencheck.de/artikel',
    siteName: 'Reifencheck.de',
    title: 'Reifencheck Artikel | Reifencheck.de',
    description:
      'Lesen Sie spannende Beiträge und erhalten Sie wertvolle Informationen zum Thema Reifencheck.',
    images: [
      {
        url: '/images/blog-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Reifencheck Artikel image',
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
      '@id': 'https://www.reifencheck.de/artikel#artikel',
      url: 'https://www.reifencheck.de/artikel',
      name: 'Reifencheck Artikel',
      description:
        'Reifencheck.de Artikel – Tipps, Ratgeber und aktuelle News rund um Reifen, Autos und Fahrsicherheit.',
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

// import type { Metadata } from 'next';
// import Script from 'next/script';
// import BlogPage from '@/components/blogpage/BlogPage';

// const WP_API = 'https://wp.reifencheck.de/wp-json/wp/v2';

// /* ----------------------------------------------------
//    SHARED TYPES
// ---------------------------------------------------- */

// export interface Blog {
//   id: number;
//   slug: string;
//   date: string;
//   title: { rendered: string };
//   excerpt?: { rendered: string };
//   _embedded?: {
//     'wp:featuredmedia'?: Array<{ source_url?: string }>;
//   };
// }

// /** Props passed into BlogPage component */
// export interface BlogPageProps {
//   blogs: Blog[];
//   total: number;
//   currentPage: number;
//   // parentSlug: string | null;
//   // subSlug: string | null;
// }

// /** Params received from URL */
// interface ArtikelSearchParams {
//   page?: string;
//   kategorie?: string;
//   subkategorie?: string;
// }

// /* ----------------------------------------------------
//    HELPERS
// ---------------------------------------------------- */

// async function getCategoryIdBySlug(slug: string) {
//   try {
//     const res = await fetch(`${WP_API}/categories?slug=${slug}`);
//     const data = await res.json();
//     return data[0]?.id ?? null;
//   } catch {
//     return null;
//   }
// }

// /* ----------------------------------------------------
//    FETCH BLOGS (SSR)
// ---------------------------------------------------- */

// async function getBlogs(
//   page = 1,
//   parentSlug: string | null,
//   subSlug: string | null
// ): Promise<{ blogs: Blog[]; total: number }> {
//   const perPage = 6;
//   let filter = '';

//   if (subSlug) {
//     const id = await getCategoryIdBySlug(subSlug);
//     if (id) filter = `&categories=${id}`;
//   }

//   const url = `${WP_API}/posts?page=${page}&per_page=${perPage}&_embed${filter}`;
//   const res = await fetch(url, { next: { revalidate: 60 } });

//   if (!res.ok) return { blogs: [], total: 0 };

//   const blogs = await res.json();
//   const total = Number(res.headers.get('X-WP-Total'));

//   return { blogs, total };
// }

// /* ----------------------------------------------------
//    METADATA
// ---------------------------------------------------- */

// export const metadata: Metadata = {
//   title: 'Reifencheck Artikel | Reifencheck.de',
//   description:
//     'Entdecken Sie aktuelle Artikel rund um Reifen, Autos und Tipps für Ihren Reifencheck auf Reifencheck.de.',
//   alternates: { canonical: 'https://www.reifencheck.de/artikel' },
//   keywords: [
//     'Reifen Artikel',
//     'Reifen Blogs',
//     'Reifencheck Tipps',
//     'Autoreifen Ratgeber',
//     'Winterreifen Sommerreifen Artikel',
//     'Winterreifen Sommerreifen Blogs',
//     'Reifenpflege und Sicherheit',
//   ],
//   openGraph: {
//     type: 'website',
//     locale: 'de_DE',
//     url: 'https://www.reifencheck.de/artikel',
//     siteName: 'Reifencheck.de',
//     title: 'Reifencheck Artikel | Reifencheck.de',
//     description:
//       'Lesen Sie spannende Beiträge und erhalten Sie wertvolle Informationen zum Thema Reifencheck.',
//     images: [
//       {
//         url: '/images/blog-og-image.jpg',
//         width: 1200,
//         height: 630,
//         alt: 'Reifencheck Artikel image',
//       },
//     ],
//   },
// };

// /* ----------------------------------------------------
//    PAGE COMPONENT
// ---------------------------------------------------- */

// export default async function BlogListPage({
//   searchParams,
// }: {
//   searchParams: ArtikelSearchParams;
// }) {
//   const page = Number(searchParams.page ?? 1);

//   const parentSlug = searchParams.kategorie ?? null;
//   const subSlug = searchParams.subkategorie ?? null;

//   const { blogs, total } = await getBlogs(page, parentSlug, subSlug);

//   const jsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'Artikel',
//     '@id': 'https://www.reifencheck.de/artikel#artikel',
//     url: 'https://www.reifencheck.de/artikel',
//     name: 'Reifencheck Artikel',
//     description:
//       'Reifencheck.de Artikel – Tipps, Ratgeber und aktuelle News rund um Reifen, Autos und Fahrsicherheit.',
//     inLanguage: 'de-DE',
//   };

//   return (
//     <>
//       <BlogPage
//         blogs={blogs}
//         total={total}
//         currentPage={page}
//         // parentSlug={parentSlug}
//         // subSlug={subSlug}
//       />

//       <Script id="ld-artikel" type="application/ld+json">
//         {JSON.stringify(jsonLd)}
//       </Script>
//     </>
//   );
// }
