// src/store/api/blogApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  metaDescription: string;
  createdAt: string;
}

interface BlogListResponse {
  blogs: Blog[];
  total: number;
}

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:8001';

export const blogsApi = createApi({
  reducerPath: 'blogsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/api/blogs`,
  }),
  tagTypes: ['Blogs'],
  endpoints: builder => ({
    getBlogs: builder.query<
      BlogListResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 6 }) => `list?page=${page}&limit=${limit}`,
      providesTags: ['Blogs'],
      keepUnusedDataFor: 300, // cache for 5 minutes
    }),
  }),
});

export const { useGetBlogsQuery } = blogsApi;

