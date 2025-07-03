'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

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

const NewArticles: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/blogs/list`, {
          params: { page, limit },
        });

        if (page === 1) {
          setBlogs(res.data.blogs);
        } else {
          setBlogs(prev => [...prev, ...res.data.blogs]);
        }

        setTotal(res.data.total);
        if (res.data.blogs.length < limit) setHasMore(false);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      }
    };

    fetchBlogs();
  }, [page]);

  return (
    <section className="news-section pt-10 pb-20 bg-mono-0">
      <div className="custom-container">
        <div className="news-content">
          <div className="section-header text-left mb-9">
            <h2 className="h3 text-primary-70 font-secondary">
              News & Articles
            </h2>
            <p className="text-mono-100 font-medium text-[14px] font-primary">
              Stay updated with the latest insights and tips about tires.
            </p>
          </div>

          <div className="news-list grid grid-cols-3 max-md:grid-cols-1 gap-6">
            {blogs.map(blog => (
              <Link key={blog._id} href={`/blogs/${blog.slug}`}>
                <div className="news-item bg-mono-0 relative border border-border-100 rounded-[4px] cursor-pointer hover:shadow-lg transition-shadow">
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-[280px] object-cover rounded-[4px]"
                    width={1024}
                    height={675}
                    priority
                  />
                  <div className="news-item-content absolute bottom-0 left-0 z-[99] py-6 px-5 bg-[#0000007a]">
                    <h5 className="text-mono-0 font-semibold h6 font-secondary">
                      {blog.title}
                    </h5>
                    <p className="text-mono-0 text-[14px] font-medium font-primary mt-1">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-10">
              <span>{total} blogs found</span>
              <button
                className="px-5 py-2 text-white bg-primary-70 rounded hover:bg-primary-90 transition"
                onClick={() => setPage(prev => prev + 1)}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewArticles;
