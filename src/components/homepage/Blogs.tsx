
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
