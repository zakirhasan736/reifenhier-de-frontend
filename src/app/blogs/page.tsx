import type { Metadata } from 'next';
import Script from 'next/script';
import BlogPage from '@/components/blogpage/BlogPage';

export const metadata: Metadata = {
  title: 'Reifencheck Blog | Reifencheck.de',
  description:
    'Entdecken Sie aktuelle Blogartikel rund um Reifen, Autos und Tipps für Ihren Reifencheck auf Reifencheck.de.',
  keywords: [
    'Reifen Blog',
    'Reifencheck Tipps',
    'Autoreifen Ratgeber',
    'Winterreifen Sommerreifen Blog',
    'Reifenpflege und Sicherheit',
  ],
  alternates: { canonical: 'https://reifencheck.de/blogs' },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://reifencheck.de/blogs',
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

export default function BlogListPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://reifencheck.de/blogs#blog',
    url: 'https://reifencheck.de/blogs',
    name: 'Reifencheck Blog',
    description:
      'Reifencheck.de Blog – Tipps, Ratgeber und aktuelle News rund um Reifen, Autos und Fahrsicherheit.',
    inLanguage: 'de-DE',
  };

  return (
    <>
      <BlogPage />
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
