import NewArticles from './NewArticles';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  metaDescription: string;
  createdAt: string;
}


const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:8001';

export default async function BlogsPage() {
  let blogs: Blog[] = [];

  try {
    const res = await fetch(`${apiUrl}/api/blogs/list?page=1&limit=6`, {
      next: { revalidate: 300 }, // cache 5 min (ISR)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = (await res.json()) as { blogs: Blog[]; total: number };
    blogs = data.blogs || [];
  } catch (error) {
    console.error('❌ Failed to fetch SSR blogs:', error);
  }

  return (
    <>
          <NewArticles blogs={blogs} />
    </>
  );
}
