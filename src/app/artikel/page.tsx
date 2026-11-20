import { use } from 'react';
import type { Metadata } from 'next';
import BlogPage, { type BlogCard } from '@/components/blogpage/BlogPage';
import { CORE_KEYWORDS, SITE_URL } from '@/libs/seo/site';
import { ARTICLE_LIST_KEYWORDS } from '@/libs/seo/keywords';
import { blogCoverSrc, BLOGS_PER_PAGE, fetchMongoBlogs } from '@/libs/blogs/mongo';
import JsonLd from '@/components/seo/JsonLd';
import Link from 'next/link';

const WP_API = 'https://wp.reifexa.de/wp-json/wp/v2';

const BASE_TITLE = 'Reifen-Ratgeber 2026: Tests, Reifencheck & Tipps | Reifexa';
const BASE_DESCRIPTION =
  'Aktuelle Ratgeber, Tests und Tipps zu Sommerreifen, Winterreifen, Ganzjahresreifen und Reifenkauf auf Reifexa.de.';

/**
 * Page 2, 3, … are their own pages (self-canonical, own title) so Google
 * crawls through the archive; pointing them at page 1 hid older articles.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const kategorie = params.kategorie || '';
  const sub = params.subkategorie || '';

  const qs = new URLSearchParams();
  if (kategorie) qs.set('kategorie', kategorie);
  if (sub) qs.set('subkategorie', sub);
  if (page > 1) qs.set('page', String(page));
  const canonical = `${SITE_URL}/artikel${qs.toString() ? `?${qs}` : ''}`;

  const suffix = page > 1 ? ` – Seite ${page}` : '';
  const topic = sub || kategorie;
  const title = topic
    ? `${topic} – Reifen-Ratgeber${suffix} | Reifexa`
    : page > 1
      ? `Reifen-Ratgeber & Tests${suffix} | Reifexa`
      : BASE_TITLE;
  const description =
    page > 1 ? `${BASE_DESCRIPTION} Seite ${page}.` : BASE_DESCRIPTION;

  return {
    ...staticMetadata,
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: { ...staticMetadata.openGraph, url: canonical },
  };
}

const staticMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: 'Reifen-Ratgeber 2026: Tests, Reifencheck & Tipps | Reifexa' },
  description:
    'Aktuelle Ratgeber, Tests und Tipps zu Sommerreifen, Winterreifen, Ganzjahresreifen und Reifenkauf auf Reifexa.de.',
  alternates: { canonical: `${SITE_URL}/artikel` },
  keywords: [...ARTICLE_LIST_KEYWORDS, ...CORE_KEYWORDS.slice(0, 8)],
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

async function getCategoryIdBySlug(slug: string) {
  const res = await fetch(`${WP_API}/categories?slug=${slug}`);
  const data = await res.json();
  return data[0]?.id ?? null;
}

function matchesTag(tags: string[] | undefined, needle: string) {
  const q = needle.trim().toLowerCase();
  if (!q) return true;
  return (tags || []).some(t => t.trim().toLowerCase().includes(q));
}

async function getBlogs(
  page: number,
  parentSlug: string | null,
  subSlug: string | null
): Promise<{ blogs: BlogCard[]; total: number }> {
  const perPage = BLOGS_PER_PAGE;
  const tagFilter = subSlug || parentSlug;

  const mongo = await fetchMongoBlogs({
    page: tagFilter ? 1 : page,
    limit: tagFilter ? 50 : perPage,
  });

  if (mongo.blogs.length > 0) {
    const filtered = tagFilter
      ? mongo.blogs.filter(b => matchesTag(b.tags, tagFilter))
      : mongo.blogs;
    const start = (page - 1) * perPage;
    const paged = filtered.slice(start, start + perPage);
    return {
      blogs: paged.map(b => ({
        id: b._id,
        slug: b.slug,
        title: b.title,
        date: b.createdAt,
        coverImage: blogCoverSrc(b.coverImage),
        excerpt: b.metaDescription || '',
        tags: b.tags || [],
      })),
      total: filtered.length,
    };
  }

  let filter = '';
  if (subSlug) {
    const id = await getCategoryIdBySlug(subSlug);
    if (id) filter = `&categories=${id}`;
  }

  const url = `${WP_API}/posts?page=${page}&per_page=${perPage}&_embed${filter}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const data = await res.json();
  const blogs: BlogCard[] = Array.isArray(data)
    ? data.map(
        (post: {
          id: number;
          slug: string;
          date?: string;
          title?: { rendered?: string };
          excerpt?: { rendered?: string };
          _embedded?: {
            'wp:featuredmedia'?: { source_url?: string }[];
          };
        }) => ({
          id: String(post.id),
          slug: post.slug,
          title: post.title?.rendered || '',
          date: post.date || '',
          excerpt: post.excerpt?.rendered || '',
          coverImage:
            post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
            '',
        })
      )
    : [];

  return {
    blogs,
    total: Number(res.headers.get('X-WP-Total')) || blogs.length,
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

      {page === 1 && !parentSlug && !subSlug ? <RatgeberOverview /> : null}

      <JsonLd id="ld-artikel" data={jsonLd} />
    </>
  );
}

const TOPICS: Array<{ title: string; text: string; links: Array<[string, string]> }> = [
  {
    title: 'Winterreifen & Winterreifenpflicht',
    text: 'In Deutschland gilt die situative Winterreifenpflicht: Bei Glätte, Schnee oder Eis sind Reifen mit Alpine-Symbol (Schneeflocke im Berg) vorgeschrieben. Unsere Ratgeber erklären Bußgelder, Mindestprofil und worauf es bei Winterreifen-Tests ankommt.',
    links: [['Winterreifen günstig vergleichen', '/winterreifen'], ['Ganzjahresreifen als Alternative', '/ganzjahresreifen']],
  },
  {
    title: 'Sommerreifen & Reifentests',
    text: 'Sommerreifen spielen ihre Stärken bei Wärme aus: kürzere Bremswege auf nasser und trockener Straße und weniger Verschleiß. Wir fassen Testergebnisse, EU-Reifenlabel und Preis-Leistung verständlich zusammen.',
    links: [['Sommerreifen im Preisvergleich', '/sommerreifen'], ['Reifenmarken vergleichen', '/marken']],
  },
  {
    title: 'Reifencheck, Größe & Sicherheit',
    text: 'Profiltiefe, Reifenalter (DOT-Nummer), Reifendruck und die richtige Reifengröße entscheiden über Sicherheit und Kosten. Mit Checklisten und dem Reifengrößenrechner prüfen Sie Ihre Reifen in wenigen Minuten selbst.',
    links: [['Reifengrößenrechner', '/reifengroessen-rechner'], ['Reifen nach Größe finden', '/reifen']],
  },
  {
    title: 'Reifen günstig kaufen',
    text: 'Der niedrigste Stückpreis ist nicht immer das beste Angebot. Entscheidend ist der Gesamtpreis für vier Reifen inklusive Versand. Preisverlauf und Preisalarm zeigen, wann sich der Kauf lohnt.',
    links: [['So funktioniert der Reifenpreisvergleich', '/reifenpreisvergleich'], ['Alle Reifenangebote', '/produkte']],
  },
];

/** Server-rendered topic overview: crawlable text + landing links for the article hub. */
function RatgeberOverview() {
  return (
    <section className="custom-container pb-16" aria-labelledby="ratgeber-themen">
      <h2 id="ratgeber-themen" className="text-[24px] md:text-[30px] font-semibold text-[#16171A] mb-2">
        Reifen-Ratgeber: die wichtigsten Themen
      </h2>
      <p className="max-w-3xl text-[15px] md:text-[16px] leading-[165%] text-[#404042] mb-6">
        Im Reifexa-Ratgeber finden Sie unabhängige Kaufberatung rund um Autoreifen für den deutschen Markt –
        von Reifentests und dem EU-Reifenlabel über die Winterreifenpflicht bis zum Reifencheck in Eigenregie.
        Jeder Artikel verlinkt direkt auf passende Reifengrößen und Angebote im Preisvergleich.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {TOPICS.map(t => (
          <div key={t.title} className="rounded-[16px] border border-[#E9ECF3] bg-mono-0 p-5">
            <h3 className="text-[18px] font-semibold text-[#16171A] mb-1">{t.title}</h3>
            <p className="text-[15px] leading-[160%] text-[#4B4F58]">{t.text}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {t.links.map(([label, href]) => (
                <Link key={href} href={href} className="rounded-full border border-[#E1E5EE] px-3 py-1.5 text-[14px] hover:border-primary-100 hover:text-primary-100">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
