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

const BlogListPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await axios.get(`${apiUrl}/api/blogs/list`, {
        params: { page, limit: 6, search },
      });
      setBlogs(res.data.blogs);
      setTotal(res.data.total);
    };
    fetchBlogs();
  }, [page, search]);

  return (
    <section className="blogs-page">
      <div className="blog-details-banner bg-mono-0 py-8 max-sm:py-5">
        <div className="custom-container">
          <div className="product-banner-wrapper flex flex-col items-center justify-center">
            <ul className="breadcrumb-area flex items-center gap-[10px]">
              <li className="breadcrumb-item body-caption prev-pages flex items-center gap-[10px]">
                <Link className="body-caption text-mono-100" href="/" passHref>
                  Home
                </Link>
                <span className="angle">&gt;</span>
              </li>
              <li className="breadcrumb-item body-caption capitalize text-mono-70">
                Blogs
              </li>
            </ul>
            <h4 className="h6 current-category-title capitalize mt-[15px] max-md:mt-2">
              Blog Details
            </h4>
          </div>
        </div>
      </div>
      <div className="blog-page-wrapper bg-opacity-opacity">
        <div className="custom-container ">
          <div className="mx-auto p-6 ">
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border px-4 py-2 w-full mb-6"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map(blog => (
                <Link key={blog._id} href={`/blogs/${blog.slug}`}>
                  <div className="border rounded p-4 hover:shadow">
                    {blog.coverImage && (
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-48 object-cover rounded mb-3"
                        width={442}
                        height={280}
                      />
                    )}
                    <h2 className="text-xl font-semibold h-[84px] mb-2">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page * 6 >= total}
                onClick={() => setPage(prev => prev + 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogListPage;
