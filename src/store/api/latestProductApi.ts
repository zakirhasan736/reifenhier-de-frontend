import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from '@/types/product';

interface LatestProductResponse {
  products: Product[];
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const latestProductApi = createApi({
  reducerPath: 'latestProductApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/api/products`, // 👈 Updated to match your API path
    credentials: 'include',
  }),
  tagTypes: ['LatestProducts'],
  endpoints: builder => ({
    getLatestProducts: builder.query<LatestProductResponse, void>({
      query: () => 'latest-products',
      providesTags: ['LatestProducts'],
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),
  }),
});

export const { useGetLatestProductsQuery } = latestProductApi;
