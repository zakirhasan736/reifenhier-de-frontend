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
    <section className="news-section lg:pb-[70] pb-14 bg-mono-0">
      <div className="custom-container">
        <div className="news-content">
          <div className="section-header text-left md:mb-8 mb-6">
            <h2 className="h3 font-primary font-medium  md:text-[28px] text-[26px] lg:text-[36px] text-center text-[#16171A] mb-3">
              News & Articles
            </h2>
            <p className="font-normal font-secondary text-center lg:text-[18px] text-[14px] leading-[140%] text-[#89898B]">
              Stay updated with the latest insights and tips about tires.
            </p>
          </div>

          <div className="news-list grid grid-cols-3 max-md:grid-cols-1 gap-6">
            {blogs.map(blog => (
              <Link key={blog._id} href={`/blogs/${blog.slug}`}>
                <div className="news-item bg-mono-0 relative rounded-[4px] cursor-pointer">
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-[200px] object-cover rounded-[10px]"
                    width={1024}
                    height={200}
                    priority
                  />
                  <div className="news-item-content relative pt-5">
                    <h5 className="text-[#404042] font-medium h6 font-primary">
                      {blog.title}
                    </h5>
                    <p className="text-[#89898B] text-[12px] font-medium font-primary mt-2">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="text-primary-100 underline hover:text-primary-90 transition text-[14px] font-medium font-secondary mt-3 block"
                    >
                      Read More
                    </Link>
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
