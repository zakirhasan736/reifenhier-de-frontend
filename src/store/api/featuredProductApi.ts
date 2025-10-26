import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from '@/types/product';

interface FeaturedProductResponse {
  title: string;
  category: string;
  products: Product[];
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const featuredProductApi = createApi({
  reducerPath: 'featuredProductApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/api/products`,
    credentials: 'include',
  }),
  tagTypes: ['FeaturedProducts'],
  endpoints: builder => ({
    getFeaturedProducts: builder.query<FeaturedProductResponse, void>({
      query: () => 'sessions-products', 
      providesTags: ['FeaturedProducts'],
      keepUnusedDataFor: 300, 
    }),
  }),
});

export const { useGetFeaturedProductsQuery } = featuredProductApi;
