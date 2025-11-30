'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const WP_API = 'https://wp.reifencheck.de/wp-json/wp/v2';
interface Blog {
  id: number;
  slug: string;
  date: string;
  // WP REST API returns title as an object with a `rendered` string
  title: {
    rendered: string;
  };
  // excerpt is also an object with rendered HTML
  excerpt?: {
    rendered: string;
  };
  // embedded media (optional)
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string;
    }>;
  };
}
interface BlogPageProps {
  blogs: Blog[];
  total: number;
  currentPage: number;
  // parentSlug: string | null;
  // subSlug: string | null;
}


export default function BlogPage({
  blogs: initialBlogs,
  total: initialTotal,
  currentPage,
  // parentSlug: _parentSlug,
  // subSlug: _subSlug,
}: BlogPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const limit = 6;
  const totalPages = Math.ceil(initialTotal / limit);

  const [search, setSearch] = useState('');
  const [blogs, setBlogs] = useState(initialBlogs);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  // ⭐ Live search
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!search.trim()) {
        setBlogs(initialBlogs);
        setTotal(initialTotal);
        return;
      }

      setLoading(true);

      try {
        const res = await axios.get(
          `${WP_API}/posts?search=${encodeURIComponent(search)}&_embed`
        );
        setBlogs(res.data);
        setTotal(res.data.length);
      } catch (err) {
        console.error('Search Error:', err);
      }

      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, initialBlogs, initialTotal]);

  // ⭐ Pagination preserves slug filters
  const handlePageChange = (page: number) => {
    const query = new URLSearchParams(searchParams?.toString() || '');
    query.set('page', page.toString());

    router.push(`/artikel?${query.toString()}`);
  };

  console.log(blogs);
  return (
    <section className="blogs-page">
      <div className="blog-page-wrapper bg-mono-0 py-9">
        <div className="custom-container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-5 text-secondary-100">
            News & Testberichte
          </h1>

          {/* 🔍 Search Bar */}
          <div className="blog-search-box relative mb-9 border border-secondary-100/40 rounded-full max-w-[380px] w-full overflow-hidden">
            <input
              type="text"
              placeholder="Blogs durchsuchen..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-[380px] text-secondary-100  overflow-hidden !rounded-full w-full 
                          pl-11 py-[9px] lg:py-[11.5px]
                         bg-mono-0 focus:outline-none"
            />

            <Image
              src="/images/icons/search-norma2.svg"
              alt="Search"
              width={16}
              height={16}
              className="absolute top-[13px] lg:top-[16px] left-4"
            />
          </div>

          {/* 📰 BLOG LIST GRID */}
          <div
            className={`grid ${
              blogs.length === 1
                ? 'grid-cols-1 justify-center'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            }`}
          >
            {loading ? (
              // Skeleton loader
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="news-item animate-pulse">
                  <div className="w-full h-[200px] bg-gray-300 rounded-lg" />
                  <div className="pt-5">
                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4" />
                    <div className="h-4 bg-gray-300 rounded w-1/4" />
                  </div>
                </div>
              ))
            ) : blogs.length === 0 ? (
              <p className="text-gray-500 text-center col-span-3">
                Keine Blogartikel gefunden.
              </p>
            ) : (
              blogs.map((blog: Blog) => {
                const image =
                  blog._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                  '/images/blog-default.jpg';

                return (
                  <Link
                    key={blog.id}
                    href={`/artikel/${blog.slug}`}
                    className="max-w-[384px] w-full"
                  >
                    <div className="news-item bg-mono-0 rounded-[4px] cursor-pointer">
                      <Image
                        src={image}
                        alt={blog.title.rendered}
                        className="w-full h-[200px] object-cover rounded-[10px]"
                        width={1024}
                        height={200}
                      />

                      <div className="pt-5">
                        <h2
                          className="text-[#404042] font-medium h6"
                          dangerouslySetInnerHTML={{
                            __html: blog.title.rendered,
                          }}
                        />

                        <p className="text-[#89898B] text-[12px] mt-2">
                          {new Date(blog.date).toLocaleDateString('de-DE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>

                        <span className="text-primary-100 underline mt-3 block">
                          Mehr lesen
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* PAGINATION */}
          {search.trim() === '' && total > limit && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                <Image
                  src="/images/icons/left-arrow-svgrepo-com.svg"
                  alt="Previous"
                  width={16}
                  height={16}
                />
              </button>

              <span className="text-sm text-gray-500 self-center">
                Seite {currentPage} von {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                <Image
                  src="/images/icons/right-arrow-svgrepo-com.svg"
                  alt="Next"
                  width={16}
                  height={16}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import axios from 'axios';

// const WP_API = 'https://wp.reifencheck.de/wp-json/wp/v2';

// interface Blog {
//   id: number;
//   slug: string;
//   date: string;
//   title: { rendered: string };
//   excerpt?: { rendered: string };
//   _embedded?: {
//     'wp:featuredmedia'?: Array<{ source_url?: string }>;
//   };
// }

// export default function BlogPage({
//   blogs: initialBlogs,
//   total: initialTotal,
//   currentPage,
//   parentSlug,
//   subSlug,
// }: any) {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const limit = 6;
//   const totalPages = Math.ceil(initialTotal / limit);

//   const [search, setSearch] = useState('');
//   const [blogs, setBlogs] = useState(initialBlogs);
//   const [total, setTotal] = useState(initialTotal);
//   const [loading, setLoading] = useState(false);

//   // ⭐ Live search
//   useEffect(() => {
//     const timeout = setTimeout(async () => {
//       if (!search.trim()) {
//         setBlogs(initialBlogs);
//         setTotal(initialTotal);
//         return;
//       }

//       setLoading(true);

//       try {
//         const res = await axios.get(
//           `${WP_API}/posts?search=${encodeURIComponent(search)}&_embed`
//         );
//         setBlogs(res.data);
//         setTotal(res.data.length);
//       } catch (err) {
//         console.error('Search Error:', err);
//       }

//       setLoading(false);
//     }, 400);

//     return () => clearTimeout(timeout);
//   }, [search, initialBlogs, initialTotal]);

//   // ⭐ Pagination preserves slug filters
//   const handlePageChange = (page: number) => {
//     const query = new URLSearchParams(searchParams.toString());
//     query.set('page', page.toString());

//     router.push(`/artikel?${query.toString()}`);
//   };

//   return (
//     <section className="blogs-page bg-white py-9">
//       <div className="custom-container p-6">
//         <h1 className="text-2xl font-bold text-secondary-100 mb-5">
//           News & Testberichte
//         </h1>

//         {/* 🔍 Search Bar */}
//         <div className="relative mb-8 border rounded-full overflow-hidden max-w-[380px]">
//           <input
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             placeholder="Blogs durchsuchen…"
//             className="pl-11 py-3 rounded-full w-full text-secondary-100"
//           />
//           <Image
//             src="/images/icons/search-norma2.svg"
//             width={16}
//             height={16}
//             alt="Search"
//             className="absolute left-4 top-3.5"
//           />
//         </div>

//         {/* Blog Grid */}
//         <div
//           className={`grid ${
//             blogs.length === 1
//               ? 'grid-cols-1 justify-center'
//               : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
//           }`}
//         >
//           {loading ? (
//             Array.from({ length: 3 }).map((_, i) => (
//               <div key={i} className="animate-pulse">
//                 <div className="h-[200px] bg-gray-300 rounded" />
//                 <div className="mt-4 h-4 bg-gray-300 rounded w-3/4" />
//                 <div className="mt-2 h-4 bg-gray-300 rounded w-1/2" />
//               </div>
//             ))
//           ) : blogs.length === 0 ? (
//             <p className="text-gray-500 text-center col-span-3">
//               Keine Blogartikel gefunden.
//             </p>
//           ) : (
//             blogs.map((blog: Blog) => {
//               const image =
//                 blog._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
//                 '/images/blog-default.jpg';

//               return (
//                 <Link key={blog.id} href={`/artikel/${blog.slug}`}>
//                   <div>
//                     <Image
//                       src={image}
//                       width={1024}
//                       height={200}
//                       alt={blog.title.rendered}
//                       className="rounded-lg h-[200px] w-full object-cover"
//                     />

//                     <h2
//                       className="text-[#404042] font-medium mt-4"
//                       dangerouslySetInnerHTML={{
//                         __html: blog.title.rendered,
//                       }}
//                     />

//                     <p className="text-[#89898B] text-[12px] mt-2">
//                       {new Date(blog.date).toLocaleDateString('de-DE', {
//                         day: 'numeric',
//                         month: 'long',
//                         year: 'numeric',
//                       })}
//                     </p>

//                     <span className="text-primary-100 underline mt-3 block">
//                       Mehr lesen
//                     </span>
//                   </div>
//                 </Link>
//               );
//             })
//           )}
//         </div>

//         {/* Pagination */}
//         {search === '' && total > limit && (
//           <div className="flex justify-center gap-4 mt-8">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => handlePageChange(currentPage - 1)}
//               className="px-4 py-2 border rounded disabled:opacity-50"
//             >
//               ←
//             </button>

//             <span className="text-gray-500">
//               Seite {currentPage} von {totalPages}
//             </span>

//             <button
//               disabled={currentPage >= totalPages}
//               onClick={() => handlePageChange(currentPage + 1)}
//               className="px-4 py-2 border rounded disabled:opacity-50"
//             >
//               →
//             </button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
