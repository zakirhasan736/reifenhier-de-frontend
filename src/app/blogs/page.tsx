import BlogPage from '@/components/blogpage/BlogPage';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Reifencheck Blog | Reifencheck.de',
  description:
    'Entdecken Sie aktuelle Blogartikel rund um Reifen, Autos und Tipps für Ihren Reifencheck auf Reifencheck.de.',
  openGraph: {
    title: 'Reifencheck Blog | Reifencheck.de',
    description:
      'Lesen Sie spannende Beiträge und erhalten Sie wertvolle Informationen zum Thema Reifencheck.',
    url: 'https://reifencheck.de/blogs',
    images: [
      {
        url: '/images/blog-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Reifencheck Blog',
      },
    ],
  },
};

const BlogListPage = () => {
  return (
    <>
      <BlogPage />
    </>
  );
};

export default BlogListPage;
