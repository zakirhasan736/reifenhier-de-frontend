// // Server Component (SSR)
// import React from 'react';
// import NewArticles from './NewArticles'; // 👈 Client component
// interface Blog {
//   _id: string;
//   title: string;
//   slug: string;
//   coverImage: string;
//   metaDescription: string;
//   createdAt: string;
// }

// const apiUrl =
//   process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
//   'http://localhost:8001';

// export default async function NewArticlesServerWrapper() {
//   let blogs: Blog[] = [];

//   try {
//     const res = await fetch(`${apiUrl}/api/blogs/list?page=1&limit=6`, {
//       next: { revalidate: 300 },
//     });

//     if (res.ok) {
//       const data = await res.json();
//       blogs = Array.isArray(data.blogs) ? data.blogs : [];
//     }
//   } catch (err) {
//     console.error('SSR Blog fetch failed:', err);
//   }

//   return <NewArticles blogs={blogs} />;
// }
'use client';

import React from 'react';
import { useGetBlogsQuery } from '@/store/api/blogApi';
import NewArticles from './NewArticles'; // Assumes this is a client component

const NewArticlesWrapper = () => {
  const { data,  isError } = useGetBlogsQuery({ page: 1, limit: 6 });


  if (isError) return <p>Failed to load blogs.</p>;

  return <NewArticles blogs={data?.blogs || []} />;
};

export default NewArticlesWrapper;
