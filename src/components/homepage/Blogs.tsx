import NewArticles from './NewArticles';

interface Blog {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  metaDescription?: string;
  createdAt?: string;
  date: string;
  excerpt?: string;
}


const WP_API = 'https://wp.reifencheck.de/wp-json/wp/v2';

export default async function BlogsPage() {
  let blogs: Blog[] = [];

  try {
    // WordPress latest posts with featured images
    const res = await fetch(`${WP_API}/posts?per_page=9&_embed`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    blogs = data.map((post: {
      id: number;
      slug: string;
      title?: { rendered?: string };
      date?: string;
      excerpt?: { rendered?: string };
      _embedded?: {
        'wp:featuredmedia'?: { source_url?: string }[];
      };
    }) => ({
      id: post.id,
      slug: post.slug,
      title: post.title?.rendered || '',
      date: post.date || '',
      excerpt: post.excerpt?.rendered || '',
      coverImage:
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        '/images/default-blog.jpg',
    }));
  } catch (error) {
    console.error('❌ WP Blog Fetch Error:', error);
  }

  return <NewArticles blogs={blogs} />;
}