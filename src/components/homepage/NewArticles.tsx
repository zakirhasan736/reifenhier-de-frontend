import Link from 'next/link';
import BlogCoverImage from '@/components/blogpage/BlogCoverImage';

interface WPBlog {
  id: number | string;
  title: string;
  slug: string;
  coverImage: string;
  date: string;
}

interface BlogProps {
  blogs: WPBlog[];
}

function BlogGridCard({ blog }: { blog: WPBlog }) {
  return (
    <Link
      href={`/artikel/${blog.slug}`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#F0F0F2] bg-white shadow-[0_2px_12px_rgba(13,1,19,0.04)] transition hover:border-primary-100/30 hover:shadow-[0_8px_24px_rgba(13,1,19,0.08)]"
    >
      <BlogCoverImage
        src={blog.coverImage}
        alt={blog.title}
        className="h-[160px] w-full object-cover sm:h-[168px]"
        width={1024}
        height={220}
      />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3
          className="line-clamp-2 font-primary text-[16px] font-medium leading-[140%] text-[#16171A] group-hover:text-primary-100"
          dangerouslySetInnerHTML={{ __html: blog.title }}
        />
        <p className="mt-2 text-[12px] font-medium text-[#89898B]">
          {blog.date
            ? new Date(blog.date).toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : ''}
        </p>
        <span className="mt-auto pt-3 text-[14px] font-medium text-primary-100 underline">
          Mehr lesen
        </span>
      </div>
    </Link>
  );
}

const NewArticles: React.FC<BlogProps> = ({ blogs }) => {
  const items = Array.isArray(blogs) ? blogs.slice(0, 8) : [];

  if (items.length === 0) return null;

  return (
    <section className="news-section bg-mono-0 py-14 lg:py-[70px]">
      <div className="custom-container">
        <div className="section-header mb-6 text-left md:mb-8">
          <h2 className="h3 mb-3 text-center font-primary font-medium text-[#16171A]">
            News & Testberichte
          </h2>
          <p className="text-center font-secondary text-[16px] font-normal text-[#404042]">
            Bleiben Sie auf dem Laufenden mit den neuesten Erkenntnissen und
            Tipps zu Reifen.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 min-[1100px]:grid-cols-4 sm:gap-6">
          {items.map(blog => (
            <BlogGridCard key={blog.id} blog={blog} />
          ))}
        </div>

        <Link
          href="/artikel"
          className="mx-auto mt-8 block w-fit cursor-pointer rounded-full border border-primary-100 px-8 py-2.5 text-center font-semibold text-primary-100 transition hover:bg-primary-100 hover:text-white"
        >
          Mehr anzeigen
        </Link>
      </div>
    </section>
  );
};

export default NewArticles;
