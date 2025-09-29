'use client';

import { useGetBlogsQuery } from '@/store/api/blogApi';
import NewArticles from '@/components/homepage/NewArticles';

const BlogSidebar = () => {
  const { data, isLoading } = useGetBlogsQuery({ page: 1, limit: 6 });

  if (isLoading) return null;

  return <NewArticles blogs={data?.blogs || []} />;
};

export default BlogSidebar;
